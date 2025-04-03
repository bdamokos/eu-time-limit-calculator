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

function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function addWorkingDays(date, days) {
    let result = new Date(date);
    let remainingDays = days;
    
    while (remainingDays > 0) {
        result = addDays(result, 1);
        if (isWorkingDay(result)) {
            remainingDays--;
        }
    }
    
    return result;
}

// Find the next working day after a given date
function findNextWorkingDay(date) {
    let nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    
    while (!isWorkingDay(nextDay)) {
        nextDay.setDate(nextDay.getDate() + 1);
    }
    
    return nextDay;
}

// Apply Article 3(4): If the last day is a holiday/weekend, extend to the next working day
function applyArticle34(date) {
    // Check if the date is a weekend or holiday
    if (!isWorkingDay(date)) {
        // Find the next working day
        const nextWorkingDay = findNextWorkingDay(date);
        
        // Set the time to the end of the day (23:59:59)
        nextWorkingDay.setHours(23, 59, 59, 999);
        
        return nextWorkingDay;
    }
    
    return date;
}

function calculateDate() {
    try {
        const startDateElement = document.getElementById('startDate');
        const periodTypeElement = document.getElementById('periodType');
        const periodValueElement = document.getElementById('periodValue');
        const workingDaysOnlyElement = document.getElementById('workingDaysOnly');
        const endDateElement = document.getElementById('endDate');
        const resultDiv = document.getElementById('result');

        if (!startDateElement || !periodTypeElement || !periodValueElement || 
            !workingDaysOnlyElement || !endDateElement || !resultDiv) {
            console.error('One or more required elements not found');
            return;
        }

        if (!startDateElement.value) {
            alert('Please select a start date and time');
            return;
        }

        const startDate = new Date(startDateElement.value);
        if (isNaN(startDate.getTime())) {
            console.error('Invalid start date:', startDateElement.value);
            return;
        }

        const periodType = periodTypeElement.value;
        const periodValue = parseInt(periodValueElement.value);
        const workingDaysOnly = workingDaysOnlyElement.checked;
        
        if (isNaN(periodValue) || periodValue < 1) {
            alert('Please enter a valid period value (must be 1 or greater)');
            return;
        }
        
        let endDate;
        
        // According to Article 3 of the regulation
        if (periodType === 'hours') {
            endDate = new Date(startDate);
            endDate.setHours(endDate.getHours() + periodValue);
        } else {
            if (workingDaysOnly) {
                endDate = addWorkingDays(startDate, periodValue);
            } else {
                endDate = addDays(startDate, periodValue);
                
                // Special handling for months and years
                if (periodType === 'months') {
                    endDate.setMonth(endDate.getMonth() + periodValue);
                } else if (periodType === 'years') {
                    endDate.setFullYear(endDate.getFullYear() + periodValue);
                } else if (periodType === 'weeks') {
                    endDate = addDays(startDate, periodValue * 7);
                }
                
                // Apply Article 3(4) - extend to next working day if end date is a holiday/weekend
                endDate = applyArticle34(endDate);
            }
        }
        
        if (!endDate || isNaN(endDate.getTime())) {
            console.error('Invalid end date calculated');
            return;
        }

        // Format the result
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        
        const formattedDate = endDate.toLocaleDateString('en-US', options);
        console.log('Formatted end date:', formattedDate);
        endDateElement.textContent = formattedDate;
        
        // Add explanation
        const explanation = document.createElement('p');
        explanation.style.marginTop = '1rem';
        explanation.style.fontSize = '0.9rem';
        explanation.style.color = '#666';
        
        if (workingDaysOnly) {
            explanation.textContent = 'Note: Calculation excludes weekends and EU holidays.';
        } else {
            // Check if Article 3(4) was applied
            const originalEndDate = new Date(startDate);
            if (periodType === 'months') {
                originalEndDate.setMonth(originalEndDate.getMonth() + periodValue);
            } else if (periodType === 'years') {
                originalEndDate.setFullYear(originalEndDate.getFullYear() + periodValue);
            } else if (periodType === 'weeks') {
                originalEndDate.setDate(originalEndDate.getDate() + periodValue * 7);
            } else {
                originalEndDate.setDate(originalEndDate.getDate() + periodValue);
            }
            
            if (!isWorkingDay(originalEndDate) && periodType !== 'hours') {
                explanation.textContent = 'Note: According to Article 3(4), the period has been extended to the next working day as the calculated end date fell on a weekend or holiday.';
            } else {
                explanation.textContent = 'Note: Calculation includes all days (including weekends and holidays).';
            }
        }
        
        const existingExplanation = resultDiv.querySelector('p:last-child');
        if (existingExplanation && existingExplanation !== endDateElement) {
            resultDiv.removeChild(existingExplanation);
        }
        resultDiv.appendChild(explanation);

    } catch (error) {
        console.error('Error in calculateDate:', error);
        alert('An error occurred while calculating the date. Please check the console for details.');
    }
}

// Add event listener when the document is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set default start date to current date and time
    const startDateInput = document.getElementById('startDate');
    if (startDateInput) {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        startDateInput.value = `${year}-${month}-${day}T${hours}:${minutes}`;
    }
}); 