# CruxCalc E2E Testing with Playwright

This project uses Playwright for comprehensive end-to-end testing of all calculator functionality.

## Test Structure

```
tests/
├── calculators/           # Individual calculator tests
│   ├── bmi.spec.js       # BMI Calculator tests
│   ├── body-fat.spec.js  # Body Fat Calculator tests
│   ├── one-rep-max.spec.js # 1RM Calculator tests
│   └── running-pace.spec.js # Running Pace Calculator tests
├── integration/          # Cross-calculator integration tests
│   └── shared-values.spec.js # SharedValues synchronization tests
└── quality/             # Performance & accessibility tests
    └── performance-accessibility.spec.js
```

## Running Tests

### Prerequisites

```bash
npm install
npx playwright install
```

### Test Commands

```bash
# Run all tests headlessly
npm run test

# Run tests in headed mode (see browser)
npm run test:headed

# Run tests with interactive UI
npm run test:ui

# Run tests in debug mode
npm run test:debug

# Show test results report
npm run test:report

# Run specific test file
npx playwright test tests/calculators/bmi.spec.js

# Run tests on specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Run tests on mobile
npx playwright test --project="Mobile Chrome"
npx playwright test --project="Mobile Safari"
```

## Test Coverage

### Individual Calculator Tests

- ✅ **BMI Calculator**: Unit conversions, BMI categories, height formatting
- ✅ **Body Fat Calculator**: Navy method formulas, gender-specific inputs, unit conversions
- ✅ **1RM Calculator**: Multiple formulas (Epley, Brzycki, Lombardi), weight/rep inputs
- ✅ **Running Pace Calculator**: Pace formatting, race time calculations, pace categories

### Integration Tests

- ✅ **SharedValues Synchronization**: Height, weight, gender, unit preferences across calculators
- ✅ **localStorage Persistence**: Value retention across browser sessions
- ✅ **Cross-Calculator Navigation**: Value preservation when switching between calculators

### Quality Assurance Tests

- ✅ **Performance**: Load times < 3s, input response < 500ms, rapid input handling
- ✅ **Accessibility**: ARIA attributes, keyboard navigation, screen reader support
- ✅ **Mobile Responsiveness**: Touch interactions, multiple viewport sizes
- ✅ **Error Handling**: Boundary value testing, network interruption handling

## Test Configuration

### Browsers Tested

- **Chromium** (Chrome/Edge)
- **Firefox**
- **WebKit** (Safari)
- **Mobile Chrome** (Pixel 5)
- **Mobile Safari** (iPhone 12)

### Test Features

- **Automatic Screenshot** on test failure
- **Video Recording** on failure
- **Trace Collection** for debugging
- **Parallel Execution** for faster runs
- **HTML Report** generation

## CI/CD Integration

Tests automatically run on:

- Push to `main` or `refactor` branches
- Pull requests to `main` branch

GitHub Actions workflow includes:

- Dependency installation
- Playwright browser setup
- Application build
- Cross-browser test execution
- Test report artifacts

## Writing New Tests

### Test File Template

```javascript
import { test, expect } from "@playwright/test";

test.describe("Calculator Name", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/calculator-path");
		await page.waitForLoadState("networkidle");
	});

	test("should load with default values", async ({ page }) => {
		// Test implementation
	});

	test("should calculate correctly", async ({ page }) => {
		// Test implementation
	});

	test("should handle unit conversions", async ({ page }) => {
		// Test implementation
	});
});
```

### Selector Strategy

1. **Prefer test IDs**: `[data-testid="element-id"]`
2. **Use element IDs**: `#element-id`
3. **CSS selectors**: `.class-name`
4. **Text content**: `page.getByText('text')`

### Best Practices

1. **Wait for networkidle** after navigation
2. **Add timeouts** after input changes for calculation updates
3. **Test edge cases** (min/max values)
4. **Verify cross-browser compatibility**
5. **Include mobile responsiveness tests**

## Debugging Tests

### View Test Execution

```bash
# Run with browser visible
npm run test:headed

# Interactive mode with test steps
npm run test:ui

# Debug specific test with breakpoints
npm run test:debug -- tests/calculators/bmi.spec.js
```

### Test Artifacts

- **Screenshots**: Available on test failure
- **Videos**: Recorded for failed tests
- **Traces**: Full execution traces for debugging
- **HTML Report**: Detailed test results with artifacts

## Performance Benchmarks

### Load Time Targets

- **Initial Page Load**: < 3 seconds
- **Input Response**: < 500ms
- **Unit Toggle**: < 300ms
- **Calculator Switch**: < 2 seconds

### Accessibility Requirements

- **WCAG AA Compliance**: Color contrast, keyboard navigation
- **Screen Reader Support**: Proper ARIA labels and announcements
- **Mobile Touch**: All interactive elements > 44px touch target

## Test Data Validation

All calculator formulas are validated against expected outputs:

- **BMI**: Standard BMI formula verification
- **Body Fat**: Navy method formula accuracy
- **1RM**: Epley, Brzycki, and Lombardi formula validation
- **Running Pace**: Race time calculation verification

## Maintenance

### Regular Test Updates

- Add tests for new calculator features
- Update selectors if UI components change
- Validate calculation accuracy against external sources
- Monitor performance benchmarks over time

### Test Review Process

- All new calculators must include comprehensive E2E tests
- Tests must pass on all supported browsers
- Performance benchmarks must be maintained
- Accessibility standards must be verified
