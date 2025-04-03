// EU holidays from the official calendar
const euHolidays = [
    '2025-01-01', // New Year's Day
    '2025-04-18', // Good Friday
    '2025-04-21', // Easter Monday
    '2025-05-01', // Labour Day
    '2025-05-09', // Europe Day
    '2025-05-29', // Ascension Day
    '2025-06-09', // Whit Monday
    '2025-08-15', // Assumption
    '2025-12-25', // Christmas
    '2025-12-26'  // Boxing Day
];

function isHoliday(date) {
    const dateString = date.toISOString().split('T')[0];
    return euHolidays.includes(dateString);
}

function isWeekend(date) {
    const day = date.getDay();
    return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
}

function isWorkingDay(date) {
    return !isWeekend(date) && !isHoliday(date);
}

function findNextWorkingDay(date) {
    let nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    while (!isWorkingDay(nextDay)) {
        nextDay.setDate(nextDay.getDate() + 1);
    }
    return nextDay;
}

// Combined implementation of Articles 3(1), 3(2), and 3(4)
function calculatePeriod(eventDateTime, periodValue, periodType, workingDaysOnly = false) {
    const result = {
        initialEndDate: null,
        finalEndDate: null,
        appliedRules: []
    };

    // Start with event date
    let startDate = new Date(eventDateTime);
    
    // Apply Article 3(1) - Skip the event hour/day
    if (periodType === 'hours') {
        // For hours: skip to the next hour's beginning
        startDate.setMinutes(0, 0, 0);
        startDate.setHours(startDate.getHours() + 1);
        result.appliedRules.push('Article 3(1): Hour of event not counted, starting from next hour');
    } else {
        // For other periods: skip to next day's beginning
        startDate.setDate(startDate.getDate() + 1);
        startDate.setHours(0, 0, 0, 0);
        result.appliedRules.push('Article 3(1): Day of event not counted, starting from next day');
    }

    // Apply Article 3(2) - Calculate the period
    let endDate = new Date(startDate);
    if (periodType === 'hours') {
        endDate.setHours(endDate.getHours() + periodValue - 1);
        endDate.setMinutes(59, 59, 999);
        result.appliedRules.push(`Article 3(2)(a): ${periodValue} hour period calculated`);
    } else if (periodType === 'days') {
        if (workingDaysOnly) {
            let remainingDays = periodValue;
            while (remainingDays > 0) {
                endDate.setDate(endDate.getDate() + 1);
                if (isWorkingDay(endDate)) {
                    remainingDays--;
                }
            }
            result.appliedRules.push(`Article 3(2)(b): ${periodValue} working days calculated`);
        } else {
            endDate.setDate(endDate.getDate() + periodValue - 1);
            result.appliedRules.push(`Article 3(2)(b): ${periodValue} calendar days calculated`);
        }
        endDate.setHours(23, 59, 59, 999);
    } else {
        // Weeks, months, years
        const originalDate = endDate.getDate();
        if (periodType === 'weeks') {
            endDate.setDate(endDate.getDate() + (periodValue * 7) - 1);
        } else if (periodType === 'months') {
            endDate.setMonth(endDate.getMonth() + periodValue);
            endDate.setDate(endDate.getDate() - 1);
        } else if (periodType === 'years') {
            endDate.setFullYear(endDate.getFullYear() + periodValue);
            endDate.setDate(endDate.getDate() - 1);
        }
        endDate.setHours(23, 59, 59, 999);
        result.appliedRules.push(`Article 3(2)(c): ${periodValue} ${periodType} calculated`);
    }
    
    result.initialEndDate = new Date(endDate);

    // Apply Article 3(4) - Extend to next working day if needed
    // Only apply if:
    // 1. Period is not in hours
    // 2. Not already using working days
    // 3. End date falls on weekend or holiday
    if (periodType !== 'hours' && !workingDaysOnly && !isWorkingDay(endDate)) {
        const nextWorkDay = findNextWorkingDay(endDate);
        nextWorkDay.setHours(23, 59, 59, 999);
        result.finalEndDate = nextWorkDay;
        result.appliedRules.push(
            'Article 3(4): End date falls on non-working day, extended to next working day',
            `- Original end date: ${endDate.toLocaleString()}`,
            `- Extended to: ${nextWorkDay.toLocaleString()}`
        );
    } else {
        result.finalEndDate = endDate;
        if (periodType === 'hours') {
            result.appliedRules.push('Article 3(4): Not applied - period expressed in hours');
        } else if (workingDaysOnly) {
            result.appliedRules.push('Article 3(4): Not applied - already using working days');
        } else {
            result.appliedRules.push('Article 3(4): Not applied - end date is already a working day');
        }
    }

    return result;
}

// Tests
console.log('Testing Articles 3(1), 3(2), and 3(4) interaction...\n');

// Test 1: Period ending on a holiday
console.log('Test 1: 3-day period starting May 6, 2025 (would end on Europe Day)');
const holidayEndTest = calculatePeriod(new Date('2025-05-06T14:30:00'), 3, 'days');
console.log(holidayEndTest.appliedRules.join('\n'));
console.log('\n');

// Test 2: Period ending on a weekend
console.log('Test 2: 4-day period starting May 7, 2025 (would end on Sunday)');
const weekendEndTest = calculatePeriod(new Date('2025-05-07T10:00:00'), 4, 'days');
console.log(weekendEndTest.appliedRules.join('\n'));
console.log('\n');

// Test 3: Hours period ending on a holiday (Article 3(4) should not apply)
console.log('Test 3: 8-hour period starting May 8, 2025 at 20:00 (ends on Europe Day)');
const hourEndTest = calculatePeriod(new Date('2025-05-08T20:00:00'), 8, 'hours');
console.log(hourEndTest.appliedRules.join('\n'));
console.log('\n');

// Test 4: Working days period ending on a holiday (Article 3(4) should not apply)
console.log('Test 4: 3 working days starting May 6, 2025');
const workingDaysTest = calculatePeriod(new Date('2025-05-06T14:30:00'), 3, 'days', true);
console.log(workingDaysTest.appliedRules.join('\n')); 