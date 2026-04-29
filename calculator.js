const HOLIDAY_DATA_DIRECTORY = 'holiday-data';

export const AVAILABLE_HOLIDAY_SYSTEMS = [
    'AT', 'BE', 'BG', 'CY', 'CZ', 'DE', 'DK', 'EC', 'EE', 'EL', 'EP', 'ES', 'FI', 'FR', 'HR', 'HU', 'IE', 'IT', 'LT', 'LU', 'LV', 'MT', 'NL', 'PL', 'PT', 'RO', 'SE', 'SI', 'SK'
];

export const AVAILABLE_PERIOD_TYPES = ['hours', 'working-days', 'days', 'weeks', 'months', 'years'];
export const DEFAULT_HOLIDAY_SYSTEM = 'EP';
export const DEFAULT_DATE_FORMAT = 'dmy-text';

const holidayDataFiles = {};
const holidayDataFilePromises = {};
const availableYearsCache = {};
const holidayDataSetsBySystem = {};

function interpolateString(template, params) {
    return template.replace(/\{(\w+)\}/g, (match, key) => {
        return params[key] !== undefined ? params[key] : match;
    });
}

function isNodeEnvironment() {
    return typeof process !== 'undefined' && Boolean(process.versions?.node);
}

function sanitizeHolidaySystem(value) {
    return AVAILABLE_HOLIDAY_SYSTEMS.includes(value) ? value : DEFAULT_HOLIDAY_SYSTEM;
}

function sanitizePeriodType(value) {
    return AVAILABLE_PERIOD_TYPES.includes(value) ? value : null;
}

function sanitizeDateFormat(value) {
    const allowedFormats = ['mdy-slash', 'dmy-slash', 'iso', 'long', 'dmy', 'dmy-text'];
    return allowedFormats.includes(value) ? value : DEFAULT_DATE_FORMAT;
}

function getHolidayDataUrl(holidaySystem, holidayDataBaseUrl) {
    const base = holidayDataBaseUrl || `./${HOLIDAY_DATA_DIRECTORY}/`;
    return new URL(`${holidaySystem}.json`, new URL(base, import.meta.url));
}

async function loadHolidayDataFile(holidaySystem, holidayDataBaseUrl) {
    const targetSystem = sanitizeHolidaySystem(holidaySystem);
    const cacheKey = `${holidayDataBaseUrl || ''}:${targetSystem}`;

    if (holidayDataFiles[cacheKey]) {
        return holidayDataFiles[cacheKey];
    }

    if (holidayDataFilePromises[cacheKey]) {
        return holidayDataFilePromises[cacheKey];
    }

    holidayDataFilePromises[cacheKey] = (async () => {
        let data = {};

        try {
            const fileUrl = getHolidayDataUrl(targetSystem, holidayDataBaseUrl);

            if (isNodeEnvironment() && fileUrl.protocol === 'file:') {
                const fs = await import('node:fs/promises');
                data = JSON.parse(await fs.readFile(fileUrl, 'utf8'));
            } else {
                const response = await fetch(fileUrl.href);
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                data = await response.json();
            }
        } catch (error) {
            data = {};
        }

        holidayDataFiles[cacheKey] = data || {};
        availableYearsCache[cacheKey] = Object.keys(holidayDataFiles[cacheKey])
            .map(year => parseInt(year, 10))
            .filter(year => !Number.isNaN(year))
            .sort((a, b) => a - b);

        delete holidayDataFilePromises[cacheKey];
        return holidayDataFiles[cacheKey];
    })();

    return holidayDataFilePromises[cacheKey];
}

async function ensureHolidayYearLoaded(holidaySystem, year, holidayDataBaseUrl) {
    const targetSystem = sanitizeHolidaySystem(holidaySystem);
    const cacheKey = `${holidayDataBaseUrl || ''}:${targetSystem}`;

    if (!year) {
        return;
    }

    if (!holidayDataSetsBySystem[cacheKey]) {
        holidayDataSetsBySystem[cacheKey] = {};
    }

    if (holidayDataSetsBySystem[cacheKey][year]) {
        return;
    }

    const data = await loadHolidayDataFile(targetSystem, holidayDataBaseUrl);
    const yearDates = data[String(year)];
    holidayDataSetsBySystem[cacheKey][year] = new Set(Array.isArray(yearDates) ? yearDates : []);
}

