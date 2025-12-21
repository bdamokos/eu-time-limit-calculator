# EU Date Calculator

A web-based calculator that implements date calculation rules according to [EU Regulation 1182/71](https://eur-lex.europa.eu/eli/reg/1971/1182/oj).

## Live Demo

Try it out: [EU Date Calculator on GitHub Pages](https://bdamokos.github.io/eu-time-limit-calculator/)

## Features

- Calculate end dates based on periods (hours, days, weeks, months, years)
- Support for working days calculation (excluding weekends and holidays)
- **Holiday System Selection**: Choose from EU Member State public holidays or EU institution calendars
  - All 27 EU Member States with official 2025 and 2026 public holidays
  - European Parliament holiday calendar
  - European Commission holiday calendar
- Visual calendar display showing period calculation with holidays highlighted
- Multiple date format options
- Retroactive period calculation support
- Not (yet) implemented: partial months

## Holiday Data Sources

The calculator uses official 2025 public holiday data from:

- **EU Member States**: [OJ C, C/2024/7517, 20.12.2024](https://eur-lex.europa.eu/eli/C/2024/7517/oj/eng)
- **European Parliament**: [Official Notice (Luxembourg, 25 July 2024)](https://www.europarl.europa.eu/traineeships/welcomePack/holidays-2025_en.pdf)
- **European Commission**: [OJ C, C/2024/2219, 22.3.2024](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=OJ:C_202402219)

2026 public holiday data from:
- **EU Member States**: [European Union Member State Public Holidays Recorded in CTIS, Year 2026 (EMA/240605/2025, 22 July 2025)](https://www.ema.europa.eu/en/documents/other/european-union-member-state-public-holidays-recorded-ctis-year-2026_en.pdf)
- **European Parliament**: [Official Notice (Luxembourg, 10 October 2025)](https://www.europarl.europa.eu/traineeships/welcomePack/holidays-2026_en.pdf)
- **European Commission**: [OJ C, C/2025/4103, 24.7.2025](https://eur-lex.europa.eu/eli/C/2025/4103/oj) 

## Usage

1. Select an event date and time
2. Choose period type (hours, days, working days, weeks, months, years) and value
3. Select appropriate holiday system in Settings (⚙️):
   - Choose your relevant EU Member State
   - Or select European Parliament/Commission for EU institutional work
4. Click "Calculate" to see the result with visual calendar

## Legal Implementation

This calculator implements the time calculation rules from **EU Regulation 1182/71**:

- **Article 3(1)**: Event day/hour exclusion
- **Article 3(2)**: Period calculation methods
- **Article 3(4)**: Extension to next working day when period ends on non-working day
- **Article 3(5)**: Minimum two working days requirement

**Court Interpretation**: The calculator incorporates the interpretation from [**Case C-171/03**](https://eur-lex.europa.eu/legal-content/EN/ALL/?uri=CELEX:62003CJ0171), which establishes that for periods expressed in weeks, months, or years, Article 3(2)(c) takes precedence over Article 3(1). This means such periods start from the event day itself rather than excluding it.

**Disclaimer**: For educational purposes only - not legal advice.
