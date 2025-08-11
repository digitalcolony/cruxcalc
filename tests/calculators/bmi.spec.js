import { test, expect } from "@playwright/test";

test.describe("BMI Calculator", () => {
test.beforeEach(async ({ page }) => {
await page.goto("/bmi");
await page.waitForLoadState("networkidle");
});

test("should load with correct default values", async ({ page }) => {
await expect(page.locator("h1")).toContainText("BMI Calculator");
await expect(page.locator("#height-total-inches")).toHaveValue("68");
await expect(page.locator("#weight-lbs")).toHaveValue("160");

const bmiResult = page.locator(".result-value__number").first();
await expect(bmiResult).not.toBeEmpty();
});
});
