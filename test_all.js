/**
 * Test suite for the period calculation implementation
 * 
 * To run the tests:
 * 1. Open a terminal
 * 2. Navigate to the project directory
 * 3. Run: node test_all.js
 * 
 * The tests will verify all aspects of the period calculation:
 * - Article 3(1): Skip event hour/day
 * - Article 3(2): Period calculation (working days and calendar days)
 * - Article 3(3): Holidays and weekends handling
 * - Article 3(4): Extension to next working day
 * - Article 3(5): Ensuring at least two working days in periods of two days or more
 * 
 * Each test will output its results to the console, showing:
 * - The test scenario being run
 * - The explanation of how the period was calculated
 * - The final end date of the period
 */

// Test file for all articles using script.js
const { calculatePeriod } = require('./script.js');

// Helper function to format dates for comparison
function formatDate(date) {
    return date.toISOString().split('T')[0];
}

// Helper function to format time for comparison
function formatTime(date) {
    return date.toTimeString().split(' ')[0];
}

// Test Article 3(1) - Skip event hour/day
function testArticle31() {
    console.log('\nTesting Article 3(1) - Skip event hour/day\n');

    // Test 1: Hours
    console.log('Test 1: 2-hour period starting from 14:18:30');
    const hourTest = calculatePeriod(new Date('2025-04-03T14:18:30'), 2, 'hours', false);
    console.log('Result:', hourTest.explanation.join('\n'));
    console.log('End Date:', hourTest.finalEndDate.toLocaleString());
    console.log('\n');

    // Test 2: Days
    console.log('Test 2: 2-day period starting from April 3, 2025 14:18:30');
    const dayTest = calculatePeriod(new Date('2025-04-03T14:18:30'), 2, 'days', false);
    console.log('Result:', dayTest.explanation.join('\n'));
    console.log('End Date:', dayTest.finalEndDate.toLocaleString());
    console.log('\n');
}

// Test Article 3(2) - Period calculation
function testArticle32() {
    console.log('\nTesting Article 3(2) - Period calculation\n');

    // Test 1: Working days
    console.log('Test 1: 2 working days starting from April 3, 2025');
    const workingDaysTest = calculatePeriod(new Date('2025-04-03T00:00:00'), 2, 'days', true);
    console.log('Result:', workingDaysTest.explanation.join('\n'));
    console.log('End Date:', workingDaysTest.finalEndDate.toLocaleString());
    console.log('\n');

    // Test 2: Calendar days
    console.log('Test 2: 2 calendar days starting from April 3, 2025');
    const calendarDaysTest = calculatePeriod(new Date('2025-04-03T00:00:00'), 2, 'days', false);
    console.log('Result:', calendarDaysTest.explanation.join('\n'));
    console.log('End Date:', calendarDaysTest.finalEndDate.toLocaleString());
    console.log('\n');
}

// Test Article 3(3) - Holidays and weekends
function testArticle33() {
    console.log('\nTesting Article 3(3) - Holidays and weekends\n');

    // Test 1: Period ending on a holiday
    console.log('Test 1: 1 day period ending on a holiday (May 1, 2025)');
    const holidayTest = calculatePeriod(new Date('2025-04-30T00:00:00'), 1, 'days', false);
    console.log('Result:', holidayTest.explanation.join('\n'));
    console.log('End Date:', holidayTest.finalEndDate.toLocaleString());
    console.log('\n');

    // Test 2: Period ending on a weekend
    console.log('Test 2: 1 day period ending on a weekend (April 5, 2025 - Saturday)');
    const weekendTest = calculatePeriod(new Date('2025-04-04T00:00:00'), 1, 'days', false);
    console.log('Result:', weekendTest.explanation.join('\n'));
    console.log('End Date:', weekendTest.finalEndDate.toLocaleString());
    console.log('\n');
}

