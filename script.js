// Holiday data organized by country/institution
const holidayData = {
    // EU Member States holidays for 2025 based on OJ C, C/2024/7517, 20.12.2024
    'BE': ['2025-01-01', '2025-04-20', '2025-04-21', '2025-05-01', '2025-05-29', '2025-06-08', '2025-06-09', '2025-07-21', '2025-08-15', '2025-11-01', '2025-11-11', '2025-12-25'],
    'BG': ['2025-01-01', '2025-03-03', '2025-04-18', '2025-04-19', '2025-04-20', '2025-04-21', '2025-05-01', '2025-05-06', '2025-05-24', '2025-09-06', '2025-09-22', '2025-11-01', '2025-12-24', '2025-12-25', '2025-12-26'],
    'CZ': ['2025-01-01', '2025-04-18', '2025-04-19', '2025-04-20', '2025-04-21', '2025-05-01', '2025-05-08', '2025-07-05', '2025-07-06', '2025-09-28', '2025-10-28', '2025-11-17', '2025-12-24', '2025-12-25', '2025-12-26'],
    'DK': ['2025-01-01', '2025-04-17', '2025-04-18', '2025-04-20', '2025-04-21', '2025-05-29', '2025-06-08', '2025-06-09', '2025-12-25', '2025-12-26'],
    'DE': ['2025-01-01', '2025-04-18', '2025-04-21', '2025-05-01', '2025-05-29', '2025-06-09', '2025-10-03', '2025-12-25', '2025-12-26'],
    'EE': ['2025-01-01', '2025-02-24', '2025-04-18', '2025-04-20', '2025-05-01', '2025-06-08', '2025-06-23', '2025-06-24', '2025-08-20', '2025-12-24', '2025-12-25', '2025-12-26'],
    'IE': ['2025-01-01', '2025-02-03', '2025-03-17', '2025-04-21', '2025-05-05', '2025-06-02', '2025-08-04', '2025-10-27', '2025-12-25', '2025-12-26'],
    'EL': ['2025-01-01', '2025-01-06', '2025-03-03', '2025-03-25', '2025-04-18', '2025-04-19', '2025-04-20', '2025-04-21', '2025-05-01', '2025-06-08', '2025-06-09', '2025-08-15', '2025-10-28', '2025-12-25', '2025-12-26'],
    'ES': ['2025-01-01', '2025-01-06', '2025-04-18', '2025-05-01', '2025-08-15', '2025-11-01', '2025-12-06', '2025-12-08', '2025-12-25'],
    'FR': ['2025-01-01', '2025-04-21', '2025-05-01', '2025-05-08', '2025-05-29', '2025-06-09', '2025-07-14', '2025-08-15', '2025-11-01', '2025-11-11', '2025-12-25'],
    'HR': ['2025-01-01', '2025-01-06', '2025-04-20', '2025-04-21', '2025-05-01', '2025-05-30', '2025-06-19', '2025-06-22', '2025-08-05', '2025-08-15', '2025-11-01', '2025-11-18', '2025-12-25', '2025-12-26'],
    'IT': ['2025-01-01', '2025-04-18', '2025-04-21', '2025-05-01', '2025-05-29', '2025-06-09', '2025-07-21', '2025-08-15', '2025-11-01', '2025-12-25', '2025-12-26'],
    'CY': ['2025-01-01', '2025-01-06', '2025-03-03', '2025-03-25', '2025-04-01', '2025-04-18', '2025-04-21', '2025-05-01', '2025-06-09', '2025-08-15', '2025-10-01', '2025-10-28', '2025-12-24', '2025-12-25', '2025-12-26'],
    'LV': ['2025-01-01', '2025-04-18', '2025-04-21', '2025-05-01', '2025-05-05', '2025-06-23', '2025-06-24', '2025-11-18', '2025-12-24', '2025-12-25', '2025-12-26', '2025-12-31'],
    'LT': ['2025-01-01', '2025-02-16', '2025-03-11', '2025-04-20', '2025-04-21', '2025-05-01', '2025-05-04', '2025-06-01', '2025-06-24', '2025-07-06', '2025-08-15', '2025-11-01', '2025-11-02', '2025-12-24', '2025-12-25', '2025-12-26'],
    'LU': ['2025-01-01', '2025-04-21', '2025-05-01', '2025-05-09', '2025-05-29', '2025-06-09', '2025-06-23', '2025-08-15', '2025-11-01', '2025-12-25', '2025-12-26'],
    'HU': ['2025-01-01', '2025-03-15', '2025-04-18', '2025-04-21', '2025-05-01', '2025-06-09', '2025-08-20', '2025-10-23', '2025-11-01', '2025-12-25', '2025-12-26'],
    'MT': ['2025-01-01', '2025-02-10', '2025-03-19', '2025-03-31', '2025-04-18', '2025-05-01', '2025-06-07', '2025-06-29', '2025-08-15', '2025-09-08', '2025-09-21', '2025-12-08', '2025-12-13', '2025-12-25'],
    'NL': ['2025-01-01', '2025-04-18', '2025-04-21', '2025-04-26', '2025-05-05', '2025-05-29', '2025-05-30', '2025-06-09', '2025-12-25', '2025-12-26'],
    'AT': ['2025-01-01', '2025-01-06', '2025-04-21', '2025-05-01', '2025-05-29', '2025-06-09', '2025-06-19', '2025-08-15', '2025-10-26', '2025-11-01', '2025-12-08', '2025-12-25', '2025-12-26'],
    'PL': ['2025-01-01', '2025-01-06', '2025-04-20', '2025-04-21', '2025-05-01', '2025-05-03', '2025-06-08', '2025-06-19', '2025-08-15', '2025-11-01', '2025-11-11', '2025-12-25', '2025-12-26'],
    'PT': ['2025-01-01', '2025-04-18', '2025-04-20', '2025-04-25', '2025-05-01', '2025-06-10', '2025-06-19', '2025-08-15', '2025-10-05', '2025-11-01', '2025-12-01', '2025-12-08', '2025-12-25'],
    'RO': ['2025-01-01', '2025-01-02', '2025-01-06', '2025-01-07', '2025-01-24', '2025-04-18', '2025-04-20', '2025-04-21', '2025-05-01', '2025-06-01', '2025-06-08', '2025-06-09', '2025-08-15', '2025-11-30', '2025-12-01', '2025-12-25', '2025-12-26'],
    'SI': ['2025-01-01', '2025-01-02', '2025-02-08', '2025-04-20', '2025-04-21', '2025-04-27', '2025-05-01', '2025-05-02', '2025-06-08', '2025-06-25', '2025-08-15', '2025-10-31', '2025-11-01', '2025-12-25', '2025-12-26'],
    'SK': ['2025-01-01', '2025-01-06', '2025-04-18', '2025-04-21', '2025-05-01', '2025-05-08', '2025-07-05', '2025-08-29', '2025-09-15', '2025-11-01', '2025-11-17', '2025-12-24', '2025-12-25', '2025-12-26'],
    'FI': ['2025-01-01', '2025-01-06', '2025-04-18', '2025-04-21', '2025-05-01', '2025-05-29', '2025-06-20', '2025-12-06', '2025-12-24', '2025-12-25', '2025-12-26'],
    'SE': ['2025-01-01', '2025-01-06', '2025-04-18', '2025-04-20', '2025-04-21', '2025-05-01', '2025-05-29', '2025-06-06', '2025-06-08', '2025-06-21', '2025-11-01', '2025-12-25', '2025-12-26'],

    // European Parliament holidays 2024-2025
    'EP': [
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
    ],

    // European Commission holidays 2025
    'EC': [
        '2025-01-01', // New Year's Day
        '2025-01-02', // Day after New Year's Day
        '2025-04-17', // Maundy Thursday
        '2025-04-18', // Good Friday
        '2025-04-21', // Easter Monday
        '2025-05-01', // Labour Day
        '2025-05-09', // Anniversary of the Declaration by Robert Schuman in 1950
        '2025-05-29', // Ascension Day
        '2025-05-30', // Day after Ascension Day
        '2025-06-09', // Whit Monday
        '2025-06-23', // Luxembourg National Holiday (for staff serving in Luxembourg)
        '2025-07-21', // Belgian National Holiday (for staff serving in Brussels)
        '2025-08-15', // Assumption
        '2025-12-24', // Christmas period
        '2025-12-25',
        '2025-12-26',
        '2025-12-27',
        '2025-12-28',
        '2025-12-29',
        '2025-12-30',
        '2025-12-31'
    ]
};

