import { test, expect } from "@playwright/test";

test.describe("Muscle Potential Calculator", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/muscle-potential");
		await page.waitForLoadState("networkidle");
	});

	test("should load with correct default values", async ({ page }) => {
		// Check page loads correctly
		await expect(page.locator("h1")).toContainText("Muscle Potential");

		// Check default height (70 inches)
		await expect(page.locator("#height")).toHaveValue("70");

		// Check that muscle potential results are displayed
		await expect(page.locator('[data-testid="contest-weight"], #contest-weight')).toBeVisible();
		await expect(page.locator('[data-testid="stage-weight"], #stage-weight')).toBeVisible();
		await expect(page.locator('[data-testid="maximum-weight"], #maximum-weight')).toBeVisible();
	});

	test("should calculate Casey Butt formulas correctly", async ({ page }) => {
		// Set height to 6'0" (72 inches)
		await page.locator("#height").fill("72");
		await page.waitForTimeout(500);

		// Casey Butt's formulas for 72 inches:
		// Contest weight ≈ height² × 0.29 (approximately)
		// For 72": contest weight ≈ 148-152 lbs
		const contestResult = page
			.locator(
				'[data-testid="contest-weight"] .result-value__number, #contest-weight .result-value__number'
			)
			.first();
		await expect(contestResult).toContainText(/14[8-9]|15[0-5]/);

		// Stage weight (contest + 8-12 lbs) ≈ 156-164 lbs
		const stageResult = page
			.locator(
				'[data-testid="stage-weight"] .result-value__number, #stage-weight .result-value__number'
			)
			.first();
		await expect(stageResult).toContainText(/15[6-9]|16[0-7]/);

		// Maximum weight (contest + 25-35 lbs) ≈ 173-187 lbs
		const maxResult = page
			.locator(
				'[data-testid="maximum-weight"] .result-value__number, #maximum-weight .result-value__number'
			)
			.first();
		await expect(maxResult).toContainText(/17[3-9]|18[0-9]/);
	});

	test("should convert between imperial and metric units", async ({ page }) => {
		// Set height to 70 inches
		await page.locator("#height").fill("70");

		// Switch to metric
		await page.click('[data-unit="metric"]');
		await page.waitForTimeout(500);

		// Height should convert to cm (~178 cm)
		await expect(page.locator("#height-cm")).toHaveValue(/17[7-9]|18[0-1]/);

		// Results should show kg units
		const contestUnit = page
			.locator(
				'[data-testid="contest-weight"] .result-value__unit, #contest-weight .result-value__unit'
			)
			.first();
		await expect(contestUnit).toContainText("kg");

		// Switch back to imperial
		await page.click('[data-unit="imperial"]');
		await page.waitForTimeout(500);

		// Should convert back to inches
		await expect(page.locator("#height")).toHaveValue(/69|70|71/);

		// Results should show lbs units
		const contestUnitLbs = page
			.locator(
				'[data-testid="contest-weight"] .result-value__unit, #contest-weight .result-value__unit'
			)
			.first();
		await expect(contestUnitLbs).toContainText("lbs");
	});

	test("should update results when height changes", async ({ page }) => {
		// Test with shorter height (64 inches)
		await page.locator("#height").fill("64");
		await page.waitForTimeout(500);

		const contestShort = page
			.locator(
				'[data-testid="contest-weight"] .result-value__number, #contest-weight .result-value__number'
			)
			.first();
		const shortValue = await contestShort.textContent();

		// Test with taller height (76 inches)
		await page.locator("#height").fill("76");
		await page.waitForTimeout(500);

		const contestTall = page
			.locator(
				'[data-testid="contest-weight"] .result-value__number, #contest-weight .result-value__number'
			)
			.first();
		const tallValue = await contestTall.textContent();

		// Taller height should result in higher muscle potential
		expect(parseInt(tallValue)).toBeGreaterThan(parseInt(shortValue));
	});

	test("should show Casey Butt information", async ({ page }) => {
		// Check that Casey Butt's name is mentioned
		await expect(page.getByText(/Casey Butt/i)).toBeVisible();

		// Check for descriptions of the different weight categories
		await expect(page.getByText(/contest.*condition/i)).toBeVisible();
		await expect(page.getByText(/stage.*ready/i)).toBeVisible();
		await expect(page.getByText(/maximum.*potential/i)).toBeVisible();
	});

	test("should handle edge cases", async ({ page }) => {
		// Test minimum height
		await page.locator("#height").fill("60"); // 5 feet
		await page.waitForTimeout(500);

		const contestMin = page
			.locator(
				'[data-testid="contest-weight"] .result-value__number, #contest-weight .result-value__number'
			)
			.first();
		await expect(contestMin).not.toBeEmpty();

		// Test maximum reasonable height
		await page.locator("#height").fill("80"); // 6'8"
		await page.waitForTimeout(500);

		const contestMax = page
			.locator(
				'[data-testid="contest-weight"] .result-value__number, #contest-weight .result-value__number'
			)
			.first();
		await expect(contestMax).not.toBeEmpty();
	});

	test("should show proper weight progression", async ({ page }) => {
		await page.locator("#height").fill("70");
		await page.waitForTimeout(500);

		// Get all three weights
		const contestText = await page
			.locator(
				'[data-testid="contest-weight"] .result-value__number, #contest-weight .result-value__number'
			)
			.first()
			.textContent();
		const stageText = await page
			.locator(
				'[data-testid="stage-weight"] .result-value__number, #stage-weight .result-value__number'
			)
			.first()
			.textContent();
		const maxText = await page
			.locator(
				'[data-testid="maximum-weight"] .result-value__number, #maximum-weight .result-value__number'
			)
			.first()
			.textContent();

		const contest = parseInt(contestText);
		const stage = parseInt(stageText);
		const maximum = parseInt(maxText);

		// Weight progression should be: contest < stage < maximum
		expect(contest).toBeLessThan(stage);
		expect(stage).toBeLessThan(maximum);
	});

	test("should persist height value in localStorage", async ({ page }) => {
		// Set custom height
		await page.locator("#height").fill("74");
		await page.waitForTimeout(1000);

		// Reload page
		await page.reload();
		await page.waitForLoadState("networkidle");

		// Height should be restored
		await expect(page.locator("#height")).toHaveValue("74");
	});

	test("should work on mobile devices", async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 667 });

		// Should still be functional
		await expect(page.locator("h1")).toContainText("Muscle Potential");

		// Test interactions
		await page.locator("#height").fill("68");
		await page.waitForTimeout(500);

		const contestResult = page
			.locator(
				'[data-testid="contest-weight"] .result-value__number, #contest-weight .result-value__number'
			)
			.first();
		await expect(contestResult).not.toBeEmpty();
	});

	test("should sync height with other calculators", async ({ page }) => {
		// Set height in muscle potential calculator
		await page.locator("#height").fill("71");
		await page.waitForTimeout(1000);

		// Navigate to BMI calculator
		await page.goto("/bmi");
		await page.waitForLoadState("networkidle");

		// Height should be synced if SharedValues is working
		await expect(page.locator("#height")).toHaveValue("71");

		// Go back to muscle potential
		await page.goto("/muscle-potential");
		await page.waitForLoadState("networkidle");

		// Height should still be there
		await expect(page.locator("#height")).toHaveValue("71");
	});

	test("should show methodology information", async ({ page }) => {
		// Check for information about the calculation methodology
		await expect(page.getByText(/natural.*potential/i)).toBeVisible();
		await expect(page.getByText(/genetic.*limit/i)).toBeVisible();

		// Should mention drug-free calculations
		await expect(page.getByText(/drug.free|natural/i)).toBeVisible();
	});
});
