import { test, expect } from "@playwright/test";

test.describe("BMI Calculator", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/bmi");
		await page.waitForLoadState("networkidle");
	});

	test("should load with correct default values", async ({ page }) => {
		// Check page title and header
		await expect(page).toHaveTitle(/BMI Calculator/);
		await expect(page.locator(".calculator-layout__title")).toContainText("BMI Calculator");

		// Check default values are present
		const heightSlider = page.locator("#height-total-inches");
		const weightSlider = page.locator("#weight-lbs");

		await expect(heightSlider).toBeVisible();
		await expect(weightSlider).toBeVisible();

		// Check BMI result elements exist
		await expect(page.locator("#bmi-number")).toBeVisible();
		await expect(page.locator("#bmi-category")).toBeVisible();
	});

	test("should calculate BMI correctly with imperial units", async ({ page }) => {
		// Set height to 70 inches (5'10") and weight to 170 lbs
		await page.locator("#height-total-inches").fill("70");
		await page.locator("#weight-lbs").fill("170");

		await page.waitForTimeout(500);

		// BMI = weight (lbs) / height (in)² × 703
		// BMI = 170 / (70)² × 703 ≈ 24.4
		const bmiResult = page.locator("#bmi-number");
		await expect(bmiResult).toContainText(/24\.[0-9]|25\.[0-9]/);

		// Should be in "Normal" category
		const categoryResult = page.locator("#bmi-category");
		await expect(categoryResult).toContainText(/Normal/i);
	});

	test("should handle Asian BMI scale option", async ({ page }) => {
		// Set values that are normal on standard scale but overweight on Asian scale
		await page.locator("#height-total-inches").fill("68");
		await page.locator("#weight-lbs").fill("160"); // BMI ≈ 24.3
		await page.waitForTimeout(500);

		let categoryResult = page.locator("#bmi-category");

		// Should be "Normal" on standard scale
		await expect(categoryResult).toContainText(/Normal/i);

		// Enable Asian BMI scale
		await page.check("#asian-scale");
		await page.waitForTimeout(500);

		// Should now be "Overweight" on Asian scale (BMI > 23.0)
		await expect(categoryResult).toContainText(/Overweight/i);

		// Disable Asian BMI scale
		await page.uncheck("#asian-scale");
		await page.waitForTimeout(500);

		// Should return to "Normal"
		await expect(categoryResult).toContainText(/Normal/i);
	});

	test("should show different BMI categories correctly", async ({ page }) => {
		// Test underweight (BMI < 18.5)
		await page.locator("#height-total-inches").fill("70");
		await page.locator("#weight-lbs").fill("120"); // BMI ≈ 17.2
		await page.waitForTimeout(500);

		let categoryResult = page.locator("#bmi-category");
		await expect(categoryResult).toContainText(/Underweight/i);

		// Test normal weight (BMI 18.5-24.9)
		await page.locator("#weight-lbs").fill("160"); // BMI ≈ 22.9
		await page.waitForTimeout(500);

		await expect(categoryResult).toContainText(/Normal/i);

		// Test overweight (BMI 25.0-29.9)
		await page.locator("#weight-lbs").fill("190"); // BMI ≈ 27.2
		await page.waitForTimeout(500);

		await expect(categoryResult).toContainText(/Overweight/i);

		// Test obese (BMI ≥ 30.0)
		await page.locator("#weight-lbs").fill("220"); // BMI ≈ 31.5
		await page.waitForTimeout(500);

		await expect(categoryResult).toContainText(/Obese/i);
	});

	test("should show visual BMI scale indicator", async ({ page }) => {
		// Check that the visual scale is present
		await expect(page.locator(".scale-bar")).toBeVisible();
		await expect(page.locator(".scale-segment.underweight")).toBeVisible();
		await expect(page.locator(".scale-segment.normal")).toBeVisible();
		await expect(page.locator(".scale-segment.overweight")).toBeVisible();
		await expect(page.locator(".scale-segment.obese")).toBeVisible();

		// Check that the scale indicator exists
		await expect(page.locator("#scale-indicator")).toBeVisible();
	});
});
