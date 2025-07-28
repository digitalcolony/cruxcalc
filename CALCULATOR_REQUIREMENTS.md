# Calculator Requirements Document

## Project Overview

**Calculator Name:** Body Fat Percentage Calculator
**Project:** CruxCalc - Potato Hack Fitness Calculators
**Date:** July 27, 2025
**Status:** Body Fat Calculator - Requirements Complete

## Existing Calculator Analysis

Current calculators implemented:

- ✅ BMI Calculator - Body Mass Index with visual indicators
- ✅ BMR Calculator - Basal Metabolic Rate (3 formulas comparison)
- ✅ Heart Rate Zones - Training zone calculator
- ✅ Muscle Potential - Casey Butt's maximum muscle formulas
- ✅ Potato Hack - Calorie deficit with resistant starch
- ✅ Running Pace - Race time predictions for 5K/10K/half/full marathon
- ✅ One Rep Max Calculator - 1RM estimation using 3 proven formulas

## Suggested Next Calculator Options

### Option 1: TDEE Calculator (Total Daily Energy Expenditure)

**Purpose:** Calculate total calories burned per day including activity multipliers
**Rationale:** Natural progression from BMR, highly requested fitness metric
**Complexity:** Medium
**Dependencies:** BMR calculator integration

### Option 2: Body Fat Percentage Calculator

**Purpose:** Estimate body fat using multiple measurement methods
**Rationale:** Complements BMI and muscle potential calculators
**Complexity:** Medium-High
**Dependencies:** None

### Option 3: One Rep Max Calculator

**Purpose:** Predict maximum lift capacity from submaximal lifts
**Rationale:** Strength training focus, fits "hack" theme
**Complexity:** Low-Medium
**Dependencies:** None

### Option 4: Macronutrient Calculator

**Purpose:** Calculate protein/carb/fat targets based on goals
**Rationale:** Nutrition focus, complements TDEE/BMR
**Complexity:** Medium-High
**Dependencies:** TDEE/BMR integration

### Option 5: Hydration Calculator

**Purpose:** Calculate daily water intake needs
**Rationale:** Simple, universal health metric
**Complexity:** Low
**Dependencies:** Possible weight integration

## Technical Requirements (Standard for All Calculators)

### 1. Framework & Structure

- **Platform:** Astro 5.12.0 static site generation
- **File Structure:** `/src/pages/[calculator-name].astro`
- **Layout:** Import from `../layouts/Layout.astro`
- **Styling:** Neo-brutalist design system with CSS custom properties

### 2. Design System Compliance

- **Color Scheme:** Primary color with thick borders and bold shadows
- **Typography:** Bold, high-contrast text hierarchy
- **Layout:** Two-column grid (inputs left, results right)
- **Responsive:** Mobile-first design with breakpoints at 768px, 1024px
- **Components:** Consistent button styles, input controls, cards

### 3. Shared Functionality

- **Cross-Page Data:** Integration with `/public/sharedValues.js`
- **Age Synchronization:** Must sync age values with BMR/HR calculators
- **Local Storage:** Page-specific settings persistence
- **Navigation:** Header integration with short nav label

### 4. Input Standards

- **Range Sliders:** Custom-styled with thumb design matching existing
- **Toggle Buttons:** Gender/unit selection with active states
- **Validation:** Real-time input validation and error handling
- **Debounced Updates:** 100ms delay for smooth calculation updates

### 5. Results Display

- **Primary Metric:** Large, prominent display with units
- **Secondary Data:** Supporting calculations and comparisons
- **Explanatory Text:** Method descriptions and formulas used
- **Visual Indicators:** Progress bars, zones, or category displays where applicable

### 6. Information Architecture

- **Educational Content:** Info sections explaining the science/methodology
- **Practical Application:** How to use the results effectively
- **Limitations:** Accuracy disclaimers and method limitations
- **References:** Scientific backing or formula sources

## Specific Requirements Template

### Calculator Name: Body Fat Percentage Calculator

#### 1. Functional Requirements

**Primary Function:**

- [ ] Calculate body fat percentage using U.S. Navy circumference method (primary)
- [ ] Calculate body fat percentage using enhanced BMI method (secondary comparison)
- [ ] Display both results with accuracy ranges and method explanations
- [ ] Show body fat categories and age-adjusted ideal ranges

