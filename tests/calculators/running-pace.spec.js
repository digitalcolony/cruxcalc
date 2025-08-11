import { test, expect } from "@playwright/test";

test.describe("Running Pace Calculator", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/running");
		await page.waitForLoadState("networkidle");
	});

	test("should load with correct default values", async ({ page }) => {
		// Check page loads correctly
		await expect(page.locator("h1")).toContainText("Running Pace");

		// Check default pace (8:00 min/mile)
		await expect(page.locator("#pace")).toHaveValue("480"); // 8:00 = 480 seconds

		// Should display race time calculations
		await expect(page.locator('#time-5k, [data-testid="5k-time"]')).toBeVisible();
		await expect(page.locator('#time-10k, [data-testid="10k-time"]')).toBeVisible();
		await expect(page.locator('#time-half, [data-testid="half-time"]')).toBeVisible();
		await expect(page.locator('#time-full, [data-testid="full-time"]')).toBeVisible();
	});

	test("should display pace in correct format", async ({ page }) => {
		// Set pace to 7:30 min/mile (450 seconds)
		await page.locator("#pace").fill("450");
		await page.waitForTimeout(500);

		// Check that pace display shows 7:30 format
		const paceDisplay = page
			.locator(".pace-display, .input-display, .range-slider-display")
			.first();
		await expect(paceDisplay).toContainText("7:30");
	});

	test("should calculate race times correctly", async ({ page }) => {
		// Set pace to 8:00 min/mile (480 seconds)
		await page.locator("#pace").fill("480");
		await page.waitForTimeout(500);

		// 5K = 3.10686 miles × 8:00 = ~24:51
		const time5k = page.locator('#time-5k, [data-testid="5k-time"]').first();
		await expect(time5k).toContainText(/24:[45][0-9]|25:[01][0-9]/);

		// 10K = 6.21371 miles × 8:00 = ~49:42
		const time10k = page.locator('#time-10k, [data-testid="10k-time"]').first();
		await expect(time10k).toContainText(/49:[234][0-9]|50:[012][0-9]/);

		// Half Marathon = 13.1094 miles × 8:00 = ~1:44:53
		const timeHalf = page.locator('#time-half, [data-testid="half-time"]').first();
		await expect(timeHalf).toContainText(/1:4[345]:[0-9][0-9]/);

		// Full Marathon = 26.2188 miles × 8:00 = ~3:29:45
		const timeFull = page.locator('#time-full, [data-testid="full-time"]').first();
		await expect(timeFull).toContainText(/3:2[89]:[0-9][0-9]|3:3[01]:[0-9][0-9]/);
	});

	test("should update pace category badge", async ({ page }) => {
		// Set easy pace (10:00 min/mile)
		await page.locator("#pace").fill("600");
		await page.waitForTimeout(500);

		const categoryBadge = page.locator('#pace-category, [data-testid="pace-category"]').first();
		await expect(categoryBadge).toContainText(/Easy|Recovery|Base/);

		// Set faster pace (6:00 min/mile)
		await page.locator("#pace").fill("360");
		await page.waitForTimeout(500);

		await expect(categoryBadge).toContainText(/Elite|Fast|Tempo|Threshold/);
	});

	test("should handle fast and slow pace inputs", async ({ page }) => {
		// Test very fast pace (5:00 min/mile = 300 seconds)
		await page.locator("#pace").fill("300");
		await page.waitForTimeout(500);

		const time5k = page.locator('#time-5k, [data-testid="5k-time"]').first();
		await expect(time5k).not.toBeEmpty();

		// Test slow pace (12:00 min/mile = 720 seconds)
		await page.locator("#pace").fill("720");
		await page.waitForTimeout(500);

		await expect(time5k).not.toBeEmpty();
	});

	test("should display pace categories and descriptions", async ({ page }) => {
		// Check for pace category information
		await expect(page.getByText(/Easy|Recovery/)).toBeVisible();
		await expect(page.getByText(/Tempo|Threshold/)).toBeVisible();
		await expect(page.getByText(/Race|Competition/)).toBeVisible();
	});

	test("should persist pace value in localStorage", async ({ page }) => {
		// Set custom pace
		await page.locator("#pace").fill("420"); // 7:00 min/mile
		await page.waitForTimeout(1000);

		// Reload page
		await page.reload();
		await page.waitForLoadState("networkidle");

		// Pace should be restored
		await expect(page.locator("#pace")).toHaveValue("420");
	});

	test("should work correctly on mobile", async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 667 });

		// Should still function on mobile
		await expect(page.locator("h1")).toContainText("Running Pace");

		// Test pace slider
		await page.locator("#pace").fill("450");
		await page.waitForTimeout(500);

		// Race times should update
		const time5k = page.locator('#time-5k, [data-testid="5k-time"]').first();
		await expect(time5k).not.toBeEmpty();
	});

	test("should show different race times for different paces", async ({ page }) => {
		// Set 7:00 pace
		await page.locator("#pace").fill("420");
		await page.waitForTimeout(500);

		const time5k_fast = await page
			.locator('#time-5k, [data-testid="5k-time"]')
			.first()
			.textContent();

		// Set 9:00 pace
		await page.locator("#pace").fill("540");
		await page.waitForTimeout(500);

		const time5k_slow = await page
			.locator('#time-5k, [data-testid="5k-time"]')
			.first()
			.textContent();

		// Times should be different
		expect(time5k_fast).not.toBe(time5k_slow);
	});

	test("should handle edge cases for pace slider", async ({ page }) => {
		// Test minimum pace (should be around 4:00-5:00 min/mile)
		await page.locator("#pace").fill("240"); // 4:00 min/mile
		await page.waitForTimeout(500);

		const time5k = page.locator('#time-5k, [data-testid="5k-time"]').first();
		await expect(time5k).not.toBeEmpty();

		// Test maximum pace (should be around 15:00+ min/mile)
		await page.locator("#pace").fill("900"); // 15:00 min/mile
		await page.waitForTimeout(500);

		await expect(time5k).not.toBeEmpty();
	});

	test("should display proper time formatting", async ({ page }) => {
		// Set a pace that will generate times over 1 hour
		await page.locator("#pace").fill("600"); // 10:00 min/mile
		await page.waitForTimeout(500);

		// Half marathon should be over 2 hours
		const timeHalf = page.locator('#time-half, [data-testid="half-time"]').first();
		const halfText = await timeHalf.textContent();

		// Should contain hours:minutes:seconds format (h:mm:ss)
		expect(halfText).toMatch(/\d:\d\d:\d\d/);

		// Full marathon should be over 4 hours
		const timeFull = page.locator('#time-full, [data-testid="full-time"]').first();
		const fullText = await timeFull.textContent();

		// Should be over 4 hours
		expect(fullText).toMatch(/[45]:\d\d:\d\d/);
	});

	test("should update all race times when pace changes", async ({ page }) => {
		// Set initial pace
		await page.locator("#pace").fill("480"); // 8:00 min/mile
		await page.waitForTimeout(500);

		// Get initial times
		const initial5k = await page.locator('#time-5k, [data-testid="5k-time"]').first().textContent();
		const initial10k = await page
			.locator('#time-10k, [data-testid="10k-time"]')
			.first()
			.textContent();
		const initialHalf = await page
			.locator('#time-half, [data-testid="half-time"]')
			.first()
			.textContent();
		const initialFull = await page
			.locator('#time-full, [data-testid="full-time"]')
			.first()
			.textContent();

		// Change pace
		await page.locator("#pace").fill("360"); // 6:00 min/mile
		await page.waitForTimeout(500);

		// Get new times
		const new5k = await page.locator('#time-5k, [data-testid="5k-time"]').first().textContent();
		const new10k = await page.locator('#time-10k, [data-testid="10k-time"]').first().textContent();
		const newHalf = await page
			.locator('#time-half, [data-testid="half-time"]')
			.first()
			.textContent();
		const newFull = await page
			.locator('#time-full, [data-testid="full-time"]')
			.first()
			.textContent();

		// All times should have changed
		expect(new5k).not.toBe(initial5k);
		expect(new10k).not.toBe(initial10k);
		expect(newHalf).not.toBe(initialHalf);
		expect(newFull).not.toBe(initialFull);
	});
});
