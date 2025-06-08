const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const faviconSizes = [
	{ size: 16, name: "favicon-16x16.png" },
	{ size: 32, name: "favicon-32x32.png" },
	{ size: 180, name: "apple-touch-icon.png" },
];

async function generateFavicons() {
	console.log("🎯 Starting favicon generation...");

	let browser;
	try {
		browser = await puppeteer.launch({
			headless: "new",
			args: ["--no-sandbox", "--disable-setuid-sandbox"],
		});
		const page = await browser.newPage();

		// Create a simple favicon design instead of using the complex SVG
		for (const favicon of faviconSizes) {
			console.log(`Generating ${favicon.name}...`);

			const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {
                        margin: 0;
                        padding: 0;
                        width: ${favicon.size}px;
                        height: ${favicon.size}px;
                        background: #f5f5dc;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-family: monospace;
                        border: 2px solid #000;
                        box-sizing: border-box;
                    }
                    .icon {
                        background: #ff3366;
                        color: white;
                        width: ${Math.floor(favicon.size * 0.6)}px;
                        height: ${Math.floor(favicon.size * 0.6)}px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-weight: bold;
                        font-size: ${Math.floor(favicon.size * 0.3)}px;
                        border: 2px solid #000;
                    }
                </style>
            </head>
            <body>
                <div class="icon">🥔</div>
            </body>
            </html>
            `;

			await page.setContent(html);
			await page.setViewport({ width: favicon.size, height: favicon.size });

			const outputPath = path.join(__dirname, "..", favicon.name);
			await page.screenshot({
				path: outputPath,
				type: "png",
				clip: { x: 0, y: 0, width: favicon.size, height: favicon.size },
			});

			console.log(`✅ Generated ${favicon.name}`);
		}
	} catch (error) {
		console.error("Error generating favicons:", error);
	} finally {
		if (browser) {
			await browser.close();
		}
	}

	console.log("🎉 Favicon generation completed!");
}

generateFavicons();
