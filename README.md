# Health & Fitness Calculators 🏃‍♂️💪

**Modern Health & Fitness Calculators**

This app is a collection of sleek, user-friendly health and fitness calculators built with Astro. Say goodbye to boring, outdated calculator interfaces and hello to engaging, modern tools for your health journey.

## ✨ Features

- **🧮 BMI Calculator** - Calculate your Body Mass Index with instant visual feedback
- **🔥 BMR Calculators** - Multiple basal metabolic rate formulas:
  - Harris-Benedict Equation
  - Mifflin-St Jeor Equation
  - Katch-McArdle Formula (requires body fat %)
- **💪 Muscle Potential Calculator** - Casey Butt's scientific formula for predicting natural muscle-building potential
- **🏃 Running Pace Calculator** - Calculate race finish times for 5K, 10K, half marathon, and full marathon distances
- **🥔 Potato Hack Calculator** - Calorie deficit calculator for the potato-based weight loss approach
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
│   │   ├── bmi.astro            # BMI Calculator
│   │   ├── bmr.astro            # BMR Calculator (unified)
│   │   ├── muscle-potential.astro # Casey Butt formula
│   │   ├── running.astro        # Running Pace Calculator
│   │   └── potato-hack.astro    # Potato Hack Calculator
│   ├── styles/
│       └── global.css           # Modern styling with CSS custom properties
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

- **Harris-Benedict** - Classic formula from 1919, revised in 1984
- **Mifflin-St Jeor** - More accurate for modern populations (1990)
- **Katch-McArdle** - Most accurate when body fat % is known

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

_Built with ❤️ for the health and fitness community_
