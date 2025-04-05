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
    
    // Format the date as YYYY-MM-DD for comparison with the holidays array
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    
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
        explanation: [],
        workingDaysCount: 0
    };

    const isRetroactive = periodValue < 0;
    const absolutePeriodValue = Math.abs(periodValue);

    // Step 1: Apply Article 3(1) - Skip the event hour/day
    let startDate = new Date(eventDateTime);
    
    if (periodType === 'hours') {
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

    // Step 2: Apply Article 3(2) - Calculate the period
    let endDate = new Date(startDate);
    
    if (periodType === 'hours') {
        if (isRetroactive) {
            endDate.setHours(endDate.getHours() - absolutePeriodValue + 1);
            endDate.setMinutes(0, 0, 0);
        } else {
            endDate.setHours(endDate.getHours() + absolutePeriodValue - 1);
            endDate.setMinutes(59, 59, 999);
        }
        result.appliedRules.push(`Article 3(2)(a): ${absolutePeriodValue} hour ${isRetroactive ? 'retroactive ' : ''}period calculated`);
    } else if (periodType === 'working-days') {
        let remainingDays = absolutePeriodValue;
        let currentDate = new Date(startDate);
        
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
        result.appliedRules.push(`Article 3(2)(b): ${absolutePeriodValue} working days ${isRetroactive ? 'retroactive ' : ''}calculated`);
    } else if (periodType === 'days') {
        if (isRetroactive) {
            endDate.setDate(endDate.getDate() - absolutePeriodValue + 1);
            endDate.setHours(0, 0, 0, 0);
        } else {
            endDate.setDate(endDate.getDate() + absolutePeriodValue - 1);
            endDate.setHours(23, 59, 59, 999);
        }
        result.appliedRules.push(`Article 3(2)(b): ${absolutePeriodValue} calendar days ${isRetroactive ? 'retroactive ' : ''}calculated`);
    } else if (periodType === 'weeks') {
        if (isRetroactive) {
            endDate.setDate(endDate.getDate() - (absolutePeriodValue * 7) + 1);
            endDate.setHours(0, 0, 0, 0);
        } else {
            endDate.setDate(endDate.getDate() + (absolutePeriodValue * 7) - 1);
            endDate.setHours(23, 59, 59, 999);
        }
        result.appliedRules.push(`Article 3(2)(c): ${absolutePeriodValue} weeks ${isRetroactive ? 'retroactive ' : ''}calculated`);
    } else if (periodType === 'months') {
        if (isRetroactive) {
            endDate.setMonth(endDate.getMonth() - absolutePeriodValue);
            endDate.setHours(0, 0, 0, 0);
        } else {
            endDate.setMonth(endDate.getMonth() + absolutePeriodValue);
            endDate.setDate(endDate.getDate() - 1);
            endDate.setHours(23, 59, 59, 999);
        }
        result.appliedRules.push(`Article 3(2)(c): ${absolutePeriodValue} months ${isRetroactive ? 'retroactive ' : ''}calculated`);
    } else if (periodType === 'years') {
        if (isRetroactive) {
            endDate.setFullYear(endDate.getFullYear() - absolutePeriodValue);
            endDate.setHours(0, 0, 0, 0);
        } else {
            endDate.setFullYear(endDate.getFullYear() + absolutePeriodValue);
            endDate.setDate(endDate.getDate() - 1);
            endDate.setHours(23, 59, 59, 999);
        }
        result.appliedRules.push(`Article 3(2)(c): ${absolutePeriodValue} years ${isRetroactive ? 'retroactive ' : ''}calculated`);
    }

    result.initialEndDate = new Date(endDate);

    // Step 3: Apply Article 3(4) - Extend to next working day if needed
    if (periodType !== 'hours' && !isRetroactive && !isWorkingDay(endDate)) {
        const nextWorkDay = findNextWorkingDay(endDate);
        nextWorkDay.setHours(23, 59, 59, 999);
        endDate = nextWorkDay;
        result.appliedRules.push(
            'Article 3(4): End date falls on non-working day, extended to next working day',
            `- Previous end date: ${result.initialEndDate.toLocaleString()}`,
            `- Extended to: ${endDate.toLocaleString()}`
        );
    }

    // Step 4: Apply Article 3(5) - Ensure at least two working days
    if (periodType !== 'hours' && absolutePeriodValue >= 2) {
        // Count working days in the period
        let workingDays = 0;
        let currentDate = new Date(startDate);
        currentDate.setHours(0, 0, 0, 0);
        const endDateCopy = new Date(endDate);
        endDateCopy.setHours(23, 59, 59, 999);
        
        // Log the period for debugging
        console.log(`Checking working days from ${currentDate.toLocaleDateString()} to ${endDateCopy.toLocaleDateString()}`);
        
        // First, count working days in the original period
        while (currentDate <= endDateCopy) {
            if (isWorkingDay(currentDate)) {
                workingDays++;
                console.log(`Found working day: ${currentDate.toLocaleDateString()}`);
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
        
        result.workingDaysCount = workingDays;
        console.log(`Total working days found: ${workingDays}`);
        
        if (workingDays < 2) {
            if (isRetroactive) {
                // For retroactive periods, extend backward
                let prevWorkDay = new Date(startDate);
                prevWorkDay.setHours(0, 0, 0, 0);
                
                // Find the previous working day
                while (!isWorkingDay(prevWorkDay)) {
                    prevWorkDay.setDate(prevWorkDay.getDate() - 1);
                }
                
                // Count working days in the backward extended period
                currentDate = new Date(prevWorkDay);
                currentDate.setHours(0, 0, 0, 0);
                workingDays = 0;
                
                while (currentDate <= endDateCopy) {
                    if (isWorkingDay(currentDate)) {
                        workingDays++;
                        console.log(`Found working day in backward extended period: ${currentDate.toLocaleDateString()}`);
                    }
                    currentDate.setDate(currentDate.getDate() + 1);
                }
                
                console.log(`Total working days in backward extended period: ${workingDays}`);
                
                if (workingDays >= 2) {
                    startDate = prevWorkDay;
                    result.appliedRules.push(
                        'Article 3(5): Period extended backward to ensure at least two working days',
                        `- Original start date: ${result.initialEndDate.toLocaleString()}`,
                        `- Extended to: ${startDate.toLocaleDateString()}`
                    );
                    result.explanation.push(`According to Article 3(5), any period of two days or more must include at least two working days. The period only included ${result.workingDaysCount} working day${result.workingDaysCount === 1 ? '' : 's'}, so it has been extended backward to ${startDate.toLocaleDateString()} to ensure at least two working days are included.`);
                }
            } else {
                // For forward periods, extend forward to include at least two working days total
                let nextWorkDay = findNextWorkingDay(endDateCopy);
                nextWorkDay.setHours(23, 59, 59, 999);
                
                // We already found one working day, so we need to find at least one more
                // If we didn't find any working days in the original period, extend until we find two
                let requiredAdditionalWorkingDays = 2 - workingDays;
                let foundAdditionalWorkingDays = 0;
                let currentWorkDay = new Date(nextWorkDay);
                
                while (foundAdditionalWorkingDays < requiredAdditionalWorkingDays) {
                    if (isWorkingDay(currentWorkDay)) {
                        foundAdditionalWorkingDays++;
                        console.log(`Found additional working day: ${currentWorkDay.toLocaleDateString()}`);
                    }
                    
                    if (foundAdditionalWorkingDays < requiredAdditionalWorkingDays) {
                        currentWorkDay.setDate(currentWorkDay.getDate() + 1);
                    }
                }
                
                endDate = new Date(currentWorkDay);
                endDate.setHours(23, 59, 59, 999);
                
                result.appliedRules.push(
                    'Article 3(5): Period extended forward to ensure at least two working days',
                    `- Original end date: ${result.initialEndDate.toLocaleString()}`,
                    `- Extended to: ${endDate.toLocaleString()}`
                );
                result.explanation.push(`According to Article 3(5), any period of two days or more must include at least two working days. The period only included ${result.workingDaysCount} working day${result.workingDaysCount === 1 ? '' : 's'}, so it has been extended forward to ${endDate.toLocaleDateString()} to ensure at least two working days are included.`);
            }
        }
    }

    result.finalEndDate = endDate;
    return result;
}

// Function to format the result for display
function formatResult(result) {
    let output = '<div class="result-container">';
    
    // Add the final end date
    output += `<div class="result-date">End Date: ${result.finalEndDate.toLocaleString()}</div>`;
    
    // Add explanation
    output += '<div class="result-explanation">';
    
    // Step 1: Always explain Article 3(1)
    if (result.explanation.length > 0 && result.explanation[0].includes('Article 3(1)')) {
        output += result.explanation[0];
    }
    
    // Check which rules were applied
    const article34Applied = result.appliedRules.some(rule => rule.includes('Article 3(4)'));
    const article35Applied = result.appliedRules.some(rule => rule.includes('Article 3(5)'));
    
    // Step 2: Explain initial end date calculation
    if (result.initialEndDate) {
        const initialDateStr = result.initialEndDate.toLocaleDateString();
        const endDateBeforeArt35 = article34Applied ? 
            result.appliedRules.find(rule => rule.includes('Extended to:'))?.split('Extended to: ')[1] : 
            result.initialEndDate.toLocaleString();
        
        if (article34Applied) {
            output += `<br>The original end date (${initialDateStr}) falls on a non-working day, so according to Article 3(4), the period has been extended to the next working day (${new Date(endDateBeforeArt35).toLocaleDateString()}).`;
        }
    }
    
    // Step 3: Explain Article 3(5) if applied
    if (article35Applied && result.explanation.find(exp => exp.includes('Article 3(5)'))) {
        output += `<br>${result.explanation.find(exp => exp.includes('Article 3(5)'))}`;
    }
    
    output += '</div>';
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