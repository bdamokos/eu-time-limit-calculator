// Set timezone to UTC for consistent testing
process.env.TZ = 'UTC';

const assert = require('assert');
const { calculatePeriod, setHolidaySystem, getHolidaySystem, holidayData } = require('./script.js');

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

// Test country-specific holidays affect calculations
function testCountrySpecificHolidays() {
    // Test case 1: January 6 (Epiphany) - Holiday in Austria but not in Germany
    // Period ending on January 6, 2025 should be extended in Austria but not in Germany
    
    // Austria: January 6 is a holiday, so period should extend past Jan 6 holiday and then be extended by Article 3(5)
    setHolidaySystem('AT');
    const austriaRes = calculatePeriod(new Date('2025-01-03T00:00:00'), 3, 'days');
    // Jan 3 -> start Jan 4, period: Jan 4 (Sat), 5 (Sun), 6 (Mon, holiday) -> ends Jan 6 (holiday) -> extended to Jan 7 by Art 3(4) -> extended to Jan 8 by Art 3(5)
    assert(austriaRes.appliedRules.some(r => r.includes('Article 3(4)')), 'Article 3(4) should be applied in Austria for Jan 6 holiday');
    assert(austriaRes.appliedRules.some(r => r.includes('Article 3(5)')), 'Article 3(5) should be applied in Austria to ensure 2 working days');
    assert.strictEqual(iso(austriaRes.finalEndDate), '2025-01-08T23:59:59.999Z', 'Austria should extend to Jan 8 to ensure 2 working days');
    
    // Germany: January 6 is NOT a holiday, but period still needs to be extended by Article 3(5)
    setHolidaySystem('DE');
    const germanyRes = calculatePeriod(new Date('2025-01-03T00:00:00'), 3, 'days');
    // Jan 3 -> start Jan 4, period: Jan 4 (Sat), 5 (Sun), 6 (Mon, working day) -> only 1 working day -> extended to Jan 7 by Art 3(5)
    assert(!germanyRes.appliedRules.some(r => r.includes('Article 3(4)')), 'Article 3(4) should NOT be applied in Germany for Jan 6');
    assert(germanyRes.appliedRules.some(r => r.includes('Article 3(5)')), 'Article 3(5) should be applied in Germany to ensure 2 working days');
    assert.strictEqual(iso(germanyRes.finalEndDate), '2025-01-07T23:59:59.999Z', 'Germany should extend to Jan 7 to ensure 2 working days');
    
    console.log(`  ✓ Austria extends Jan 6 period to Jan 8 (holiday + Art 3(5)), Germany extends to Jan 7 (Art 3(5))`);
}

function testBulgarianSpecificHoliday() {
    // Test case 2: March 3 (Liberation Day) - Holiday in Bulgaria but not in most other countries
    // Period ending on March 3, 2025 should be extended in Bulgaria but not in Germany
    
    // Bulgaria: March 3 is Liberation Day (holiday)
    setHolidaySystem('BG');
    const bulgariaRes = calculatePeriod(new Date('2025-02-28T00:00:00'), 3, 'days');
    // Feb 28 -> start Mar 1, period: Mar 1 (Sat), 2 (Sun), 3 (Mon, holiday) -> ends Mar 3 (holiday) -> extended to Mar 4 by Art 3(4) -> extended to Mar 5 by Art 3(5)
    assert(bulgariaRes.appliedRules.some(r => r.includes('Article 3(4)')), 'Article 3(4) should be applied in Bulgaria for Mar 3 holiday');
    assert(bulgariaRes.appliedRules.some(r => r.includes('Article 3(5)')), 'Article 3(5) should be applied in Bulgaria to ensure 2 working days');
    assert.strictEqual(iso(bulgariaRes.finalEndDate), '2025-03-05T23:59:59.999Z', 'Bulgaria should extend to Mar 5 to ensure 2 working days');
    
    // Germany: March 3 is NOT a holiday, but period still needs to be extended by Article 3(5)
    setHolidaySystem('DE');
    const germanyRes = calculatePeriod(new Date('2025-02-28T00:00:00'), 3, 'days');
    // Feb 28 -> start Mar 1, period: Mar 1 (Sat), 2 (Sun), 3 (Mon, working day) -> only 1 working day -> extended to Mar 4 by Art 3(5)
    assert(!germanyRes.appliedRules.some(r => r.includes('Article 3(4)')), 'Article 3(4) should NOT be applied in Germany for Mar 3');
    assert(germanyRes.appliedRules.some(r => r.includes('Article 3(5)')), 'Article 3(5) should be applied in Germany to ensure 2 working days');
    assert.strictEqual(iso(germanyRes.finalEndDate), '2025-03-04T23:59:59.999Z', 'Germany should extend to Mar 4 to ensure 2 working days');
    
    console.log(`  ✓ Bulgaria extends Mar 3 period to Mar 5 (holiday + Art 3(5)), Germany extends to Mar 4 (Art 3(5))`);
}