**Input Requirements:**

- [ ] Gender selection: Male/Female toggle button
- [ ] Age: Range slider from 18-80 years (shared with BMR/HR calculators)
- [ ] Height: Range slider with ft/in and cm options (leverage BMI integration)
- [ ] Weight: Range slider with lbs/kg options (leverage BMI integration)
- [ ] Neck circumference: Range slider 10-25 inches (25-63 cm)
- [ ] Waist circumference: Range slider 20-60 inches (51-152 cm)
- [ ] Hip circumference: Range slider 25-65 inches (64-165 cm) - Women only
- [ ] Unit system support (Imperial/Metric toggle)
- [ ] Real-time calculation updates with debouncing

**Output Requirements:**

- [ ] Primary result: Navy method body fat percentage (large, prominent display)
- [ ] Secondary result: BMI method body fat percentage (comparison display)
- [ ] Body fat category classification (Essential/Athletic/Fitness/Average/Obese)
- [ ] Age-adjusted ideal body fat range (Jackson & Pollock standards)
- [ ] Fat mass and lean body mass calculations
- [ ] Method accuracy disclaimers and explanations

#### 2. Calculation Logic

**Navy Method Formulas (Hodgdon & Beckett, 1984):**

- [ ] **Men**: `495 / (1.0324 - 0.19077×log10(waist-neck) + 0.15456×log10(height)) - 450`
- [ ] **Women**: `495 / (1.29579 - 0.35004×log10(waist+hip-neck) + 0.22100×log10(height)) - 450`

**Enhanced BMI Method (Deurenberg Formula, Updated):**

- [ ] **Adults**: `BF% = 1.39×BMI + 0.16×age - 10.34×gender - 9` (gender: 0=female, 1=male)
- [ ] **Children**: `BF% = 1.51×BMI - 0.70×age - 3.6×gender + 1.4` (if age < 18)

**Supporting Calculations:**

- [ ] **Fat Mass**: `FM = (BF% / 100) × Weight`
- [ ] **Lean Mass**: `LM = Weight - FM`
- [ ] **BMI**: `BMI = weight(kg) / height(m)²` (integrate with existing BMI calculator)

**Data Processing:**

- [ ] Round body fat percentage to 1 decimal place
- [ ] Round fat/lean mass to 1 decimal place
- [ ] Input validation for all measurements
- [ ] Handle edge cases (extreme measurements)
- [ ] Default values: 30yr male, 5'10", 175lbs, 15" neck, 32" waist

#### 3. User Experience

**Interface Design:**

- [ ] Two-column layout (inputs left, results right)
- [ ] Gender toggle at top of inputs
- [ ] Age slider (shared value synchronization)
- [ ] Height/Weight sliders (BMI integration)
- [ ] Circumference measurement sliders
- [ ] Unit toggle (Imperial/Metric)
- [ ] Primary Navy result card (large, prominent)
- [ ] Secondary BMI comparison card
- [ ] Body fat category indicator with visual scale
- [ ] Age-adjusted ideal range display

**Interaction Flow:**

- [ ] Page loads with default values
- [ ] Gender selection updates formula and required inputs
- [ ] Female selection shows hip measurement slider
- [ ] Age sync with BMR/HR calculators
- [ ] Height/Weight sync with BMI calculator
- [ ] Real-time updates with debounced calculations
- [ ] Unit conversion affects all measurements

#### 4. Integration Requirements

**Shared Data Synchronization:**

- [ ] Age: Sync with BMR and Heart Rate calculators
- [ ] Height: Sync with BMI calculator
- [ ] Weight: Sync with BMI calculator
- [ ] Gender: Sync with BMR calculator
- [ ] Unit preferences: Global setting

**localStorage Keys:**

- [ ] `cruxcalc-bf-neck` (store in inches, convert for display)
- [ ] `cruxcalc-bf-waist` (store in inches, convert for display)
- [ ] `cruxcalc-bf-hips` (store in inches, convert for display)
- [ ] `cruxcalc-bf-units` (imperial/metric preference)
- [ ] Use existing shared keys for age, height, weight, gender

