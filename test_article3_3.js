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

// Article 3(3) implementation
function calculatePeriodWithHolidays(startDateTime, periodValue, periodType, excludeHolidays) {
    const result = {
        startDateTime: new Date(startDateTime),
        endDateTime: new Date(startDateTime),
        includedDates: [],
        explanation: []
    };

    if (excludeHolidays) {
        // Case 1: Working days only
        let remainingDays = periodValue;
        let currentDate = new Date(startDateTime);
        
        while (remainingDays > 0) {
            currentDate.setDate(currentDate.getDate() + 1);
            if (isWorkingDay(currentDate)) {
                remainingDays--;
                result.includedDates.push(new Date(currentDate));
            }
        }
        result.endDateTime = new Date(currentDate);
        result.endDateTime.setHours(23, 59, 59, 999);
        
        result.explanation.push(
            'Article 3(3): Period expressed in working days',
            'Excluding public holidays, Sundays and Saturdays',
            `Start date: ${startDateTime.toLocaleDateString()}`,
            `End date: ${result.endDateTime.toLocaleDateString()}`,
            '\nIncluded working days:',
            ...result.includedDates.map(d => `- ${d.toLocaleDateString()} (${d.toLocaleString('en-us', {weekday: 'long'})})`)
        );
    } else {
        // Case 2: Include all days (default behavior)
        result.endDateTime.setDate(startDateTime.getDate() + periodValue);
        result.endDateTime.setHours(23, 59, 59, 999);
        
        // List all days in the period
        let currentDate = new Date(startDateTime);
        while (currentDate <= result.endDateTime) {
            result.includedDates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }
        
        const holidays = result.includedDates.filter(d => isHoliday(d));
        const weekends = result.includedDates.filter(d => isWeekend(d));
        
        result.explanation.push(
            'Article 3(3): Period includes all days by default',
            `Start date: ${startDateTime.toLocaleDateString()}`,
            `End date: ${result.endDateTime.toLocaleDateString()}`,
            '\nIncluded holidays:',
            ...(holidays.length ? holidays.map(d => `- ${d.toLocaleDateString()}`) : ['(none)']),
            '\nIncluded weekends:',
            ...(weekends.length ? weekends.map(d => `- ${d.toLocaleDateString()} (${d.toLocaleString('en-us', {weekday: 'long'})})`) : ['(none)'])
        );
    }

    return result;
}

// Tests
console.log('Testing Article 3(3)...\n');

// Test 1: Regular period including holidays and weekends
console.log('Test 1: 5-day period starting Thursday, May 8, 2025 (includes Europe Day and a weekend)');
const regularTest = calculatePeriodWithHolidays(
    new Date('2025-05-08T00:00:00'), 
    5, 
    'days',
    false
);
console.log(regularTest.explanation.join('\n'));
console.log('\n');

// Test 2: Working days only
console.log('Test 2: 5 working days starting Thursday, May 8, 2025 (skipping Europe Day and weekend)');
const workingDaysTest = calculatePeriodWithHolidays(
    new Date('2025-05-08T00:00:00'),
    5,
    'days',
    true
);
console.log(workingDaysTest.explanation.join('\n')); 