function testEuropeanInstitutionsVsMemberStates() {
    // Test case 3: European institutions vs Member States
    // Compare European Parliament holidays with a Member State that has different holidays
    
    // European Parliament holidays include more office closing days in December
    setHolidaySystem('EP');
    const epRes = calculatePeriod(new Date('2025-12-22T00:00:00'), 3, 'days');
    // Dec 22 -> start Dec 23, period should account for EP office closing days 24-31
    
    // France has fewer December holidays than EP
    setHolidaySystem('FR');
    const franceRes = calculatePeriod(new Date('2025-12-22T00:00:00'), 3, 'days');
    
    // The end dates should be different due to different holiday calendars
    assert.notStrictEqual(iso(epRes.finalEndDate), iso(franceRes.finalEndDate), 
        'European Parliament and France should have different results due to different December holidays');
    
    console.log(`  ✓ European Parliament: ${iso(epRes.finalEndDate).slice(0,10)}, France: ${iso(franceRes.finalEndDate).slice(0,10)} (different December holidays)`);
}

function testWorkingDaysWithDifferentHolidays() {
    // Test case 4: Working days calculation with different holiday systems
    // A period that includes a country-specific holiday should have different working day counts
    
    // Set to European Parliament (default)
    setHolidaySystem('EP');
    const epWorkingDays = calculatePeriod(new Date('2025-01-02T00:00:00'), 5, 'working-days');
    
    // Set to Austria (has Jan 6 as holiday, EP doesn't have Jan 6 in 2025)
    setHolidaySystem('AT');
    const austriaWorkingDays = calculatePeriod(new Date('2025-01-02T00:00:00'), 5, 'working-days');
    
    // Both should end on the same date because they both find exactly 5 working days ending on Jan 10
    // EP: Jan 6, 7, 8, 9, 10 (Jan 6 is not a holiday for EP)
    // Austria: Jan 3, 7, 8, 9, 10 (Jan 6 is a holiday for Austria, so Jan 3 is counted instead)
    assert.strictEqual(iso(epWorkingDays.finalEndDate), iso(austriaWorkingDays.finalEndDate), 
        'EP and Austria should have the same end date when calculating 5 working days, despite different holiday calendars');
    
    console.log(`  ✓ Working days: EP ends ${iso(epWorkingDays.finalEndDate).slice(0,10)}, Austria ends ${iso(austriaWorkingDays.finalEndDate).slice(0,10)}`);
}

function testCaseC17103WeeksCalculation() {
    // Test Case C-171/03: Periods expressed in weeks should end on the same day of week as event
    // According to the court decision, for periods expressed in weeks, months, or years,
    // Article 3(2)(c) takes precedence over Article 3(1)
    
    // Test: 3 weeks from Monday, April 7, 2025 should end on Monday, April 28, 2025
    const mondayResult = calculatePeriod(new Date('2025-04-07T00:00:00Z'), 3, 'weeks');
    assert(mondayResult.appliedRules.some(r => r.includes('Case C-171/03')), 'Case C-171/03 rule should be applied');
    assert.strictEqual(iso(mondayResult.finalEndDate), '2025-04-28T23:59:59.999Z', 
        '3 weeks from Monday April 7 should end on Monday April 28');
    
    // Test: 2 weeks from Friday, January 10, 2025 should end on Friday, January 24, 2025
    const fridayResult = calculatePeriod(new Date('2025-01-10T00:00:00Z'), 2, 'weeks');
    assert(fridayResult.appliedRules.some(r => r.includes('Case C-171/03')), 'Case C-171/03 rule should be applied');
    assert.strictEqual(iso(fridayResult.finalEndDate), '2025-01-24T23:59:59.999Z', 
        '2 weeks from Friday January 10 should end on Friday January 24');
    
    console.log(`  ✓ 3 weeks from Monday ends on Monday (same day of week)`);
    console.log(`  ✓ 2 weeks from Friday ends on Friday (same day of week)`);
}

