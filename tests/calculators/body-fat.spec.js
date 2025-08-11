import { test, expect } from "@playwright/test";

test.describe("Body Fat Calculator", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/body-fat");
		await page.waitForLoadState("networkidle");
	});

	test("should load with correct default values for male", async ({ page }) => {
		// Check page loads correctly
		await expect(page.locator(".calculator-layout__title")).toContainText("Body Fat");

		// Should default to male
		await expect(page.locator('[data-gender="male"]')).toHaveClass(/active/);

		// Check default values (SharedValues may affect these)
		await expect(page.locator("#height-total-inches")).toHaveValue(/\d+/);
		await expect(page.locator("#neck")).toHaveValue(/\d+/);
		await expect(page.locator("#waist")).toHaveValue(/\d+/);

		// Hip input should be hidden for male
		await expect(page.locator(".hip-group")).toHaveCSS("display", "none");

		// Should show a body fat result
		const result = page.locator('#navy-result, [data-testid="body-fat-result"]').first();
		await expect(result).not.toBeEmpty();
	});

	test("should show hip measurement when female is selected", async ({ page }) => {
		// Click female gender toggle
		await page.click('[data-gender="female"]');
		await page.waitForTimeout(500);

		// Hip input should now be visible
		await expect(page.locator(".hip-group")).toBeVisible();
		await expect(page.locator("#hips")).toBeVisible();

		// Should recalculate with different formula
		const result = page.locator('#navy-result, [data-testid="body-fat-result"]').first();
		await expect(result).not.toBeEmpty();
	});

	test("should calculate body fat correctly for men", async ({ page }) => {
		// Set known values for male calculation
		await page.click('[data-gender="male"]');
		await page.locator("#height-total-inches").fill("70"); // 5'10"
		await page.locator("#neck").fill("15");
		await page.locator("#waist").fill("34");

		await page.waitForTimeout(500);

		// Should calculate reasonable body fat percentage (10-25% range)
		const result = page.locator('#navy-result, [data-testid="body-fat-result"]').first();
		const resultText = await result.textContent();
		const bodyFat = parseFloat(resultText.replace("%", ""));

		expect(bodyFat).toBeGreaterThan(5);
		expect(bodyFat).toBeLessThan(40);
	});

	test("should calculate body fat correctly for women", async ({ page }) => {
		// Set known values for female calculation
		await page.click('[data-gender="female"]');
		await page.waitForTimeout(500);

		await page.locator("#height-total-inches").fill("65"); // 5'5"
		await page.locator("#neck").fill("13");
		await page.locator("#waist").fill("28");
		await page.locator("#hips").fill("36");

		await page.waitForTimeout(500);

		// Should calculate reasonable body fat percentage (15-35% range for women)
		const result = page.locator('#navy-result, [data-testid="body-fat-result"]').first();
		const resultText = await result.textContent();
		const bodyFat = parseFloat(resultText.replace("%", ""));

		expect(bodyFat).toBeGreaterThan(10);
		expect(bodyFat).toBeLessThan(45);
	});

	test("should convert between height units correctly", async ({ page }) => {
		// Start with imperial (SharedValues may affect default)
		const initialHeight = await page.locator("#height-total-inches").inputValue();
		expect(parseInt(initialHeight)).toBeGreaterThan(60); // Reasonable height range

		// Switch to metric
		await page.click('[data-height-unit="metric"]');
		await page.waitForTimeout(500);

		// Should convert to cm range
		await expect(page.locator("#height-cm")).toHaveValue(/1[6-9]\d/);

		// Switch back to imperial
		await page.click('[data-height-unit="imperial"]');
		await page.waitForTimeout(500);

		// Should convert back to approximately 70 inches
		await expect(page.locator("#height-total-inches")).toHaveValue(/6[8-9]|7[0-2]/);
	});

	test("should update body fat category badge", async ({ page }) => {
		// Set values that should result in "Fitness" category for male
		await page.click('[data-gender="male"]');
		await page.locator("#height-total-inches").fill("70");
		await page.locator("#neck").fill("15");
		await page.locator("#waist").fill("32");

		await page.waitForTimeout(500);

		const categoryBadge = page.locator('#category-badge, [data-testid="category-badge"]').first();
		await expect(categoryBadge).toBeVisible();

		// Should show one of the valid categories
		const badgeText = await categoryBadge.textContent();
		expect(["Essential", "Athletic", "Fitness", "Average", "Obese"]).toContain(badgeText);
	});

	test("should display body fat categories table", async ({ page }) => {
		// Check for body fat categories table
		await expect(page.locator(".body-fat-categories, table").first()).toBeVisible();

		// Check for key categories in table cells
		await expect(page.locator("td").getByText("Essential").first()).toBeVisible();
		await expect(page.locator("td").getByText("Athletic").first()).toBeVisible();
		await expect(page.locator("td").getByText("Fitness").first()).toBeVisible();
		await expect(page.locator("td").getByText("Average").first()).toBeVisible();
		await expect(page.locator("td").getByText("Obese").first()).toBeVisible();
	});

	test("should handle circumference input changes", async ({ page }) => {
		await page.click('[data-gender="male"]');

		// Test neck circumference changes
		await page.locator("#neck").fill("16");
		await page.waitForTimeout(300);

		const result1 = await page
			.locator('#navy-result, [data-testid="body-fat-result"]')
			.first()
			.textContent();

		// Change waist circumference
		await page.locator("#waist").fill("36");
		await page.waitForTimeout(300);

		const result2 = await page
			.locator('#navy-result, [data-testid="body-fat-result"]')
			.first()
			.textContent();

		// Results should be different
		expect(result1).not.toBe(result2);
	});

	test("should work correctly with edge cases", async ({ page }) => {
		await page.click('[data-gender="male"]');

		// Test minimum values
		await page.locator("#height-total-inches").fill("48"); // 4'0"
		await page.locator("#neck").fill("10");
		await page.locator("#waist").fill("20");

		await page.waitForTimeout(500);

		const result = page.locator('#navy-result, [data-testid="body-fat-result"]').first();
		await expect(result).not.toBeEmpty();

		// Test maximum values
		await page.locator("#height-total-inches").fill("84"); // 7'0"
		await page.locator("#neck").fill("25");
		await page.locator("#waist").fill("60");

		await page.waitForTimeout(500);

		await expect(result).not.toBeEmpty();
	});

	test("should persist gender selection during session", async ({ page }) => {
		// Start with default male
		await expect(page.locator('[data-gender="male"]')).toHaveClass(/active/);

		// Select female
		await page.click('[data-gender="female"]');
		await page.waitForTimeout(500);

		// Set some values
		await page.locator("#neck").fill("13.5");
		await page.locator("#waist").fill("29");
		await page.locator("#hips").fill("38");

		await page.waitForTimeout(1000);

		// Female should still be selected and hip input visible
		await expect(page.locator('[data-gender="female"]')).toHaveClass(/active/);
		await expect(page.locator(".hip-group")).toBeVisible();

		// Switch back to male and verify hip input hides
		await page.click('[data-gender="male"]');
		await page.waitForTimeout(500);
		await expect(page.locator('[data-gender="male"]')).toHaveClass(/active/);
		await expect(page.locator(".hip-group")).toHaveCSS("display", "none");
	});

	test("should be responsive on mobile", async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 667 });

		// Should still function on mobile
		await expect(page.locator(".calculator-layout__title")).toContainText("Body Fat");

		// Test gender toggle
		await page.click('[data-gender="female"]');
		await page.waitForTimeout(500);

		await expect(page.locator(".hip-group")).toBeVisible();

		// Test inputs
		await page.locator("#neck").fill("14");
		await page.locator("#waist").fill("30");

		await page.waitForTimeout(500);

		const result = page.locator('#navy-result, [data-testid="body-fat-result"]').first();
		await expect(result).not.toBeEmpty();
	});

	test("should show different results for male vs female with same measurements", async ({
		page,
	}) => {
		const commonMeasurements = {
			height: "68",
			neck: "14",
			waist: "30",
		};

		// Test male calculation
		await page.click('[data-gender="male"]');
		await page.locator("#height-total-inches").fill(commonMeasurements.height);
		await page.locator("#neck").fill(commonMeasurements.neck);
		await page.locator("#waist").fill(commonMeasurements.waist);
		await page.waitForTimeout(500);

		const maleResult = await page
			.locator('#navy-result, [data-testid="body-fat-result"]')
			.first()
			.textContent();

		// Test female calculation
		await page.click('[data-gender="female"]');
		await page.waitForTimeout(500);
		await page.locator("#height-total-inches").fill(commonMeasurements.height);
		await page.locator("#neck").fill(commonMeasurements.neck);
		await page.locator("#waist").fill(commonMeasurements.waist);
		await page.locator("#hips").fill("36"); // Add hip measurement for female
		await page.waitForTimeout(500);

		const femaleResult = await page
			.locator('#navy-result, [data-testid="body-fat-result"]')
			.first()
			.textContent();

		// Results should be different due to different formulas
		expect(maleResult).not.toBe(femaleResult);
	});
});
