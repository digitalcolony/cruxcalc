import { test, expect } from "@playwright/test";

test.describe("Cross-Calculator Integration", () => {
	test("should sync height values between BMI and BMR calculators", async ({ page }) => {
		// Capture console logs
		const logs = [];
		page.on("console", (msg) => logs.push(msg.text()));

		// Start at BMI calculator
		await page.goto("/bmi");
		await page.waitForLoadState("domcontentloaded");
		await page.waitForSelector("#height-total-inches", { state: "visible" });

		// Wait for SharedValues to be available and initialized
		await page.waitForFunction(() => {
			return typeof window.SharedValues !== "undefined";
		});

		// Wait a bit more for all components to initialize
		await page.waitForTimeout(2000);

		// Directly test SharedValues system by bypassing the component event system
		await page.evaluate(() => {
			console.log("=== DIRECT SHAREDVALUES TEST ===");

			// Get the SharedValues instance
			const sharedValues = new window.SharedValues();

			// Save consistent height values so unit conversion doesn't overwrite them
			const heightInInches = 72;
			const heightInCm = Math.round(heightInInches * 2.54); // 72" = 183cm
			const feet = Math.floor(heightInInches / 12);
			const inches = heightInInches % 12;

			sharedValues.update({
				heightTotalInches: heightInInches,
				heightCm: heightInCm,
				heightFeet: feet,
				heightInches: inches,
			});

			console.log("✅ Saved consistent height values:", {
				heightTotalInches: heightInInches,
				heightCm: heightInCm,
				heightFeet: feet,
				heightInches: inches,
			});

			// Verify it was saved
			const savedInches = sharedValues.get("heightTotalInches");
			const savedCm = sharedValues.get("heightCm");
			console.log("📦 Retrieved values:", { heightTotalInches: savedInches, heightCm: savedCm });

			// Also update the DOM element directly to match
			const slider = document.getElementById("height-total-inches");
			if (slider) {
				slider.value = heightInInches.toString();
				const display = document.getElementById("height-total-inches-display");
				if (display) {
					display.textContent = `${feet}'${inches}"`;
				}
			}
		});

		// Wait for debounced operations
		await page.waitForTimeout(1000);

		// Navigate to BMR calculator
		await page.goto("/bmr");
		await page.waitForLoadState("domcontentloaded");
		await page.waitForSelector("#height-total-inches", { state: "visible" });

		// Wait for SharedValues to be available
		await page.waitForFunction(() => {
			return typeof window.SharedValues !== "undefined";
		});

		// Wait for component initialization
		await page.waitForTimeout(2000);

		// Test what value was actually loaded
		const actualValue = await page.evaluate(() => {
			const sharedValues = new window.SharedValues();
			return sharedValues.get("heightTotalInches");
		});
		console.log("🔍 Final SharedValues heightTotalInches:", actualValue);

		// Print relevant logs
		console.log("=== RELEVANT LOGS ===");
		logs
			.filter((log) => log.includes("SharedValues") || log.includes("heightTotalInches"))
			.forEach((log) => console.log(log));

		// Height should be synchronized - if this fails, it means the SharedValues system itself is broken
		await expect(page.locator("#height-total-inches")).toHaveValue("72");
	});

	test("should sync weight values between BMI and BMR calculators", async ({ page }) => {
		// Capture console logs
		const logs = [];
		page.on("console", (msg) => logs.push(msg.text()));

		// Start at BMI calculator
		await page.goto("/bmi");
		await page.waitForLoadState("domcontentloaded");
		await page.waitForSelector("#weight-lbs", { state: "visible" });

		// Wait for SharedValues to be available
		await page.waitForFunction(() => {
			return typeof window.SharedValues !== "undefined";
		});

		// Wait for components to initialize
		await page.waitForTimeout(2000);

		// Change weight value with consistent unit values
		await page.evaluate(() => {
			console.log("=== DIRECT WEIGHT TEST ===");

			// Save consistent weight values that round-trip correctly
			const weightInLbs = 175;
			// Calculate the precise kg value that will convert back to 175 lbs
			const preciseKg = weightInLbs * 0.453592; // 79.3784
			const weightInKg = Math.round(preciseKg * 10) / 10; // 79.4 kg

			const sharedValues = new window.SharedValues();
			sharedValues.update({
				weightLbs: weightInLbs,
				weightKg: weightInKg,
			});

			console.log("✅ Saved consistent weight values:", {
				weightLbs: weightInLbs,
				weightKg: weightInKg,
			});

			// Verify round-trip conversion
			const roundTripLbs = Math.round(weightInKg / 0.453592);
			console.log("🔄 Round-trip test:", { original: weightInLbs, converted: roundTripLbs });

			// Also update DOM to match
			const slider = document.getElementById("weight-lbs");
			if (slider) {
				slider.value = weightInLbs.toString();
				const display = document.getElementById("weight-lbs-display");
				if (display) {
					display.textContent = `${weightInLbs} lbs`;
				}
			}
		});

		// Wait for debounced save
		await page.waitForTimeout(1000);

		// Navigate to BMR calculator
		await page.goto("/bmr");
		await page.waitForLoadState("domcontentloaded");
		await page.waitForSelector("#weight-lbs", { state: "visible" });

		// Wait for SharedValues and component initialization
		await page.waitForFunction(() => {
			return typeof window.SharedValues !== "undefined";
		});
		await page.waitForTimeout(2000);

		// Print debugging info
		console.log("=== WEIGHT SYNC DEBUG ===");
		logs
			.filter((log) => log.includes("SharedValues") || log.includes("weightLbs"))
			.forEach((log) => console.log(log));

		// Weight should be synchronized
		await expect(page.locator("#weight-lbs")).toHaveValue("175");
	});
});
