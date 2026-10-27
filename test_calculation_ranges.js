// A hard timeout and independent operation budgets keep regressions safe to run.
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
    const eventDate = new Date('2025-04-03T00:00:00Z');
    const nativeSetDate = Date.prototype.setDate;
    const originalLog = console.log;
    console.log = () => {};
    try {
        for (const engine of [browser, standalone]) {
            const calculate = engine.calculatePeriod;
            for (const [type, excessive] of [
                ['years', 7000], ['months', 84000], ['weeks', 365000],
                ['days', 2555000], ['hours', 61488000]
            ]) {
                for (const sign of [1, -1]) {
                    let steps = 0;
                    await withDateMethods({ setDate(...args) {
                        assert(++steps <= 3, 'Reject long spans before a daily walk');
                        return nativeSetDate.apply(this, args);
                    } }, async () => {
                        await assert.rejects(calculate(eventDate, sign * excessive, type), /span/);
                    });
                }
                for (const period of [1e20, -1e20, 0, 2.5, NaN, Infinity, '2']) {
                    await assert.rejects(calculate(eventDate, period, type), /integer/i);
                }
                await assert.rejects(calculate(new Date(NaN), 1, type), /valid Date|date range/);
                for (const [timestamp, sign] of [[8640000000000000, 1], [-8640000000000000, -1]]) {
                    await assert.rejects(calculate(new Date(timestamp), sign, type), /date range/);
                }
            }

            // Exact distance boundaries in both directions. The forward endpoint is a Monday.
            const boundaryDate = new Date('2050-04-05T00:00:00Z');
            for (const [type, maximum, excessive] of [
                ['days', 50000, 50001], ['hours', 1200000, 1200024],
                ['weeks', 7142, 7143], ['months', 1642, 1643], ['years', 136, 137]
            ]) {
                for (const sign of [1, -1]) {
                    let steps = 0;
                    const result = await withDateMethods({ setDate(...args) {
                        assert(++steps <= 50005, 'Accepted spans must have bounded work');
                        return nativeSetDate.apply(this, args);
                    } }, () => calculate(boundaryDate, sign * maximum, type));
                    assert(Number.isFinite(result.finalEndDate.getTime()));
                    assert.equal(Math.sign(result.finalEndDate - result.eventDate), sign);
                    await assert.rejects(calculate(boundaryDate, sign * excessive, type), /span/);
                }
            }

            // Preserve ordinary signed arithmetic, month-end/leap-year and holiday rules.
            for (const [type, period, expected] of [
                ['hours', 2, '2025-06-25T16:59:59.999Z'], ['hours', -5, '2025-06-25T09:00:00.000Z'],
                ['days', 2, '2025-06-27T23:59:59.999Z'], ['days', -7, '2025-06-18T00:00:00.000Z'],
                ['weeks', 2, '2025-07-09T23:59:59.999Z'], ['weeks', -2, '2025-06-11T00:00:00.000Z'],
                ['months', 1, '2025-07-25T23:59:59.999Z'], ['months', -1, '2025-05-25T00:00:00.000Z'],
                ['years', 1, '2026-06-25T23:59:59.999Z'], ['years', -1, '2024-06-25T00:00:00.000Z']
            ]) {
                const result = await calculate(new Date('2025-06-25T14:30:00Z'), period, type);
                assert.equal(result.finalEndDate.toISOString(), expected);
            }
            assert.equal((await calculate(new Date('2025-01-31T00:00:00Z'), 1, 'months'))
                .initialEndDate.toISOString(), '2025-02-28T23:59:59.999Z');
            assert.equal((await calculate(new Date('2024-02-29T00:00:00Z'), 1, 'years'))
                .initialEndDate.toISOString(), '2025-02-28T23:59:59.999Z');
            assert.equal((await calculate(new Date('2026-04-02T00:00:00Z'), 2, 'days'))
                .finalEndDate.toISOString(), '2026-04-08T23:59:59.999Z');

            // All-nonworking calendars and failed date arithmetic must terminate explicitly.
            for (const period of [1, -2]) {
                await withDateMethods({ setDate() { return this.getTime(); } }, async () => {
                    await assert.rejects(calculate(eventDate, period, 'days'), /advance the date/);
                });
                await withDateMethods({ setDate() { return this.setTime(NaN); } }, async () => {
                    await assert.rejects(calculate(eventDate, period, 'days'), /date range/);
                });
                let steps = 0;
                await withDateMethods({
                    getDay() { return 0; },
                    setDate(...args) {
                        assert(++steps <= 50005, 'Extensions must have bounded work');
                        return nativeSetDate.apply(this, args);
                    }
                }, async () => {
                    await assert.rejects(calculate(eventDate, period, 'days'), /iteration limit|span/);
                });
            }
            // Counting and extension visits consume one shared budget.
            let checks = 0;
            await withDateMethods({ getDay() { return ++checks === 1 ? 1 : 0; } }, async () => {
                await assert.rejects(calculate(boundaryDate, 7142, 'weeks'), /iteration limit/);
            });

            // Exported coverage is another direct year-enumeration entry point.
            for (const pair of [
                [eventDate, new Date('9025-04-03T00:00:00Z')],
                [new Date('9025-04-03T00:00:00Z'), eventDate], [new Date(NaN), eventDate]
            ]) {
                await assert.rejects(engine.checkHolidayDataCoverage(...pair, 'EP'), /span|date range/);
            }
        }
        for (const type of ['hours', 'days', 'weeks', 'months', 'years']) {
            for (const period of [70000000, -70000000, '1e21', '-1e21', '2days', '2.5', true, [2]]) {
                const response = await standalone.calculateDeadline({ date: '2025-04-03', time: '12:00', period, type });
                assert.equal(response.ok, false);
                assert(response.errors.length > 0);
                assert(!('result' in response), 'Never return a partial count');
            }
            for (const period of ['2', '-2', '2e0']) {
                assert.equal((await standalone.calculateDeadline({ date: '2025-04-03', time: '12:00', period, type })).ok, true);
            }
        }
        await testBrowserForm();
    } finally { console.log = originalLog; }
    console.log('Calendar-range security regressions passed (both engines, wrapper and browser form).');
}