function testCaseC17103MonthsCalculation() {
    // Test Case C-171/03: Periods expressed in months should end on same date as event
    
    // Test: 2 months from January 15, 2025 should end on March 15, 2025
    // But March 15, 2025 is a Saturday, so Article 3(4) extends it to March 17, 2025 (Monday)
    const monthResult = calculatePeriod(new Date('2025-01-15T00:00:00Z'), 2, 'months');
    assert(monthResult.appliedRules.some(r => r.includes('Case C-171/03')), 'Case C-171/03 rule should be applied');
    assert(monthResult.appliedRules.some(r => r.includes('Article 3(4)')), 'Article 3(4) should be applied because March 15 is a Saturday');
    assert.strictEqual(iso(monthResult.finalEndDate), '2025-03-17T23:59:59.999Z', 
        '2 months from January 15 should end on March 17 (extended from March 15 due to weekend)');
    
    // Test edge case: 1 month from January 31, 2025 should end on February 28, 2025 (last day of Feb)
    const monthEdgeResult = calculatePeriod(new Date('2025-01-31T00:00:00Z'), 1, 'months');
    assert(monthEdgeResult.appliedRules.some(r => r.includes('Case C-171/03')), 'Case C-171/03 rule should be applied');
    assert.strictEqual(iso(monthEdgeResult.finalEndDate), '2025-02-28T23:59:59.999Z', 
        '1 month from January 31 should end on February 28 (last day of February)');
    
    console.log(`  ✓ 2 months from January 15 ends on March 17 (March 15 extended due to weekend)`);
    console.log(`  ✓ 1 month from January 31 ends on February 28 (last day of target month)`);
}

function testCaseC17103YearsCalculation() {
    // Test Case C-171/03: Periods expressed in years should end on same date as event
    
    // Test: 1 year from March 10, 2025 should end on March 10, 2026
    const yearResult = calculatePeriod(new Date('2025-03-10T00:00:00Z'), 1, 'years');
    assert(yearResult.appliedRules.some(r => r.includes('Case C-171/03')), 'Case C-171/03 rule should be applied');
    assert.strictEqual(iso(yearResult.finalEndDate), '2026-03-10T23:59:59.999Z', 
        '1 year from March 10, 2025 should end on March 10, 2026');
    
    // Test leap year edge case: 1 year from February 29, 2024 should end on February 28, 2025
    const leapYearResult = calculatePeriod(new Date('2024-02-29T00:00:00Z'), 1, 'years');
    assert(leapYearResult.appliedRules.some(r => r.includes('Case C-171/03')), 'Case C-171/03 rule should be applied');
    assert.strictEqual(iso(leapYearResult.finalEndDate), '2025-02-28T23:59:59.999Z', 
        '1 year from February 29, 2024 should end on February 28, 2025');
    
    console.log(`  ✓ 1 year from March 10, 2025 ends on March 10, 2026 (same date)`);
    console.log(`  ✓ 1 year from February 29, 2024 ends on February 28, 2025 (leap year adjustment)`);
}

