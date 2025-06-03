const assert = require('assert');
const { calculatePeriod } = require('./script.js');

function iso(date) {
    return date.toISOString();
}

// Article 3(1) - skipping the event hour/day
function testArticle31() {
    const hourRes = calculatePeriod(new Date('2025-04-03T14:18:30Z'), 2, 'hours');
    assert(hourRes.appliedRules.some(r => r.startsWith('Article 3(1)')), 'Article 3(1) not applied for hours');
    assert.strictEqual(iso(hourRes.finalEndDate), '2025-04-03T16:59:59.999Z');

    const dayRes = calculatePeriod(new Date('2025-04-03T14:18:30Z'), 2, 'days');
    assert(dayRes.appliedRules.some(r => r.startsWith('Article 3(1)')), 'Article 3(1) not applied for days');
    assert.strictEqual(iso(dayRes.finalEndDate), '2025-04-07T23:59:59.999Z');
}

// Article 3(2) - working vs calendar days
function testArticle32() {
    const workRes = calculatePeriod(new Date('2025-04-03T00:00:00Z'), 2, 'working-days');
    assert(workRes.appliedRules.some(r => r.includes('Article 3(2)')), 'Article 3(2) not applied for working days');
    assert.strictEqual(iso(workRes.finalEndDate), '2025-04-07T23:59:59.999Z');

    const calRes = calculatePeriod(new Date('2025-04-03T00:00:00Z'), 2, 'days');
    assert(calRes.appliedRules.some(r => r.includes('Article 3(2)')), 'Article 3(2) not applied for calendar days');
    assert.strictEqual(iso(calRes.finalEndDate), '2025-04-07T23:59:59.999Z');
}

// Article 3(3) and 3(4) - holidays/weekends and extension
function testArticle33and34() {
    const holidayRes = calculatePeriod(new Date('2025-04-30T00:00:00Z'), 1, 'days');
    assert(holidayRes.appliedRules.some(r => r.includes('Article 3(4)')), 'Article 3(4) not applied on holiday');
    assert.strictEqual(iso(holidayRes.finalEndDate), '2025-05-02T23:59:59.999Z');

    const weekendRes = calculatePeriod(new Date('2025-04-04T00:00:00Z'), 1, 'days');
    assert(weekendRes.appliedRules.some(r => r.includes('Article 3(4)')), 'Article 3(4) not applied on weekend');
    assert.strictEqual(iso(weekendRes.finalEndDate), '2025-04-07T23:59:59.999Z');
}

// Article 3(5) - ensure two working days
function testArticle35() {
    const christmasRes = calculatePeriod(new Date('2024-12-24T00:00:00'), 2, 'days');
    assert(christmasRes.appliedRules.some(r => r.includes('Article 3(5)')), 'Article 3(5) not applied for Christmas period');
    assert.strictEqual(iso(christmasRes.finalEndDate), '2025-01-07T23:59:59.999Z');

    const mayRes = calculatePeriod(new Date('2025-04-30T00:00:00'), 2, 'days');
    assert(mayRes.appliedRules.some(r => r.includes('Article 3(5)')), 'Article 3(5) not applied for May period');
    assert.strictEqual(iso(mayRes.finalEndDate), '2025-05-05T23:59:59.999Z');
}

// Article 3(4) and 3(5) together
function testArticle34and35HolidayPeriod() {
    const startBefore = calculatePeriod(new Date('2024-12-24T00:00:00'), 7, 'days');
    assert.strictEqual(iso(startBefore.finalEndDate), '2025-01-07T23:59:59.999Z');

    const startDuring = calculatePeriod(new Date('2024-12-26T00:00:00'), 5, 'days');
    assert.strictEqual(iso(startDuring.finalEndDate), '2025-01-07T23:59:59.999Z');

    const startAfter = calculatePeriod(new Date('2025-01-02T00:00:00'), 3, 'days');
    assert.strictEqual(iso(startAfter.finalEndDate), '2025-01-07T23:59:59.999Z');
}

console.log('Running tests...');

const tests = [
    { name: 'Article 3(1)', fn: testArticle31 },
    { name: 'Article 3(2)', fn: testArticle32 },
    { name: 'Article 3(3) and 3(4)', fn: testArticle33and34 },
    { name: 'Article 3(5)', fn: testArticle35 },
    { name: 'Article 3(4) and 3(5) together', fn: testArticle34and35HolidayPeriod }
];

const failures = [];

for (const test of tests) {
    try {
        test.fn();
        console.log(`✅ ${test.name} passed`);
    } catch (err) {
        console.log(`❌ ${test.name} failed: ${err.message}`);
        failures.push({ name: test.name, error: err.message });
    }
}

if (failures.length === 0) {
    console.log('\n🎉 All tests passed!');
} else {
    console.log(`\n💥 ${failures.length} test(s) failed:`);
    failures.forEach(failure => {
        console.log(`  - ${failure.name}: ${failure.error}`);
    });
    process.exit(1);
}
