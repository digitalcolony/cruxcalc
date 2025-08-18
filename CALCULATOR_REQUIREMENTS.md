# Calculator Requirements Document

## Project Overview

**Project:** CruxCalc - Potato Hack Fitness Calculators
**Date:** August 12, 2025
**Status:** All Core Calculators Complete - Planning Next Features

## Current Calculator Status

**Implemented and Live:**

- ✅ **BMI Calculator** - Body Mass Index with visual indicators and categories
- ✅ **BMR Calculator** - Basal Metabolic Rate (3 formulas: Mifflin-St Jeor, Harris-Benedict, Katch-McArdle)
- ✅ **Body Fat Calculator** - Navy circumference method with gender-specific measurements
- ✅ **Heart Rate Zones** - Training zone calculator with 5 zones based on age
- ✅ **Muscle Potential** - Casey Butt's maximum muscle formulas with measurements
- ✅ **One Rep Max Calculator** - 1RM estimation using 3 proven formulas (Epley, Brzycki, Lander)
- ✅ **Potato Hack** - Calorie deficit calculator with resistant starch benefits
- ✅ **Running Pace** - Race time predictions for 5K/10K/half/full marathon with pace categories

**Integration Features:**

- ✅ SharedValues system for cross-calculator synchronization (age, height, weight, gender)
- ✅ localStorage persistence across all calculators
- ✅ Responsive design optimized for mobile and desktop
- ✅ Unit conversion system (Imperial/Metric)
- ✅ Real-time calculations with debounced updates

## Next Calculator Options

### Option 1: TDEE Calculator (Total Daily Energy Expenditure)

**Purpose:** Calculate total calories burned per day including activity multipliers
**Rationale:** Natural progression from BMR, highly requested fitness metric
**Complexity:** Medium
**Dependencies:** BMR calculator integration

### Option 2: Macronutrient Calculator

**Purpose:** Calculate protein/carb/fat targets based on goals and activity level
**Rationale:** Nutrition planning tool, complements TDEE/BMR calculators
**Complexity:** Medium-High
**Dependencies:** TDEE/BMR integration

### Option 3: Hydration Calculator

**Purpose:** Calculate daily water intake needs based on activity and environment
**Rationale:** Simple but valuable wellness tool, fits health theme
**Complexity:** Low-Medium
**Dependencies:** Weight integration

### Option 4: Sleep Optimization Calculator

**Purpose:** Calculate optimal bedtime and wake time based on sleep cycles
**Rationale:** Recovery/wellness focus, complements fitness calculators
**Complexity:** Low-Medium
**Dependencies:** None

## Current Implementation Status

All 8 core calculators are now complete and functional:

- ✅ **BMI Calculator** - Body mass index with health categories
- ✅ **BMR Calculator** - Basal metabolic rate using multiple formulas
- ✅ **Body Fat Calculator** - Navy circumference method implementation
- ✅ **Heart Rate Zones Calculator** - Training zones with age-based max HR
- ✅ **Muscle Potential Calculator** - Genetic potential estimation
- ✅ **One Rep Max Calculator** - Maximum lift strength estimation
- ✅ **Potato Hack Calculator** - Weight loss timeline planning
- ✅ **Running Pace Calculator** - Distance/time/pace calculations

The application features a mature SharedValues system for cross-calculator data persistence, consistent neo-brutalist design, and responsive mobile-first layout.

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

## Implementation Summary

### Body Fat Calculator (Implemented)

The Body Fat Calculator is fully functional at `/body-fat` using the Navy circumference method. Features include:

- Gender-specific calculations (waist/neck for men, waist/neck/hips for women)
- Real-time calculations with debounced updates
- SharedValues integration for age, height, weight synchronization
- Imperial/metric unit support
- Body fat category classifications
- Responsive design matching the site's neo-brutalist aesthetic
- Input validation and error handling

**Key Implementation Notes:**

- Uses Navy circumference method only (as requested)
- Integrates with existing SharedValues system
- Maintains design system consistency
- Mobile-optimized measurement controls

### One Rep Max Calculator (Implemented)

The One Rep Max Calculator is fully functional at `/one-rep-max` with the following features:

- Three proven 1RM formulas (Epley, Brzycki, Lombardi)
- Weight and repetition sliders with real-time calculations
- Imperial/metric unit support with localStorage persistence
- Educational content explaining formula differences and usage
- Responsive design matching the site's design system
- Input validation and error handling

**Key Implementation Notes:**

- Standalone calculator (no SharedValues dependencies)
- Uses three complementary formulas for accuracy range
- Optimized for 3-6 rep range input (most accurate)
- Mobile-friendly slider controls

## Current Project Status

All 8 core calculators are complete and the application is in a mature state with:

- ✅ Consistent neo-brutalist design system
- ✅ Responsive mobile-first layout
- ✅ SharedValues cross-calculator persistence
- ✅ Comprehensive error handling and validation
- ✅ Educational content for each calculator
- ✅ SEO-optimized pages with proper meta tags
- ✅ Accessibility features (ARIA labels, keyboard navigation)
- ✅ Performance optimization (< 2s load times)

## Future Calculator Options

With all core calculators complete, potential additions could include:

### Option 1: TDEE Calculator (Total Daily Energy Expenditure)

**Purpose:** Calculate total daily caloric needs including activity level
**Rationale:** Builds on BMR calculator, adds activity multipliers
**Complexity:** Medium
**Dependencies:** BMR integration

### Option 2: Macronutrient Calculator

**Purpose:** Calculate protein/carb/fat ratios for fitness goals
**Rationale:** Nutrition focus complements existing fitness calculators
**Complexity:** Medium
**Dependencies:** Weight integration, possible TDEE integration

### Option 3: Hydration Calculator

**Purpose:** Calculate daily water intake needs based on activity
**Rationale:** Simple wellness addition, universal health metric  
**Complexity:** Low
**Dependencies:** Possible weight integration

### Option 4: Sleep Optimization Calculator

**Purpose:** Calculate optimal bedtime and wake time based on sleep cycles
**Rationale:** Recovery/wellness focus complements fitness calculators
**Complexity:** Low-Medium
**Dependencies:** None

## Success Metrics (Project Complete)

### Overall Project Success ✅

- ✅ All 8 core calculators implemented and functional
- ✅ Consistent design system across all calculators
- ✅ SharedValues integration working seamlessly
- ✅ Mobile responsiveness on all common devices
- ✅ Page load times under 2 seconds consistently
- ✅ Educational content provides clear value on each page
- ✅ Cross-calculator data synchronization working properly
- ✅ Error handling and input validation robust
- ✅ Accessibility standards met (ARIA labels, keyboard navigation)
- ✅ SEO optimization complete with proper meta tags

The CruxCalc application successfully provides a comprehensive suite of fitness and health calculators with excellent user experience and technical implementation.