// Default holiday system and date format
let selectedHolidaySystem = 'EP';
let dateFormat = 'dmy-text';

// Sanitize holiday system value to prevent injection via URL parameters or cookies
function sanitizeHolidaySystem(value) {
    const allowed = Object.keys(holidayData);
    return allowed.includes(value) ? value : 'EP';
}

// Sanitize date format from allowed list
function sanitizeDateFormat(value) {
    const allowedFormats = ['mdy-slash', 'dmy-slash', 'iso', 'long', 'dmy', 'dmy-text'];
    return allowedFormats.includes(value) ? value : 'dmy-text';
}

function getCookie(name) {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        const raw = parts.pop().split(';').shift();
        return decodeURIComponent(raw);
    }
    return null;
}

function setCookie(name, value, days) {
    if (typeof document === 'undefined') return;
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const encoded = encodeURIComponent(value);
    document.cookie =
        `${name}=${encoded}; expires=${date.toUTCString()}; path=/; Secure; SameSite=Lax`;
}

if (typeof document !== 'undefined') {
    // First check URL parameters, then fall back to cookies
    const urlParams = new URLSearchParams(window.location.search);
    
    // Load date format from URL or cookie
    const urlDateFormat = urlParams.get('format');
    if (urlDateFormat) {
        dateFormat = sanitizeDateFormat(urlDateFormat);
    } else {
        const savedDateFormat = getCookie('dateFormat');
        if (savedDateFormat) {
            // Handle legacy format codes
            if (savedDateFormat === 'dmy') {
                dateFormat = 'dmy-text';
            } else if (savedDateFormat === 'mdy') {
                dateFormat = 'mdy-slash';
            } else {
                dateFormat = sanitizeDateFormat(savedDateFormat);
            }
        }
    }

    // Load holiday system from URL or cookie
    const urlHolidaySystem = urlParams.get('holidays');
    if (urlHolidaySystem) {
        selectedHolidaySystem = sanitizeHolidaySystem(urlHolidaySystem);
    } else {
        const savedHolidaySystem = getCookie('holidaySystem');
        if (savedHolidaySystem) {
            selectedHolidaySystem = sanitizeHolidaySystem(savedHolidaySystem);
        }
    }
}

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
    
    const holidays = holidayData[selectedHolidaySystem] || holidayData['EP'];
    return holidays.includes(dateString);
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

