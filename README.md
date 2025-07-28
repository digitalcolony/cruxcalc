# Potato Hack Fitness Calculators 🥔💪

**Modern Health & Fitness Calculators - Available as Web App & Desktop App**

This is a collection of sleek, user-friendly health and fitness calculators built with Astro. Say goodbye to boring, outdated calculator interfaces and hello to engaging, modern tools for your health journey. **Download as a desktop or mobile app for the best experience!**

## ✨ Features

- **🧮 BMI Calculator** - Calculate your Body Mass Index with instant visual feedback
- **🔥 BMR Calculators** - Multiple basal metabolic rate formulas:
  - Harris-Benedict Equation
  - Mifflin-St Jeor Equation
  - Katch-McArdle Formula (requires body fat %)
- **� Body Fat Calculator** - Navy circumference method for accurate body fat percentage measurement
- **❤️ Heart Rate Zones Calculator** - Calculate optimal training zones using Karvonen and percentage methods
- **�💪 One Rep Max Calculator** - Estimate maximum lift capacity using Epley, Brzycki, and Lombardi formulas
- **🏋️ Muscle Potential Calculator** - Casey Butt's scientific formula for predicting natural muscle-building potential
- **🏃 Running Pace Calculator** - Calculate race finish times for 5K, 10K, half marathon, and full marathon distances
- **🥔 Potato Hack Calculator** - Calorie deficit calculator for the potato-based weight loss approach with 3, 4, 5 day and weekly estimates
- **📱 Progressive Web App (PWA)** - Download and install as a desktop or mobile app
- **⚡ Always Up-to-Date** - Automatic updates when new features are added
- **🔄 Shared Values System** - Input data once, use across all calculators
- **📱 Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **⚡ Fast & Lightweight** - Built with Astro for optimal performance

## 📱 Download as an App

### Desktop Installation (Windows, Mac, Linux)

