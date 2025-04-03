# EU Date Calculator

This web application implements date calculation rules according to EU Regulation 1182/71, which establishes rules for calculating periods, dates, and time limits in EU legislation.

## Features

- Calculate end dates based on various period types (hours, days, weeks, months, years)
- Option to calculate based on working days only (excluding weekends and holidays)
- Implements the specific rules from EU Regulation 1182/71
- Modern, user-friendly interface
- Responsive design

## How to Use

1. Open `index.html` in a web browser
2. Select a start date and time
3. Choose the period type (hours, days, weeks, months, or years)
4. Enter the period value
5. Optionally check "Working Days Only" to exclude weekends and holidays
6. Click "Calculate End Date" to see the result

## Implementation Details

The calculator implements the following key provisions from EU Regulation 1182/71:

- Article 3: Rules for calculating periods
- Special handling for different period types
- Working days calculation (excluding weekends and holidays)
- Proper handling of month-end dates
- Article 3(4): Extension of periods ending on weekends or holidays to the next working day

### Key Rules Implemented

1. **Article 3(1)**: When calculating a period from an event, the day of the event is not counted
2. **Article 3(2)**: Periods include all days (including weekends and holidays) unless specified otherwise
3. **Article 3(4)**: If a period ends on a weekend or holiday, it is extended to the next working day
4. **Article 3(5)**: Periods of two days or more must include at least two working days

## Holiday Data

The calculator includes the official European Parliament calendar for 2025:
- Public holidays (New Year's Day, Good Friday, Easter Monday, etc.)
- Office closing days (days following New Year's Day, Maundy Thursday, etc.)
- National Days (Luxembourg, France, Belgium) - Note: these are considered holidays depending on the place of employment
- Christmas and New Year period closure
- Weekend detection (Saturday and Sunday)

Note: For officials and other servants employed in EP liaison offices, the national day of the country in which they work will be considered a public holiday if it falls on a working day.

## Technical Requirements

- Modern web browser with JavaScript enabled
- No server-side requirements
- No external dependencies

## Notes

- The calculator uses the local timezone of the user's browser
- All calculations are done client-side for privacy and speed

## License

This project is open source and available for public use. 