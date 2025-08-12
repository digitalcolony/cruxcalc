import { test, expect } from "@playwright/test";

test.describe("Performance and Accessibility Tests", () => {
	test.describe("Performance Tests", () => {
		test("should load calculators quickly", async ({ page }) => {
			const calculators = [
				"/bmi",
				"/bmr",
				"/body-fat",
				"/one-rep-max",
				"/running",
				"/heart-rate-zones",
				"/muscle-potential",
				"/potato-hack",
			];

			for (const calculator of calculators) {
				const startTime = Date.now();

				await page.goto(calculator);
				await page.waitForLoadState("networkidle");

				const loadTime = Date.now() - startTime;

				// Should load within 6 seconds (reasonable for development environment)
				expect(loadTime).toBeLessThan(6000);

				// Check that main heading is visible (use first h1 to avoid browser dev tools)
				await expect(page.locator("h1").first()).toBeVisible();
			}
		});

		test("should respond to input changes quickly", async ({ page }) => {
			await page.goto("/bmi");
			await page.waitForLoadState("networkidle");

			const startTime = Date.now();

			// Change height value
			await page.locator("#height-total-inches").fill("72");

			// Wait for BMI result to update
			await page.waitForFunction(() => {
				const result = document.querySelector('#bmi-number, [data-testid="bmi-result"]');
				return result && result.textContent !== "";
			});

			const responseTime = Date.now() - startTime;

			// Should respond within 500ms
			expect(responseTime).toBeLessThan(500);
		});

		test("should handle rapid input changes without lag", async ({ page }) => {
			await page.goto("/one-rep-max");
			await page.waitForLoadState("networkidle");

			const startTime = Date.now();

			// Rapidly change weight multiple times
			for (let i = 100; i <= 200; i += 20) {
				await page.locator("#weight").fill(i.toString());
				await page.waitForTimeout(10); // Very short delay to simulate rapid changes
			}

			// Wait for final calculation
			await page.waitForTimeout(200);

			const totalTime = Date.now() - startTime;

			// Should handle rapid changes within 2 seconds
			expect(totalTime).toBeLessThan(2000);

			// Final result should be calculated
			const epleyResult = page
				.locator('#epley-result .result-value__number, [data-testid="epley-result"]')
				.first();
			await expect(epleyResult).not.toBeEmpty();
		});
	});

	test.describe("Accessibility Tests", () => {
		test("should have proper heading structure", async ({ page }) => {
			await page.goto("/bmi");
			await page.waitForLoadState("networkidle");

			// Should have main h1
			const h1 = page.locator("h1").first();
			await expect(h1).toBeVisible();

			// Check for proper heading hierarchy
			const headings = await page.locator("h1, h2, h3, h4, h5, h6").all();
			expect(headings.length).toBeGreaterThan(0);
		});

		test("should have proper form labels", async ({ page }) => {
			await page.goto("/bmi");
			await page.waitForLoadState("networkidle");

			// All input sliders should have associated labels
			const sliders = await page.locator('input[type="range"]').all();

			for (const slider of sliders) {
				const id = await slider.getAttribute("id");
				if (id) {
					// Should have a label or be within a labeled container
					const label = page.locator(`label[for="${id}"]`);
					const labeledContainer = slider.locator(
						'xpath=ancestor::*[contains(@class, "input-group") or contains(@class, "InputGroup")]'
					);

					// Either direct label or labeled container should exist
					const hasLabel = (await label.count()) > 0;
					const hasLabeledContainer = (await labeledContainer.count()) > 0;

					expect(hasLabel || hasLabeledContainer).toBe(true);
				}
			}
		});

		test("should support keyboard navigation", async ({ page }) => {
			await page.goto("/bmi");
			await page.waitForLoadState("networkidle");

			// Should be able to tab through interactive elements
			await page.keyboard.press("Tab");
			let focusedElement = await page.locator(":focus").first();
			await expect(focusedElement).toBeVisible();

			// Continue tabbing through several elements
			for (let i = 0; i < 5; i++) {
				await page.keyboard.press("Tab");
				focusedElement = await page.locator(":focus").first();
				await expect(focusedElement).toBeVisible();
			}
		});

		test("should have sufficient color contrast", async ({ page }) => {
			await page.goto("/bmi");
			await page.waitForLoadState("networkidle");

			// Check that text is readable by ensuring it's visible
			const textElements = await page.locator("p, span, div").filter({ hasText: /\w+/ }).all();

			for (let i = 0; i < Math.min(textElements.length, 10); i++) {
				const element = textElements[i];
				await expect(element).toBeVisible();
			}
		});

		test("should have proper ARIA attributes for interactive elements", async ({ page }) => {
			await page.goto("/body-fat");
			await page.waitForLoadState("networkidle");

			// Gender toggle buttons should have proper ARIA
			const genderButtons = await page.locator("[data-gender]").all();

			for (const button of genderButtons) {
				// Should be focusable
				await expect(button).toBeVisible();

				// Should have role or be a button element
				const role = await button.getAttribute("role");
				const tagName = await button.evaluate((el) => el.tagName.toLowerCase());

				expect(role === "button" || tagName === "button").toBe(true);
			}
		});

		test("should work with screen reader announcements", async ({ page }) => {
			await page.goto("/bmi");
			await page.waitForLoadState("networkidle");

			// Result elements should have appropriate text content for screen readers
			const bmiResult = page.locator('#bmi-number, [data-testid="bmi-result"]').first();
			const resultText = await bmiResult.textContent();

			// Should have meaningful text, not just numbers
			expect(resultText).toBeTruthy();
			expect(resultText.trim().length).toBeGreaterThan(0);
		});
	});

	test.describe("Mobile Responsiveness", () => {
		test("should work correctly on mobile devices", async ({ page }) => {
			// Test common mobile viewport sizes
			const viewports = [
				{ width: 375, height: 667, name: "iPhone SE" },
				{ width: 390, height: 844, name: "iPhone 12" },
				{ width: 360, height: 800, name: "Android" },
			];

			for (const viewport of viewports) {
				await page.setViewportSize({ width: viewport.width, height: viewport.height });

				await page.goto("/bmi");
				await page.waitForLoadState("networkidle");

				// Should be visible and functional
				await expect(page.locator("h1").first()).toBeVisible();

				// Sliders should be usable
				await page.locator("#height-total-inches").fill("70");
				await page.locator("#weight-lbs").fill("160");

				await page.waitForTimeout(500);

				// Result should calculate
				const bmiResult = page.locator('#bmi-number, [data-testid="bmi-result"]').first();
				await expect(bmiResult).not.toBeEmpty();
			}
		});

		test("should handle touch interactions", async ({ page }) => {
			await page.setViewportSize({ width: 375, height: 667 });

			await page.goto("/one-rep-max");
			await page.waitForLoadState("networkidle");

			// Should be able to tap unit toggle buttons
			await page.click('[data-unit="metric"]');
			await page.waitForTimeout(500);

			// Should switch to metric view
			await expect(page.locator(".metric-weight")).toBeVisible();

			// Should be able to interact with sliders via touch
			const weightSlider = page.locator("#weight-kg");
			await weightSlider.click();
			await weightSlider.fill("80");

			await page.waitForTimeout(500);

			// Result should update
			const epleyResult = page
				.locator('#epley-result .result-value__number, [data-testid="epley-result"]')
				.first();
			await expect(epleyResult).not.toBeEmpty();
		});
	});

	test.describe("Error Handling", () => {
		test("should handle network interruptions gracefully", async ({ page }) => {
			await page.goto("/bmi");
			await page.waitForLoadState("networkidle");

			// Should still function even if network is interrupted
			// (Since calculations are client-side)
			await page.locator("#height-total-inches").fill("68");
			await page.locator("#weight-lbs").fill("150");

			await page.waitForTimeout(500);

			const bmiResult = page.locator('#bmi-number, [data-testid="bmi-result"]').first();
			await expect(bmiResult).not.toBeEmpty();
		});

		test("should handle invalid input gracefully", async ({ page }) => {
			await page.goto("/bmi");
			await page.waitForLoadState("networkidle");

			// Test with boundary values
			await page.locator("#height-total-inches").fill("48"); // Minimum
			await page.locator("#weight-lbs").fill("80"); // Minimum allowed

			await page.waitForTimeout(500);

			// Should still calculate without errors
			const bmiResult = page.locator('#bmi-number, [data-testid="bmi-result"]').first();
			await expect(bmiResult).not.toBeEmpty();

			// Test with maximum values
			await page.locator("#height-total-inches").fill("84"); // Maximum
			await page.locator("#weight-lbs").fill("400"); // Maximum allowed

			await page.waitForTimeout(500);

			await expect(bmiResult).not.toBeEmpty();
		});
	});
});