// Test Article 3(4) - Extension to next working day
function testArticle34() {
    console.log('\nTesting Article 3(4) - Extension to next working day\n');

    // Test 1: Period ending on a holiday
    console.log('Test 1: 1 day period ending on a holiday (May 1, 2025)');
    const holidayTest = calculatePeriod(new Date('2025-04-30T00:00:00'), 1, 'days', false);
    console.log('Result:', holidayTest.explanation.join('\n'));
    console.log('End Date:', holidayTest.finalEndDate.toLocaleString());
    console.log('\n');

    // Test 2: Period ending on a weekend
    console.log('Test 2: 1 day period ending on a weekend (April 5, 2025 - Saturday)');
    const weekendTest = calculatePeriod(new Date('2025-04-04T00:00:00'), 1, 'days', false);
    console.log('Result:', weekendTest.explanation.join('\n'));
    console.log('End Date:', weekendTest.finalEndDate.toLocaleString());
    console.log('\n');
}

// Test Article 3(5) - Ensuring at least two working days
function testArticle35() {
    console.log('\nTesting Article 3(5) - Ensuring at least two working days\n');

    // Test 1: 2-day period during Christmas holidays
    console.log('Test 1: 2-day period starting from December 24, 2024');
    const holidayTest = calculatePeriod(new Date('2024-12-24T00:00:00'), 2, 'days', false);
    console.log('Result:', holidayTest.explanation.join('\n'));
    console.log('End Date:', holidayTest.finalEndDate.toLocaleString());
    console.log('Working days found:', holidayTest.workingDaysCount);
    
    // The period Dec 25, 2024 to Jan 6, 2025 contains only 1 working day (Jan 6)
    // Dec 30 is incorrectly counted as a working day in the log but it's defined as a holiday
    // The period must be extended to Jan 7, 2025 to include 2 working days
    console.log('Extension to 2nd working day correct:', holidayTest.finalEndDate.toLocaleDateString() === '1/7/2025');
    console.log('\n');

    // Test 2: 2-day period with only one working day
    console.log('Test 2: 2-day period starting from April 30, 2025 (May 1 is a holiday)');
    const singleWorkDayTest = calculatePeriod(new Date('2025-04-30T00:00:00'), 2, 'days', false);
    console.log('Result:', singleWorkDayTest.explanation.join('\n'));
    console.log('End Date:', singleWorkDayTest.finalEndDate.toLocaleString());
    console.log('Extension to 2nd working day correct:', singleWorkDayTest.finalEndDate.toLocaleDateString() === '5/5/2025');
    console.log('\n');
}

// Test Article 3(4) and 3(5) together - Holiday period
function testArticle34And35HolidayPeriod() {
    console.log('\nTesting Article 3(4) and 3(5) together - Holiday period\n');

    // Test 1: Period starting before Christmas, ending during holidays
    console.log('Test 1: 7 days starting from December 24, 2024');
    const test1 = calculatePeriod(new Date('2024-12-24T00:00:00'), 7, 'days', false);
    console.log('Result:', test1.explanation.join('\n'));
    console.log('End Date:', test1.finalEndDate.toLocaleString());
    console.log('\n');

    // Test 2: Period starting during Christmas, ending during holidays
    console.log('Test 2: 5 days starting from December 26, 2024');
    const test2 = calculatePeriod(new Date('2024-12-26T00:00:00'), 5, 'days', false);
    console.log('Result:', test2.explanation.join('\n'));
    console.log('End Date:', test2.finalEndDate.toLocaleString());
    console.log('\n');

    // Test 3: Period starting after New Year, ending during holidays
    console.log('Test 3: 3 days starting from January 2, 2025');
    const test3 = calculatePeriod(new Date('2025-01-02T00:00:00'), 3, 'days', false);
    console.log('Result:', test3.explanation.join('\n'));
    console.log('End Date:', test3.finalEndDate.toLocaleString());
    console.log('Expected End Date: 2025-01-07T23:59:59.999Z');
    console.log('Extension to 2nd working day correct:', test3.finalEndDate.toLocaleDateString() === '1/7/2025');
    console.log('\n');
}

// Run all tests
console.log('Starting tests...\n');
testArticle31();
testArticle32();
testArticle33();
testArticle34();
testArticle35();
testArticle34And35HolidayPeriod();
console.log('All tests completed.'); 