**Navigation:**

- [ ] Short navigation label: "Body Fat" (8 characters max)
- [ ] URL path: `/body-fat`
- [ ] Page title: "Body Fat Percentage Calculator - Navy & BMI Methods"
- [ ] Meta description: "Calculate body fat percentage using Navy circumference method and BMI formula. Get accurate body composition analysis with category classifications."

#### 5. Content Requirements

**Body Fat Categories (ACE Standards):**

- [ ] **Essential Fat**: Men 2-5% | Women 10-13%
- [ ] **Athletes**: Men 6-13% | Women 14-20%
- [ ] **Fitness**: Men 14-17% | Women 21-24%
- [ ] **Average**: Men 18-24% | Women 25-31%
- [ ] **Obese**: Men 25%+ | Women 32%+

**Age-Adjusted Ideal Ranges (Jackson & Pollock):**

- [ ] Display ideal body fat percentage for user's age
- [ ] Show progression of healthy ranges by decade
- [ ] Explain why body fat naturally increases with age

**Educational Sections:**

- [ ] Navy Method: Military validation, circumference accuracy
- [ ] BMI Method: Quick comparison, limitations explanation
- [ ] Why Both Methods: Accuracy range demonstration
- [ ] Measurement Instructions: How to measure circumferences correctly
- [ ] Accuracy Limitations: ±3-4% typical variation
- [ ] Body Fat vs BMI: Why body composition matters more than weight

**Formula Details Section:**

- [ ] **Navy Method**: Developed by Naval Health Research Center, ±3-4% accuracy
- [ ] **BMI Method**: Enhanced Deurenberg formula, ±4-5% accuracy
- [ ] **Comparison Value**: Showing both methods builds confidence in results
- [ ] **Measurement Tips**: Proper technique for neck, waist, hip measurements

**SEO Content:**

- [ ] Page title: "Body Fat Calculator - Navy Method & BMI Body Fat Percentage"
- [ ] Meta description: "Calculate body fat percentage using proven Navy circumference method and BMI formula. Get accurate body composition analysis with age-adjusted recommendations."
- [ ] Target keywords: body fat calculator, body fat percentage, Navy method, circumference measurements

#### 6. Technical Specifications

**Performance:**

- [ ] Instant calculation updates (< 50ms)
- [ ] Smooth slider interactions
- [ ] Mobile-optimized circumference input controls

**Browser Support:**

- [ ] Modern browser compatibility (ES6+)
- [ ] Touch-friendly measurement sliders
- [ ] Accessibility: ARIA labels, keyboard navigation

**Data Persistence:**

- [ ] Remember user's measurements across sessions
- [ ] Sync shared values (age, height, weight) with other calculators
- [ ] Persist unit preferences globally

**Conversion Logic:**

- [ ] 1 inch = 2.54 cm (precise conversion)
- [ ] 1 pound = 0.453592 kg (precise conversion)
- [ ] Display metric values to 1 decimal place
- [ ] Store internally in imperial for consistency

**UI Matching Design System:**

- [ ] Same two-column layout (inputs left, results right)
- [ ] Same slider styling and behavior
- [ ] Same card design for results
- [ ] Same color scheme and typography
- [ ] Same responsive breakpoints

**Gender-Specific Interface:**

- [ ] Hide/show hip measurement based on gender selection
- [ ] Update formula descriptions dynamically
- [ ] Adjust default values by gender
- [ ] Update ideal ranges by gender

### Calculator Name: One Rep Max Calculator

#### 1. Functional Requirements

**Primary Function:**

- [x] Calculate estimated one-repetition maximum using three established formulas
- [x] Allow users to input weight lifted and repetitions performed
- [x] Display results from Epley, Brzycki, and Lombardi formulas simultaneously

**Input Requirements:**

- [x] Weight lifted: Range slider from 50-500 pounds with kg conversion option
- [x] Repetitions: Range slider from 1-10 reps
- [x] Unit system support (Imperial lbs/Metric kg toggle)
- [x] Input validation: Weight 50-500 lbs (22.7-226.8 kg), Reps 1-10
- [x] Real-time calculation updates with debouncing

**Output Requirements:**