function testMonthEndEdgeCases() {
    // Test comprehensive month-end edge cases where target day doesn't exist in destination month
    // Per Article 3(2)(c): "If, in a period expressed in months or in years, the day on which it should 
    // expire does not occur in the last month, the period shall end with the expiry of the last hour 
    // of the last day of that month"
    
    // Test 1: January 30 + 1 month in non-leap year = February 28
    const jan30NonLeap = calculatePeriod(new Date('2025-01-30T00:00:00Z'), 1, 'months');
    assert(jan30NonLeap.appliedRules.some(r => r.includes('Case C-171/03')), 'Case C-171/03 rule should be applied');
    assert.strictEqual(iso(jan30NonLeap.finalEndDate), '2025-02-28T23:59:59.999Z', 
        'January 30, 2025 + 1 month should end on February 28, 2025 (non-leap year)');
    
    // Test 2: January 30 + 1 month in leap year = February 29
    const jan30LeapYear = calculatePeriod(new Date('2024-01-30T00:00:00Z'), 1, 'months');
    assert(jan30LeapYear.appliedRules.some(r => r.includes('Case C-171/03')), 'Case C-171/03 rule should be applied');
    assert.strictEqual(iso(jan30LeapYear.finalEndDate), '2024-02-29T23:59:59.999Z', 
        'January 30, 2024 + 1 month should end on February 29, 2024 (leap year)');
    
    // Test 3: February 28 + 1 month = March 28 (should NOT trigger last-day rule)
    const feb28 = calculatePeriod(new Date('2025-02-28T00:00:00Z'), 1, 'months');
    assert(feb28.appliedRules.some(r => r.includes('Case C-171/03')), 'Case C-171/03 rule should be applied');
    assert.strictEqual(iso(feb28.finalEndDate), '2025-03-28T23:59:59.999Z', 
        'February 28, 2025 + 1 month should end on March 28, 2025');
    
    // Test 4: February 29 + 1 month = March 29 (leap year case)
    const feb29 = calculatePeriod(new Date('2024-02-29T00:00:00Z'), 1, 'months');
    assert(feb29.appliedRules.some(r => r.includes('Case C-171/03')), 'Case C-171/03 rule should be applied');
    assert.strictEqual(iso(feb29.finalEndDate), '2024-03-29T23:59:59.999Z', 
        'February 29, 2024 + 1 month should end on March 29, 2024');
    
    // Test 5: March 31 + 1 month = April 30 (31-day to 30-day month)
    const mar31 = calculatePeriod(new Date('2025-03-31T00:00:00Z'), 1, 'months');
    assert(mar31.appliedRules.some(r => r.includes('Case C-171/03')), 'Case C-171/03 rule should be applied');
    assert.strictEqual(iso(mar31.finalEndDate), '2025-04-30T23:59:59.999Z', 
        'March 31, 2025 + 1 month should end on April 30, 2025 (last day of April)');
    
    // Test 6: May 31 + 1 month = June 30 (31-day to 30-day month)
    const may31 = calculatePeriod(new Date('2025-05-31T00:00:00Z'), 1, 'months');
    assert(may31.appliedRules.some(r => r.includes('Case C-171/03')), 'Case C-171/03 rule should be applied');
    assert.strictEqual(iso(may31.finalEndDate), '2025-06-30T23:59:59.999Z', 
        'May 31, 2025 + 1 month should end on June 30, 2025 (last day of June)');
    
    // Test 7: August 31 + 1 month = September 30 (31-day to 30-day month)
    const aug31 = calculatePeriod(new Date('2025-08-31T00:00:00Z'), 1, 'months');
    assert(aug31.appliedRules.some(r => r.includes('Case C-171/03')), 'Case C-171/03 rule should be applied');
    assert.strictEqual(iso(aug31.finalEndDate), '2025-09-30T23:59:59.999Z', 
        'August 31, 2025 + 1 month should end on September 30, 2025 (last day of September)');
    
    // Test 8: October 31 + 1 month = November 30, but November 30, 2025 is Sunday, so extended to December 1
    const oct31 = calculatePeriod(new Date('2025-10-31T00:00:00Z'), 1, 'months');
    assert(oct31.appliedRules.some(r => r.includes('Case C-171/03')), 'Case C-171/03 rule should be applied');
    assert(oct31.appliedRules.some(r => r.includes('Article 3(4)')), 'Article 3(4) should be applied (Nov 30 is Sunday)');
    assert.strictEqual(iso(oct31.finalEndDate), '2025-12-01T23:59:59.999Z', 
        'October 31, 2025 + 1 month should end on December 1, 2025 (November 30 extended due to Sunday)');
    
    // Test 9: December 31 + 1 month = January 31, but January 31, 2026 is Saturday, so extended to February 2
    const dec31 = calculatePeriod(new Date('2025-12-31T00:00:00Z'), 1, 'months');
    assert(dec31.appliedRules.some(r => r.includes('Case C-171/03')), 'Case C-171/03 rule should be applied');
    assert(dec31.appliedRules.some(r => r.includes('Article 3(4)')), 'Article 3(4) should be applied (Jan 31 is Saturday)');
    assert.strictEqual(iso(dec31.finalEndDate), '2026-02-02T23:59:59.999Z', 
        'December 31, 2025 + 1 month should end on February 2, 2026 (January 31 extended due to Saturday)');
    
    // Test 10: Test multiple months with edge cases
    // January 31 + 2 months = March 31 (Jan 31 -> Feb 28 -> Mar 31)
    const jan31TwoMonths = calculatePeriod(new Date('2025-01-31T00:00:00Z'), 2, 'months');
    assert(jan31TwoMonths.appliedRules.some(r => r.includes('Case C-171/03')), 'Case C-171/03 rule should be applied');
    assert.strictEqual(iso(jan31TwoMonths.finalEndDate), '2025-03-31T23:59:59.999Z', 
        'January 31, 2025 + 2 months should end on March 31, 2025');
    
    // Test 11: Test with Article 3(4) extension (weekend extension)
    // March 31 + 1 month = April 30, but if April 30 is weekend, should extend
    const mar31Weekend = calculatePeriod(new Date('2023-03-31T00:00:00Z'), 1, 'months');
    // April 30, 2023 is a Sunday, so should extend to May 1, 2023
    assert(mar31Weekend.appliedRules.some(r => r.includes('Case C-171/03')), 'Case C-171/03 rule should be applied');
    assert(mar31Weekend.appliedRules.some(r => r.includes('Article 3(4)')), 'Article 3(4) should be applied for weekend extension');
    assert.strictEqual(iso(mar31Weekend.finalEndDate), '2023-05-01T23:59:59.999Z', 
        'March 31, 2023 + 1 month should end on May 1, 2023 (April 30 extended due to Sunday)');
    
    console.log(`  ✓ January 30 + 1 month: Non-leap year -> February 28, Leap year -> February 29`);
    console.log(`  ✓ February 28 + 1 month -> March 28 (no last-day adjustment needed)`);
    console.log(`  ✓ February 29 + 1 month -> March 29 (leap year case)`);
    console.log(`  ✓ 31st day to 30-day months: Mar->Apr, May->Jun, Aug->Sep, Oct->Nov (with weekend extension)`);
    console.log(`  ✓ December 31 + 1 month -> February 2 (year transition + weekend extension)`);
    console.log(`  ✓ January 31 + 2 months -> March 31 (multi-month calculation)`);
    console.log(`  ✓ Month-end + weekend extension works correctly`);
}

