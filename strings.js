// EU Regulation 1182/71 Date Calculator - Text Strings
// This file contains all user-facing strings for internationalization and maintainability

const strings = {
    // Article explanations and legal references
    articles: {
        article31Hours: "According to Article 3(1), the hour of the event ({eventHour}:00) is not counted. The period starts from the next hour ({startHour}:00).",
        article31HoursRetroactive: "According to Article 3(1), for retroactive calculation, the hour of the event ({eventHour}:00) is not counted. The period starts from the end of the previous hour ({startHour}:59) and counts backwards.",
        article31Days: "According to Article 3(1), the day of the event ({eventDate}) is not counted. The period starts from the next day ({startDate}).",
        article31DaysRetroactive: "According to Article 3(1), for retroactive calculation, the day of the event ({eventDate}) is not counted. The period starts from the end of the previous day ({startDate}) and counts backwards.",
        article35Extension: "According to Article 3(5), any period of two days or more must include at least two working days. The period only included {workingDaysCount} working day{plural}, so it has been extended {direction} to {extendedDate} to ensure at least two working days are included.",
        caseC17103: "According to <a href=\"https://eur-lex.europa.eu/legal-content/EN/ALL/?uri=CELEX:62003CJ0171\" target=\"_blank\" rel=\"noopener\">Case C-171/03</a>, for periods expressed in weeks, months, or years, Article 3(2)(c) takes precedence over Article 3(1). The period starts from the event day itself ({eventDate})."
    },

    // Applied rules descriptions
    appliedRules: {
        article31HourSkipped: "Article 3(1): Hour of event not counted, starting from next hour",
        article31HourSkippedRetroactive: "Article 3(1): Hour of event not counted, starting from end of previous hour for retroactive calculation",
        article31DaySkipped: "Article 3(1): Day of event not counted, starting from next day",
        article31DaySkippedRetroactive: "Article 3(1): Day of event not counted, starting from end of previous day for retroactive calculation",
        article32Hours: "Article 3(2)(a): {periodValue} hour {retroactive}period calculated",
        article32WorkingDays: "Article 3(2)(b): {periodValue} working days {retroactive}calculated",
        article32CalendarDays: "Article 3(2)(b): {periodValue} calendar days {retroactive}calculated",
        article32Weeks: "Article 3(2)(c) per Case C-171/03: {periodValue} weeks {retroactive}calculated, ending on same day of week as event",
        article32Months: "Article 3(2)(c) per Case C-171/03: {periodValue} months {retroactive}calculated, ending on same date as event",
        article32Years: "Article 3(2)(c) per Case C-171/03: {periodValue} years {retroactive}calculated, ending on same date as event",
        article34Extension: "Article 3(4): End date falls on non-working day, extended to next working day",
        article34ExtensionDetails: "- Previous end date: {previousDate}\n- Extended to: {extendedDate}",
        article35Extension: "Article 3(5): Period extended {direction} to ensure at least two working days",
        article35ExtensionDetails: "- Original {startOrEnd} date: {originalDate}\n- Extended to: {extendedDate}",
        caseC17103Precedence: "Case C-171/03: For weeks/months/years, period starts from the event day itself (Article 3(2)(c) takes precedence over Article 3(1))"
    },

    // Holiday data warnings
    holidayWarnings: {
        memberStateWarning: "⚠️ <strong>Public Holiday Data Warning:</strong> Public holiday data for {systemName} is not available for {missingYears}. Only Sundays and Saturdays are treated as non-working days for the missing period{plural}. Available data covers: {availableYears}.",
        memberStateWarningSingle: "⚠️ <strong>Public Holiday Data Warning:</strong> Public holiday data for {systemName} is not available for {missingYears}. Only Sundays and Saturdays are treated as non-working days for the missing period{plural}. Available data covers: {availableYears}.",
        epWarning: "⚠️ <strong>Public Holiday Data Warning:</strong> Complete public holiday data for {systemName} is not available for {missingYears}. Only New Year week holidays may be included for the missing year{plural}. Other public holidays are not accounted for. Available data covers: {availableYears}.",
        epWarningSingle: "⚠️ <strong>Public Holiday Data Warning:</strong> Complete public holiday data for {systemName} is not available for {missingYears}. Only New Year week holidays may be included for the missing year{plural}. Other public holidays are not accounted for. Available data covers: {availableYears}."
    },

    // Holiday system names
    holidaySystems: {
        'EP': 'European Parliament',
        'EC': 'European Commission',
        'AT': 'Austria', 'BE': 'Belgium', 'BG': 'Bulgaria', 'HR': 'Croatia', 'CY': 'Cyprus',
        'CZ': 'Czech Republic', 'DK': 'Denmark', 'EE': 'Estonia', 'FI': 'Finland', 'FR': 'France',
        'DE': 'Germany', 'EL': 'Greece', 'HU': 'Hungary', 'IE': 'Ireland', 'IT': 'Italy',
        'LV': 'Latvia', 'LT': 'Lithuania', 'LU': 'Luxembourg', 'MT': 'Malta', 'NL': 'Netherlands',
        'PL': 'Poland', 'PT': 'Portugal', 'RO': 'Romania', 'SK': 'Slovakia', 'SI': 'Slovenia',
        'ES': 'Spain', 'SE': 'Sweden'
    },

    // UI Labels and descriptions
    ui: {
        endDateLabel: "End Date: {endDate}",
        holidaySystemInfo: "Using {systemName} public holidays",
        eventTimeRequired: "Only required for hour-based calculations",
        eventNamePlaceholder: "e.g., Response deadline for Case XYZ",
        eventNameDescription: "This will appear as the event title in your calendar (max 100 characters)",
        deadlineExportTitle: "Deadline Export (Recommended)",
        deadlineExportDescription: "All-day event on deadline with 1-day advance reminder",
        periodExportTitle: "Period Export",
        periodExportDescription: "Multi-day event spanning entire calculation period",
        permalinkCopied: "Permalink copied to clipboard!",
        permalinkFailed: "Failed to copy permalink. Please copy manually.",
        reminderText: "Reminder: {eventName}",
        validationErrorInvalidChars: "Event name contains invalid characters or patterns.",
        validationErrorTooManySpecialChars: "Event name contains too many special characters.",
        validationErrorTooLong: "Event name is too long (maximum 100 characters)."
    },

    // Calendar export descriptions
    calendar: {
        deadlineDescription: "Calculated deadline based on EU Regulation 1182/71\\n\\nPeriod: {periodDescription}\\nEvent Date: {eventDate}\\nCalculated End Date: {calculatedEndDate}\\n\\nApplied Rules:\\n{appliedRules}\\n\\nGenerated by https://time-limits.bdamokos.org",
        periodDescription: "EU Regulation 1182/71 Period Calculation\\n\\nPeriod: {periodDescription}\\nStart (Event Date): {startDate}\\nEnd (Deadline): {endDate}\\n\\nApplied Rules:\\n{appliedRules}\\n\\nThis event spans the entire calculated period.\\n\\nGenerated by https://time-limits.bdamokos.org",
        googleCalendarDescription: "Calculated deadline based on EU Regulation 1182/71\\n\\nPeriod: {periodDescription}\\nEvent Date: {eventDate}\\nCalculated End Date: {calculatedEndDate}\\n\\nApplied Rules: {appliedRules}\\n\\nGenerated by https://time-limits.bdamokos.org",
        googleCalendarPeriodDescription: "EU Regulation 1182/71 Period Calculation\\n\\nPeriod: {periodDescription}\\nStart (Event Date): {startDate}\\nEnd (Deadline): {endDate}\\n\\nApplied Rules: {appliedRules}\\n\\nThis event spans the entire calculated period.\\n\\nGenerated by https://time-limits.bdamokos.org"
    },

    // Footer and legal information
    footer: {
        disclaimer: "⚠️ Disclaimer:",
        disclaimerText: "This website is for educational purposes only and is not legal advice on the interpretation or applicability of EU law. The calculations provided are based on the text of Regulation (EEC, Euratom) No 1182/71 and should not be relied upon for legal purposes.",
        regulationDescription: "This calculator implements {regulationLink}, which determines the rules applicable to periods, dates and time limits in EU law.", 
        regulationTitle: "Regulation (EEC, Euratom) No 1182/71 of the Council of 3 June 1971 determining the rules applicable to periods, dates and time limits",
        holidayDataSources: "Holiday Data Sources:",
        memberStatesSource: "EU Member States public holidays 2025: {sourceLink}",
        memberStates2026Source: "EU Member States public holidays 2026: {sourceLink}",
        epSource: "European Parliament holidays 2025: {sourceLink}",
        ep2026Source: "European Parliament holidays 2026: {sourceLink}",
        ecSource: "European Commission holidays 2025: {sourceLink}",
        ec2026Source: "European Commission holidays 2026: {sourceLink}",
        githubLink: "View source code on GitHub"
    },

    // Calendar legend
    legend: {
        startOfPeriod: "Start of period",
        endOfPeriod: "End of period",
        eventDate: "Event Date",
        startEventDate: "Start + Event Date",
        workingDay: "Working Day",
        holiday: "Holiday",
        weekend: "Weekend",
        inPeriod: "In Period",
        extension: "Extension",
        today: "Today"
    }
};

// Export for Node.js and browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = strings;
} else if (typeof window !== 'undefined') {
    window.strings = strings;
} 