function formatDate(date) {
    switch (dateFormat) {
        case 'mdy-slash':
            return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${date.getFullYear()}`;
        case 'dmy-slash':
            return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
        case 'iso':
            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        case 'long':
            return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
        case 'dmy':
        case 'dmy-text':
        default:
            return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    }
}

function formatDateTime(date) {
    const timeStr = date.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
    const dateStr = formatDate(date);
    return dateFormat === 'iso' ? `${dateStr} ${timeStr}` : `${dateStr}, ${timeStr}`;
}

function updateEventDateDisplay() {
    const input = document.getElementById('eventDate');
    const preview = document.getElementById('eventDateFormatted');
    if (!input || !preview || !input.value) {
        if (preview) preview.textContent = '';
        return;
    }
    const date = new Date(input.value);
    if (!isNaN(date)) {
        preview.textContent = formatDate(date);
    } else {
        preview.textContent = '';
    }
}

// Combined implementation of Articles 3(1), 3(2), 3(3), and 3(4)
function calculatePeriod(eventDateTime, periodValue, periodType) {
    const result = {
        eventDate: new Date(eventDateTime),
        startDate: null,
        initialEndDate: null,
        finalEndDate: null,
        appliedRules: [],
        explanation: [],
        workingDaysCount: 0,
        holidayDataWarning: null
    };

    const isRetroactive = periodValue < 0;
    const absolutePeriodValue = Math.abs(periodValue);

    // Step 1: Apply Article 3(1) - Skip the event hour/day (except for weeks, months, years per Case C-171/03)
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
    } else if (periodType === 'weeks' || periodType === 'months' || periodType === 'years') {
        // Per Case C-171/03, for periods expressed in weeks, months, or years, 
        // Article 3(2)(c) takes precedence and the period runs from the event day itself
        startDate.setHours(0, 0, 0, 0);
        result.appliedRules.push('Case C-171/03: For weeks/months/years, period starts from the event day itself (Article 3(2)(c) takes precedence over Article 3(1))');
        result.explanation.push(`According to <a href="https://eur-lex.europa.eu/legal-content/EN/ALL/?uri=CELEX:62003CJ0171" target="_blank" rel="noopener">Case C-171/03</a>, for periods expressed in weeks, months, or years, Article 3(2)(c) takes precedence over Article 3(1). The period starts from the event day itself (${formatDate(startDate)}).`);
    } else {
        if (isRetroactive) {
            startDate.setHours(0, 0, 0, 0);
            result.appliedRules.push('Article 3(1): Day of event not counted, starting from beginning of current day for retroactive calculation');
            result.explanation.push(`According to Article 3(1), for retroactive calculation, the day of the event (${formatDate(eventDateTime)}) is not counted. The period starts from the beginning of the current day and counts backwards.`);
        } else {
            startDate.setDate(startDate.getDate() + 1);
            startDate.setHours(0, 0, 0, 0);
            result.appliedRules.push('Article 3(1): Day of event not counted, starting from next day');
            result.explanation.push(`According to Article 3(1), the day of the event (${formatDate(eventDateTime)}) is not counted. The period starts from the next day (${formatDate(startDate)}).`);
        }
    }

    // Store the actual start date after applying Article 3(1)
    result.startDate = new Date(startDate);

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
            endDate.setDate(endDate.getDate() - (absolutePeriodValue * 7));
            endDate.setHours(0, 0, 0, 0);
        } else {
            endDate.setDate(endDate.getDate() + (absolutePeriodValue * 7));
            endDate.setHours(23, 59, 59, 999);
        }
        result.appliedRules.push(`Article 3(2)(c) per Case C-171/03: ${absolutePeriodValue} weeks ${isRetroactive ? 'retroactive ' : ''}calculated, ending on same day of week as event`);
    } else if (periodType === 'months') {
        if (isRetroactive) {
            // For retroactive calculation, subtract months and handle overflow
            const originalDay = endDate.getDate();
            endDate.setMonth(endDate.getMonth() - absolutePeriodValue);
            
            // If the original day doesn't exist in the target month, JavaScript will overflow
            // We need to adjust to the last day of the intended month according to Article 3(2)(c)
            const targetMonth = endDate.getMonth();
            if (endDate.getDate() !== originalDay) {
                // Overflow occurred, set to last day of target month
                endDate.setDate(0); // This sets to last day of previous month (which is our target month)
            }
            endDate.setHours(0, 0, 0, 0);
        } else {
            // For forward calculation, add months and handle overflow according to Article 3(2)(c)
            const originalDay = endDate.getDate();
            const targetMonth = (endDate.getMonth() + absolutePeriodValue) % 12;
            const targetYear = endDate.getFullYear() + Math.floor((endDate.getMonth() + absolutePeriodValue) / 12);
            
            endDate.setMonth(endDate.getMonth() + absolutePeriodValue);
            
            // Check if overflow occurred (JavaScript automatically rolls to next month if day doesn't exist)
            if (endDate.getMonth() !== targetMonth || endDate.getFullYear() !== targetYear) {
                // Overflow occurred - set to last day of intended target month per Article 3(2)(c)
                endDate.setFullYear(targetYear);
                endDate.setMonth(targetMonth + 1, 0); // Set to last day of target month
            }
            
            // Article 3(2)(c): Period ends on the same date as the day from which it runs
            // The end date is the target date itself (already correctly calculated)
            endDate.setHours(23, 59, 59, 999);
        }
        result.appliedRules.push(`Article 3(2)(c) per Case C-171/03: ${absolutePeriodValue} months ${isRetroactive ? 'retroactive ' : ''}calculated, ending on same date as event`);
    } else if (periodType === 'years') {
        if (isRetroactive) {
            // For retroactive calculation, subtract years and handle overflow (e.g., Feb 29 in non-leap year)
            const originalDay = endDate.getDate();
            const originalMonth = endDate.getMonth();
            endDate.setFullYear(endDate.getFullYear() - absolutePeriodValue);
            
            // If the original day doesn't exist in the target year (e.g., Feb 29 in non-leap year)
            if (endDate.getDate() !== originalDay || endDate.getMonth() !== originalMonth) {
                // Overflow occurred, set to last day of intended month per Article 3(2)(c)
                endDate.setMonth(originalMonth + 1, 0); // Set to last day of target month
            }
            endDate.setHours(0, 0, 0, 0);
        } else {
            // For forward calculation, add years and handle overflow according to Article 3(2)(c)
            const originalDay = endDate.getDate();
            const originalMonth = endDate.getMonth();
            endDate.setFullYear(endDate.getFullYear() + absolutePeriodValue);
            
            // Check if overflow occurred (e.g., Feb 29 to non-leap year)
            if (endDate.getDate() !== originalDay || endDate.getMonth() !== originalMonth) {
                // Overflow occurred - set to last day of intended month in target year per Article 3(2)(c)
                endDate.setMonth(originalMonth + 1, 0); // Set to last day of target month
            }
            
            // Article 3(2)(c): Period ends on the same date as the day from which it runs
            // The end date is the target date itself (already correctly calculated)
            endDate.setHours(23, 59, 59, 999);
        }
        result.appliedRules.push(`Article 3(2)(c) per Case C-171/03: ${absolutePeriodValue} years ${isRetroactive ? 'retroactive ' : ''}calculated, ending on same date as event`);
    }

    result.initialEndDate = new Date(endDate);

    // Step 3: Apply Article 3(4) - Extend to next working day if needed
    if (periodType !== 'hours' && !isRetroactive && !isWorkingDay(endDate)) {
        const nextWorkDay = findNextWorkingDay(endDate);
        nextWorkDay.setHours(23, 59, 59, 999);
        endDate = nextWorkDay;
        result.appliedRules.push(
            'Article 3(4): End date falls on non-working day, extended to next working day',
            `- Previous end date: ${formatDateTime(result.initialEndDate)}`,
            `- Extended to: ${formatDateTime(endDate)}`
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
        console.log(`Checking working days from ${formatDate(currentDate)} to ${formatDate(endDateCopy)}`);
        
        // First, count working days in the original period
        while (currentDate <= endDateCopy) {
            if (isWorkingDay(currentDate)) {
                workingDays++;
                console.log(`Found working day: ${formatDate(currentDate)}`);
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
                        console.log(`Found working day in backward extended period: ${formatDate(currentDate)}`);
                    }
                    currentDate.setDate(currentDate.getDate() + 1);
                }
                
                console.log(`Total working days in backward extended period: ${workingDays}`);
                
                if (workingDays >= 2) {
                    startDate = prevWorkDay;
                    result.appliedRules.push(
                        'Article 3(5): Period extended backward to ensure at least two working days',
                        `- Original start date: ${formatDateTime(result.initialEndDate)}`,
                        `- Extended to: ${formatDate(startDate)}`
                    );
                    result.explanation.push(`According to Article 3(5), any period of two days or more must include at least two working days. The period only included ${result.workingDaysCount} working day${result.workingDaysCount === 1 ? '' : 's'}, so it has been extended backward to ${formatDate(startDate)} to ensure at least two working days are included.`);
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
                        console.log(`Found additional working day: ${formatDate(currentWorkDay)}`);
                    }
                    
                    if (foundAdditionalWorkingDays < requiredAdditionalWorkingDays) {
                        currentWorkDay.setDate(currentWorkDay.getDate() + 1);
                    }
                }
                
                endDate = new Date(currentWorkDay);
                endDate.setHours(23, 59, 59, 999);
                
                result.appliedRules.push(
                    'Article 3(5): Period extended forward to ensure at least two working days',
                    `- Original end date: ${formatDateTime(result.initialEndDate)}`,
                    `- Extended to: ${formatDateTime(endDate)}`
                );
                result.explanation.push(`According to Article 3(5), any period of two days or more must include at least two working days. The period only included ${result.workingDaysCount} working day${result.workingDaysCount === 1 ? '' : 's'}, so it has been extended forward to ${formatDate(endDate)} to ensure at least two working days are included.`);
            }
        }
    }

    result.finalEndDate = endDate;
    
    // Check holiday data coverage for the calculated period
    const periodStart = new Date(Math.min(result.startDate, result.finalEndDate));
    const periodEnd = new Date(Math.max(result.startDate, result.finalEndDate));
    
    const coverage = checkHolidayDataCoverage(periodStart, periodEnd, selectedHolidaySystem);
    if (!coverage.isComplete) {
        result.holidayDataWarning = generateHolidayWarning(coverage, selectedHolidaySystem);
    }
    
    return result;
}

function renderCalendar(result) {
    const container = document.getElementById('calendar-container');
    container.innerHTML = '';

    // Create legend
    const legend = document.createElement('div');
    legend.className = 'calendar-legend';
    legend.innerHTML = `
        <div class="legend-item">
            <div class="legend-color" style="background-color: #1a73e8;"></div>
            <span>Start of period</span>
        </div>
        <div class="legend-item">
            <div class="legend-color" style="background-color: #1557b0;"></div>
            <span>End of period</span>
        </div>
        <div class="legend-item">
            <div class="legend-color" style="background-color: #f3e5f5; border: 1px dashed #9c27b0;"></div>
            <span>Event Date</span>
        </div>
        <div class="legend-item">
            <div class="legend-color" style="background: linear-gradient(to bottom right, #1a73e8 0%, #1a73e8 49%, #f3e5f5 51%, #f3e5f5 100%); border: 1px dashed #9c27b0;"></div>
            <span>Start + Event Date</span>
        </div>
        <div class="legend-item">
            <div class="legend-color" style="background-color: #e8f0fe;"></div>
            <span>Working Day</span>
        </div>
        <div class="legend-item">
            <div class="legend-color" style="background-color: #fff3cd;"></div>
            <span>Holiday</span>
        </div>
        <div class="legend-item">
            <div class="legend-color" style="background-color: #f8f9fa; border: 1px solid #dee2e6;"></div>
            <span>Weekend</span>
        </div>
        <div class="legend-item">
            <div class="legend-color" style="border: 1px solid #1a73e8;"></div>
            <span>In Period</span>
        </div>
        <div class="legend-item">
            <div class="legend-color" style="border: 1px dashed #1a73e8;"></div>
            <span>Extension</span>
        </div>
        <div class="legend-item">
            <div class="legend-color" style="border: 2px solid #dc3545;"></div>
            <span>Today</span>
        </div>
    `;
    container.appendChild(legend);

    // Create months container
    const monthsContainer = document.createElement('div');
    monthsContainer.className = 'calendar-months-container';
    container.appendChild(monthsContainer);

    // Get the date range to display
    const startDate = new Date(result.startDate);
    const endDate = new Date(result.finalEndDate);
    
    // For retroactive calculations, swap start and end dates for display purposes
    const displayStart = new Date(Math.min(startDate, endDate));
    const displayEnd = new Date(Math.max(startDate, endDate));
    
    // Get first day of start month and last day of end month
    const firstDisplayMonth = new Date(displayStart.getFullYear(), displayStart.getMonth(), 1);
    const lastDisplayMonth = new Date(displayEnd.getFullYear(), displayEnd.getMonth() + 1, 0);

    // Generate calendar for each month in the range
    let currentDate = new Date(firstDisplayMonth);
    while (currentDate <= lastDisplayMonth) {
        const monthWrapper = document.createElement('div');
        monthWrapper.className = 'calendar-month-wrapper';
        monthsContainer.appendChild(monthWrapper);
        renderMonthCalendar(currentDate, result, monthWrapper);
        currentDate.setMonth(currentDate.getMonth() + 1);
    }
}

function renderMonthCalendar(date, result, container) {
    // Create month header
    const monthHeader = document.createElement('div');
    monthHeader.className = 'calendar-month-header';
    monthHeader.textContent = date.toLocaleString('default', { month: 'long', year: 'numeric' });
    container.appendChild(monthHeader);

    // Create calendar grid
    const calendar = document.createElement('div');
    calendar.className = 'calendar';

    // Add day headers - Start with Monday
    const header = document.createElement('div');
    header.className = 'calendar-header';
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    days.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.textContent = day;
        header.appendChild(dayHeader);
    });
    calendar.appendChild(header);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get first day of month and last day of month
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    
    // Calculate padding for Monday start
    let firstDayPadding = firstDay.getDay() - 1;
    if (firstDayPadding === -1) firstDayPadding = 6; // Sunday should be 6 when starting on Monday
    
    // Create a grid of all days
    const totalDays = firstDayPadding + lastDay.getDate();
    const totalWeeks = Math.ceil(totalDays / 7);
    
    // Create week rows
    for (let week = 0; week < totalWeeks; week++) {
        const weekRow = document.createElement('div');
        weekRow.className = 'calendar-week';
        
        // Add days in this week
        for (let weekday = 0; weekday < 7; weekday++) {
            const dayNumber = week * 7 + weekday - firstDayPadding + 1;
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            
            if (dayNumber > 0 && dayNumber <= lastDay.getDate()) {
                const currentDate = new Date(date.getFullYear(), date.getMonth(), dayNumber);
                dayElement.textContent = dayNumber;

                // Add appropriate classes based on the day's properties
                if (isWeekend(currentDate)) {
                    dayElement.classList.add('weekend');
                }
                if (isHoliday(currentDate)) {
                    dayElement.classList.add('holiday');
                }
                if (isWorkingDay(currentDate)) {
                    dayElement.classList.add('working-day');
                }

                if (isSameDay(currentDate, today)) {
                    dayElement.classList.add('today');
                }

                // For retroactive calculations, we need to check if the date is between end and start
                // For forward calculations, we check if the date is between start and end
                const periodStart = new Date(Math.min(result.startDate, result.finalEndDate));
                const periodEnd = new Date(Math.max(result.startDate, result.finalEndDate));

                // Check if this day is in the calculated period
                if (currentDate >= periodStart && currentDate <= periodEnd) {
                    dayElement.classList.add('in-period');
                }

                // Mark start and end dates - for retroactive calculations, these are reversed
                const isStartDate = isSameDay(currentDate, result.startDate);
                const isEventDate = isSameDay(currentDate, result.eventDate);
                const isEndDate = isSameDay(currentDate, result.finalEndDate);
                
                if (isStartDate && isEventDate) {
                    // Both start and event date - show diagonal split
                    dayElement.classList.add('start-event-date');
                } else if (isStartDate) {
                    dayElement.classList.add('start-date');
                } else if (isEventDate) {
                    dayElement.classList.add('event-date');
                }
                
                if (isEndDate) {
                    dayElement.classList.add('end-date');
                }

                // Mark extension days - need to handle both forward and retroactive cases
                if (result.initialEndDate) {
                    const isForward = result.startDate <= result.finalEndDate;
                    if (isForward && currentDate > result.initialEndDate && currentDate <= result.finalEndDate) {
                        dayElement.classList.add('extension');
                    } else if (!isForward && currentDate < result.initialEndDate && currentDate >= result.finalEndDate) {
                        dayElement.classList.add('extension');
                    }
                }
            }
            
            weekRow.appendChild(dayElement);
        }
        
        calendar.appendChild(weekRow);
    }

    container.appendChild(calendar);
}

// Helper function to compare dates without time
function isSameDay(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
}

// HTML escaping function to prevent XSS
function escapeHtml(text) {
    if (text == null) return '';
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Safe DOM creation function
function createResultElement(result) {
    const container = document.createElement('div');
    container.className = 'result-container';

    // Add the final end date
    const endDateDiv = document.createElement('div');
    endDateDiv.className = 'result-date';
    endDateDiv.textContent = `End Date: ${formatDateTime(result.finalEndDate)}`;
    container.appendChild(endDateDiv);
    
    // Add holiday system information
    const holidaySystemNames = {
        'EP': 'European Parliament',
        'EC': 'European Commission',
        'AT': 'Austria', 'BE': 'Belgium', 'BG': 'Bulgaria', 'HR': 'Croatia', 'CY': 'Cyprus',
        'CZ': 'Czech Republic', 'DK': 'Denmark', 'EE': 'Estonia', 'FI': 'Finland', 'FR': 'France',
        'DE': 'Germany', 'EL': 'Greece', 'HU': 'Hungary', 'IE': 'Ireland', 'IT': 'Italy',
        'LV': 'Latvia', 'LT': 'Lithuania', 'LU': 'Luxembourg', 'MT': 'Malta', 'NL': 'Netherlands',
        'PL': 'Poland', 'PT': 'Portugal', 'RO': 'Romania', 'SK': 'Slovakia', 'SI': 'Slovenia',
        'ES': 'Spain', 'SE': 'Sweden'
    };
    
    const holidaySystemDiv = document.createElement('div');
    holidaySystemDiv.style.cssText = 'font-size: 12px; color: #666; margin-bottom: 10px;';
    holidaySystemDiv.textContent = `Using ${holidaySystemNames[selectedHolidaySystem] || selectedHolidaySystem} public holidays`;
    container.appendChild(holidaySystemDiv);
    
    // Add holiday data warning if applicable
    if (result.holidayDataWarning) {
        const warningDiv = document.createElement('div');
        warningDiv.className = 'holiday-warning';
        warningDiv.style.cssText = 'background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 10px; margin-bottom: 15px; border-radius: 4px; font-size: 14px;';
        
        // Safely extract and display the warning message by completely stripping all HTML
        // This prevents any potential HTML injection vulnerabilities
        let cleanWarning = result.holidayDataWarning;
        
        // First, extract content from any <strong> tags safely
        cleanWarning = cleanWarning.replace(/<strong>([^<]*)<\/strong>/g, '$1');
        
        // Then strip ALL HTML tags to ensure no script or other dangerous content
        cleanWarning = cleanWarning.replace(/<[^>]*>/g, '');

        let previousWarning;
        do {previousWarning = cleanWarning;

            cleanWarning = cleanWarning.replace(/<strong>([^<]*)<\/strong>/g, '$1');
            cleanWarning = cleanWarning.replace(/<[^>]*>/g, '');
        } while (previousWarning !== cleanWarning);
        
        // Use textContent to safely set the warning text (no HTML interpretation)
        warningDiv.textContent = cleanWarning;
        container.appendChild(warningDiv);
    }
    
    // Add explanation
    const explanationDiv = document.createElement('div');
    explanationDiv.className = 'result-explanation';
    
    // Step 1: Always explain Article 3(1)
    if (result.explanation.length > 0 && result.explanation[0].includes('Article 3(1)')) {
        const para1 = document.createElement('span');
        // The explanation may contain links, so we need to handle them safely
        const explanation = result.explanation[0];
        if (explanation.includes('<a href=')) {
            // Parse links safely - only allow specific EUR-Lex links
            const linkRegex = /<a href="(https:\/\/eur-lex\.europa\.eu[^"]*)"[^>]*>([^<]*)<\/a>/g;
            let lastIndex = 0;
            let match;
            
            while ((match = linkRegex.exec(explanation)) !== null) {
                // Add text before the link
                if (match.index > lastIndex) {
                    const textNode = document.createTextNode(explanation.substring(lastIndex, match.index));
                    para1.appendChild(textNode);
                }
                
                // Create safe link
                const link = document.createElement('a');
                link.href = match[1]; // Already validated by regex to be EUR-Lex domain
                link.target = '_blank';
                link.rel = 'noopener';
                link.textContent = match[2];
                para1.appendChild(link);
                
                lastIndex = match.index + match[0].length;
            }
            
            // Add remaining text
            if (lastIndex < explanation.length) {
                const textNode = document.createTextNode(explanation.substring(lastIndex));
                para1.appendChild(textNode);
            }
        } else {
            para1.textContent = explanation;
        }
        explanationDiv.appendChild(para1);
    }
    
    // Check which rules were applied
    const article34Applied = result.appliedRules.some(rule => rule.includes('Article 3(4)'));
    const article35Applied = result.appliedRules.some(rule => rule.includes('Article 3(5)'));
    
    // Step 2: Explain initial end date calculation
    if (result.initialEndDate) {
        const initialDateStr = formatDate(result.initialEndDate);
        
        if (article34Applied) {
            // For Article 3(4), the final end date is the extended date
            const br = document.createElement('br');
            explanationDiv.appendChild(br);
            const para2 = document.createElement('span');
            para2.textContent = `The original end date (${initialDateStr}) falls on a non-working day, so according to Article 3(4), the period has been extended to the next working day (${formatDate(result.finalEndDate)}).`;
            explanationDiv.appendChild(para2);
        }
    }
    
    // Step 3: Explain Article 3(5) if applied
    if (article35Applied && result.explanation.find(exp => exp.includes('Article 3(5)'))) {
        const br = document.createElement('br');
        explanationDiv.appendChild(br);
        const para3 = document.createElement('span');
        para3.textContent = result.explanation.find(exp => exp.includes('Article 3(5)'));
        explanationDiv.appendChild(para3);
    }
    
    container.appendChild(explanationDiv);
    
    // Add calendar export section
    const exportDiv = document.createElement('div');
    exportDiv.style.cssText = 'margin-top: 20px; padding-top: 15px; border-top: 1px solid #e9ecef; text-align: center;';
    
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = 'display: flex; gap: 10px; justify-content: center; align-items: center; flex-wrap: wrap;';
    
    const calendarBtn = document.createElement('button');
    calendarBtn.className = 'calendar-export-trigger';
    calendarBtn.textContent = '📅 Export to Calendar';
    calendarBtn.onclick = openCalendarModal;
    buttonContainer.appendChild(calendarBtn);
    
    const shareBtn = document.createElement('button');
    shareBtn.className = 'calendar-export-trigger';
    shareBtn.title = 'Copy shareable link';
    shareBtn.textContent = '🔗 Share Link';
    shareBtn.onclick = copyPermalinkToClipboard;
    buttonContainer.appendChild(shareBtn);
    
    exportDiv.appendChild(buttonContainer);
    container.appendChild(exportDiv);

    // Store the current result for export functions
    window.currentCalculationResult = result;

    // Render the calendar visualization
    renderCalendar(result);
    
    return container;
}

// Function to get the years covered by holiday data for a given system
function getHolidayDataYears(holidaySystem) {
    const holidays = holidayData[holidaySystem] || [];
    const years = new Set();
    
    holidays.forEach(dateStr => {
        const year = parseInt(dateStr.split('-')[0]);
        years.add(year);
    });
    
    return Array.from(years).sort();
}

// Function to check if we have complete holiday data for a date range
function checkHolidayDataCoverage(startDate, endDate, holidaySystem) {
    const availableYears = getHolidayDataYears(holidaySystem);
    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();
    
    const missingYears = [];
    
    for (let year = startYear; year <= endYear; year++) {
        if (holidaySystem === 'EP') {
            const holidays = holidayData[holidaySystem] || [];
            const yearHolidays = holidays.filter(dateStr => dateStr.startsWith(`${year}-`));
            
            if (yearHolidays.length === 0) {
                // No data at all for this year
                missingYears.push(year);
            } else {
                // Check if we only have New Year period data (first week of January)
                const hasOnlyNewYearDays = yearHolidays.every(dateStr => {
                    const date = dateStr.split('-');
                    return date[1] === '01' && parseInt(date[2]) <= 7; // First week
                });
                
                if (hasOnlyNewYearDays) {
                    // If we only have January 1-7 holidays, we don't have the full year's holidays
                    const yearEarlyJan = new Date(year, 0, 7, 23, 59, 59, 999); // End of Jan 7
                    
                    // Check if any part of our period in this year extends beyond the New Year period
                    const periodStartInYear = year === startYear ? startDate : new Date(year, 0, 1);
                    const periodEndInYear = year === endYear ? endDate : new Date(year, 11, 31, 23, 59, 59, 999);
                    
                    if (periodEndInYear > yearEarlyJan) {
                        // Period extends beyond New Year data coverage
                        missingYears.push(year);
                    }
                }
            }
        } else {
            // Non-EP systems: simple check for year availability
            if (!availableYears.includes(year)) {
                missingYears.push(year);
            }
        }
    }
    
    return {
        isComplete: missingYears.length === 0,
        missingYears: missingYears,
        availableYears: availableYears
    };
}

// Function to generate holiday data warning message
function generateHolidayWarning(coverage, holidaySystem) {
    if (coverage.isComplete) {
        return null;
    }
    
    const holidaySystemNames = {
        'EP': 'European Parliament',
        'EC': 'European Commission',
        'AT': 'Austria', 'BE': 'Belgium', 'BG': 'Bulgaria', 'HR': 'Croatia', 'CY': 'Cyprus',
        'CZ': 'Czech Republic', 'DK': 'Denmark', 'EE': 'Estonia', 'FI': 'Finland', 'FR': 'France',
        'DE': 'Germany', 'EL': 'Greece', 'HU': 'Hungary', 'IE': 'Ireland', 'IT': 'Italy',
        'LV': 'Latvia', 'LT': 'Lithuania', 'LU': 'Luxembourg', 'MT': 'Malta', 'NL': 'Netherlands',
        'PL': 'Poland', 'PT': 'Portugal', 'RO': 'Romania', 'SK': 'Slovakia', 'SI': 'Slovenia',
        'ES': 'Spain', 'SE': 'Sweden'
    };
    
    const systemName = holidaySystemNames[holidaySystem] || holidaySystem;
    const missingYearsStr = coverage.missingYears.join(', ');
    const availableYearsStr = coverage.availableYears.length > 0 ? 
        coverage.availableYears.join(', ') : 'none';
    
    let message = `⚠️ <strong>Public Holiday Data Warning:</strong> `;
    
    if (holidaySystem === 'EP' && coverage.missingYears.length > 0) {
        // Special message for European Parliament partial data
        if (coverage.missingYears.length === 1) {
            message += `Complete public holiday data for ${systemName} is not available for ${missingYearsStr}. `;
        } else {
            message += `Complete public holiday data for ${systemName} is not available for ${missingYearsStr}. `;
        }
        message += `Only New Year week holidays may be included for the missing year${coverage.missingYears.length > 1 ? 's' : ''}. `;
        message += `Other public holidays are not accounted for. `;
    } else {
        if (coverage.missingYears.length === 1) {
            message += `Public holiday data for ${systemName} is not available for ${missingYearsStr}. `;
        } else {
            message += `Public holiday data for ${systemName} is not available for ${missingYearsStr}. `;
        }
        message += `Only Sundays and Saturdays are treated as non-working days for the missing period${coverage.missingYears.length > 1 ? 's' : ''}. `;
    }
    
    if (coverage.availableYears.length > 0) {
        message += `Available data covers: ${availableYearsStr}.`;
    }
    
    return message;
}

// Function to format date for iCal (YYYYMMDDTHHMMSSZ)
function formatICalDate(date) {
    return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

// Function to format date for iCal (YYYYMMDD for all-day events)
function formatICalAllDayDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
}

// Security function to sanitize text for iCal format
function sanitizeICalText(text) {
    if (!text) return '';
    
    return text
        // Limit length to reasonable size (75 chars per RFC 5545 line folding, but we'll be more generous for titles)
        .slice(0, 100)
        // Remove line breaks and carriage returns (critical for preventing injection)
        .replace(/[\r\n\u2028\u2029]/g, '')
        // Remove other control characters except tab
        .replace(/[\x00-\x08\x0B-\x1F\x7F]/g, '')
        // Escape iCal special characters according to RFC 5545
        .replace(/\\/g, '\\\\')  // Backslash must be escaped first
        .replace(/;/g, '\\;')    // Semicolon
        .replace(/,/g, '\\,')    // Comma
        .replace(/"/g, '\\"')    // Quote (though not strictly required in all contexts)
        // Trim whitespace
        .trim();
}

// Security function to sanitize text for URL parameters
function sanitizeUrlText(text) {
    if (!text) return '';
    
    return text
        // Limit length for URLs (browsers have limits, Google Calendar has specific limits)
        .slice(0, 100)
        // Remove line breaks and control characters
        .replace(/[\r\n\u2028\u2029\x00-\x1F\x7F]/g, '')
        // Trim whitespace
        .trim();
}

// Client-side validation function for event names
function validateEventName(text) {
    if (!text) return { valid: true, sanitized: '' };
    
    // Check for obviously malicious patterns
    const suspiciousPatterns = [
        /BEGIN:/i,
        /END:/i,
        /VEVENT/i,
        /VALARM/i,
        /VTODO/i,
        /VJOURNAL/i,
        /javascript:/i,
        /data:/i,
        /vbscript:/i,
        /&subject=/i,      // URL parameter injection
        /&dates=/i,        // Calendar URL injection  
        /<script/i,        // Script tag injection
        /"><script/i,      // Attribute breakout + script
        /\s*\[\s*\]/,      // Suspicious brackets
        /\{\{.*\}\}/,      // Template injection patterns
        /\$\{.*\}/,        // Template literal injection
        /%[0-9a-f]{2}/i,   // URL encoded characters (suspicious in event names)
        /\\x[0-9a-f]{2}/i, // Hex encoded characters
        /\\u[0-9a-f]{4}/i  // Unicode escape sequences
    ];
    
    for (const pattern of suspiciousPatterns) {
        if (pattern.test(text)) {
            return { 
                valid: false, 
                error: 'Event name contains invalid characters or patterns.',
                sanitized: ''
            };
        }
    }
    
    // Check for too many special characters (might indicate injection attempt)
    const specialCharCount = (text.match(/[<>\"&;{}\\]/g) || []).length;
    if (specialCharCount > 3) {
        return {
            valid: false,
            error: 'Event name contains too many special characters.',
            sanitized: text.replace(/[<>\"&;{}\\]/g, '').trim()
        };
    }
    
    // Length check
    if (text.length > 100) {
        return {
            valid: false,
            error: 'Event name is too long (maximum 100 characters).',
            sanitized: text.slice(0, 100)
        };
    }
    
    // Basic sanitization for display
    const sanitized = text
        .replace(/[\r\n\u2028\u2029\x00-\x1F\x7F]/g, '')
        .trim();
    
    return { valid: true, sanitized };
}

// Function to generate deadline export (all-day event with reminder)
function generateDeadlineICalEvent(result, deadlineName, periodDescription) {
    const now = new Date();
    const deadlineDate = new Date(result.finalEndDate);
    
    // For all-day event on deadline day
    const startAllDay = new Date(deadlineDate);
    startAllDay.setHours(0, 0, 0, 0);
    
    const endAllDay = new Date(deadlineDate);
    endAllDay.setDate(endAllDay.getDate() + 1); // iCal end date is exclusive for all-day events
    endAllDay.setHours(0, 0, 0, 0);
    
    const eventId = `deadline-${now.getTime()}@eu-periods-calculator.com`;
    
    // Sanitize user input for iCal format
    const safeTitle = sanitizeICalText(deadlineName) || 'EU Regulation 1182/71 Deadline';
    const safePeriodDescription = sanitizeICalText(periodDescription);
    
    // Build description with safe, static content
    const description = `Calculated deadline based on EU Regulation 1182/71\\n\\n` +
                       `Period: ${safePeriodDescription}\\n` +
                       `Event Date: ${sanitizeICalText(formatDate(result.eventDate))}\\n` +
                       `Calculated End Date: ${sanitizeICalText(formatDateTime(result.finalEndDate))}\\n\\n` +
                       `Applied Rules:\\n${result.appliedRules.map(rule => sanitizeICalText(rule)).join('\\n')}\\n\\n` +
                       `Generated by EU Periods Calculator`;
    
    const icalContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//EU Periods Calculator//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${eventId}
DTSTART;VALUE=DATE:${formatICalAllDayDate(startAllDay)}
DTEND;VALUE=DATE:${formatICalAllDayDate(endAllDay)}
SUMMARY:${safeTitle}
DESCRIPTION:${description}
STATUS:CONFIRMED
TRANSP:OPAQUE
BEGIN:VALARM
ACTION:DISPLAY
DESCRIPTION:Reminder: ${safeTitle}
TRIGGER:-P1D
END:VALARM
END:VEVENT
END:VCALENDAR`;

    return icalContent;
}

// Function to generate period export (multi-day event spanning the period)
function generatePeriodICalEvent(result, deadlineName, periodDescription) {
    const now = new Date();
    const startDate = new Date(result.eventDate);
    const endDate = new Date(result.finalEndDate);
    
    // For all-day events spanning multiple days
    const startAllDay = new Date(startDate);
    startAllDay.setHours(0, 0, 0, 0);
    
    const endAllDay = new Date(endDate);
    endAllDay.setDate(endAllDay.getDate() + 1); // iCal end date is exclusive
    endAllDay.setHours(0, 0, 0, 0);
    
    const eventId = `period-${now.getTime()}@eu-periods-calculator.com`;
    
    // Sanitize user input for iCal format
    const safeName = sanitizeICalText(deadlineName) || 'Legal Deadline';
    const title = `EU Period: ${safeName}`;
    const safePeriodDescription = sanitizeICalText(periodDescription);
    
    // Build description with safe, static content
    const description = `EU Regulation 1182/71 Period Calculation\\n\\n` +
                       `Period: ${safePeriodDescription}\\n` +
                       `Start (Event Date): ${sanitizeICalText(formatDate(result.eventDate))}\\n` +
                       `End (Deadline): ${sanitizeICalText(formatDateTime(result.finalEndDate))}\\n\\n` +
                       `Applied Rules:\\n${result.appliedRules.map(rule => sanitizeICalText(rule)).join('\\n')}\\n\\n` +
                       `This event spans the entire calculated period.\\n\\n` +
                       `Generated by EU Periods Calculator`;
    
    const icalContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//EU Periods Calculator//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${eventId}
DTSTART;VALUE=DATE:${formatICalAllDayDate(startAllDay)}
DTEND;VALUE=DATE:${formatICalAllDayDate(endAllDay)}
SUMMARY:${title}
DESCRIPTION:${description}
STATUS:CONFIRMED
TRANSP:TRANSPARENT
END:VEVENT
END:VCALENDAR`;

    return icalContent;
}

// Function to download iCal file
function downloadICalFile(content, filename) {
    const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
}

// Function to generate Google Calendar web links
function generateGoogleCalendarLink(result, deadlineName, periodDescription, isDeadline = true) {
    if (isDeadline) {
        // Deadline - all day event
        const deadlineDate = new Date(result.finalEndDate);
        const endDate = new Date(result.finalEndDate);
        endDate.setDate(endDate.getDate() + 1); // Google expects end date to be exclusive
        
        // Sanitize and encode for URL
        const safeTitle = sanitizeUrlText(deadlineName) || 'EU Regulation 1182/71 Deadline';
        const title = encodeURIComponent(safeTitle);
        const startDateStr = formatICalAllDayDate(deadlineDate);
        const endDateStr = formatICalAllDayDate(endDate);
        
        // Build description with sanitized content
        const safePeriodDescription = sanitizeUrlText(periodDescription);
        const description = encodeURIComponent(
            `Calculated deadline based on EU Regulation 1182/71\n\n` +
            `Period: ${safePeriodDescription}\n` +
            `Event Date: ${formatDate(result.eventDate)}\n` +
            `Calculated End Date: ${formatDateTime(result.finalEndDate)}\n\n` +
            `Applied Rules: ${result.appliedRules.map(rule => sanitizeUrlText(rule)).join(', ')}\n\n` +
            `Generated by EU Periods Calculator`
        );
        
        return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDateStr}/${endDateStr}&details=${description}`;
    } else {
        // Period view - all day event
        const startDate = new Date(result.eventDate);
        const endDate = new Date(result.finalEndDate);
        endDate.setDate(endDate.getDate() + 1); // Google expects end date to be exclusive
        
        // Sanitize and encode for URL
        const safeName = sanitizeUrlText(deadlineName) || 'Legal Deadline';
        const title = encodeURIComponent(`EU Period: ${safeName}`);
        const startDateStr = formatICalAllDayDate(startDate);
        const endDateStr = formatICalAllDayDate(endDate);
        
        // Build description with sanitized content
        const safePeriodDescription = sanitizeUrlText(periodDescription);
        const description = encodeURIComponent(
            `EU Regulation 1182/71 Period Calculation\n\n` +
            `Period: ${safePeriodDescription}\n` +
            `Start (Event Date): ${formatDate(result.eventDate)}\n` +
            `End (Deadline): ${formatDateTime(result.finalEndDate)}\n\n` +
            `Applied Rules: ${result.appliedRules.map(rule => sanitizeUrlText(rule)).join(', ')}\n\n` +
            `This event spans the entire calculated period.\n\n` +
            `Generated by EU Periods Calculator`
        );
        
        return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDateStr}/${endDateStr}&details=${description}`;
    }
}

// Function to generate Outlook web links
function generateOutlookWebLink(result, deadlineName, periodDescription, isDeadline = true) {
    if (isDeadline) {
        // Deadline - all day event
        const deadlineDate = new Date(result.finalEndDate);
        const endDate = new Date(result.finalEndDate);
        endDate.setDate(endDate.getDate() + 1); // Outlook expects end date to be exclusive
        
        // Sanitize and encode for URL
        const safeTitle = sanitizeUrlText(deadlineName) || 'EU Regulation 1182/71 Deadline';
        const title = encodeURIComponent(safeTitle);
        const startDateStr = formatICalAllDayDate(deadlineDate);
        const endDateStr = formatICalAllDayDate(endDate);
        
        // Build description with sanitized content
        const safePeriodDescription = sanitizeUrlText(periodDescription);
        const description = encodeURIComponent(
            `Calculated deadline based on EU Regulation 1182/71\n\n` +
            `Period: ${safePeriodDescription}\n` +
            `Event Date: ${formatDate(result.eventDate)}\n` +
            `Calculated End Date: ${formatDateTime(result.finalEndDate)}\n\n` +
            `Applied Rules: ${result.appliedRules.map(rule => sanitizeUrlText(rule)).join(', ')}\n\n` +
            `Generated by EU Periods Calculator`
        );
        
        return `https://outlook.live.com/calendar/0/deeplink/compose?subject=${title}&startdt=${startDateStr}&enddt=${endDateStr}&allday=true&body=${description}`;
    } else {
        // Period view - all day event
        const startDate = new Date(result.eventDate);
        const endDate = new Date(result.finalEndDate);
        endDate.setDate(endDate.getDate() + 1); // Outlook expects end date to be exclusive
        
        // Sanitize and encode for URL
        const safeName = sanitizeUrlText(deadlineName) || 'Legal Deadline';
        const title = encodeURIComponent(`EU Period: ${safeName}`);
        const startDateStr = formatICalAllDayDate(startDate);
        const endDateStr = formatICalAllDayDate(endDate);
        
        // Build description with sanitized content
        const safePeriodDescription = sanitizeUrlText(periodDescription);
        const description = encodeURIComponent(
            `EU Regulation 1182/71 Period Calculation\n\n` +
            `Period: ${safePeriodDescription}\n` +
            `Start (Event Date): ${formatDate(result.eventDate)}\n` +
            `End (Deadline): ${formatDateTime(result.finalEndDate)}\n\n` +
            `Applied Rules: ${result.appliedRules.map(rule => sanitizeUrlText(rule)).join(', ')}\n\n` +
            `This event spans the entire calculated period.\n\n` +
            `Generated by EU Periods Calculator`
        );
        
        return `https://outlook.live.com/calendar/0/deeplink/compose?subject=${title}&startdt=${startDateStr}&enddt=${endDateStr}&allday=true&body=${description}`;
    }
}

