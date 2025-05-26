# CruxCalc 🏃‍♂️💪

**Modern Health & Fitness Calculators**

CruxCalc is a collection of sleek, user-friendly health and fitness calculators built with Astro. Say goodbye to boring, outdated calculator interfaces and hello to engaging, modern tools for your health journey.

## ✨ Features

- **🧮 BMI Calculator** - Calculate your Body Mass Index with instant visual feedback
- **🔥 BMR Calculators** - Multiple basal metabolic rate formulas:
  - Harris-Benedict Equation
  - Mifflin-St Jeor Equation
  - Katch-McArdle Formula (requires body fat %)
- **💪 Muscle Potential Calculator** - Casey Butt's scientific formula for predicting natural muscle-building potential
- **🔄 Shared Values System** - Input data once, use across all calculators
- **📱 Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **⚡ Fast & Lightweight** - Built with Astro for optimal performance

## 🚀 Project Structure

```text
/
├── public/
│   ├── favicon.svg
│   └── sharedValues.js          # Cross-calculator data sharing
├── src/
│   ├── components/              # Reusable Astro components
│   ├── layouts/
│   │   └── Layout.astro         # Main layout template
│   ├── pages/                   # Calculator pages (auto-routed)
│   │   ├── index.astro          # Homepage with calculator grid
│   │   ├── bmi.astro           # BMI Calculator
│   │   ├── bmr-harris-benedict.astro
│   │   ├── bmr-katch-mcardle.astro
│   │   ├── bmr-mifflin-st-jeor.astro
│   │   └── muscle-potential.astro # Casey Butt formula
│   ├── styles/
│   │   └── global.css          # Modern styling with CSS custom properties
│   └── utils/                  # Utility functions
├── astro.config.mjs
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

### BMR Calculators

- **Harris-Benedict** (`/bmr-harris-benedict`) - Classic formula from 1919, revised in 1984
- **Mifflin-St Jeor** (`/bmr-mifflin-st-jeor`) - More accurate for modern populations (1990)
- **Katch-McArdle** (`/bmr-katch-mcardle`) - Most accurate when body fat % is known

### Muscle Potential Calculator (`/muscle-potential`)

Uses Casey Butt's scientifically-validated formula to predict natural muscle-building potential based on:

- Height
- Wrist circumference (frame size indicator)
- Ankle circumference (frame size indicator)
- Body fat percentage

## 🔄 Shared Values System

CruxCalc features a smart shared values system that allows you to:

- Enter your basic measurements once
- Use them across all calculators automatically
- Save time and ensure consistency
- Values persist during your browser session

## 🎨 Design Philosophy

- **Modern & Clean** - Contemporary design that's easy on the eyes
- **Mobile-First** - Responsive design that works on any device
- **Accessibility** - Semantic HTML and keyboard navigation support
- **Performance** - Fast loading with minimal JavaScript
- **User-Friendly** - Intuitive interfaces with helpful explanations

## 📊 Scientific Accuracy

All formulas implemented are scientifically validated:

- BMI uses the standard WHO classification
- BMR formulas are peer-reviewed and widely accepted
- Casey Butt's muscle potential formula is based on extensive analysis of drug-free bodybuilders

## 🛠️ Built With

- **[Astro](https://astro.build)** - Modern static site generator
- **Vanilla JavaScript** - For calculator logic and interactivity
- **CSS3** - Modern styling with custom properties and grid/flexbox
- **HTML5** - Semantic markup for accessibility

## 🚀 Getting Started

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd cruxcalc
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
   Navigate to `http://localhost:4321` to see CruxCalc in action!

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
- **Casey Butt Research** - Scientific basis for muscle potential calculations
- **BMR Formula Comparisons** - Understanding different metabolic rate equations

---

_Built with ❤️ for the health and fitness community_
