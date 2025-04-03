// Article 3(1) implementation
function calculatePeriodFromEvent(eventDateTime, periodValue, periodType) {
    const result = {
        startDateTime: new Date(eventDateTime),
        endDateTime: new Date(eventDateTime),
        explanation: []
    };

    if (periodType === 'hours') {
        // For hours: skip to the next hour's beginning
        result.startDateTime = new Date(eventDateTime);
        result.startDateTime.setMinutes(0);
        result.startDateTime.setSeconds(0);
        result.startDateTime.setMilliseconds(0);
        result.startDateTime.setHours(result.startDateTime.getHours() + 1);
        
        // Set end time to the last second of the final hour
        result.endDateTime = new Date(result.startDateTime);
        result.endDateTime.setHours(result.endDateTime.getHours() + periodValue - 1);
        result.endDateTime.setMinutes(59);
        result.endDateTime.setSeconds(59);
        result.endDateTime.setMilliseconds(999);
        
        result.explanation.push(
            `Event occurred at ${eventDateTime.toLocaleTimeString()}`,
            `Period starts at the beginning of the next hour: ${result.startDateTime.toLocaleTimeString()}`,
            `Period ends at the end of the last hour: ${result.endDateTime.toLocaleTimeString()}`
        );
    } else {
        // For days and longer: skip to next day's beginning
        result.startDateTime = new Date(eventDateTime);
        result.startDateTime.setDate(result.startDateTime.getDate() + 1);
        result.startDateTime.setHours(0, 0, 0, 0);
        
        // Set end time to the last millisecond of the final day
        result.endDateTime = new Date(result.startDateTime);
        if (periodType === 'days') {
            result.endDateTime.setDate(result.endDateTime.getDate() + periodValue - 1);
        } else if (periodType === 'weeks') {
            result.endDateTime.setDate(result.endDateTime.getDate() + (periodValue * 7) - 1);
        } else if (periodType === 'months') {
            result.endDateTime.setMonth(result.endDateTime.getMonth() + periodValue);
            result.endDateTime.setDate(result.endDateTime.getDate() - 1);
        } else if (periodType === 'years') {
            result.endDateTime.setFullYear(result.endDateTime.getFullYear() + periodValue);
            result.endDateTime.setDate(result.endDateTime.getDate() - 1);
        }
        result.endDateTime.setHours(23, 59, 59, 999);
        
        result.explanation.push(
            `Event occurred on ${eventDateTime.toLocaleDateString()} at ${eventDateTime.toLocaleTimeString()}`,
            `Period starts at the beginning of the next day: ${result.startDateTime.toLocaleDateString()} ${result.startDateTime.toLocaleTimeString()}`,
            `Period ends at the end of the last day: ${result.endDateTime.toLocaleDateString()} ${result.endDateTime.toLocaleTimeString()}`
        );
    }
    
    return result;
}

// Tests
console.log('Testing Article 3(1)...\n');

// Test 1: Hours
console.log('Test 1: 2-hour period starting from 14:18:30');
const hourTest = calculatePeriodFromEvent(new Date('2025-04-03T14:18:30'), 2, 'hours');
console.log(hourTest.explanation.join('\n'));
console.log('\n');

// Test 2: Days
console.log('Test 2: 2-day period starting from April 3, 2025 14:18:30');
const dayTest = calculatePeriodFromEvent(new Date('2025-04-03T14:18:30'), 2, 'days');
console.log(dayTest.explanation.join('\n'));
console.log('\n');

// Test 3: Months
console.log('Test 3: 2-month period starting from April 3, 2025 14:18:30');
const monthTest = calculatePeriodFromEvent(new Date('2025-04-03T14:18:30'), 2, 'months');
console.log(monthTest.explanation.join('\n')); 