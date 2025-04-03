// Article 3(2) implementation
function calculatePeriod(startDateTime, periodValue, periodType) {
    const result = {
        startDateTime: new Date(startDateTime),
        endDateTime: new Date(startDateTime),
        explanation: []
    };

    // Set start time to the beginning of the hour/day as per 3.2
    result.startDateTime.setMinutes(0, 0, 0);

    if (periodType === 'hours') {
        // Article 3.2(a): Period in hours
        result.endDateTime = new Date(result.startDateTime);
        result.endDateTime.setHours(result.startDateTime.getHours() + periodValue);
        result.endDateTime.setMinutes(59, 59, 999);

        result.explanation.push(
            `Article 3.2(a): Period of ${periodValue} hours`,
            `Starts at the beginning of the first hour: ${result.startDateTime.toLocaleTimeString()}`,
            `Ends with the expiry of the last hour: ${result.endDateTime.toLocaleTimeString()}`
        );
    } else {
        // For all other periods, start at the beginning of the day
        result.startDateTime.setHours(0, 0, 0, 0);

        if (periodType === 'days') {
            // Article 3.2(b): Period in days
            result.endDateTime = new Date(result.startDateTime);
            result.endDateTime.setDate(result.startDateTime.getDate() + periodValue);
            result.endDateTime.setHours(23, 59, 59, 999);

            result.explanation.push(
                `Article 3.2(b): Period of ${periodValue} days`,
                `Starts at the beginning of first day: ${result.startDateTime.toLocaleString()}`,
                `Ends with the expiry of the last day: ${result.endDateTime.toLocaleString()}`
            );
        } else {
            // Article 3.2(c): Period in weeks, months or years
            result.endDateTime = new Date(result.startDateTime);
            const originalDate = result.startDateTime.getDate();

            if (periodType === 'weeks') {
                result.endDateTime.setDate(result.startDateTime.getDate() + (periodValue * 7));
            } else if (periodType === 'months') {
                // Store the target month we want to end up in
                const targetMonth = (result.startDateTime.getMonth() + periodValue) % 12;
                const addedYears = Math.floor((result.startDateTime.getMonth() + periodValue) / 12);
                
                // First set the year (if needed)
                if (addedYears > 0) {
                    result.endDateTime.setFullYear(result.startDateTime.getFullYear() + addedYears);
                }
                
                // Try to set the target month
                result.endDateTime.setMonth(targetMonth);
                
                // Check if we ended up in the correct month
                if (result.endDateTime.getMonth() !== targetMonth) {
                    // If not, we need to use the last day of the target month
                    result.endDateTime = new Date(result.endDateTime.getFullYear(), targetMonth + 1, 0);
                    result.explanation.push(
                        `Note: Since day ${originalDate} doesn't exist in the target month, using last day of that month per Article 3.2(c)`
                    );
                }
            } else if (periodType === 'years') {
                result.endDateTime.setFullYear(result.startDateTime.getFullYear() + periodValue);
            }
            
            result.endDateTime.setHours(23, 59, 59, 999);

            result.explanation.push(
                `Article 3.2(c): Period of ${periodValue} ${periodType}`,
                `Starts at the beginning of first day: ${result.startDateTime.toLocaleString()}`,
                `Should end on same date (${originalDate}) if exists: ${result.endDateTime.toLocaleString()}`
            );
        }
    }

    return result;
}

// Tests
console.log('Testing Article 3(2)...\n');

// Test 1: Hours (3.2.a)
console.log('Test 1: 5-hour period starting at 10:00');
const hourTest = calculatePeriod(new Date('2025-04-03T10:00:00'), 5, 'hours');
console.log(hourTest.explanation.join('\n'));
console.log('\n');

// Test 2: Days (3.2.b)
console.log('Test 2: 3-day period starting April 3, 2025');
const dayTest = calculatePeriod(new Date('2025-04-03T00:00:00'), 3, 'days');
console.log(dayTest.explanation.join('\n'));
console.log('\n');

// Test 3: Months - normal case (3.2.c)
console.log('Test 3: 2-month period starting March 15, 2025');
const monthTest = calculatePeriod(new Date('2025-03-15T00:00:00'), 2, 'months');
console.log(monthTest.explanation.join('\n'));
console.log('\n');

// Test 4: Months - special case with end of month (3.2.c)
console.log('Test 4: 1-month period starting January 31, 2025 (January -> February)');
const monthEndTest = calculatePeriod(new Date('2025-01-31T00:00:00'), 1, 'months');
console.log(monthEndTest.explanation.join('\n'));
console.log('\n');

// Test 5: Years (3.2.c)
console.log('Test 5: 2-year period starting March 15, 2025');
const yearTest = calculatePeriod(new Date('2025-03-15T00:00:00'), 2, 'years');
console.log(yearTest.explanation.join('\n')); 