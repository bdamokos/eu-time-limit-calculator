// Run security regressions in a child with a hard timeout, even if a guard regresses.
process.env.TZ = 'UTC';
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const vm = require('node:vm');

if (!process.argv.includes('--child')) {
    const child = spawnSync(process.execPath, [__filename, '--child'], {
        timeout: 20000, encoding: 'utf8', maxBuffer: 1024 * 1024
    });
    assert.ifError(child.error);
    assert.equal(child.status, 0, child.stderr || child.stdout);
    process.stdout.write(child.stdout);
} else {
    run().catch(error => { console.error(error); process.exitCode = 1; });
}

async function withDateMethods(methods, operation) {
    const originals = {};
    for (const [name, implementation] of Object.entries(methods)) {
        originals[name] = Date.prototype[name];
        Date.prototype[name] = implementation;
    }
    try { return await operation(); }
    finally { Object.assign(Date.prototype, originals); }
}

async function run() {
    const browser = require('./script.js');
    const standalone = await import('./calculator.js');
    const engines = [browser.calculatePeriod, standalone.calculatePeriod];
    const eventDate = new Date('2025-04-03T00:00:00Z');
    const originalLog = console.log;
    console.log = () => {}; // The browser engine logs each counted day.
    try {
        for (const calculate of engines) {
            let steps = 0;
            await withDateMethods({ setDate() { steps++; throw new Error('Unexpected date walk'); } }, async () => {
                for (const period of [1e20, -1e20, 1e21, -1e21, Number.MAX_SAFE_INTEGER,
                    -Number.MAX_SAFE_INTEGER, 10001, -10001, 0, 2.5, NaN, Infinity, '2']) {
                    await assert.rejects(calculate(eventDate, period, 'working-days'), /integer|Working-day/);
                }
            });
            assert.equal(steps, 0, 'Reject invalid periods before date walking');

            for (const [period, expected] of [
                [1, '2025-04-04T23:59:59.999Z'], [2, '2025-04-07T23:59:59.999Z'],
                [-1, '2025-04-01T00:00:00.000Z'], [-2, '2025-03-31T00:00:00.000Z']
            ]) {
                const result = await calculate(eventDate, period, 'working-days');
                assert.equal(result.finalEndDate.toISOString(), expected);
            }
            // Real holiday-sensitive controls, including retroactive traversal.
            for (const period of [2, -2]) {
                const result = await calculate(new Date('2026-04-02T00:00:00Z'), period, 'working-days');
                assert.equal(result.finalEndDate.toISOString(), period > 0
                    ? '2026-04-08T23:59:59.999Z' : '2026-03-30T00:00:00.000Z');
            }

            // Exact accepted limits, with an independent bound on date operations.
            const nativeSetDate = Date.prototype.setDate;
            for (const period of [10000, -10000]) {
                steps = 0;
                const result = await withDateMethods({ setDate(...args) {
                    assert(++steps <= 50005, 'Accepted limits must have bounded work');
                    return nativeSetDate.apply(this, args);
                } }, () => calculate(new Date('2050-04-04T00:00:00Z'), period, 'working-days'));
                assert(Number.isFinite(result.finalEndDate.getTime()));
                assert.equal(Math.sign(result.finalEndDate - result.eventDate), Math.sign(period));
                assert(steps > 10000, 'Boundary control must exercise the full walk');
            }

            await assert.rejects(calculate(new Date(NaN), 1, 'working-days'), /valid Date|date range/);
            for (const [timestamp, period] of [[8640000000000000, 1], [-8640000000000000, -1]]) {
                await assert.rejects(calculate(new Date(timestamp), period, 'working-days'), /date range/);
            }

            // Synthetic calendar failures test both directions without an unbounded attack.
            for (const period of [1, -1, 2, -2]) {
                await withDateMethods({ setDate() { return this.getTime(); } }, async () => {
                    await assert.rejects(calculate(eventDate, period, 'working-days'), /advance the date/);
                });
                await withDateMethods({ setDate() { return this.setTime(NaN); } }, async () => {
                    await assert.rejects(calculate(eventDate, period, 'working-days'), /date range/);
                });
                steps = 0;
                await withDateMethods({
                    getDay() { return 0; }, // A calendar with no working days.
                    setDate(...args) {
                        assert(++steps <= 50005, 'Iteration budget must terminate date walking');
                        return nativeSetDate.apply(this, args);
                    }
                }, async () => {
                    await assert.rejects(calculate(eventDate, period, 'working-days'), /iteration limit/);
                });
                assert(steps >= 50000, 'Exercise budget exhaustion rather than an earlier rejection');
            }
        }

        for (const period of ['100000000000000000000', '-100000000000000000000', 1e21,
            -1e21, '1e20', '-1e20', '10001', '-10001', '2.5', '2days', 'Infinity', '', true, [2]]) {
            const response = await standalone.calculateDeadline({ date: '2025-04-03', period, type: 'working-days' });
            assert.equal(response.ok, false, `Wrapper must reject ${JSON.stringify(period)}`);
            assert(response.errors.length > 0);
            assert(!('result' in response));
        }
        for (const period of ['2', '-2', '2e0', 10000, -10000]) {
            const response = await standalone.calculateDeadline({ date: '2025-04-03', period, type: 'working-days' });
            assert.equal(response.ok, true);
            assert.equal(response.input.period, Number(period));
        }
        await withDateMethods({ setDate() { return this.setTime(NaN); } }, async () => {
            const response = await standalone.calculateDeadline({ date: '2025-04-03', period: 2, type: 'working-days' });
            assert.equal(response.ok, false);
            assert.match(response.errors[0], /date range/);
        });
        await testBrowserForm();
    } finally { console.log = originalLog; }
    console.log('Working-day security regressions passed (both engines, wrapper and browser form).');
}