1. Visit [calc.potatohack.com](https://calc.potatohack.com) in Chrome, Edge, or Firefox
2. Look for the **"Install"** or **"Download"** icon in your browser's address bar
3. Click to install - it will appear as a standalone desktop app
4. Launch from your desktop, taskbar, or start menu

### Mobile Installation (Android & iOS)

1. Open [calc.potatohack.com](https://calc.potatohack.com) in your mobile browser
2. **Android**: Tap "Add to Home Screen" or "Install App"
3. **iOS**: Tap the Share button → "Add to Home Screen"
4. The app icon will appear on your home screen

### App Benefits

- **🖥️ Standalone Window** - Opens without browser UI for distraction-free calculations
- **⚡ Instant Access** - Launch directly from desktop/home screen
- **🔄 Auto-Updates** - Always get the latest features and bug fixes
- **💾 Offline Ready** - Basic functionality works without internet
- **🎯 Native Feel** - Behaves like a traditional desktop/mobile app

## 🌐 Social Media Optimized

Professional link previews when shared on:

- **Facebook** - Custom branded Open Graph cards
- **Twitter** - Dedicated Twitter Card images
- **LinkedIn** - Professional preview cards
- **WhatsApp/SMS** - Rich link previews

Each calculator has its own themed social media image for better engagement.

## 🚀 Project Structure

```text
/
├── public/
│   ├── favicon.svg
│   ├── site.webmanifest         # PWA configuration
│   ├── og-*.png                 # Social media images
│   ├── android-chrome-*.png     # PWA icons
│   └── image-templates/         # Social media image generators
├── src/
│   ├── components/              # Reusable Astro components
│   │   └── Header.astro         # Navigation with active states
│   ├── layouts/
│   │   └── Layout.astro         # Main layout with SEO & social meta
│   ├── pages/                   # Calculator pages (auto-routed)
│   │   ├── index.astro          # Homepage with calculator grid
│   │   ├── bmi.astro            # BMI Calculator
│   │   ├── bmr.astro            # BMR Calculator (unified)
│   │   ├── body-fat.astro       # Body Fat Calculator (Navy Method)
│   │   ├── heart-rate-zones.astro # Heart Rate Zones Calculator
│   │   ├── one-rep-max.astro    # One Rep Max Calculator
│   │   ├── muscle-potential.astro # Casey Butt formula
│   │   ├── running.astro        # Running Pace Calculator
│   │   └── potato-hack.astro    # Potato Hack Calculator
│   └── styles/
│       └── global.css           # Neo-brutalist styling
├── astro.config.mjs             # Site config with calc.potatohack.com
├── package.json
└── tsconfig.json
```

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 🧮 Available Calculators

### BMI Calculator (`/bmi`)

Calculate your Body Mass Index with instant visual feedback and health category classification.

### BMR Calculators (`/bmr`)

- **Harris-Benedict** - Classic formula from 1919, revised in 1984
- **Mifflin-St Jeor** - More accurate for modern populations (1990)
- **Katch-McArdle** - Most accurate when body fat % is known

### Body Fat Calculator (`/body-fat`)

Calculate body fat percentage using the U.S. Navy circumference method featuring:

- Gender-specific formulas for accurate measurements
- Real-time body fat category feedback
- Visual category indicators (Essential, Athletic, Fitness, Average, Obese)
- Measurement guidance for neck, waist, and hip circumferences
- Supports both imperial and metric units

### Heart Rate Zones Calculator (`/heart-rate-zones`)

Calculate personalized heart rate training zones using:

- **Karvonen Method** - Uses resting heart rate for personalized zones
- **Percentage Method** - Based on maximum heart rate percentage
- Five training zones: Active Recovery, Aerobic Base, Aerobic, Lactate Threshold, Neuromuscular Power
- Real-time zone feedback and training recommendations
- Age-based maximum heart rate estimation

### One Rep Max Calculator (`/one-rep-max`)

Estimate your maximum lift capacity using three proven formulas:

- **Epley Formula** - Most commonly used in powerlifting
- **Brzycki Formula** - Popular alternative with different rep range focus
- **Lombardi Formula** - Traditional formula for strength estimation
- Compare results across all three methods
- Input current weight and reps to calculate 1RM

### Muscle Potential Calculator (`/muscle-potential`)

Uses Casey Butt's scientifically-validated formula to predict natural muscle-building potential based on:

- Height
- Wrist circumference (frame size indicator)
- Ankle circumference (frame size indicator)
- Body fat percentage

### Running Pace Calculator (`/running`)

Calculate race finish times based on your per-mile pace with features including:

- Interactive pace slider with 5-second increments
- Finish times for 5K, 10K, half marathon, and full marathon
- Pace categorization (Elite, Sub-Elite, Competitive, Advanced, Intermediate, Recreational, Beginner, Walking/Jogging, Walking)
- Persistent pace preference using localStorage

### Potato Hack Calculator (`/potato-hack`)

Specialized calculator for the potato-based weight loss approach featuring:

- Calorie deficit calculations based on potato consumption
- BMR integration from other calculators
- Adjustable potato portions and cooking method considerations
- Weight loss timeline projections

## 🔄 Shared Values System

The calculators feature a smart shared values system that allows you to:

- Enter your basic measurements once
- Use them across all calculators automatically
- Save time and ensure consistency
- Values persist during your browser session

## 🎨 Design Philosophy

- **Neo-Brutalist Design** - Bold, functional design with strong visual hierarchy
- **Modern & Clean** - Contemporary design that's easy on the eyes
- **Mobile-First** - Responsive design that works on any device
- **PWA Standards** - App-like experience with offline capabilities
- **Accessibility** - Semantic HTML and keyboard navigation support
- **Performance** - Fast loading with minimal JavaScript
- **User-Friendly** - Intuitive interfaces with helpful explanations

## 📊 Scientific Accuracy

All formulas implemented are scientifically validated:

- **BMI** uses the standard WHO classification
- **BMR** formulas are peer-reviewed and widely accepted
- **Body Fat (Navy Method)** developed by the Naval Health Research Center, widely used by U.S. military
- **Heart Rate Zones** based on Karvonen method and percentage-based calculations used by sports scientists
- **One Rep Max** formulas are established strength training standards used in powerlifting and sports
- **Casey Butt's muscle potential** formula is based on extensive analysis of drug-free bodybuilders
- **Potato hack calculations** include resistant starch reduction for cooled potatoes (17%)

## 🛠️ Built With

- **[Astro](https://astro.build)** - Modern static site generator
- **Progressive Web App** - PWA standards for app-like experience
- **Vanilla JavaScript** - For calculator logic and interactivity
- **CSS3** - Modern styling with custom properties and grid/flexbox
- **HTML5** - Semantic markup for accessibility
- **Open Graph & Twitter Cards** - Professional social media sharing

## 🚀 Getting Started

### For Users

Simply visit [calc.potatohack.com](https://calc.potatohack.com) and start calculating! Optionally download as an app for the best experience.

### For Developers

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:4321` to see the app in action!

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Whether it's:

- Adding new calculators
- Improving existing formulas
- Enhancing the UI/UX
- Fixing bugs
- Improving documentation

Feel free to open an issue or submit a pull request.

## 🔗 Learn More

- **Astro Documentation** - [docs.astro.build](https://docs.astro.build)

---

_Built with 🥔 for the health and fitness community - Available everywhere as a web app!_
