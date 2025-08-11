import { test, expect } from "@playwright/test";

test.describe("Cross-Calculator Integration", () => {
	test("should sync height values between BMI and BMR calculators", async ({ page }) => {
		// Start at BMI calculator
		await page.goto("/bmi");
		await page.waitForLoadState("networkidle");

		// Set height to 72 inches (6'0")
		await page.locator("#height-total-inches").fill("72");
		await page.waitForTimeout(500);

		// Navigate to BMR calculator
		await page.goto("/bmr");
		await page.waitForLoadState("networkidle");

		// Height should be synchronized
		await expect(page.locator("#height-total-inches")).toHaveValue("72");
	});

	test("should sync weight values between calculators", async ({ page }) => {
		// Start at BMI calculator
		await page.goto("/bmi");
		await page.waitForLoadState("networkidle");

		// Set weight to 180 lbs
		await page.locator("#weight").fill("180");
		await page.waitForTimeout(500);

		// Navigate to BMR calculator
		await page.goto("/bmr");
		await page.waitForLoadState("networkidle");

		// Weight should be synchronized
		await expect(page.locator("#weight")).toHaveValue("180");
	});

	test("should sync gender selection between calculators", async ({ page }) => {
		// Start at BMR calculator
		await page.goto("/bmr");
		await page.waitForLoadState("networkidle");

		// Select female
		await page.click('[data-gender="female"]');
		await page.waitForTimeout(500);

		// Navigate to Body Fat calculator
		await page.goto("/body-fat");
		await page.waitForLoadState("networkidle");

		// Female should still be selected
		await expect(page.locator('[data-gender="female"]')).toHaveClass(/active/);

		// Hip measurement should be visible
		await expect(page.locator(".hip-group")).toBeVisible();
	});

	test("should maintain unit preferences across calculators", async ({ page }) => {
		// Start at BMI calculator
		await page.goto("/bmi");
		await page.waitForLoadState("networkidle");

		// Switch to metric units
		await page.click('[data-unit="metric"]');
		await page.waitForTimeout(500);

		// Set height in cm
		await page.locator("#height-cm").fill("180");

		// Navigate to BMR calculator
		await page.goto("/bmr");
		await page.waitForLoadState("networkidle");

		// Should still be in metric mode
		await expect(page.locator(".metric-height")).toBeVisible();
		await expect(page.locator(".imperial-height")).toHaveCSS("display", "none");

		// Height should be approximately the same
		await expect(page.locator("#height-cm")).toHaveValue(/17[8-9]|18[01]/);
	});

	test("should persist values across browser sessions", async ({ page }) => {
		// Set values in BMI calculator
		await page.goto("/bmi");
		await page.waitForLoadState("networkidle");

		await page.locator("#height-total-inches").fill("74");
		await page.locator("#weight").fill("190");
		await page.waitForTimeout(1000);

		// Simulate browser restart by clearing context and creating new page
		await page.context().clearCookies();

		// Navigate to BMR calculator
		await page.goto("/bmr");
		await page.waitForLoadState("networkidle");

		// Values should still be present from localStorage
		await expect(page.locator("#height-total-inches")).toHaveValue("74");
		await expect(page.locator("#weight")).toHaveValue("190");
	});

	test("should sync neck circumference between Body Fat and other calculators", async ({
		page,
	}) => {
		// Start at Body Fat calculator
		await page.goto("/body-fat");
		await page.waitForLoadState("networkidle");

		// Set neck circumference
		await page.locator("#neck").fill("16.5");
		await page.waitForTimeout(500);

		// Navigate to another calculator that might use neck measurement
		// (Note: This tests the SharedValues system even if not all calculators use neck)
		await page.goto("/bmi");
		await page.waitForLoadState("networkidle");

		// Navigate back to Body Fat
		await page.goto("/body-fat");
		await page.waitForLoadState("networkidle");

		// Neck value should be preserved
		await expect(page.locator("#neck")).toHaveValue("16.5");
	});

	test("should handle unit conversions consistently across calculators", async ({ page }) => {
		// Start at BMI calculator in imperial
		await page.goto("/bmi");
		await page.waitForLoadState("networkidle");

		// Set height and weight
		await page.locator("#height-total-inches").fill("70");
		await page.locator("#weight").fill("160");

		// Switch to metric
		await page.click('[data-unit="metric"]');
		await page.waitForTimeout(500);

		// Get the converted values
		const heightCm = await page.locator("#height-cm").inputValue();
		const weightKg = await page.locator("#weight-kg").inputValue();

		// Navigate to BMR calculator
		await page.goto("/bmr");
		await page.waitForLoadState("networkidle");

		// Should be in metric mode with similar values
		await expect(page.locator(".metric-height")).toBeVisible();
		await expect(page.locator("#height-cm")).toHaveValue(heightCm);
		await expect(page.locator("#weight-kg")).toHaveValue(weightKg);
	});

	test("should maintain calculation results when switching between calculators", async ({
		page,
	}) => {
		// Start at BMI calculator
		await page.goto("/bmi");
		await page.waitForLoadState("networkidle");

		// Set specific values
		await page.locator("#height-total-inches").fill("68");
		await page.locator("#weight").fill("150");
		await page.waitForTimeout(500);

		// Get BMI result
		const bmiResult = await page
			.locator('#bmi-result, [data-testid="bmi-result"]')
			.first()
			.textContent();

		// Navigate to another calculator and back
		await page.goto("/bmr");
		await page.waitForLoadState("networkidle");

		await page.goto("/bmi");
		await page.waitForLoadState("networkidle");

		// BMI should be recalculated to the same value
		await expect(page.locator('#bmi-result, [data-testid="bmi-result"]').first()).toContainText(
			bmiResult
		);
	});

	test("should handle age synchronization between appropriate calculators", async ({ page }) => {
		// Start at Heart Rate calculator
		await page.goto("/heart-rate-zones");
		await page.waitForLoadState("networkidle");

		// Set age
		await page.locator("#age").fill("30");
		await page.waitForTimeout(500);

		// Navigate to BMR calculator
		await page.goto("/bmr");
		await page.waitForLoadState("networkidle");

		// Age should be synchronized
		await expect(page.locator("#age")).toHaveValue("30");
	});

	test("should work correctly with multiple browser tabs", async ({ context }) => {
		// Create two pages (tabs)
		const page1 = await context.newPage();
		const page2 = await context.newPage();

		// Set values in first tab
		await page1.goto("/bmi");
		await page1.waitForLoadState("networkidle");

		await page1.locator("#height-total-inches").fill("71");
		await page1.locator("#weight").fill("175");
		await page1.waitForTimeout(500);

		// Open second tab to BMR calculator
		await page2.goto("/bmr");
		await page2.waitForLoadState("networkidle");

		// Values should be synchronized
		await expect(page2.locator("#height-total-inches")).toHaveValue("71");
		await expect(page2.locator("#weight")).toHaveValue("175");

		// Change values in second tab
		await page2.locator("#age").fill("35");
		await page2.waitForTimeout(500);

		// Navigate to heart rate in first tab
		await page1.goto("/heart-rate-zones");
		await page1.waitForLoadState("networkidle");

		// Age should be synchronized
		await expect(page1.locator("#age")).toHaveValue("35");

		await page1.close();
		await page2.close();
	});
});
