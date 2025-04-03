// EU holidays and office closing days for 2025 (European Parliament official calendar)
const euHolidays = [
    // Public holidays 2025
    '2025-01-01', // New Year's Day
    '2025-04-18', // Good Friday
    '2025-04-21', // Easter Monday
    '2025-05-01', // Labour Day
    '2025-05-09', // Europe Day (Robert Schuman Declaration)
    '2025-05-29', // Ascension Day
    '2025-06-09', // Whit Monday
    '2025-08-15', // Assumption
    // National Days (Note: these depend on place of employment)

    '2025-07-21', // National Day in Belgium
    
    // Office closing days 2025
    '2025-01-02', // Day following New Year's Day
    '2025-01-03', // Second day following New Year's Day
    '2025-04-17', // Maundy Thursday
    '2025-05-30', // Day after Ascension Day
    // Christmas and New Year period
    '2025-12-24',
    '2025-12-25',
    '2025-12-26',
    '2025-12-27',
    '2025-12-28',
    '2025-12-29',
    '2025-12-30',
    '2025-12-31',
    '2026-01-01',
    '2026-01-02'
];

function isHoliday(date) {
    // Check if the date is valid before trying to convert it
    if (isNaN(date.getTime())) {
        return false; // Invalid date is not a holiday
    }
    
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

// Combined implementation of Articles 3(1), 3(2), 3(3), and 3(4)
function calculatePeriod(eventDateTime, periodValue, periodType, workingDaysOnly = false) {
    const result = {
        initialEndDate: null,
        finalEndDate: null,
        appliedRules: [],
        explanation: []
    };

    // Start with event date
    let startDate = new Date(eventDateTime);
    
    // Apply Article 3(1) - Skip the event hour/day
    if (periodType === 'hours') {
        // For hours: skip to the next hour's beginning
        startDate.setMinutes(0, 0, 0);
        startDate.setHours(startDate.getHours() + 1);
        result.appliedRules.push('Article 3(1): Hour of event not counted, starting from next hour');
        result.explanation.push(`According to Article 3(1), the hour of the event (${eventDateTime.getHours()}:00) is not counted. The period starts from the next hour (${startDate.getHours()}:00).`);
    } else {
        // For other periods: skip to next day's beginning
        startDate.setDate(startDate.getDate() + 1);
        startDate.setHours(0, 0, 0, 0);
        result.appliedRules.push('Article 3(1): Day of event not counted, starting from next day');
        result.explanation.push(`According to Article 3(1), the day of the event (${eventDateTime.toLocaleDateString()}) is not counted. The period starts from the next day (${startDate.toLocaleDateString()}).`);
    }

    // Apply Article 3(2) - Calculate the period
    let endDate = new Date(startDate);
    if (periodType === 'hours') {
        endDate.setHours(endDate.getHours() + periodValue - 1);
        endDate.setMinutes(59, 59, 999);
        result.appliedRules.push(`Article 3(2)(a): ${periodValue} hour period calculated`);
        result.explanation.push(`According to Article 3(2)(a), a period expressed in hours runs from the start time to the same time on the last hour of the period. The period ends at ${endDate.toLocaleString()}.`);
    } else if (periodType === 'days') {
        if (workingDaysOnly) {
            let remainingDays = periodValue;
            let countedDays = 0;
            let skippedDays = 0;
            while (remainingDays > 0) {
                endDate.setDate(endDate.getDate() + 1);
                if (isWorkingDay(endDate)) {
                    remainingDays--;
                    countedDays++;
                } else {
                    skippedDays++;
                }
            }
            result.appliedRules.push(`Article 3(2)(b): ${periodValue} working days calculated`);
            result.explanation.push(`According to Article 3(2)(b), a period expressed in working days excludes holidays and weekends. The period includes ${countedDays} working days and skips ${skippedDays} non-working days.`);
        } else {
            endDate.setDate(endDate.getDate() + periodValue - 1);
            result.appliedRules.push(`Article 3(2)(b): ${periodValue} calendar days calculated`);
            result.explanation.push(`According to Article 3(2)(b), a period expressed in days runs from the start date to the same date on the last day of the period. The period ends at ${endDate.toLocaleDateString()}.`);
        }
        endDate.setHours(23, 59, 59, 999);
    } else {
        // Weeks, months, years
        const originalDate = endDate.getDate();
        if (periodType === 'weeks') {
            endDate.setDate(endDate.getDate() + (periodValue * 7) - 1);
            result.explanation.push(`According to Article 3(2)(c), a period expressed in weeks runs from the start date to the same day of the week on the last week of the period. The period ends at ${endDate.toLocaleDateString()}.`);
        } else if (periodType === 'months') {
            endDate.setMonth(endDate.getMonth() + periodType);
            endDate.setDate(endDate.getDate() - 1);
            result.explanation.push(`According to Article 3(2)(c), a period expressed in months runs from the start date to the same date on the last month of the period. The period ends at ${endDate.toLocaleDateString()}.`);
        } else if (periodType === 'years') {
            endDate.setFullYear(endDate.getFullYear() + periodValue);
            endDate.setDate(endDate.getDate() - 1);
            result.explanation.push(`According to Article 3(2)(c), a period expressed in years runs from the start date to the same date on the last year of the period. The period ends at ${endDate.toLocaleDateString()}.`);
        }
        endDate.setHours(23, 59, 59, 999);
        result.appliedRules.push(`Article 3(2)(c): ${periodValue} ${periodType} calculated`);
    }
    
    result.initialEndDate = new Date(endDate);

    // Apply Article 3(3) - Include holidays and weekends by default
    if (!workingDaysOnly) {
        result.appliedRules.push('Article 3(3): Holidays and weekends are included in the period');
        result.explanation.push(`According to Article 3(3), holidays and weekends are included in the period by default.`);
    } else {
        result.appliedRules.push('Article 3(3): Working days only specified, holidays and weekends are excluded');
        result.explanation.push(`According to Article 3(3), since "working days only" was specified, holidays and weekends are excluded from the period.`);
    }

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
        result.explanation.push(`According to Article 3(4), since the period ends on a non-working day (${endDate.toLocaleDateString()}), it is extended to the next working day (${nextWorkDay.toLocaleDateString()}).`);
    } else {
        result.finalEndDate = endDate;
        if (periodType === 'hours') {
            result.appliedRules.push('Article 3(4): Not applied - period expressed in hours');
            result.explanation.push(`Article 3(4) does not apply because the period is expressed in hours.`);
        } else if (workingDaysOnly) {
            result.appliedRules.push('Article 3(4): Not applied - already using working days');
            result.explanation.push(`Article 3(4) does not apply because the period is already using working days.`);
        } else {
            result.appliedRules.push('Article 3(4): Not applied - end date is already a working day');
            result.explanation.push(`Article 3(4) does not apply because the period ends on a working day (${endDate.toLocaleDateString()}).`);
        }
    }

    return result;
}

