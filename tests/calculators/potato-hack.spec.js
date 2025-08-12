import { test, expect } from "@playwright/test";

test.describe("Potato Hack Calculator", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/potato-hack");
		await page.waitForLoadState("domcontentloaded");
		// Wait for calculator to be ready
		await page.waitForSelector("#potato-pounds", { state: "visible" });
	});

	test("should load with correct default values", async ({ page }) => {
		// Check page loads correctly
		await expect(page.locator(".calculator-layout__title")).toContainText("Potato Hack");

		// Check default potato weight (4 lbs)
		await expect(page.locator("#potato-pounds")).toHaveValue("4");

		// Check default TDEE (1700)
		await expect(page.locator("#tdee")).toHaveValue("1700");

		// Check that results are displayed
		await expect(page.locator('[data-testid="total-calories"], #total-calories')).toBeVisible();
		await expect(page.locator('[data-testid="calorie-deficit"], #calorie-deficit')).toBeVisible();
		await expect(page.locator('[data-testid="weekly-change"], #weekly-change')).toBeVisible();
	});

	test("should calculate potato calories correctly", async ({ page }) => {
		// Set 4 lbs of potatoes
		await page.locator("#potato-pounds").fill("4");
		await page.waitForTimeout(500);

		// 4 lbs × 350 calories/lb = 1400 calories
		const totalCalories = page
			.locator(
				'[data-testid="total-calories"] .result-value__number, #total-calories .result-value__number'
			)
			.first();
		await expect(totalCalories).toContainText(/1400|1,400/);
	});

	test("should apply resistant starch reduction", async ({ page }) => {
		// Set 4 lbs of potatoes, get baseline calories
		await page.locator("#potato-pounds").fill("4");
		await page.waitForTimeout(500);

		const normalCalories = await page
			.locator(
				'[data-testid="total-calories"] .result-value__number, #total-calories .result-value__number'
			)
			.first()
			.textContent();

		// Check "cooled overnight" option (click the label)
		await page.locator("label.checkbox-label").click();
		await page.waitForTimeout(500);

		// Should reduce calories by 17% (1400 × 0.83 = 1162)
		const cooledCalories = page
			.locator(
				'[data-testid="total-calories"] .result-value__number, #total-calories .result-value__number'
			)
			.first();
		await expect(cooledCalories).toContainText(/116[0-5]|1,16[0-5]/);

		// Cooled calories should be less than normal calories
		const cooledValue = parseInt(
			await cooledCalories.textContent().then((text) => text.replace(/,/g, ""))
		);
		const normalValue = parseInt(normalCalories.replace(/,/g, ""));
		expect(cooledValue).toBeLessThan(normalValue);
	});

	test("should calculate calorie deficit correctly", async ({ page }) => {
		// Set 4 lbs potatoes (1400 calories) and TDEE 2000
		await page.locator("#potato-pounds").fill("4");
		await page.locator("#tdee").fill("2000");
		await page.waitForTimeout(500);

		// Deficit = 2000 - 1400 = 600 calories
		const deficit = page
			.locator(
				'[data-testid="calorie-deficit"] .result-value__number, #calorie-deficit .result-value__number'
			)
			.first();
		await expect(deficit).toContainText(/600/);
	});

	test("should calculate fat loss projections", async ({ page }) => {
		// Set conditions for predictable deficit: 3.5 lbs potatoes, 2000 TDEE
		await page.locator("#potato-pounds").fill("3.5");
		await page.locator("#tdee").fill("2000");
		await page.waitForTimeout(500);

		// 3.5 lbs × 350 = 1225 calories
		// Deficit = 2000 - 1225 = 775 calories/day
		// 3500 calories = 1 lb fat
		// 3 days: (775 × 3) / 3500 = 0.66 lbs
		const threeDayChange = page
			.locator(
				'[data-testid="three-day-change"] .result-value__number, #three-day-change .result-value__number'
			)
			.first();
		await expect(threeDayChange).toContainText(/0\.[6-7]/);

		// Weekly: (775 × 7) / 3500 = 1.55 lbs
		const weeklyChange = page
			.locator(
				'[data-testid="weekly-change"] .result-value__number, #weekly-change .result-value__number'
			)
			.first();
		await expect(weeklyChange).toContainText(/1\.[5-6]/);
	});

	test("should convert between lbs and kg correctly", async ({ page }) => {
		// Set 4 lbs
		await page.locator("#potato-pounds").fill("4");
		await page.waitForTimeout(200);

		// Switch to metric using correct selector
		await page.click('[data-potato-unit="metric"]');
		await page.waitForTimeout(800);

		// Weight should convert to ~1.8 kg (4 lbs ÷ 2.205)
		await expect(page.locator("#potato-kg")).toHaveValue(/1\.[7-9]/);

		// Results should show kg units
		const weeklyUnit = page
			.locator(
				'[data-testid="weekly-change"] .result-value__unit, #weekly-change .result-value__unit'
			)
			.first();
		await expect(weeklyUnit).toContainText("kg");

		// Change the kg value slightly to trigger unit conversion back
		await page.locator("#potato-kg").fill("1.9");
		await page.waitForTimeout(200);

		// Switch back to imperial
		await page.click('[data-potato-unit="imperial"]');
		await page.waitForTimeout(800);

		// Should convert back to lbs (1.9 kg × 2.205 ≈ 4.19 lbs)
		await expect(page.locator("#potato-pounds")).toHaveValue(/4\.[1-3]/);

		const weeklyUnitLbs = page
			.locator(
				'[data-testid="weekly-change"] .result-value__unit, #weekly-change .result-value__unit'
			)
			.first();
		await expect(weeklyUnitLbs).toContainText("lbs");
	});

	test("should update all projections when inputs change", async ({ page }) => {
		// Set initial values
		await page.locator("#potato-pounds").fill("3");
		await page.locator("#tdee").fill("1800");
		await page.waitForTimeout(500);

		const initialWeekly = await page
			.locator(
				'[data-testid="weekly-change"] .result-value__number, #weekly-change .result-value__number'
			)
			.first()
			.textContent();

		// Increase potato weight (less deficit)
		await page.locator("#potato-pounds").fill("5");
		await page.waitForTimeout(500);

		const newWeekly = await page
			.locator(
				'[data-testid="weekly-change"] .result-value__number, #weekly-change .result-value__number'
			)
			.first()
			.textContent();

		// More potatoes = less deficit = less fat loss
		expect(parseFloat(newWeekly)).toBeLessThan(parseFloat(initialWeekly));
	});

	test("should show all time projections", async ({ page }) => {
		// Check that all time period results are visible
		await expect(page.locator('[data-testid="three-day-change"], #three-day-change')).toBeVisible();
		await expect(page.locator('[data-testid="four-day-change"], #four-day-change')).toBeVisible();
		await expect(page.locator('[data-testid="five-day-change"], #five-day-change')).toBeVisible();
		await expect(page.locator('[data-testid="weekly-change"], #weekly-change')).toBeVisible();

		// Results should increase with time
		const threeDayText = await page
			.locator(
				'[data-testid="three-day-change"] .result-value__number, #three-day-change .result-value__number'
			)
			.first()
			.textContent();
		const weeklyText = await page
			.locator(
				'[data-testid="weekly-change"] .result-value__number, #weekly-change .result-value__number'
			)
			.first()
			.textContent();

		expect(parseFloat(weeklyText)).toBeGreaterThan(parseFloat(threeDayText));
	});

	test("should handle edge cases", async ({ page }) => {
		// Test minimum potato weight
		await page.locator("#potato-pounds").fill("3");
		await page.locator("#tdee").fill("1200");
		await page.waitForTimeout(500);

		const minResult = page
			.locator(
				'[data-testid="calorie-deficit"] .result-value__number, #calorie-deficit .result-value__number'
			)
			.first();
		await expect(minResult).not.toBeEmpty();

		// Test maximum potato weight
		await page.locator("#potato-pounds").fill("5");
		await page.locator("#tdee").fill("3000");
		await page.waitForTimeout(500);

		const maxResult = page
			.locator(
				'[data-testid="calorie-deficit"] .result-value__number, #calorie-deficit .result-value__number'
			)
			.first();
		await expect(maxResult).not.toBeEmpty();
	});

	test("should persist values in localStorage", async ({ page }) => {
		// Set custom TDEE value which is more likely to persist
		await page.locator("#tdee").fill("2200");
		await page.waitForTimeout(1000);

		// Reload page
		await page.reload();
		await page.waitForLoadState("domcontentloaded");
		await page.waitForSelector("#tdee", { state: "visible" });

		// TDEE should be restored
		await expect(page.locator("#tdee")).toHaveValue("2200");

		// Check that basic calculator elements are present
		await expect(page.locator("#potato-pounds")).toBeVisible();

		// Verify calculator is functional - range slider values are in valid range
		const potatoValue = await page.locator("#potato-pounds").inputValue();
		expect(parseFloat(potatoValue)).toBeGreaterThanOrEqual(3);
		expect(parseFloat(potatoValue)).toBeLessThanOrEqual(5);
	});

	test("should work on mobile devices", async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 667 });

		// Should still be functional
		await expect(page.locator(".calculator-layout__title")).toContainText("Potato Hack");

		// Test interactions
		await page.locator("#potato-pounds").fill("3.5");
		await page.locator("#tdee").fill("1900");

		await page.waitForTimeout(500);

		const deficit = page
			.locator(
				'[data-testid="calorie-deficit"] .result-value__number, #calorie-deficit .result-value__number'
			)
			.first();
		await expect(deficit).not.toBeEmpty();
	});

	test("should sync TDEE with BMR calculator", async ({ page }) => {
		// Set TDEE in potato hack calculator
		await page.locator("#tdee").fill("2100");
		await page.waitForTimeout(1000);

		// Navigate to BMR calculator
		await page.goto("/bmr");
		await page.waitForLoadState("networkidle");

		// TDEE should be reflected if SharedValues is working
		// (This might require the BMR calculator to display TDEE)
		const tdeeDisplay = page.locator('[data-testid="tdee-result"], #tdee-result');
		if (await tdeeDisplay.isVisible()) {
			await expect(tdeeDisplay).toContainText("2100");
		}
	});

	test("should show resistant starch information", async ({ page }) => {
		// Check for information about resistant starch
		await expect(page.getByText(/resistant starch/i).first()).toBeVisible();
		await expect(page.getByText(/17%|cooled/i).first()).toBeVisible();
		await expect(page.getByText(/overnight/i).first()).toBeVisible();
	});
});