// Modal functions
function openCalendarModal() {
    if (!window.currentCalculationResult) return;
    
    const modal = document.getElementById('calendarModal');
    modal.style.display = 'flex';
    
    // Set focus to event name input and populate from permalink if available
    setTimeout(() => {
        const eventNameInput = document.getElementById('modalDeadlineName');
        if (window.permalinkEventName && !eventNameInput.value) {
            eventNameInput.value = window.permalinkEventName;
        }
        eventNameInput.focus();
    }, 100);
}

function closeCalendarModal() {
    const modal = document.getElementById('calendarModal');
    modal.style.display = 'none';
}

// Modal export handler
function handleModalExport(exportType, format) {
    if (!window.currentCalculationResult) return;
    
    const deadlineNameInput = document.getElementById('modalDeadlineName');
    const deadlineName = deadlineNameInput.value || '';
    
    // Validate event name client-side
    const validation = validateEventName(deadlineName);
    if (!validation.valid) {
        // Show error message
        showValidationError(deadlineNameInput, validation.error);
        return;
    }
    
    // Clear any existing validation errors
    clearValidationError(deadlineNameInput);
    
    const periodValue = document.getElementById('periodValue').value;
    const periodType = document.getElementById('periodType').value;
    const periodDescription = `${periodValue} ${periodType}`;
    
    // Use the validated/sanitized name
    const safeDeadlineName = validation.sanitized;
    
    if (exportType === 'deadline') {
        if (format === 'ical') {
            const icalContent = generateDeadlineICalEvent(window.currentCalculationResult, safeDeadlineName, periodDescription);
            const filename = `eu-deadline-${new Date().toISOString().split('T')[0]}.ics`;
            downloadICalFile(icalContent, filename);
        } else if (format === 'google') {
            const googleLink = generateGoogleCalendarLink(window.currentCalculationResult, safeDeadlineName, periodDescription, true);
            window.open(googleLink, '_blank', 'noopener');
        } else if (format === 'outlook') {
            const outlookLink = generateOutlookWebLink(window.currentCalculationResult, safeDeadlineName, periodDescription, true);
            window.open(outlookLink, '_blank', 'noopener');
        }
    } else if (exportType === 'period') {
        if (format === 'ical') {
            const icalContent = generatePeriodICalEvent(window.currentCalculationResult, safeDeadlineName, periodDescription);
            const filename = `eu-period-${new Date().toISOString().split('T')[0]}.ics`;
            downloadICalFile(icalContent, filename);
        } else if (format === 'google') {
            const googleLink = generateGoogleCalendarLink(window.currentCalculationResult, safeDeadlineName, periodDescription, false);
            window.open(googleLink, '_blank', 'noopener');
        } else if (format === 'outlook') {
            const outlookLink = generateOutlookWebLink(window.currentCalculationResult, safeDeadlineName, periodDescription, false);
            window.open(outlookLink, '_blank', 'noopener');
        }
    }
    
    // Close modal after export
    closeCalendarModal();
}