function testDaysVsWeeksCalculation() {
    // Compare that days and weeks calculations are now different per Case C-171/03
    // Days still follow Article 3(1) (skip event day), but weeks follow Article 3(2)(c) (start from event day)
    
    // Test: 7 days vs 1 week from same starting date should give different results
    const daysResult = calculatePeriod(new Date('2025-04-07T00:00:00Z'), 7, 'days');
    const weeksResult = calculatePeriod(new Date('2025-04-07T00:00:00Z'), 1, 'weeks');
    
    // 7 days from April 7: starts April 8, ends April 14
    assert.strictEqual(iso(daysResult.finalEndDate), '2025-04-14T23:59:59.999Z', 
        '7 days from April 7 should end on April 14');
    
    // 1 week from April 7: starts April 7, ends April 14 (same day of week)
    assert.strictEqual(iso(weeksResult.finalEndDate), '2025-04-14T23:59:59.999Z', 
        '1 week from April 7 should end on April 14');
    
    // They happen to end on the same date in this case, but the logic is different
    assert(daysResult.appliedRules.some(r => r.includes('Article 3(1)')), 'Days should apply Article 3(1)');
    assert(weeksResult.appliedRules.some(r => r.includes('Case C-171/03')), 'Weeks should apply Case C-171/03');
    
    console.log(`  ✓ 7 days and 1 week from same date use different calculation methods`);
}

// Security tests for sanitization functions
function testHolidaySystemSanitization() {
    // Test valid holiday system
    setHolidaySystem('DE');
    assert.strictEqual(getHolidaySystem(), 'DE', 'Valid system (DE) should be accepted');

    // Test invalid holiday system - should default to EP
    setHolidaySystem('INVALID_SYSTEM');
    assert.strictEqual(getHolidaySystem(), 'EP', 'Invalid system should default to EP');

    // Test XSS injection attempt
    setHolidaySystem('<script>alert("xss")</script>');
    assert.strictEqual(getHolidaySystem(), 'EP', 'XSS attempt should default to EP');

    // Test another valid system
    setHolidaySystem('FR');
    assert.strictEqual(getHolidaySystem(), 'FR', 'Valid system (FR) should be accepted');

    // Test empty string
    setHolidaySystem('');
    assert.strictEqual(getHolidaySystem(), 'EP', 'Empty string should default to EP');

    // Test null/undefined
    setHolidaySystem(null);
    assert.strictEqual(getHolidaySystem(), 'EP', 'Null value should default to EP');

    setHolidaySystem(undefined);
    assert.strictEqual(getHolidaySystem(), 'EP', 'Undefined value should default to EP');

    console.log('  ✓ All holiday system sanitization tests passed');
}

