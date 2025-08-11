import { test, expect } from "@playwright/test";

test.describe("One Rep Max Calculator", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/one-rep-max");
		await page.waitForLoadState("networkidle");
	});

	test("should load with correct default values", async ({ page }) => {
		// Check page loads correctly
		await expect(page.locator("h1")).toContainText("One Rep Max");

		// Check default weight (135 lbs)
		await expect(page.locator("#weight")).toHaveValue("135");

		// Check default reps (5)
		await expect(page.locator("#reps")).toHaveValue("5");

		// Check that all three formula results are displayed
		await expect(page.locator('#epley-result, [data-testid="epley-result"]')).toBeVisible();
		await expect(page.locator('#brzycki-result, [data-testid="brzycki-result"]')).toBeVisible();
		await expect(page.locator('#lombardi-result, [data-testid="lombardi-result"]')).toBeVisible();
	});

	test("should calculate 1RM formulas correctly", async ({ page }) => {
		// Set weight to 200 lbs and 5 reps
		await page.locator("#weight").fill("200");
		await page.locator("#reps").fill("5");

		await page.waitForTimeout(500);

		// Epley formula: 200 × (1 + 5/30) = 200 × 1.167 = 233.4
		const epleyResult = page
			.locator('#epley-result .result-value__number, [data-testid="epley-result"]')
			.first();
		await expect(epleyResult).toContainText(/23[2-5]/);

		// Brzycki formula: 200 × 36/(37-5) = 200 × 36/32 = 225
		const brzyckiResult = page
			.locator('#brzycki-result .result-value__number, [data-testid="brzycki-result"]')
			.first();
		await expect(brzyckiResult).toContainText(/22[3-7]/);

		// Lombardi formula: 200 × 5^0.10 ≈ 200 × 1.175 = 235
		const lombardiResult = page
			.locator('#lombardi-result .result-value__number, [data-testid="lombardi-result"]')
			.first();
		await expect(lombardiResult).toContainText(/23[3-7]/);
	});

	test("should convert between lbs and kg correctly", async ({ page }) => {
		// Set 200 lbs, 5 reps
		await page.locator("#weight").fill("200");
		await page.locator("#reps").fill("5");

		// Switch to metric
		await page.click('[data-unit="metric"]');
		await page.waitForTimeout(500);

		// Weight should convert to ~91 kg (200 / 2.205)
		await expect(page.locator("#weight-kg")).toHaveValue(/9[0-2]/);

		// Results should show kg units but approximately same numerical values
		const epleyUnit = page.locator("#epley-result .result-value__unit").first();
		await expect(epleyUnit).toContainText("kg");

		// Switch back to imperial
		await page.click('[data-unit="imperial"]');
		await page.waitForTimeout(500);

		// Should convert back to lbs
		await expect(page.locator("#weight")).toHaveValue(/19[8-9]|20[0-2]/);

		const epleyUnitLbs = page.locator("#epley-result .result-value__unit").first();
		await expect(epleyUnitLbs).toContainText("lbs");
	});

	test("should update results when reps change", async ({ page }) => {
		await page.locator("#weight").fill("200");

		// Test with 1 rep (should equal the weight)
		await page.locator("#reps").fill("1");
		await page.waitForTimeout(500);

		const epleyResult = page
			.locator('#epley-result .result-value__number, [data-testid="epley-result"]')
			.first();
		await expect(epleyResult).toContainText("200");

		// Test with 8 reps (higher multiplier)
		await page.locator("#reps").fill("8");
		await page.waitForTimeout(500);

		// Should be significantly higher than 200
		await expect(epleyResult).toContainText(/2[5-9][0-9]|3[0-1][0-9]/);
	});

	test("should display formula information", async ({ page }) => {
		// Check that formula details are present
		await expect(page.getByText("Epley")).toBeVisible();
		await expect(page.getByText("Brzycki")).toBeVisible();
		await expect(page.getByText("Lombardi")).toBeVisible();

		// Check for formula descriptions
		await expect(page.getByText(/1RM = w.*30/)).toBeVisible(); // Epley formula
		await expect(page.getByText(/1RM = w.*37.*r/)).toBeVisible(); // Brzycki formula
		await expect(page.getByText(/1RM = w.*r.*0\.10/)).toBeVisible(); // Lombardi formula
	});

	test("should handle edge cases", async ({ page }) => {
		// Test minimum values
		await page.locator("#weight").fill("50");
		await page.locator("#reps").fill("1");
		await page.waitForTimeout(500);

		const epleyResult = page
			.locator('#epley-result .result-value__number, [data-testid="epley-result"]')
			.first();
		await expect(epleyResult).toContainText("50");

		// Test maximum reps
		await page.locator("#reps").fill("10");
		await page.waitForTimeout(500);

		await expect(epleyResult).not.toBeEmpty();

		// Test maximum weight
		await page.locator("#weight").fill("500");
		await page.waitForTimeout(500);

		await expect(epleyResult).not.toBeEmpty();
	});

	test("should persist values in localStorage", async ({ page }) => {
		// Set custom values
		await page.locator("#weight").fill("225");
		await page.locator("#reps").fill("3");

		await page.waitForTimeout(1000);

		// Reload page
		await page.reload();
		await page.waitForLoadState("networkidle");

		// Values should be restored
		await expect(page.locator("#weight")).toHaveValue("225");
		await expect(page.locator("#reps")).toHaveValue("3");
	});

	test("should work on mobile devices", async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 667 });

		// Should still be functional
		await expect(page.locator("h1")).toContainText("One Rep Max");

		// Test interactions
		await page.locator("#weight").fill("180");
		await page.locator("#reps").fill("6");

		await page.waitForTimeout(500);

		const epleyResult = page
			.locator('#epley-result .result-value__number, [data-testid="epley-result"]')
			.first();
		await expect(epleyResult).not.toBeEmpty();
	});

	test("should show different results for different formulas", async ({ page }) => {
		await page.locator("#weight").fill("180");
		await page.locator("#reps").fill("5");

		await page.waitForTimeout(500);

		// Get all three results
		const epleyText = await page
			.locator('#epley-result .result-value__number, [data-testid="epley-result"]')
			.first()
			.textContent();
		const brzyckiText = await page
			.locator('#brzycki-result .result-value__number, [data-testid="brzycki-result"]')
			.first()
			.textContent();
		const lombardiText = await page
			.locator('#lombardi-result .result-value__number, [data-testid="lombardi-result"]')
			.first()
			.textContent();

		// Results should be different (formulas produce different estimates)
		expect(epleyText).not.toBe(brzyckiText);
		expect(epleyText).not.toBe(lombardiText);
		expect(brzyckiText).not.toBe(lombardiText);
	});
});