async function ensureHolidayYearsLoaded(holidaySystem, years, holidayDataBaseUrl) {
    await Promise.all(years.map(year => ensureHolidayYearLoaded(holidaySystem, year, holidayDataBaseUrl)));
}

export async function getHolidayDatesForYear(holidaySystem, year, options = {}) {
    const targetSystem = sanitizeHolidaySystem(holidaySystem);
    const data = await loadHolidayDataFile(targetSystem, options.holidayDataBaseUrl);
    const yearDates = data[String(year)];
    return Array.isArray(yearDates) ? yearDates : [];
}

export async function getHolidayDataYears(holidaySystem, options = {}) {
    const targetSystem = sanitizeHolidaySystem(holidaySystem);
    const cacheKey = `${options.holidayDataBaseUrl || ''}:${targetSystem}`;
    await loadHolidayDataFile(targetSystem, options.holidayDataBaseUrl);
    return availableYearsCache[cacheKey] || [];
}

async function isHoliday(date, holidaySystem, holidayDataBaseUrl) {
    if (Number.isNaN(date.getTime())) {
        return false;
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    const targetSystem = sanitizeHolidaySystem(holidaySystem);
    const cacheKey = `${holidayDataBaseUrl || ''}:${targetSystem}`;

    await ensureHolidayYearLoaded(targetSystem, year, holidayDataBaseUrl);
    return holidayDataSetsBySystem[cacheKey]?.[year]?.has(dateString) || false;
}

function isWeekend(date) {
    const day = date.getDay();
    return day === 0 || day === 6;
}

async function isWorkingDay(date, holidaySystem, holidayDataBaseUrl) {
    if (isWeekend(date)) return false;
    return !(await isHoliday(date, holidaySystem, holidayDataBaseUrl));
}

async function findNextWorkingDay(date, holidaySystem, holidayDataBaseUrl) {
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    while (!(await isWorkingDay(nextDay, holidaySystem, holidayDataBaseUrl))) {
        nextDay.setDate(nextDay.getDate() + 1);
    }
    return nextDay;
}

function getYearsInRange(startDate, endDate) {
    const years = [];
    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();
    for (let year = startYear; year <= endYear; year++) {
        years.push(year);
    }
    return years;
}

export function parseLocalDate(dateString) {
    if (!dateString || !/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return null;

    const [year, month, day] = dateString.split('-').map(part => parseInt(part, 10));
    if ([year, month, day].some(value => Number.isNaN(value))) {
        return null;
    }

    const date = new Date(year, month - 1, day);
    date.setHours(0, 0, 0, 0);
    return date;
}

export function createEventDateTime(dateString, timeString) {
    const date = parseLocalDate(dateString);
    if (!date) return null;

    if (timeString) {
        if (!/^\d{2}:\d{2}$/.test(timeString)) return null;
        const [hours, minutes] = timeString.split(':').map(part => parseInt(part, 10));
        if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
        date.setHours(hours, minutes, 0, 0);
    }

    return date;
}

export function formatDate(date, format = DEFAULT_DATE_FORMAT) {
    const dateFormat = sanitizeDateFormat(format);

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

export function formatDateTime(date, format = DEFAULT_DATE_FORMAT) {
    const timeStr = date.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
    const dateStr = formatDate(date, format);
    return sanitizeDateFormat(format) === 'iso' ? `${dateStr} ${timeStr}` : `${dateStr}, ${timeStr}`;
}

export async function checkHolidayDataCoverage(startDate, endDate, holidaySystem, options = {}) {
    const targetSystem = sanitizeHolidaySystem(holidaySystem);
    const availableYears = await getHolidayDataYears(targetSystem, options);
    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();
    const missingYears = [];

    for (let year = startYear; year <= endYear; year++) {
        if (targetSystem === DEFAULT_HOLIDAY_SYSTEM) {
            const yearHolidays = await getHolidayDatesForYear(targetSystem, year, options);

            if (yearHolidays.length === 0) {
                missingYears.push(year);
            } else {
                const hasOnlyNewYearDays = yearHolidays.every(dateStr => {
                    const date = dateStr.split('-');
                    return date[1] === '01' && parseInt(date[2], 10) <= 7;
                });

                if (hasOnlyNewYearDays) {
                    const yearEarlyJan = new Date(year, 0, 7, 23, 59, 59, 999);
                    const periodEndInYear = year === endYear ? endDate : new Date(year, 11, 31, 23, 59, 59, 999);

                    if (periodEndInYear > yearEarlyJan) {
                        missingYears.push(year);
                    }
                }
            }
        } else if (!availableYears.includes(year)) {
            missingYears.push(year);
        }
    }

    return {
        isComplete: missingYears.length === 0,
        missingYears,
        availableYears
    };
}

export function generateHolidayWarning(coverage, holidaySystem) {
    if (coverage.isComplete) {
        return null;
    }

    const missingYearsStr = coverage.missingYears.join(', ');
    const availableYearsStr = coverage.availableYears.length > 0 ? coverage.availableYears.join(', ') : 'none';
    const systemName = sanitizeHolidaySystem(holidaySystem);

    if (systemName === DEFAULT_HOLIDAY_SYSTEM) {
        return `Complete public holiday data for ${systemName} is not available for ${missingYearsStr}. Only New Year week holidays may be included for the missing year. Available data covers: ${availableYearsStr}.`;
    }

    return `Complete public holiday data for ${systemName} is not available for ${missingYearsStr}. Available data covers: ${availableYearsStr}.`;
}

export async function calculatePeriod(eventDateTime, periodValue, periodType, options = {}) {
    const holidaySystem = sanitizeHolidaySystem(options.holidays || options.holidaySystem || DEFAULT_HOLIDAY_SYSTEM);
    const dateFormat = sanitizeDateFormat(options.format || DEFAULT_DATE_FORMAT);
    const holidayDataBaseUrl = options.holidayDataBaseUrl;
    const type = sanitizePeriodType(periodType);

    if (!type) {
        throw new Error(`periodType must be one of: ${AVAILABLE_PERIOD_TYPES.join(', ')}`);
    }

    if (!(eventDateTime instanceof Date) || Number.isNaN(eventDateTime.getTime())) {
        throw new Error('eventDateTime must be a valid Date');
    }

    if (!Number.isInteger(periodValue) || periodValue === 0) {
        throw new Error('periodValue must be a non-zero integer');
    }

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

    await ensureHolidayYearLoaded(holidaySystem, result.eventDate.getFullYear(), holidayDataBaseUrl);

    let startDate = new Date(eventDateTime);

    if (type === 'hours') {
        startDate.setMinutes(0, 0, 0);
        if (isRetroactive) {
            startDate.setHours(startDate.getHours() - 1);
            startDate.setMinutes(59, 59, 999);
            result.appliedRules.push('Article 3(1): Event hour not counted for retroactive period');
        } else {
            startDate.setHours(startDate.getHours() + 1);
            result.appliedRules.push('Article 3(1): Event hour not counted');
        }
    } else if (type === 'weeks' || type === 'months' || type === 'years') {
        startDate.setHours(0, 0, 0, 0);
        result.appliedRules.push('Case C-171/03: Weeks, months and years run from the event day');
        result.explanation.push(interpolateString('The period runs from the event day itself ({eventDate}).', {
            eventDate: formatDate(startDate, dateFormat)
        }));
    } else if (isRetroactive) {
        startDate.setDate(startDate.getDate() - 1);
        startDate.setHours(23, 59, 59, 999);
        result.appliedRules.push('Article 3(1): Event day not counted for retroactive period');
    } else {
        startDate.setDate(startDate.getDate() + 1);
        startDate.setHours(0, 0, 0, 0);
        result.appliedRules.push('Article 3(1): Event day not counted');
        result.explanation.push(interpolateString('The period starts from the next day ({startDate}).', {
            startDate: formatDate(startDate, dateFormat)
        }));
    }

    result.startDate = new Date(startDate);

    let endDate = new Date(startDate);

    if (type === 'hours') {
        if (isRetroactive) {
            endDate.setHours(endDate.getHours() - absolutePeriodValue + 1);
            endDate.setMinutes(0, 0, 0);
        } else {
            endDate.setHours(endDate.getHours() + absolutePeriodValue - 1);
            endDate.setMinutes(59, 59, 999);
        }
        result.appliedRules.push(`Article 3(2)(a): ${absolutePeriodValue} hour period calculated`);
    } else if (type === 'working-days') {
        let remainingDays = absolutePeriodValue;
        const currentDate = new Date(startDate);

        if (isRetroactive) {
            while (remainingDays > 0) {
                currentDate.setDate(currentDate.getDate() - 1);
                if (await isWorkingDay(currentDate, holidaySystem, holidayDataBaseUrl)) {
                    remainingDays--;
                }
            }
            endDate = new Date(currentDate);
            endDate.setHours(0, 0, 0, 0);
        } else {
            while (remainingDays > 0) {
                if (await isWorkingDay(currentDate, holidaySystem, holidayDataBaseUrl)) {
                    remainingDays--;
                }
                if (remainingDays > 0) {
                    currentDate.setDate(currentDate.getDate() + 1);
                }
            }
            endDate = new Date(currentDate);
            endDate.setHours(23, 59, 59, 999);
        }
        result.appliedRules.push(`Article 3(2)(b): ${absolutePeriodValue} working day period calculated`);
    } else if (type === 'days') {
        if (isRetroactive) {
            endDate.setDate(endDate.getDate() - absolutePeriodValue + 1);
            endDate.setHours(0, 0, 0, 0);
        } else {
            endDate.setDate(endDate.getDate() + absolutePeriodValue - 1);
            endDate.setHours(23, 59, 59, 999);
        }
        result.appliedRules.push(`Article 3(2)(b): ${absolutePeriodValue} calendar day period calculated`);
    } else if (type === 'weeks') {
        endDate.setDate(endDate.getDate() + (isRetroactive ? -absolutePeriodValue * 7 : absolutePeriodValue * 7));
        endDate.setHours(isRetroactive ? 0 : 23, isRetroactive ? 0 : 59, isRetroactive ? 0 : 59, isRetroactive ? 0 : 999);
        result.appliedRules.push(`Article 3(2)(c): ${absolutePeriodValue} week period calculated`);
    } else if (type === 'months') {
        const originalDay = endDate.getDate();

        if (isRetroactive) {
            endDate.setMonth(endDate.getMonth() - absolutePeriodValue);
            if (endDate.getDate() !== originalDay) {
                endDate.setDate(0);
            }
            endDate.setHours(0, 0, 0, 0);
        } else {
            const targetMonth = (endDate.getMonth() + absolutePeriodValue) % 12;
            const targetYear = endDate.getFullYear() + Math.floor((endDate.getMonth() + absolutePeriodValue) / 12);
            endDate.setMonth(endDate.getMonth() + absolutePeriodValue);

            if (endDate.getMonth() !== targetMonth || endDate.getFullYear() !== targetYear) {
                endDate.setFullYear(targetYear);
                endDate.setMonth(targetMonth + 1, 0);
            }

            endDate.setHours(23, 59, 59, 999);
        }
        result.appliedRules.push(`Article 3(2)(c): ${absolutePeriodValue} month period calculated`);
    } else if (type === 'years') {
        const originalDay = endDate.getDate();
        const originalMonth = endDate.getMonth();

        endDate.setFullYear(endDate.getFullYear() + (isRetroactive ? -absolutePeriodValue : absolutePeriodValue));

        if (endDate.getDate() !== originalDay || endDate.getMonth() !== originalMonth) {
            endDate.setMonth(originalMonth + 1, 0);
        }

        endDate.setHours(isRetroactive ? 0 : 23, isRetroactive ? 0 : 59, isRetroactive ? 0 : 59, isRetroactive ? 0 : 999);
        result.appliedRules.push(`Article 3(2)(c): ${absolutePeriodValue} year period calculated`);
    }

    result.initialEndDate = new Date(endDate);

    if (type !== 'hours' && !isRetroactive && !(await isWorkingDay(endDate, holidaySystem, holidayDataBaseUrl))) {
        const nextWorkDay = await findNextWorkingDay(endDate, holidaySystem, holidayDataBaseUrl);
        nextWorkDay.setHours(23, 59, 59, 999);
        endDate = nextWorkDay;
        result.appliedRules.push('Article 3(4): End date extended to next working day');
    }

    if (type !== 'hours' && absolutePeriodValue >= 2) {
        let workingDays = 0;
        let currentDate = new Date(startDate);
        currentDate.setHours(0, 0, 0, 0);
        const endDateCopy = new Date(endDate);
        endDateCopy.setHours(23, 59, 59, 999);

        while (currentDate <= endDateCopy) {
            if (await isWorkingDay(currentDate, holidaySystem, holidayDataBaseUrl)) {
                workingDays++;
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }

        result.workingDaysCount = workingDays;

        if (workingDays < 2) {
            if (isRetroactive) {
                const prevWorkDay = new Date(startDate);
                prevWorkDay.setHours(0, 0, 0, 0);

                while (!(await isWorkingDay(prevWorkDay, holidaySystem, holidayDataBaseUrl))) {
                    prevWorkDay.setDate(prevWorkDay.getDate() - 1);
                }

                startDate = prevWorkDay;
                result.startDate = new Date(startDate);
                result.appliedRules.push('Article 3(5): Period extended backward to include at least two working days');
            } else {
                let nextWorkDay = await findNextWorkingDay(endDateCopy, holidaySystem, holidayDataBaseUrl);
                nextWorkDay.setHours(23, 59, 59, 999);

                const requiredAdditionalWorkingDays = 2 - workingDays;
                let foundAdditionalWorkingDays = 0;
                const currentWorkDay = new Date(nextWorkDay);

                while (foundAdditionalWorkingDays < requiredAdditionalWorkingDays) {
                    if (await isWorkingDay(currentWorkDay, holidaySystem, holidayDataBaseUrl)) {
                        foundAdditionalWorkingDays++;
                    }

                    if (foundAdditionalWorkingDays < requiredAdditionalWorkingDays) {
                        currentWorkDay.setDate(currentWorkDay.getDate() + 1);
                    }
                }

                endDate = new Date(currentWorkDay);
                endDate.setHours(23, 59, 59, 999);
                result.appliedRules.push('Article 3(5): Period extended forward to include at least two working days');
            }
        }
    }

    result.finalEndDate = endDate;

    const periodStart = new Date(Math.min(result.startDate, result.finalEndDate));
    const periodEnd = new Date(Math.max(result.startDate, result.finalEndDate));
    const years = getYearsInRange(periodStart, periodEnd);
    await ensureHolidayYearsLoaded(holidaySystem, years, holidayDataBaseUrl);

    const coverage = await checkHolidayDataCoverage(periodStart, periodEnd, holidaySystem, { holidayDataBaseUrl });
    if (!coverage.isComplete) {
        result.holidayDataWarning = generateHolidayWarning(coverage, holidaySystem);
    }

    return result;
}

function dateToJson(date) {
    return date instanceof Date && !Number.isNaN(date.getTime()) ? date.toISOString() : null;
}

export function serializeCalculationResult(result, options = {}) {
    const dateFormat = sanitizeDateFormat(options.format || DEFAULT_DATE_FORMAT);

    return {
        eventDate: dateToJson(result.eventDate),
        startDate: dateToJson(result.startDate),
        initialEndDate: dateToJson(result.initialEndDate),
        finalEndDate: dateToJson(result.finalEndDate),
        finalDate: result.finalEndDate ? formatDate(result.finalEndDate, dateFormat) : null,
        appliedRules: result.appliedRules,
        explanation: result.explanation,
        workingDaysCount: result.workingDaysCount,
        holidayDataWarning: result.holidayDataWarning
    };
}

export async function calculateDeadline(input = {}) {
    const errors = [];
    const date = input.date;
    const time = input.time || '';
    const period = Number.parseInt(input.period, 10);
    const type = sanitizePeriodType(input.type);
    const holidays = sanitizeHolidaySystem(input.holidays || input.holidaySystem || DEFAULT_HOLIDAY_SYSTEM);
    const format = sanitizeDateFormat(input.format || DEFAULT_DATE_FORMAT);

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        errors.push('date must be provided as YYYY-MM-DD');
    }

    if (!Number.isInteger(period) || period === 0) {
        errors.push('period must be a non-zero integer');
    }

    if (!type) {
        errors.push(`type must be one of: ${AVAILABLE_PERIOD_TYPES.join(', ')}`);
    }

    if (type === 'hours' && !time) {
        errors.push('time is required when type is hours');
    }

    const eventDateTime = errors.length === 0 ? createEventDateTime(date, time) : null;
    if (errors.length === 0 && !eventDateTime) {
        errors.push('date/time values are invalid');
    }

    const normalizedInput = {
        date,
        time: time || null,
        period: Number.isInteger(period) ? period : null,
        type,
        holidays,
        format
    };

    if (errors.length > 0) {
        return {
            ok: false,
            errors,
            input: normalizedInput
        };
    }

    const result = await calculatePeriod(eventDateTime, period, type, {
        holidays,
        format,
        holidayDataBaseUrl: input.holidayDataBaseUrl
    });

    return {
        ok: true,
        input: normalizedInput,
        result: serializeCalculationResult(result, { format })
    };
}