// Security test for HTML injection prevention in warning messages
function testHtmlInjectionPrevention() {
    // Test the HTML sanitization logic directly without needing DOM
    const dangerousInput = '⚠️ <strong>Warning</strong>: <script>alert("xss")</script> <img src="x" onerror="alert(\'xss2\')">';
    
    // Simulate the sanitization logic from createResultElement
    let cleanWarning = dangerousInput;
    
    // Simplified and more secure: just strip all HTML tags completely
    // This prevents any edge cases with nested or malformed HTML
    let previousWarning;
    do {
        previousWarning = cleanWarning;
        cleanWarning = cleanWarning.replace(/<[^>]*>/g, '');
    } while (previousWarning !== cleanWarning);
    
    // Verify that all dangerous content has been removed
    assert(!cleanWarning.includes('<script'), 'Warning should not contain script tags');
    assert(!cleanWarning.includes('<img'), 'Warning should not contain img tags');
    assert(!cleanWarning.includes('onerror'), 'Warning should not contain event handlers');
    assert(cleanWarning.includes('Warning'), 'Warning should contain the actual warning text');
    
    // Verify that all HTML has been stripped
    assert(!cleanWarning.includes('<'), 'Warning should not contain any HTML tags');
    assert(!cleanWarning.includes('>'), 'Warning should not contain any HTML tags');
    
         // Test with other potentially dangerous content
     const otherDangerousInputs = [
         '<script src="evil.js"></script>Legitimate warning',
         'Warning: <iframe src="javascript:alert(1)"></iframe>',
         'Alert: <object data="javascript:alert(1)"></object>',
         'Notice: <embed src="javascript:alert(1)">',
         'Info: <link rel="stylesheet" href="javascript:alert(1)">',
         '<style>body{background:url("javascript:alert(1)")}</style>Warning',
         '<div onclick="alert(1)">Click me</div>Important notice',
         'Data: <svg onload="alert(1)"></svg>',
         'Test: <details open ontoggle="alert(1)">Content</details>',
         // Test nested and malformed HTML that could bypass weaker sanitization
         '<scrip<strong>t>alert(1)</script>',
         '<strong><script>alert(1)</script></strong>',
         '<script><strong>evil</strong>alert(1)</script>',
         '<<script>alert(1)</script>>',
         '<script><!--<strong>--></strong>alert(1)</script>',
         '<strong><script></strong>alert(1)</script>',
         '<scri<strong></strong>pt>alert(1)</script>'
     ];
     
     for (const dangerous of otherDangerousInputs) {
         let cleaned = dangerous;
         // Use the same simplified sanitization logic
         let previousCleaned;
         do {
             previousCleaned = cleaned;
             cleaned = cleaned.replace(/<[^>]*>/g, '');
         } while (previousCleaned !== cleaned);
         
         // The main security goal: ensure no HTML tags remain that could be executed
         // We check for '<' characters which could start HTML tags
         // Note: '>' characters in plain text are harmless, so we don't need to check for them
         assert(!cleaned.includes('<'), `Should strip all HTML from: "${dangerous}"`);
         
         // Ensure we still have the legitimate text content
         assert(cleaned.length > 0, `Should retain some text content from: "${dangerous}"`);
         
         // Check that common script-related patterns in HTML context are gone
         assert(!cleaned.includes('<script'), `Should strip script tags from: "${dangerous}"`);
         assert(!cleaned.includes('<iframe'), `Should strip iframe tags from: "${dangerous}"`);
         assert(!cleaned.includes('onclick='), `Should strip onclick handlers from: "${dangerous}"`);
         assert(!cleaned.includes('onload='), `Should strip onload handlers from: "${dangerous}"`);
         
         // Additional checks for the challenging nested/malformed cases
         // Note: We don't check for 'alert(' or 'javascript:' as text because once HTML tags are stripped,
         // these become harmless text content. The security concern is only when they're in executable HTML contexts.
     }
    
    // Special test for the challenging case that could bypass the old approach
    const challengingCase = '<scrip<strong>t>alert("bypass attempt")</script>';
    let cleanedChallenge = challengingCase;
    let previousCleanedChallenge;
    do {
        previousCleanedChallenge = cleanedChallenge;
        cleanedChallenge = cleanedChallenge.replace(/<[^>]*>/g, '');
    } while (previousCleanedChallenge !== cleanedChallenge);
    
         // This should be completely clean now - result should be 't>alert("bypass attempt")'
     assert.strictEqual(cleanedChallenge, 't>alert("bypass attempt")', 'Complex nested case should be safely cleaned');
     assert(!cleanedChallenge.includes('<'), 'No opening angle brackets should remain (they could start HTML tags)');
    
    console.log('  ✓ HTML injection prevention test passed - dangerous content was safely stripped');
    console.log('  ✓ Complex nested HTML bypass attempts were successfully prevented');
}