// Function to show validation error
function showValidationError(inputElement, errorMessage) {
    // Remove any existing error
    clearValidationError(inputElement);
    
    // Add error styling
    inputElement.style.borderColor = '#dc3545';
    inputElement.style.backgroundColor = '#fff5f5';
    
    // Create error message element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'validation-error';
    errorDiv.style.cssText = `
        color: #dc3545;
        font-size: 12px;
        margin-top: 4px;
        padding: 2px 0;
    `;
    errorDiv.textContent = errorMessage;
    
    // Insert error message after the input
    inputElement.parentNode.insertBefore(errorDiv, inputElement.nextSibling);
    
    // Focus the input
    inputElement.focus();
}

// Function to clear validation error
function clearValidationError(inputElement) {
    // Reset input styling
    inputElement.style.borderColor = '';
    inputElement.style.backgroundColor = '';
    
    // Remove error message
    const errorDiv = inputElement.parentNode.querySelector('.validation-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Browser-only code
if (typeof document !== 'undefined') {
    // Close modal when clicking outside
    document.addEventListener('click', function(event) {
        const modal = document.getElementById('calendarModal');
        if (event.target === modal) {
            closeCalendarModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeCalendarModal();
        }
    });
}

// Function to handle form submission
function handleSubmit(event) {
    event.preventDefault();
    
    const eventDate = document.getElementById('eventDate').value;
    const eventTime = document.getElementById('eventTime').value;
    const periodValue = parseInt(document.getElementById('periodValue').value);
    const periodType = document.getElementById('periodType').value;
    
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
    const resultContainer = document.getElementById('result');
    resultContainer.innerHTML = ''; // Clear previous content
    resultContainer.appendChild(createResultElement(result));
}

// Permalink functionality
function generatePermalink(includeEventName = false) {
    if (typeof window === 'undefined') return '';
    
    const params = new URLSearchParams();
    
    // Get current form values
    const eventDate = document.getElementById('eventDate')?.value;
    const eventTime = document.getElementById('eventTime')?.value;
    const periodValue = document.getElementById('periodValue')?.value;
    const periodType = document.getElementById('periodType')?.value;
    
    // Add required parameters
    if (eventDate) params.set('date', eventDate);
    if (eventTime) params.set('time', eventTime);
    if (periodValue) params.set('period', periodValue);
    if (periodType) params.set('type', periodType);
    
    // Add settings
    if (selectedHolidaySystem !== 'EP') params.set('holidays', sanitizeHolidaySystem(selectedHolidaySystem));
    if (dateFormat !== 'dmy-text') params.set('format', sanitizeDateFormat(dateFormat));
    
    // Add event name if requested and available
    if (includeEventName) {
        const eventName = document.getElementById('modalDeadlineName')?.value;
        if (eventName) {
            const safeName = sanitizeUrlText(eventName);
            params.set('name', safeName);
        }
    }
    
    const baseUrl = window.location.origin + window.location.pathname;
    return params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;
}

function updateUrlFromForm() {
    if (typeof window === 'undefined' || typeof history === 'undefined') return;
    
    const permalink = generatePermalink();
    const newUrl = permalink;
    
    // Only update if URL would actually change
    if (newUrl !== window.location.href) {
        history.replaceState(null, '', newUrl);
    }
}

function loadStateFromUrl() {
    if (typeof window === 'undefined') return false;
    
    const urlParams = new URLSearchParams(window.location.search);
    let hasParams = false;
    
    // Load form values from URL
    const eventDate = urlParams.get('date');
    const eventTime = urlParams.get('time');
    const periodValue = urlParams.get('period');
    const periodType = urlParams.get('type');
    const eventName = urlParams.get('name');
    
    if (eventDate) {
        const eventDateInput = document.getElementById('eventDate');
        if (eventDateInput) {
            eventDateInput.value = eventDate;
            hasParams = true;
        }
    }
    
    if (eventTime) {
        const eventTimeInput = document.getElementById('eventTime');
        if (eventTimeInput) {
            eventTimeInput.value = eventTime;
            hasParams = true;
        }
    }
    
    if (periodValue) {
        const periodValueInput = document.getElementById('periodValue');
        if (periodValueInput) {
            periodValueInput.value = periodValue;
            hasParams = true;
        }
    }
    
    if (periodType) {
        const periodTypeSelect = document.getElementById('periodType');
        if (periodTypeSelect) {
            periodTypeSelect.value = periodType;
            hasParams = true;
        }
    }
    
    // Store event name for later use in modal
    if (eventName) {
        window.permalinkEventName = eventName;
        hasParams = true;
    }
    
    return hasParams;
}

function copyPermalinkToClipboard() {
    const permalink = generatePermalink(true); // Include event name if available
    
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(permalink).then(() => {
            showPermalinkFeedback('Permalink copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy permalink:', err);
            fallbackCopyToClipboard(permalink);
        });
    } else {
        fallbackCopyToClipboard(permalink);
    }
}

function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showPermalinkFeedback('Permalink copied to clipboard!');
        } else {
            showPermalinkFeedback('Failed to copy permalink. Please copy manually.');
            promptManualCopy(text);
        }
    } catch (err) {
        console.error('Fallback copy failed:', err);
        showPermalinkFeedback('Failed to copy permalink. Please copy manually.');
        promptManualCopy(text);
    } finally {
        document.body.removeChild(textArea);
    }
}