async function testBrowserForm() {
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
    let dateSteps = 0;
    const context = vm.createContext({
        URLSearchParams,
        window: { location: { search: '?date=2025-04-03&period=7000&type=years' } },
        document: {
            cookie: '', getElementById: id => nodes[id] || null, createElement: element,
            addEventListener(type, callback) { if (type === 'DOMContentLoaded') domReady.push(callback); },
            querySelectorAll: selector => selector.startsWith('#periodForm') ? [nodes.periodValue] : []
        },
        console: { log() {}, warn() {}, error(error) { errors.push(error); } },
        fetch: async () => ({ ok: true, json: async () => JSON.parse(fs.readFileSync(`${__dirname}/holiday-data/EP.json`, 'utf8')) }),
        countStep() { assert(++dateSteps <= 10, 'URL rejection must precede daily counting'); }
    });
    vm.runInContext(fs.readFileSync(require.resolve('./script.js'), 'utf8'), context, { timeout: 1000 });
    vm.runInContext(`
        const nativeSetDate = Date.prototype.setDate;
        Date.prototype.setDate = function(...args) { countStep(); return nativeSetDate.apply(this, args); };
        createResultElement = result => ({ finalEndDate: result.finalEndDate.toISOString() });
    `, context);
    async function update(action) {
        let timer;
        dateSteps = 0;
        try {
            await Promise.race([
                new Promise(resolve => { nodes.result.onReplace = resolve; action(); }),
                new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('Form did not settle')), 2000); })
            ]);
        } finally { clearTimeout(timer); }
    }
    function assertError() {
        assert.equal(nodes.result.children.length, 1);
        assert.equal(nodes.result.children[0].attributes.role, 'alert');
        assert.match(nodes.result.children[0].textContent, /span|integer/i);
    }
    await update(() => domReady.forEach(callback => callback()));
    assertError();
    for (const [type, period] of [['years', '-7000'], ['hours', '61488000'], ['days', '1e21'],
        ['months', '2days'], ['weeks', '2.5']]) {
        nodes.periodType.value = type;
        nodes.periodValue.value = period;
        nodes.eventTime.value = '12:00';
        await update(() => nodes.periodValue.listeners.input[0]());
        assertError();
        await update(() => nodes.periodForm.listeners.submit[0]({ preventDefault() {} }));
        assertError();
    }
    nodes.periodType.value = 'days';
    nodes.periodValue.value = '2';
    await update(() => nodes.periodValue.listeners.input[0]());
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(nodes.result.children[0].finalEndDate, '2025-04-07T23:59:59.999Z');
    assert.deepEqual(errors, []);
}
