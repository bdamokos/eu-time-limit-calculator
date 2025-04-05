// EU holidays and office closing days for 2024-2025 (European Parliament official calendar)
const euHolidays = [
    // Public holidays 2024
    '2024-01-01', // New Year's Day
    '2024-03-29', // Good Friday
    '2024-04-01', // Easter Monday
    '2024-05-01', // Wednesday, Labour Day
    '2024-05-09', // Thursday, Anniversary of the Schuman declaration / Ascension Day
    '2024-05-20', // Whit Monday
    '2024-08-15', // Thursday, Assumption
    '2024-11-01', // Friday, All Saints' Day
    
    // Office closing days 2024
    '2024-01-02', // Tuesday, day following New Year's Day
    '2024-03-28', // Maundy Thursday
    '2024-05-10', // Friday, day following Ascension Day
    // Christmas and New Year period 2024
    '2024-12-23',
    '2024-12-24',
    '2024-12-25',
    '2024-12-26',
    '2024-12-27',
    '2024-12-30',
    '2024-12-31',
    '2025-01-01',
    '2025-01-02',
    '2025-01-03',

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
function calculatePeriod(eventDateTime, periodValue, periodType) {
    const result = {
        initialEndDate: null,
        finalEndDate: null,
        appliedRules: [],
        explanation: []
    };

    const isRetroactive = periodValue < 0;
    const absolutePeriodValue = Math.abs(periodValue);

    // Start with event date
    let startDate = new Date(eventDateTime);
    
    // Apply Article 3(1) - Skip the event hour/day
    if (periodType === 'hours') {
        // For hours: skip to the next hour's beginning
        startDate.setMinutes(0, 0, 0);
        if (isRetroactive) {
            startDate.setHours(startDate.getHours());
            result.appliedRules.push('Article 3(1): Hour of event not counted, starting from current hour for retroactive calculation');
            result.explanation.push(`According to Article 3(1), for retroactive calculation, the hour of the event (${eventDateTime.getHours()}:00) is not counted. The period starts from the current hour (${startDate.getHours()}:00) and counts backwards.`);
        } else {
            startDate.setHours(startDate.getHours() + 1);
            result.appliedRules.push('Article 3(1): Hour of event not counted, starting from next hour');
            result.explanation.push(`According to Article 3(1), the hour of the event (${eventDateTime.getHours()}:00) is not counted. The period starts from the next hour (${startDate.getHours()}:00).`);
        }
    } else {
        if (isRetroactive) {
            startDate.setHours(0, 0, 0, 0);
            result.appliedRules.push('Article 3(1): Day of event not counted, starting from beginning of current day for retroactive calculation');
            result.explanation.push(`According to Article 3(1), for retroactive calculation, the day of the event (${eventDateTime.toLocaleDateString()}) is not counted. The period starts from the beginning of the current day and counts backwards.`);
        } else {
            startDate.setDate(startDate.getDate() + 1);
            startDate.setHours(0, 0, 0, 0);
            result.appliedRules.push('Article 3(1): Day of event not counted, starting from next day');
            result.explanation.push(`According to Article 3(1), the day of the event (${eventDateTime.toLocaleDateString()}) is not counted. The period starts from the next day (${startDate.toLocaleDateString()}).`);
        }
    }

    // Apply Article 3(2) - Calculate the period
    let endDate = new Date(startDate);
    if (periodType === 'hours') {
        if (isRetroactive) {
            endDate.setHours(endDate.getHours() - absolutePeriodValue + 1);
            endDate.setMinutes(0, 0, 0);
            result.appliedRules.push(`Article 3(2)(a): ${absolutePeriodValue} hour retroactive period calculated`);
            result.explanation.push(`According to Article 3(2)(a), for a retroactive period, we count backwards ${absolutePeriodValue} hours from the start time. The period ends at ${endDate.toLocaleString()}.`);
        } else {
            endDate.setHours(endDate.getHours() + absolutePeriodValue - 1);
            endDate.setMinutes(59, 59, 999);
            result.appliedRules.push(`Article 3(2)(a): ${absolutePeriodValue} hour period calculated`);
            result.explanation.push(`According to Article 3(2)(a), a period expressed in hours runs from the start time to the same time on the last hour of the period. The period ends at ${endDate.toLocaleString()}.`);
        }
    } else if (periodType === 'days' || periodType === 'working-days') {
        if (periodType === 'working-days') {
            // For working days, we need to count exactly the specified number of working days
            let remainingDays = absolutePeriodValue;
            let currentDate = new Date(startDate);
            
            // Handle the case of 0-day periods
            if (remainingDays === 0) {
                endDate = new Date(currentDate);
            } else {
                if (isRetroactive) {
                    while (remainingDays > 0) {
                        currentDate.setDate(currentDate.getDate() - 1);
                        if (isWorkingDay(currentDate)) {
                            remainingDays--;
                        }
                    }
                    endDate = new Date(currentDate);
                    endDate.setHours(0, 0, 0, 0);
                } else {
                    while (remainingDays > 0) {
                        if (isWorkingDay(currentDate)) {
                            remainingDays--;
                        }
                        if (remainingDays > 0) {
                            currentDate.setDate(currentDate.getDate() + 1);
                        }
                    }
                    endDate = new Date(currentDate);
                    endDate.setHours(23, 59, 59, 999);
                }
            }
            
            result.appliedRules.push(`Article 3(2)(b): ${absolutePeriodValue} working days ${isRetroactive ? 'retroactive ' : ''}calculated`);
            result.explanation.push(`According to Article 3(2)(b), a period expressed in working days excludes holidays and weekends. ${isRetroactive ? 'Counting backwards, the' : 'The'} period ends at ${endDate.toLocaleString()}.`);
        } else {
            if (isRetroactive) {
                endDate.setDate(endDate.getDate() - absolutePeriodValue + 1);
                endDate.setHours(0, 0, 0, 0);
            } else {
                endDate.setDate(endDate.getDate() + absolutePeriodValue - 1);
                endDate.setHours(23, 59, 59, 999);
            }
            result.appliedRules.push(`Article 3(2)(b): ${absolutePeriodValue} calendar days ${isRetroactive ? 'retroactive ' : ''}calculated`);
            result.explanation.push(`According to Article 3(2)(b), ${isRetroactive ? 'counting backwards, the' : 'the'} period ends at ${endDate.toLocaleDateString()}.`);
        }
    } else {
        if (isRetroactive) {
            if (periodType === 'weeks') {
                endDate.setDate(endDate.getDate() - (absolutePeriodValue * 7) + 1);
                endDate.setHours(0, 0, 0, 0);
            } else if (periodType === 'months') {
                endDate.setMonth(endDate.getMonth() - absolutePeriodValue);
                endDate.setHours(0, 0, 0, 0);
            } else if (periodType === 'years') {
                endDate.setFullYear(endDate.getFullYear() - absolutePeriodValue);
                endDate.setHours(0, 0, 0, 0);
            }
        } else {
            if (periodType === 'weeks') {
                endDate.setDate(endDate.getDate() + (absolutePeriodValue * 7) - 1);
            } else if (periodType === 'months') {
                endDate.setMonth(endDate.getMonth() + absolutePeriodValue);
                endDate.setDate(endDate.getDate() - 1);
            } else if (periodType === 'years') {
                endDate.setFullYear(endDate.getFullYear() + absolutePeriodValue);
                endDate.setDate(endDate.getDate() - 1);
            }
            endDate.setHours(23, 59, 59, 999);
        }
        result.appliedRules.push(`Article 3(2)(c): ${absolutePeriodValue} ${periodType} ${isRetroactive ? 'retroactive ' : ''}calculated`);
        result.explanation.push(`According to Article 3(2)(c), ${isRetroactive ? 'counting backwards, the' : 'the'} period ends at ${endDate.toLocaleDateString()}.`);
    }
    
    result.initialEndDate = new Date(endDate);

    // Apply Article 3(4) - Extend to next working day if needed
    // Only apply if:
    // 1. Period is not in hours
    // 2. Not a retroactive period (explicitly mentioned in the regulation)
    // 3. End date falls on weekend or holiday
    if (periodType !== 'hours' && !isRetroactive && !isWorkingDay(endDate)) {
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
        } else if (isRetroactive) {
            result.appliedRules.push('Article 3(4): Not applied - retroactive period');
            result.explanation.push(`Article 3(4) does not apply because this is a retroactive period, as explicitly stated in the regulation.`);
        } else {
            result.appliedRules.push('Article 3(4): Not applied - end date is already a working day');
            result.explanation.push(`Article 3(4) does not apply because the period ends on a working day (${endDate.toLocaleDateString()}).`);
        }
    }

    // Apply Article 3(5) - Ensure at least two working days for periods of 2+ days
    if (periodType !== 'hours' && absolutePeriodValue >= 2) {
        let workingDaysCount = 0;
        let currentDate = new Date(Math.min(startDate.getTime(), endDate.getTime()));
        const endDateToCheck = new Date(Math.max(startDate.getTime(), endDate.getTime()));
        
        while (currentDate <= endDateToCheck) {
            if (isWorkingDay(currentDate)) {
                workingDaysCount++;
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
        
        if (workingDaysCount < 2) {
            if (isRetroactive) {
                // For retroactive periods, we need to extend backwards
                let currentDate = new Date(endDate);
                while (workingDaysCount < 2) {
                    currentDate.setDate(currentDate.getDate() - 1);
                    if (isWorkingDay(currentDate)) {
                        workingDaysCount++;
                        if (workingDaysCount === 2) {
                            currentDate.setHours(0, 0, 0, 0);
                            result.finalEndDate = currentDate;
                        }
                    }
                }
            } else {
                // For forward periods, extend forward
                let nextWorkDay = findNextWorkingDay(endDate);
                nextWorkDay.setHours(23, 59, 59, 999);
                result.finalEndDate = nextWorkDay;
            }
            result.appliedRules.push(
                'Article 3(5): Period extended to ensure at least two working days',
                `- Original end date: ${endDate.toLocaleString()}`,
                `- Extended to: ${result.finalEndDate.toLocaleString()}`
            );
            result.explanation.push(`According to Article 3(5), since the period of ${absolutePeriodValue} ${periodType} included less than two working days, it has been ${isRetroactive ? 'extended backwards' : 'extended forwards'} to ${result.finalEndDate.toLocaleDateString()} to ensure at least two working days are included.`);
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
    
    const result = calculatePeriod(eventDateTime, periodValue, periodType);
    document.getElementById('result').innerHTML = formatResult(result);
}

// Export for Node.js while preserving browser functionality
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { calculatePeriod };
} else if (typeof window !== 'undefined') {
    // Browser-specific code
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
            updateCalculation();
        });

        // Add event listeners for all input changes
        const formInputs = document.querySelectorAll('#periodForm input, #periodForm select');
        formInputs.forEach(input => {
            input.addEventListener('change', updateCalculation);
            input.addEventListener('input', updateCalculation);
        });

        // Add event listeners for preset buttons
        const presetButtons = document.querySelectorAll('.preset-btn');
        presetButtons.forEach(button => {
            button.addEventListener('click', function() {
                const value = this.getAttribute('data-value');
                const type = this.getAttribute('data-type');
                const workingDays = this.getAttribute('data-working') === 'true';
                
                document.getElementById('periodValue').value = value;
                document.getElementById('periodType').value = workingDays ? 'working-days' : type;
                
                updateCalculation();
            });
        });

        // Initial calculation
        updateCalculation();
    });

    // Function to update the calculation
    function updateCalculation() {
        const eventDate = document.getElementById('eventDate').value;
        const eventTime = document.getElementById('eventTime').value;
        const periodValue = parseInt(document.getElementById('periodValue').value);
        const periodType = document.getElementById('periodType').value;
        
        // Validate inputs
        if (!eventDate || !periodValue || isNaN(periodValue)) {
            return;
        }
        
        // Validate time input for hour-based calculations
        if (periodType === 'hours' && !eventTime) {
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
        
        const result = calculatePeriod(eventDateTime, periodValue, periodType);
        document.getElementById('result').innerHTML = formatResult(result);
    }
} 