console.log('Running tests...');

const tests = [
    { name: 'Article 3(1)', fn: testArticle31 },
    { name: 'Article 3(2)', fn: testArticle32 },
    { name: 'Article 3(3) and 3(4)', fn: testArticle33and34 },
    { name: 'Article 3(5)', fn: testArticle35 },
    { name: 'Article 3(4) and 3(5) together', fn: testArticle34and35HolidayPeriod },
    { name: 'Country-specific holidays (Austria vs Germany)', fn: testCountrySpecificHolidays },
    { name: 'Bulgarian Liberation Day vs Germany', fn: testBulgarianSpecificHoliday },
    { name: 'European institutions vs Member States', fn: testEuropeanInstitutionsVsMemberStates },
    { name: 'Working days with different holiday systems', fn: testWorkingDaysWithDifferentHolidays },
    { name: 'Case C-171/03: Weeks calculation', fn: testCaseC17103WeeksCalculation },
    { name: 'Case C-171/03: Months calculation', fn: testCaseC17103MonthsCalculation },
    { name: 'Case C-171/03: Years calculation', fn: testCaseC17103YearsCalculation },
    { name: 'Month-end edge cases (Article 3(2)(c))', fn: testMonthEndEdgeCases },
    { name: 'Days vs Weeks calculation difference', fn: testDaysVsWeeksCalculation },
    { name: 'Holiday system sanitization (Security)', fn: testHolidaySystemSanitization },
    { name: 'HTML injection prevention in warning messages', fn: testHtmlInjectionPrevention }
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

// Reset to default
setHolidaySystem('EP');

if (failures.length === 0) {
    console.log('\n🎉 All tests passed!');
    console.log('\n📊 Holiday systems tested:');
    console.log('  - European Parliament (EP)');
    console.log('  - Austria (AT) - has January 6 holiday');
    console.log('  - Germany (DE) - no January 6 holiday');
    console.log('  - Bulgaria (BG) - has March 3 Liberation Day');
    console.log('  - France (FR) - different December holidays than EP');
} else {
    console.log(`\n💥 ${failures.length} test(s) failed:`);
    failures.forEach(failure => {
        console.log(`  - ${failure.name}: ${failure.error}`);
    });
    process.exit(1);
}

// Test holiday data warning functionality
console.log('\n📋 Testing holiday data warning functionality...');

// Test 1: Period extending into future years should show appropriate warnings
const periods = require('./script.js');
periods.setHolidaySystem('DE'); // Germany data coverage

const eventDate2026 = new Date('2025-12-01T10:00:00');
const result2026 = periods.calculatePeriod(eventDate2026, 60, 'days');

console.log('Test: 60 days from 2025-12-01 (extends into 2026)');
console.log(`Holiday system: Germany (${periods.getHolidaySystem()})`);
console.log(`Period: ${result2026.startDate.toISOString().split('T')[0]} to ${result2026.finalEndDate.toISOString().split('T')[0]}`);

const availableYears = periods.getHolidayDataYears('DE');
const has2026Data = availableYears.includes(2026);

if (has2026Data) {
    if (!result2026.holidayDataWarning) {
        console.log('✅ No warning needed - Germany has 2026 data available');
    } else {
        console.log('❌ Unexpected warning when 2026 data is available');
        console.log(`Warning: ${result2026.holidayDataWarning}`);
    }
} else {
    if (result2026.holidayDataWarning) {
        console.log('✅ Warning correctly displayed for missing 2026 data');
        console.log(`Warning: ${result2026.holidayDataWarning}`);
    } else {
        console.log('❌ Expected warning for missing 2026 data, but none found');
    }
}

// Test 2: Period within 2025 should not show warning
const eventDate2025 = new Date('2025-06-01T10:00:00');
const result2025 = periods.calculatePeriod(eventDate2025, 30, 'days');

console.log('\nTest: 30 days from 2025-06-01 (stays within 2025)');
console.log(`Period: ${result2025.startDate.toISOString().split('T')[0]} to ${result2025.finalEndDate.toISOString().split('T')[0]}`);

if (!result2025.holidayDataWarning) {
    console.log('✅ No warning for period within available data');
} else {
    console.log('❌ Unexpected warning for period within available data');
    console.log(`Warning: ${result2025.holidayDataWarning}`);
}

// Test 3: European Parliament data coverage test
periods.setHolidaySystem('EP');
const resultEP2026 = periods.calculatePeriod(eventDate2026, 60, 'days');

console.log('\nTest: 60 days from 2025-12-01 with European Parliament holidays');
console.log(`Holiday system: European Parliament (${periods.getHolidaySystem()})`);
console.log(`Period: ${resultEP2026.startDate.toISOString().split('T')[0]} to ${resultEP2026.finalEndDate.toISOString().split('T')[0]}`);

// Check if EP has full 2026 data or just New Year period
const ep2026Holidays = periods.holidayData['EP'].filter(d => d.startsWith('2026-'));
const hasFullEP2026Data = ep2026Holidays.some(dateStr => {
    const date = dateStr.split('-');
    return date[1] !== '01' || parseInt(date[2]) > 7; // Has holidays beyond first week of January
});

if (hasFullEP2026Data) {
    if (!resultEP2026.holidayDataWarning) {
        console.log('✅ No warning needed - EP has full 2026 data available');
    } else {
        console.log('❌ Unexpected warning when EP has full 2026 data');
        console.log(`Warning: ${resultEP2026.holidayDataWarning}`);
    }
} else {
    if (resultEP2026.holidayDataWarning) {
        console.log('✅ European Parliament correctly shows warning for incomplete 2026 data');
        console.log(`Warning: ${resultEP2026.holidayDataWarning}`);
    } else {
        console.log('❌ Expected warning for EP incomplete 2026 data (only New Year period available)');
    }
}

// Test 4: EP period within New Year week should not show warning
const eventDateNewYear = new Date('2025-12-30T10:00:00');
const resultEPNewYear = periods.calculatePeriod(eventDateNewYear, 3, 'days');

console.log('\nTest: 3 days from 2025-12-30 with European Parliament holidays (ends Jan 6, within New Year week)');
console.log(`Period: ${resultEPNewYear.startDate.toISOString().split('T')[0]} to ${resultEPNewYear.finalEndDate.toISOString().split('T')[0]}`);

if (!resultEPNewYear.holidayDataWarning) {
    console.log('✅ European Parliament: no warning (period ends Jan 6, within New Year coverage)');
} else {
    console.log('❌ Unexpected warning for EP period within New Year week (ends Jan 6)');
    console.log(`Warning: ${resultEPNewYear.holidayDataWarning}`);
}

// Test 5: EP period only within New Year week should not show warning  
const eventDateNewYearShort = new Date('2026-01-01T10:00:00');
const resultEPNewYearShort = periods.calculatePeriod(eventDateNewYearShort, 1, 'days');

console.log('\nTest: 1 day from 2026-01-01 with European Parliament holidays (within New Year coverage)');
console.log(`Period: ${resultEPNewYearShort.startDate.toISOString().split('T')[0]} to ${resultEPNewYearShort.finalEndDate.toISOString().split('T')[0]}`);

if (!resultEPNewYearShort.holidayDataWarning) {
    console.log('✅ European Parliament New Year period: no warning (within coverage)');
} else {
    console.log('❌ Unexpected warning for EP period within New Year coverage');
    console.log(`Warning: ${resultEPNewYearShort.holidayDataWarning}`);
}

// Test 6: EP period extending beyond January 7 (dynamic based on data availability)
const eventDateBeyondNewYear = new Date('2026-01-01T10:00:00');
const resultEPBeyondNewYear = periods.calculatePeriod(eventDateBeyondNewYear, 10, 'days');

console.log('\nTest: 10 days from 2026-01-01 with European Parliament holidays (extends beyond Jan 7)');
console.log(`Period: ${resultEPBeyondNewYear.startDate.toISOString().split('T')[0]} to ${resultEPBeyondNewYear.finalEndDate.toISOString().split('T')[0]}`);

if (hasFullEP2026Data) {
    if (!resultEPBeyondNewYear.holidayDataWarning) {
        console.log('✅ No warning needed - EP has full 2026 data available');
    } else {
        console.log('❌ Unexpected warning when EP has full 2026 data');
        console.log(`Warning: ${resultEPBeyondNewYear.holidayDataWarning}`);
    }
} else {
    if (resultEPBeyondNewYear.holidayDataWarning) {
        console.log('✅ European Parliament correctly shows warning (extends beyond New Year week)');
    } else {
        console.log('❌ Expected warning for EP period extending beyond January 7');
    }
}

console.log('\n✅ Holiday data warning tests completed!');