- [x] Three 1RM estimates displayed prominently (Epley, Brzycki, Lombardi)
- [x] Results shown in user's selected unit (lbs or kg)
- [x] Formula explanations and scientific context
- [x] Accuracy disclaimers and usage guidance

#### 2. Calculation Logic

**Formulas (from Wikipedia):**

- [x] **Epley Formula:** `1RM = w × (1 + r/30)` where w = weight, r = reps
- [x] **Brzycki Formula:** `1RM = w × 36 / (37 - r)` where w = weight, r = reps
- [x] **Lombardi Formula:** `1RM = w × r^0.10` where w = weight, r = reps

**Formula Sources:**

- [x] Epley: Boyd Epley (1985) "Poundage Chart", Boyd Epley Workout
- [x] Brzycki: Matt Brzycki (1998) "A Practical Approach To Strength Training"
- [x] Lombardi: Referenced in strength training literature

**Data Processing:**

- [x] Round results to nearest whole number (no decimals for weight)
- [x] Handle edge case: 1 rep = actual weight (no estimation needed)
- [x] Validate inputs before calculation
- [x] Default values: 135 lbs, 5 reps

#### 3. User Experience

**Interface Design:**

- [x] Two range sliders in left column (Weight, Reps)
- [x] Unit toggle button (lbs/kg) near weight slider
- [x] Three result cards in right column showing 1RM estimates
- [x] Match BMR page layout and styling exactly
- [x] Real-time updates as sliders move

**Interaction Flow:**

- [x] Page loads with default: 135 lbs, 5 reps
- [x] User adjusts weight slider (50-500 lbs)
- [x] User adjusts reps slider (1-10)
- [x] User can toggle lbs/kg units
- [x] All three formulas update instantly with debounced calculation

#### 4. Integration Requirements

**Shared Data:**

- [x] No cross-calculator data dependencies (standalone calculator)
- [x] Store unit preference in localStorage
- [x] Store last used weight/reps for session persistence

**localStorage Keys:**

- [x] `cruxcalc-1rm-weight` (store in pounds, convert for display)
- [x] `cruxcalc-1rm-reps`
- [x] `cruxcalc-1rm-units` (lbs/kg preference)

**Navigation:**

- [x] Short navigation label: "1RM" (4 characters)
- [x] URL path: `/one-rep-max`
- [x] Page title: "One Rep Max Calculator - Potato Hack Fitness Calculators"
- [x] Meta description: "Calculate your one-repetition maximum using Epley, Brzycki, and Lombardi formulas. Estimate your max lift from submaximal weights and reps."

#### 5. Content Requirements

**Educational Sections:**

- [x] Formula explanations with scientific backing
- [x] When to use 1RM estimates vs actual testing
- [x] Accuracy limitations (±10% variation typical)
- [x] Safety considerations for max effort lifts
- [x] How to use 1RM for programming training loads

**Formula Details Section:**

- [x] **Epley Formula:** Most commonly used, slight overestimate for low reps
- [x] **Brzycki Formula:** Conservative estimate, widely accepted in research
- [x] **Lombardi Formula:** Logarithmic approach, good for moderate rep ranges
- [x] Note: All formulas converge around 10 reps, diverge significantly below 5 reps
- [x] Recommendation: Use 3-6 rep range for best accuracy

**SEO Content:**

- [x] Page title: "One Rep Max Calculator - 1RM Epley Brzycki Lombardi Formulas"
- [x] Meta description: "Calculate your one-repetition maximum using three proven formulas. Safe 1RM estimation from submaximal lifts for strength training programming."
- [x] Target keywords: one rep max, 1RM calculator, strength training, powerlifting

#### 6. Technical Specifications

**Performance:**

- [x] Instant calculation updates (< 50ms)
- [x] Smooth slider interactions
- [x] Mobile-optimized touch controls

**Browser Support:**

- [x] Modern browser compatibility (ES6+)
- [x] Touch-friendly slider controls
- [x] Accessibility: ARIA labels, keyboard navigation

**Data Persistence:**

- [x] Remember user's last weight/rep settings
- [x] Persist unit preference across sessions
- [x] Clear data on page refresh if desired

**Conversion Logic:**