// Function to format the result for display
function formatResult(result) {
    let output = '<div class="result-container">';
    
    // Add the final end date
    output += `<div class="result-date">End Date: ${result.finalEndDate.toLocaleString()}</div>`;
    
    // Add explanation if the final date differs from initial date
    if (result.finalEndDate.getTime() !== result.initialEndDate.getTime()) {
        output += '<div class="result-explanation">';
        output += `Note: The original end date (${result.initialEndDate.toLocaleString()}) falls on a non-working day, `;
        output += `so according to Article 3(4), the period has been extended to the next working day.`;
        output += '</div>';
    }
    
    output += '</div>';
    return output;
}

// Function to handle form submission
function handleSubmit(event) {
    event.preventDefault();
    
    const eventDate = document.getElementById('eventDate').value;
    const eventTime = document.getElementById('eventTime').value;
    const periodValue = parseInt(document.getElementById('periodValue').value);
    const periodType = document.getElementById('periodType').value;
    const workingDaysOnly = document.getElementById('workingDaysOnly').checked;
    
    // Validate time input for hour-based calculations
    if (periodType === 'hours' && !eventTime) {
        alert('Event time is required for hour-based calculations');
        return;
    }
    
    // Create event date/time
    const eventDateTime = new Date(eventDate);
    if (eventTime) {
        const [hours, minutes] = eventTime.split(':');
        eventDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    } else {
        // If no time provided, set to start of day
        eventDateTime.setHours(0, 0, 0, 0);
    }
    
    const result = calculatePeriod(eventDateTime, periodValue, periodType, workingDaysOnly);
    document.getElementById('result').innerHTML = formatResult(result);
}

// Add event listener to the form
document.getElementById('periodForm').addEventListener('submit', handleSubmit);

// Add event listener when the document is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set default date to today
    const eventDateInput = document.getElementById('eventDate');
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    eventDateInput.value = `${year}-${month}-${day}`;
    
    // Add event listener to period type select to toggle time input requirement
    const periodTypeSelect = document.getElementById('periodType');
    const eventTimeInput = document.getElementById('eventTime');
    
    periodTypeSelect.addEventListener('change', function() {
        if (this.value === 'hours') {
            eventTimeInput.required = true;
        } else {
            eventTimeInput.required = false;
        }
    });
}); 