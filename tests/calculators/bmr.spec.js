import { test, expect } from "@playwright/test";

test.describe("BMR Calculator", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/bmr");
		await page.waitForLoadState("networkidle");
	});

	test("should load with correct default values", async ({ page }) => {
		// Check page loads correctly
		await expect(page.locator("h1")).toContainText("BMR");

		// Check default values
		await expect(page.locator("#age")).toHaveValue("35");
		await expect(page.locator("#height")).toHaveValue("70"); // inches
		await expect(page.locator("#weight")).toHaveValue("170"); // lbs

		// Check that BMR results are displayed
		await expect(page.locator('[data-testid="mifflin-result"], #mifflin-result')).toBeVisible();
		await expect(page.locator('[data-testid="harris-result"], #harris-result')).toBeVisible();
		await expect(page.locator('[data-testid="katch-result"], #katch-result')).toBeVisible();
	});

	test("should calculate BMR formulas correctly for men", async ({ page }) => {
		// Set to male, 30 years, 6'0", 180 lbs
		await page.click('[data-gender="male"]');
		await page.locator("#age").fill("30");
		await page.locator("#height").fill("72"); // 6 feet = 72 inches
		await page.locator("#weight").fill("180");

		await page.waitForTimeout(500);

		// Mifflin-St Jeor for men: (10 × weight_kg) + (6.25 × height_cm) - (5 × age) + 5
		// 180 lbs = 81.6 kg, 72 inches = 182.9 cm
		// BMR ≈ 1800-1900
		const mifflinResult = page
			.locator(
				'[data-testid="mifflin-result"] .result-value__number, #mifflin-result .result-value__number'
			)
			.first();
		await expect(mifflinResult).toContainText(/18[0-9][0-9]|19[0-5][0-9]/);

		// Harris-Benedict should give a slightly different result
		const harrisResult = page
			.locator(
				'[data-testid="harris-result"] .result-value__number, #harris-result .result-value__number'
			)
			.first();
		await expect(harrisResult).toContainText(/17[0-9][0-9]|18[0-9][0-9]|19[0-5][0-9]/);
	});

	test("should calculate BMR formulas correctly for women", async ({ page }) => {
		// Set to female, 25 years, 5'6", 140 lbs
		await page.click('[data-gender="female"]');
		await page.locator("#age").fill("25");
		await page.locator("#height").fill("66"); // 5'6" = 66 inches
		await page.locator("#weight").fill("140");

		await page.waitForTimeout(500);

		// Mifflin-St Jeor for women: (10 × weight_kg) + (6.25 × height_cm) - (5 × age) - 161
		// 140 lbs = 63.5 kg, 66 inches = 167.6 cm
		// BMR ≈ 1300-1400
		const mifflinResult = page
			.locator(
				'[data-testid="mifflin-result"] .result-value__number, #mifflin-result .result-value__number'
			)
			.first();
		await expect(mifflinResult).toContainText(/13[0-9][0-9]|14[0-9][0-9]/);
	});

	test("should convert between imperial and metric units", async ({ page }) => {
		// Set imperial values
		await page.locator("#height").fill("70"); // 70 inches
		await page.locator("#weight").fill("180"); // 180 lbs

		// Switch to metric
		await page.click('[data-unit="metric"]');
		await page.waitForTimeout(500);

		// Height should convert to cm (~178 cm)
		await expect(page.locator("#height-cm")).toHaveValue(/17[7-9]|18[0-1]/);

		// Weight should convert to kg (~82 kg)
		await expect(page.locator("#weight-kg")).toHaveValue(/8[1-3]/);

		// Switch back to imperial
		await page.click('[data-unit="imperial"]');
		await page.waitForTimeout(500);

		// Should convert back approximately
		await expect(page.locator("#height")).toHaveValue(/69|70|71/);
		await expect(page.locator("#weight")).toHaveValue(/179|180|181/);
	});

	test("should calculate TDEE with activity levels", async ({ page }) => {
		await page.locator("#age").fill("30");
		await page.locator("#height").fill("70");
		await page.locator("#weight").fill("170");

		// Test different activity levels
		const activityLevels = [
			{ selector: '[data-activity="sedentary"]', multiplier: 1.2 },
			{ selector: '[data-activity="lightly-active"]', multiplier: 1.375 },
			{ selector: '[data-activity="moderately-active"]', multiplier: 1.55 },
			{ selector: '[data-activity="very-active"]', multiplier: 1.725 },
			{ selector: '[data-activity="extremely-active"]', multiplier: 1.9 },
		];

		for (const level of activityLevels) {
			await page.click(level.selector);
			await page.waitForTimeout(300);

			const tdeeResult = page
				.locator(
					'[data-testid="tdee-result"] .result-value__number, #tdee-result .result-value__number'
				)
				.first();
			await expect(tdeeResult).toBeVisible();
			await expect(tdeeResult).not.toBeEmpty();
		}
	});

	test("should show formula comparison", async ({ page }) => {
		// Check that all three formulas are shown
		await expect(page.getByText("Mifflin-St Jeor")).toBeVisible();
		await expect(page.getByText("Harris-Benedict")).toBeVisible();
		await expect(page.getByText("Katch-McArdle")).toBeVisible();

		// Check for formula descriptions or equations
		await expect(page.getByText(/10.*weight.*6\.25.*height/)).toBeVisible(); // Mifflin
		await expect(page.getByText(/88\.362.*13\.397.*weight/)).toBeVisible(); // Harris-Benedict
	});

	test("should handle body fat percentage for Katch-McArdle", async ({ page }) => {
		// Set body fat percentage (if available)
		const bodyFatInput = page.locator("#body-fat-percentage, #bodyfat");
		if (await bodyFatInput.isVisible()) {
			await bodyFatInput.fill("15");
			await page.waitForTimeout(500);

			const katchResult = page
				.locator(
					'[data-testid="katch-result"] .result-value__number, #katch-result .result-value__number'
				)
				.first();
			await expect(katchResult).not.toBeEmpty();
		}
	});

	test("should persist values in localStorage", async ({ page }) => {
		// Set custom values
		await page.click('[data-gender="female"]');
		await page.locator("#age").fill("28");
		await page.locator("#height").fill("65");
		await page.locator("#weight").fill("130");

		await page.waitForTimeout(1000);

		// Reload page
		await page.reload();
		await page.waitForLoadState("networkidle");

		// Values should be restored
		await expect(page.locator("#age")).toHaveValue("28");
		await expect(page.locator("#height")).toHaveValue("65");
		await expect(page.locator("#weight")).toHaveValue("130");
	});

	test("should work on mobile devices", async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 667 });

		// Should still be functional
		await expect(page.locator("h1")).toContainText("BMR");

		// Test interactions
		await page.locator("#age").fill("32");
		await page.locator("#weight").fill("160");

		await page.waitForTimeout(500);

		const mifflinResult = page
			.locator(
				'[data-testid="mifflin-result"] .result-value__number, #mifflin-result .result-value__number'
			)
			.first();
		await expect(mifflinResult).not.toBeEmpty();
	});

	test("should show different results for different formulas", async ({ page }) => {
		await page.locator("#age").fill("35");
		await page.locator("#height").fill("68");
		await page.locator("#weight").fill("150");

		await page.waitForTimeout(500);

		// Get all three results
		const mifflinText = await page
			.locator(
				'[data-testid="mifflin-result"] .result-value__number, #mifflin-result .result-value__number'
			)
			.first()
			.textContent();
		const harrisText = await page
			.locator(
				'[data-testid="harris-result"] .result-value__number, #harris-result .result-value__number'
			)
			.first()
			.textContent();
		const katchText = await page
			.locator(
				'[data-testid="katch-result"] .result-value__number, #katch-result .result-value__number'
			)
			.first()
			.textContent();

		// Results should be different (formulas produce different estimates)
		expect(mifflinText).not.toBe(harrisText);

		// Katch-McArdle might be the same if no body fat is provided
		if (katchText && katchText !== "0" && katchText !== "") {
			expect(mifflinText).not.toBe(katchText);
		}
	});

	test("should sync values with other calculators", async ({ page }) => {
		// Set values in BMR calculator
		await page.locator("#age").fill("40");
		await page.locator("#height").fill("72");
		await page.locator("#weight").fill("185");

		await page.waitForTimeout(1000);

		// Navigate to BMI calculator
		await page.goto("/bmi");
		await page.waitForLoadState("networkidle");

		// Values should be synced if SharedValues is working
		await expect(page.locator("#height")).toHaveValue("72");
		await expect(page.locator("#weight")).toHaveValue("185");
	});
});
