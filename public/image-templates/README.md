# Social Media Image Generation Guide

This folder contains HTML templates for generating social media images for CruxCalc.

## Templates Available:

- `og-default.html` - Default Open Graph image (1200x630px)
- `og-potato.html` - Potato Hack Calculator specific (1200x630px)
- `og-muscle.html` - Muscle Potential Calculator specific (1200x630px)
- `twitter-card.html` - Twitter Card format (1200x600px)

## How to Generate Images:

### Method 1: Online Screenshot Tools

1. Upload each HTML file to a service like:
   - https://htmlcsstoimage.com/
   - https://www.bannerbear.com/
   - https://placid.app/

### Method 2: Browser Screenshots

1. Open each HTML file in Chrome
2. Set browser window to exact dimensions (1200x630 or 1200x600)
3. Take full page screenshot
4. Save as PNG with appropriate filename

### Method 3: Puppeteer (Node.js)

```bash
npm install puppeteer
```

```javascript
const puppeteer = require("puppeteer");

async function generateImage(htmlFile, outputFile, width = 1200, height = 630) {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.setViewport({ width, height });
	await page.goto(`file://${htmlFile}`);
	await page.screenshot({ path: outputFile, type: "png" });
	await browser.close();
}

// Generate all images
generateImage("./og-default.html", "../og-image.png");
generateImage("./og-potato.html", "../og-potato.png");
generateImage("./og-muscle.html", "../og-muscle.png");
generateImage("./twitter-card.html", "../twitter-card.png", 1200, 600);
```

## Required Output Files:

- `/public/og-image.png` (1200x630px)
- `/public/og-potato.png` (1200x630px)
- `/public/og-muscle.png` (1200x630px)
- `/public/twitter-card.png` (1200x600px)

## Design System Used:

- **Font**: JetBrains Mono (Google Fonts)
- **Primary Color**: #ff3366 (red)
- **Secondary**: #00ff88 (green)
- **Accent**: #3366ff (blue)
- **Background**: #f5f5dc (beige)
- **Text**: #000000 (black)
- **Borders**: 4-6px solid black
- **Shadows**: Bold offset shadows (6-12px)
- **Style**: Neo-brutalist design

The templates are already sized correctly and use web-safe fonts that will render consistently across different screenshot tools.
