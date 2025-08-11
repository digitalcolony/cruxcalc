import { test, expect } from "@playwright/test";

test.describe("Heart Rate Zones Calculator", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/");
		await page.waitForLoadState("networkidle");
	});

	test("should load with correct default values", async ({ page }) => {
		// Check page loads correctly
		await expect(page.locator(".calculator-layout__title")).toContainText("Heart Rate Zones");

		// Check default age (35)
		await expect(page.locator("#age")).toHaveValue("35");

		// Check that heart rate zones are displayed
		await expect(page.locator('[data-testid="zone-1"], #zone-1')).toBeVisible();
		await expect(page.locator('[data-testid="zone-2"], #zone-2')).toBeVisible();
		await expect(page.locator('[data-testid="zone-3"], #zone-3')).toBeVisible();
		await expect(page.locator('[data-testid="zone-4"], #zone-4')).toBeVisible();
		await expect(page.locator('[data-testid="zone-5"], #zone-5')).toBeVisible();
	});

	test("should calculate heart rate zones correctly", async ({ page }) => {
		// Set age to 30
		await page.locator("#age").fill("30");
		await page.waitForTimeout(500);

		// Max HR = 220 - 30 = 190
		// Zone 1 (50-60%): 95-114 BPM
		// Zone 2 (60-70%): 114-133 BPM
		// Zone 3 (70-80%): 133-152 BPM
		// Zone 4 (80-90%): 152-171 BPM
		// Zone 5 (90-100%): 171-190 BPM

		const zone1 = page
			.locator('[data-testid="zone-1"] .result-value__number, #zone-1 .result-value__number')
			.first();
		await expect(zone1).toContainText(/9[5-9]|1[0-1][0-4]/);

		const zone3 = page
			.locator('[data-testid="zone-3"] .result-value__number, #zone-3 .result-value__number')
			.first();
		await expect(zone3).toContainText(/13[3-9]|14[0-9]|15[0-2]/);

		const zone5 = page
			.locator('[data-testid="zone-5"] .result-value__number, #zone-5 .result-value__number')
			.first();
		await expect(zone5).toContainText(/17[1-9]|18[0-9]|190/);
	});

	test("should update zones when age changes", async ({ page }) => {
		// Test with young age (20)
		await page.locator("#age").fill("20");
		await page.waitForTimeout(500);

		const zone5Young = page
			.locator('[data-testid="zone-5"] .result-value__number, #zone-5 .result-value__number')
			.first();
		const youngValue = await zone5Young.textContent();

		// Test with older age (50)
		await page.locator("#age").fill("50");
		await page.waitForTimeout(500);

		const zone5Old = page
			.locator('[data-testid="zone-5"] .result-value__number, #zone-5 .result-value__number')
			.first();
		const oldValue = await zone5Old.textContent();

		// Older age should have lower max heart rate
		expect(parseInt(oldValue)).toBeLessThan(parseInt(youngValue));
	});

	test("should show zone descriptions", async ({ page }) => {
		// Check that zone descriptions are present
		await expect(page.getByText(/Recovery|Active Recovery/i)).toBeVisible();
		await expect(page.getByText(/Aerobic Base|Base/i)).toBeVisible();
		await expect(page.getByText(/Tempo|Aerobic/i)).toBeVisible();
		await expect(page.getByText(/Lactate Threshold|Threshold/i)).toBeVisible();
		await expect(page.getByText(/Neuromuscular|VO2 Max/i)).toBeVisible();
	});

	test("should handle edge cases", async ({ page }) => {
		// Test minimum age
		await page.locator("#age").fill("15");
		await page.waitForTimeout(500);

		const zone1Min = page
			.locator('[data-testid="zone-1"] .result-value__number, #zone-1 .result-value__number')
			.first();
		await expect(zone1Min).not.toBeEmpty();

		// Test maximum age
		await page.locator("#age").fill("80");
		await page.waitForTimeout(500);

		const zone1Max = page
			.locator('[data-testid="zone-1"] .result-value__number, #zone-1 .result-value__number')
			.first();
		await expect(zone1Max).not.toBeEmpty();
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

		const zone3 = page
			.locator('[data-testid="zone-3"] .result-value__number, #zone-3 .result-value__number')
			.first();
		await expect(zone3).not.toBeEmpty();
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