- [x] 1 pound = 0.453592 kg (precise conversion)
- [x] Display kg values to 1 decimal place
- [x] Store internally in pounds for consistency

**UI Matching BMR Page:**

- [x] Same two-column layout (inputs left, results right)
- [x] Same slider styling and behavior
- [x] Same card design for results
- [x] Same color scheme and typography
- [x] Same responsive breakpoints

## Implementation Phases

### Phase 1: Planning & Design (Body Fat Calculator)

- [x] Choose calculator type from options
- [x] Complete detailed requirements
- [x] Research Navy and BMI formulas from authoritative sources
- [x] Identify formula sources and validation studies
- [ ] Create design mockups for dual-method interface
- [ ] Plan gender-specific UI flow

### Phase 2: Core Development

- [ ] Create page structure and layout
- [ ] Implement Navy circumference method calculations
- [ ] Implement enhanced BMI method calculations
- [ ] Add gender-specific input controls
- [ ] Add circumference measurement sliders
- [ ] Style according to design system

### Phase 3: Integration & Polish

- [ ] Integrate with shared value system (age, height, weight, gender)
- [ ] Add cross-calculator data synchronization
- [ ] Implement local storage persistence for measurements
- [ ] Add body fat category classifications
- [ ] Add age-adjusted ideal ranges
- [ ] Add educational content sections

### Phase 4: Testing & Optimization

- [ ] Validate calculations against Navy standards
- [ ] Test BMI formula accuracy
- [ ] Test responsive design on multiple devices
- [ ] Verify cross-calculator data sync
- [ ] Performance optimization and accessibility
- [ ] Test circumference input UX on mobile

### Phase 5: Deployment

- [ ] Update navigation in Header.astro
- [ ] Add calculator card to index.astro
- [ ] Update README and documentation
- [ ] Create social media preview assets

### Previous Implementation (Completed): One Rep Max Calculator

## Decision Points

**Previous Decision (Completed):**

1. **Calculator Choice:** ✅ **Option 3: One Rep Max Calculator** - COMPLETED
2. **Target Complexity:** ✅ **Low-Medium** - COMPLETED
3. **Primary User Goal:** ✅ **Quick Calculation** with educational context - COMPLETED
4. **Integration Priority:** ✅ **Standalone** - COMPLETED

**Current Decision:**

1. **Calculator Choice:** ✅ **Option 2: Body Fat Percentage Calculator**
2. **Target Complexity:** ✅ **Medium-High** (Dual method implementation)
3. **Primary User Goal:** ✅ **Accurate Body Composition Assessment** with education
4. **Integration Priority:** ✅ **BMI Integration** (leverage existing BMI calculator)

**Key Features Confirmed:**

- Navy Circumference Method (primary)
- Enhanced BMI Method (secondary comparison)
- Dual results display with accuracy comparison
- Body fat category classifications (Essential/Athletic/Fitness/Average/Obese)
- Age-adjusted ideal ranges
- Fat mass and lean mass calculations

## Success Criteria

### Body Fat Calculator Success Metrics

- [ ] Navy method calculation accuracy verified against military standards
- [ ] BMI method matches enhanced Deurenberg formula results
- [ ] Dual method comparison provides educational value
- [ ] Mobile responsiveness for circumference measurements
- [ ] Cross-calculator data sync (age, height, weight) working properly
- [ ] Page load time under 2 seconds
- [ ] Body fat categories display correctly
- [ ] Age-adjusted ideals show appropriate ranges
- [ ] Educational content explains method differences clearly
- [ ] Design consistency with existing calculators

### Previous Success Criteria (One Rep Max - Completed)

- [x] Calculation accuracy verified against known standards
- [x] Mobile responsiveness on all common devices
- [x] Page load time under 2 seconds
- [x] Cross-calculator data sync working properly
- [x] Educational content provides clear value
- [x] Design consistency with existing calculators

---

**Next Steps for Body Fat Calculator:**

1. Begin Phase 1: Create design mockups for dual-method interface
2. Plan gender-specific UI flow (hip measurement for women)
3. Set up shared value integration with BMI calculator
4. Implement Navy circumference method as primary calculation
5. Add BMI method as secondary comparison
6. Build body fat category classification system
