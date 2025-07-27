# Calculator Requirements Document

## Project Overview

**Calculator Name:** [TBD - To Be Determined]
**Project:** CruxCalc - Potato Hack Fitness Calculators
**Date:** July 27, 2025
**Status:** Planning Phase

## Existing Calculator Analysis

Current calculators implemented:

- ✅ BMI Calculator - Body Mass Index with visual indicators
- ✅ BMR Calculator - Basal Metabolic Rate (3 formulas comparison)
- ✅ Heart Rate Zones - Training zone calculator
- ✅ Muscle Potential - Casey Butt's maximum muscle formulas
- ✅ Potato Hack - Calorie deficit with resistant starch
- ✅ Running Pace - Race time predictions for 5K/10K/half/full marathon

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

### Phase 1: Planning & Design

- [x] Choose calculator type from options
- [x] Complete detailed requirements
- [x] Create design mockups/wireframes
- [x] Identify formula sources and validation

### Phase 2: Core Development

- [x] Create page structure and layout
- [x] Implement basic calculation logic
- [x] Add input controls and validation
- [x] Style according to design system

### Phase 3: Integration & Polish

- [ ] Integrate with shared value system
- [ ] Add cross-page data synchronization
- [ ] Implement local storage persistence
- [ ] Add educational content sections

### Phase 4: Testing & Optimization

- [ ] Validate calculations across input ranges
- [ ] Test responsive design on multiple devices
- [ ] Verify cross-calculator data sync
- [ ] Performance optimization and accessibility

### Phase 5: Deployment

- [ ] Update navigation in Header.astro
- [ ] Add calculator card to index.astro
- [ ] Update README and documentation
- [ ] Create social media preview assets

## Decision Points

**Decisions Made:**

1. **Calculator Choice:** ✅ **Option 3: One Rep Max Calculator**
2. **Target Complexity:** ✅ **Low-Medium** (Perfect for next implementation)
3. **Primary User Goal:** ✅ **Quick Calculation** with educational context
4. **Integration Priority:** ✅ **Standalone** (no cross-calculator dependencies)

**Key Features Confirmed:**

- Three proven formulas (Epley, Brzycki, Lombardi)
- Weight slider: 50-500 lbs with kg conversion
- Reps slider: 1-10 repetitions
- BMR page layout matching
- Real-time calculations
- Educational content on formula accuracy and usage

## Success Criteria

- [ ] Calculation accuracy verified against known standards
- [ ] Mobile responsiveness on all common devices
- [ ] Page load time under 2 seconds
- [ ] Cross-calculator data sync working properly
- [ ] Educational content provides clear value
- [ ] Design consistency with existing calculators

---

**Next Steps:**

1. Review this requirements document
2. Choose specific calculator from options
3. Fill in detailed requirements for chosen calculator
4. Begin Phase 1 implementation planning
