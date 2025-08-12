import { test, expect } from "@playwright/test";

test.describe("Heart Rate Zones Calculator", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/heart-rate-zones");
		await page.waitForLoadState("networkidle");
	});

	test("should load with correct default values", async ({ page }) => {
		// Check page loads correctly
		await expect(page.locator(".calculator-layout__title")).toContainText("Heart Rate Zones");

		// Check default age (30)
		await expect(page.locator("#age")).toHaveValue("30");

		// Check that heart rate zones are displayed
		await expect(page.locator("#zone1-range")).toBeVisible();
		await expect(page.locator("#zone2-range")).toBeVisible();
		await expect(page.locator("#zone3-range")).toBeVisible();
		await expect(page.locator("#zone4-range")).toBeVisible();
		await expect(page.locator("#zone5-range")).toBeVisible();
	});

	test("should calculate heart rate zones correctly", async ({ page }) => {
		// Set age to 30
		await page.locator("#age").fill("30");
		await page.waitForTimeout(500);

		// Max HR = 220 - 30 = 190
		// Based on actual zones in the calculator:
		// Zone 1 (68-73%): 129-139 bpm
		// Zone 3 (80-90%): 152-171 bpm
		// Zone 5 (95-100%): 181-190 bpm

		const zone1 = page.locator("#zone1-range");
		await expect(zone1).toContainText(/12[0-9]-13[0-9]/);

		const zone3 = page.locator("#zone3-range");
		await expect(zone3).toContainText(/15[0-9]-17[0-9]/);

		const zone5 = page.locator("#zone5-range");
		await expect(zone5).toContainText(/18[0-9]-19[0-9]/);
	});

	test("should update zones when age changes", async ({ page }) => {
		// Test with young age (20) - Max HR = 200
		await page.locator("#age").fill("20");
		await page.waitForTimeout(500);

		const zone5Young = page.locator("#zone5-range");
		const youngValue = await zone5Young.textContent();

		// Test with older age (50) - Max HR = 170
		await page.locator("#age").fill("50");
		await page.waitForTimeout(500);

		const zone5Old = page.locator("#zone5-range");
		const oldValue = await zone5Old.textContent();

		// Older age should have lower max heart rate and zone values
		expect(oldValue).not.toEqual(youngValue);
		// Older person should have lower zone 5 values
		const oldMaxRange = parseInt(oldValue.split("-")[1]);
		const youngMaxRange = parseInt(youngValue.split("-")[1]);
		expect(oldMaxRange).toBeLessThan(youngMaxRange);
	});

	test("should show zone descriptions", async ({ page }) => {
		// Check that zone descriptions and names are present
		await expect(page.getByText("Easy").first()).toBeVisible();
		await expect(page.getByText("Steady").first()).toBeVisible();
		await expect(page.getByText("Tempo").first()).toBeVisible();
		await expect(page.getByText("Threshold").first()).toBeVisible();
		await expect(page.getByText("VO2 Max").first()).toBeVisible();
	});

	test("should handle edge cases", async ({ page }) => {
		// Test minimum age
		await page.locator("#age").fill("15");
		await page.waitForTimeout(500);

		const zone1Min = page.locator("#zone1-range");
		await expect(zone1Min).not.toBeEmpty();
		// Age 15: Max HR = 205, should show valid ranges
		await expect(zone1Min).toContainText(/\d+-\d+/);

		// Test maximum age
		await page.locator("#age").fill("100");
		await page.waitForTimeout(500);

		const zone1Max = page.locator("#zone1-range");
		await expect(zone1Max).not.toBeEmpty();
		// Age 100: Max HR = 120, should show valid ranges
		await expect(zone1Max).toContainText(/\d+-\d+/);
	});

	test("should persist age value in localStorage", async ({ page }) => {
		// Set custom age
		await page.locator("#age").fill("42");
		await page.waitForTimeout(1000);

		// Reload page
		await page.reload();
		await page.waitForLoadState("networkidle");

		// Age should be restored
		await expect(page.locator("#age")).toHaveValue("42");
	});

	test("should work on mobile devices", async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 667 });

		// Should still be functional
		await expect(page.locator(".calculator-layout__title")).toContainText("Heart Rate Zones");

		// Test interactions
		await page.locator("#age").fill("28");
		await page.waitForTimeout(500);

		const zone3 = page.locator("#zone3-range");
		await expect(zone3).not.toBeEmpty();
		await expect(zone3).toContainText(/\d+-\d+/);
	});

	test("should sync age with other calculators", async ({ page }) => {
		// Set age in heart rate calculator
		await page.locator("#age").fill("45");
		await page.waitForTimeout(1000);

		// Navigate to BMR calculator (if it uses age)
		await page.goto("/bmr");
		await page.waitForLoadState("networkidle");

		// Age should be synced if SharedValues is working
		const ageInput = page.locator("#age");
		if (await ageInput.isVisible()) {
			await expect(ageInput).toHaveValue("45");
		}
	});
});