function promptManualCopy(text) {
    const input = prompt('Copy this permalink:', text);
    // User can select all and copy manually
}

function showPermalinkFeedback(message) {
    // Remove any existing feedback
    const existingFeedback = document.querySelector('.permalink-feedback');
    if (existingFeedback) {
        existingFeedback.remove();
    }
    
    // Create feedback element
    const feedback = document.createElement('div');
    feedback.className = 'permalink-feedback';
    feedback.textContent = message;
    feedback.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 10px 20px;
        border-radius: 4px;
        z-index: 1000;
        font-size: 14px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    `;
    
    document.body.appendChild(feedback);
    
    // Remove after 3 seconds
    setTimeout(() => {
        if (feedback.parentNode) {
            feedback.parentNode.removeChild(feedback);
        }
    }, 3000);
}

// Export for Node.js while preserving browser functionality
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        calculatePeriod,
        setHolidaySystem: function(system) {
            selectedHolidaySystem = sanitizeHolidaySystem(system);
        },
        getHolidaySystem: function() {
            return selectedHolidaySystem;
        },
        holidayData,
        getHolidayDataYears,
        checkHolidayDataCoverage,
        generateHolidayWarning
    };
} else if (typeof window !== 'undefined') {
    // Browser-specific code
    document.getElementById('periodForm').addEventListener('submit', handleSubmit);

    // Add event listener when the document is loaded
    document.addEventListener('DOMContentLoaded', function() {
        // Load state from URL first, then set defaults if no URL params
        const hasUrlParams = loadStateFromUrl();
        
        if (!hasUrlParams) {
            // Set default date to today only if no URL params
            const eventDateInput = document.getElementById('eventDate');
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            eventDateInput.value = `${year}-${month}-${day}`;
        }
        
        updateEventDateDisplay();
        const eventDateInput = document.getElementById('eventDate');
        eventDateInput.addEventListener('change', updateEventDateDisplay);
        eventDateInput.addEventListener('input', updateEventDateDisplay);
        
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

        // Settings panel handling
        const settingsBtn = document.getElementById('settings-btn');
        const settingsPanel = document.getElementById('settings-panel');
        const dateFormatSelect = document.getElementById('dateFormatSelect');
        const holidaySystemSelect = document.getElementById('holidaySystemSelect');

        if (dateFormatSelect) {
            dateFormatSelect.value = dateFormat;
            dateFormatSelect.addEventListener('change', function() {
                dateFormat = this.value;
                setCookie('dateFormat', dateFormat, 365);
                updateEventDateDisplay();
                updateCalculation();
            });
        }

        if (holidaySystemSelect) {
            holidaySystemSelect.value = selectedHolidaySystem;
            holidaySystemSelect.addEventListener('change', function() {
                selectedHolidaySystem = sanitizeHolidaySystem(this.value);
                setCookie('holidaySystem', selectedHolidaySystem, 365);
                updateCalculation();
            });
        }
        
        // Add real-time validation for modal event name input
        const modalEventNameInput = document.getElementById('modalDeadlineName');
        if (modalEventNameInput) {
            modalEventNameInput.addEventListener('input', function() {
                const validation = validateEventName(this.value);
                if (!validation.valid && this.value.length > 0) {
                    // Show validation error for non-empty invalid input
                    showValidationError(this, validation.error);
                } else {
                    // Clear any existing errors
                    clearValidationError(this);
                }
            });
            
            modalEventNameInput.addEventListener('paste', function(e) {
                // Validate pasted content after a short delay
                setTimeout(() => {
                    const validation = validateEventName(this.value);
                    if (!validation.valid && this.value.length > 0) {
                        showValidationError(this, validation.error);
                        // Replace content with sanitized version
                        this.value = validation.sanitized;
                    } else {
                        clearValidationError(this);
                    }
                }, 10);
            });
        }
        
        // If we loaded from URL and have an event name, populate the modal input
        if (window.permalinkEventName) {
            // We'll set this when the modal opens
        }

        if (settingsBtn && settingsPanel) {
            settingsBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                settingsPanel.classList.toggle('show');
            });

            document.addEventListener('click', function(e) {
                if (!settingsPanel.contains(e.target) && e.target !== settingsBtn) {
                    settingsPanel.classList.remove('show');
                }
            });
        }

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
        const resultContainer = document.getElementById('result');
        resultContainer.innerHTML = ''; // Clear previous content
        resultContainer.appendChild(createResultElement(result));
        
        // Update URL to reflect current calculation
        updateUrlFromForm();
    }

} 