async function testBrowserForm() {
    const source = fs.readFileSync(require.resolve('./script.js'), 'utf8');
    function element(value = '') {
        return {
            value, children: [], listeners: {}, attributes: {},
            addEventListener(type, callback) { (this.listeners[type] ||= []).push(callback); },
            setAttribute(name, value) { this.attributes[name] = value; },
            replaceChildren(...children) { this.children = children; this.onReplace?.(); },
            appendChild(child) { this.children.push(child); }
        };
    }
    const nodes = Object.fromEntries(['eventDate', 'eventTime', 'periodValue', 'periodType',
        'periodForm', 'result', 'eventDateFormatted'].map(id => [id, element()]));
    const domReady = [];
    const errors = [];
    const context = vm.createContext({
        URLSearchParams,
        window: { location: { search: '?date=2025-04-03&period=100000000000000000000&type=working-days' } },
        document: {
            cookie: '', getElementById: id => nodes[id] || null, createElement: element,
            addEventListener(type, callback) { if (type === 'DOMContentLoaded') domReady.push(callback); },
            querySelectorAll: selector => selector.startsWith('#periodForm') ? [nodes.periodValue] : []
        },
        console: { log() {}, warn() {}, error(error) { errors.push(error); } },
        fetch: async () => ({ ok: true, json: async () => JSON.parse(fs.readFileSync(`${__dirname}/holiday-data/EP.json`, 'utf8')) })
    });
    vm.runInContext(source, context, { timeout: 1000 });
    // Calendar rendering has its own regression suite; retain the actual form/calculation path here.
    vm.runInContext('createResultElement = result => ({ finalEndDate: result.finalEndDate.toISOString() });', context);
    async function update(action) {
        let timer;
        try {
            await Promise.race([
                new Promise(resolve => { nodes.result.onReplace = resolve; action(); }),
                new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('Form did not settle')), 2000); })
            ]);
        } finally { clearTimeout(timer); }
    }
    function assertError() {
        assert.equal(nodes.result.children.length, 1, 'Clear stale results on rejection');
        assert.equal(nodes.result.children[0].attributes.role, 'alert');
        assert.match(nodes.result.children[0].textContent, /Working-day period/);
    }
    await update(() => domReady.forEach(callback => callback()));
    assertError(); // Automatic calculation from the supplied URL.
    for (const period of ['-1e20', '2.5', '2days', '10001', '0']) {
        nodes.periodValue.value = period;
        await update(() => nodes.periodValue.listeners.input[0]());
        assertError();
        await update(() => nodes.periodForm.listeners.submit[0]({ preventDefault() {} }));
        assertError();
    }
    nodes.periodValue.value = '2';
    await update(() => nodes.periodValue.listeners.input[0]());
    // replaceChildren clears first, then appendChild renders the successful result.
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(nodes.result.children[0].finalEndDate, '2025-04-07T23:59:59.999Z');
    nodes.periodValue.value = '10001';
    await update(() => nodes.periodValue.listeners.input[0]());
    assertError();
    assert.deepEqual(errors, [], 'Form rejection must not become an unhandled calculation error');

    // Control completion order to reproduce a slow accepted calculation followed by rejection.
    context.pending = [];
    vm.runInContext('calculatePeriod = () => new Promise((resolve, reject) => pending.push({ resolve, reject }));', context);
    const olderSuccess = vm.runInContext("calculatePeriodForForm(new Date(), 1000, 'working-days')", context);
    const newerRejection = vm.runInContext("calculatePeriodForForm(new Date(), 10001, 'working-days')", context);
    context.pending[1].reject(vm.runInContext("new RangeError('Working-day period is too large')", context));
    assert.equal(await newerRejection, null);
    const rejectionMessage = nodes.result.children[0];
    context.pending[0].resolve({ finalEndDate: new Date() });
    assert.equal(await olderSuccess, null, 'A stale success must not replace the current rejection');
    assert.equal(nodes.result.children[0], rejectionMessage);

    const olderRejection = vm.runInContext("calculatePeriodForForm(new Date(), 1000, 'working-days')", context);
    const newerSuccess = vm.runInContext("calculatePeriodForForm(new Date(), 2, 'working-days')", context);
    const latestResult = { finalEndDate: new Date() };
    context.pending[3].resolve(latestResult);
    assert.equal(await newerSuccess, latestResult);
    nodes.result.replaceChildren(latestResult);
    context.pending[2].reject(vm.runInContext("new RangeError('Working-day calculation exceeded the date range')", context));
    assert.equal(await olderRejection, null);
    assert.equal(nodes.result.children[0], latestResult, 'A stale rejection must not replace the current success');
}
