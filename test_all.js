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

// Run all tests
console.log('Starting tests...\n');
testArticle31();
testArticle32();
testArticle33();
testArticle34();
console.log('All tests completed.'); 