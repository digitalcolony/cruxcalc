const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");

async function generateImage(htmlFile, outputFile, width = 1200, height = 630) {
	console.log(`Generating ${outputFile} from ${htmlFile}...`);

	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	// Set viewport to exact image dimensions
	await page.setViewport({ width, height, deviceScaleFactor: 1 });

	// Load the HTML file
	const htmlPath = path.resolve(__dirname, htmlFile);
	await page.goto(`file://${htmlPath}`, { waitUntil: "networkidle0" });

	// Take screenshot
	const outputPath = path.resolve(__dirname, "..", outputFile);
	await page.screenshot({
		path: outputPath,
		type: "png",
		fullPage: false,
		clip: { x: 0, y: 0, width, height },
	});

	await browser.close();
	console.log(`✅ Generated ${outputFile}`);
}

async function generateAllImages() {
	console.log("🖼️  Starting social media image generation...\n");

	try {
		// Generate Open Graph images (1200x630)
		await generateImage("og-default.html", "og-image.png", 1200, 630);
		await generateImage("og-potato.html", "og-potato.png", 1200, 630);
		await generateImage("og-muscle.html", "og-muscle.png", 1200, 630);

		// Generate Twitter Card (1200x600)
		await generateImage("twitter-card.html", "twitter-card.png", 1200, 600);

		console.log("\n🎉 All social media images generated successfully!");
		console.log("\nGenerated files:");
		console.log("- /public/og-image.png (default Open Graph)");
		console.log("- /public/og-potato.png (Potato Hack page)");
		console.log("- /public/og-muscle.png (Muscle Potential page)");
		console.log("- /public/twitter-card.png (Twitter Card)");
	} catch (error) {
		console.error("❌ Error generating images:", error);
		process.exit(1);
	}
}

// Run the generator
generateAllImages();
