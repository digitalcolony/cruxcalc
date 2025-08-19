# Testing & QA Guidelines

This document outlines lightweight testing and QA practices used in this project.

## Manual QA Checklist

- Verify each calculator loads and renders inputs/results
- Change slider values and confirm result updates in real-time
- Toggle units (imperial/metric) and confirm conversions are correct
- Navigate between calculators; confirm SharedValues persist height and weight
- Refresh pages; ensure values persist from localStorage
- Try boundary values (min/max) for each input
- Validate accessibility basics (labels, keyboard focus)

## Developer Checks

- Build locally before committing
- Keep console free of errors/warnings
- Add small in-page validators or assertions when debugging

## Performance Targets

- Initial page load: < 3 seconds on typical broadband
- Input response: ~instant (< 200ms perceived)

## Future Automation (Optional)

If automation is reintroduced later, prefer small, fast checks over large, brittle suites.
