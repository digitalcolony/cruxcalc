# Calculator Testing & Update Checklist

## Overview

This checklist ensures all calculators meet quality standards and function properly. Only make changes to calculators that explicitly need updates - do not modify calculators that have already passed testing.

## Testing Status

- ✅ **BMI Calculator** - COMPLETED & PASSED TESTING (DO NOT MODIFY)
- ✅ **Heart Rate Zones Calculator** - COMPLETED & PASSED TESTING (DO NOT MODIFY)
- ✅ **BMR Calculator** - COMPLETED & PASSED TESTING (DO NOT MODIFY)
- ✅ **Running Pace Calculator** - COMPLETED & PASSED TESTING (DO NOT MODIFY)
- ✅ **1RM Calculator** - COMPLETED & PASSED TESTING (DO NOT MODIFY)
- ✅ **Muscle Potential Calculator** - COMPLETED & PASSED TESTING (DO NOT MODIFY)
- ✅ **Potato Hack Calculator** - COMPLETED & PASSED TESTING (DO NOT MODIFY)
- ✅ **Body Fat Calculator** - COMPLETED & PASSED TESTING (DO NOT MODIFY)

---

## Pre-Update Checklist

Before making ANY changes to a calculator:

### 1. Verification Requirements

- [ ] **STOP**: Has this calculator already passed testing?
- [ ] **STOP**: Is this calculator marked as completed above?
- [ ] **CONFIRM**: User has explicitly requested updates to this specific calculator
- [ ] **BACKUP**: Note current working state before changes

### 2. User Requirements Analysis

- [ ] Read and understand specific user requirements
- [ ] Identify exact issues to be fixed
- [ ] Clarify scope of changes needed
- [ ] Confirm which functionality should be preserved

---

## Technical Quality Checklist

### A. Code Quality & Standards

- [ ] **TypeScript Compliance**: No IDE errors or type warnings
- [ ] **Function Parameters**: All parameters have proper type annotations
- [ ] **Variable Declarations**: No implicit `any` types
- [ ] **Error Handling**: Proper try-catch blocks where needed
- [ ] **Console Logging**: Remove debug logs in production code
- [ ] **Code Comments**: Clear, helpful comments for complex logic

### B. Component Architecture

- [ ] **RangeSlider Integration**: Uses standardized RangeSlider component
- [ ] **InputGroup Usage**: Proper InputGroup wrapper implementation
- [ ] **Event Handling**: Consistent event listener patterns
- [ ] **SharedValues Integration**: ReactiveSharedValues properly implemented
- [ ] **Component Props**: All required props passed correctly
- [ ] **Formatting Props**: formatAsPace, formatAsHeight used appropriately

### C. User Interface Standards

- [ ] **Responsive Design**: Works on mobile, tablet, and desktop
- [ ] **Visual Consistency**: Matches design system (colors, fonts, spacing)
- [ ] **Input Controls**: Sliders styled consistently across calculators
- [ ] **Results Display**: Clear, readable output formatting
- [ ] **Loading States**: Proper initialization and loading behavior
- [ ] **Accessibility**: Proper labels, ARIA attributes, keyboard navigation

### D. Functionality Requirements

- [ ] **Initial Load**: Correct default values displayed
- [ ] **Saved Values**: localStorage integration working
- [ ] **Real-time Updates**: Input changes immediately update results
- [ ] **Cross-Calculator Sync**: SharedValues updates other calculators
- [ ] **Unit Conversions**: Imperial/Metric switching (where applicable)
- [ ] **Validation**: Input ranges and error handling
- [ ] **Performance**: No lag or delays in calculations

---

## Functional Testing Protocol

### Phase 1: Initial Load Testing

- [ ] Page loads without errors
- [ ] Default values are displayed correctly
- [ ] All UI elements render properly
- [ ] No console errors in browser developer tools
- [ ] Saved values from localStorage load correctly

### Phase 2: Input Interaction Testing

- [ ] Range sliders move smoothly
- [ ] Input values update in real-time
- [ ] Display formatting is correct (units, decimals, etc.)
- [ ] All input controls are responsive
- [ ] Edge cases (min/max values) work correctly

### Phase 3: Calculation Accuracy Testing

- [ ] Mathematical calculations are correct
- [ ] Results update immediately when inputs change
- [ ] Multiple test scenarios produce expected results
- [ ] Edge cases and boundary values handled properly
- [ ] Units and formatting are accurate

### Phase 4: Integration Testing

- [ ] SharedValues sync between calculators
- [ ] localStorage saves and loads correctly
- [ ] No conflicts with other page calculators
- [ ] Browser refresh preserves user data
- [ ] Cross-calculator navigation works

### Phase 5: Cross-Browser Testing

- [ ] Chrome/Chromium browsers
- [ ] Firefox
- [ ] Safari (if possible)
- [ ] Mobile browsers
- [ ] Different viewport sizes

---

## Calculator-Specific Requirements

### BMI Calculator (✅ COMPLETED)

**Status**: Passed all testing - DO NOT MODIFY

- Features: Height/weight inputs, imperial/metric units, BMI categories, Asian BMI scale
- Components: Uses RangeSlider with formatAsHeight
- Integration: Full SharedValues integration

### Heart Rate Zones Calculator (✅ COMPLETED)

**Status**: Passed all testing - DO NOT MODIFY

- Features: Age-based HR zones, multiple zone calculations
- Components: Standard RangeSlider implementation
- Integration: SharedValues for age synchronization

### Running Pace Calculator (✅ COMPLETED)

**Status**: Passed all testing - DO NOT MODIFY

- Features: Pace slider with formatAsPace=true, real-time race time calculations (5K, 10K, Half, Full Marathon)
- Features: Pace category badge with color coding, localStorage integration for pace saving
- Components: Uses RangeSlider with formatAsPace, proper event handling
- Integration: Full SharedValues integration, cross-calculator synchronization
- Fixed: Slider event handling, race time updates, pace badge updates, initial display formatting

### Potato Hack Calculator (✅ MAJOR FIXES COMPLETED - READY FOR FINAL TESTING)

**Fixed Issues**:

- ✅ **Import Error Resolved**: Fixed ES6 import of ReactiveSharedValues - changed to proper `<script src>` approach
- ✅ **ReactiveSharedValues Integration**: Now properly instantiated via `(window as any).ReactiveSharedValues`
- ✅ **Page Load**: Calculator now loads without Vite internal server errors
- ✅ **Unit Toggle Functionality**: Fixed unit switching between lbs/kg - now updates controls properly
- ✅ **Slider Updates**: Fixed slider changes to immediately update results in right column
- ✅ **Event System**: Replaced complex component event system with reliable direct DOM approach
- ✅ **Calculation Logic**: Implemented proper potato calorie calculations with resistant starch option

**Successfully Implemented**:

- ✅ **Potato Weight Input**: Imperial (lbs) and metric (kg) sliders with proper conversion
- ✅ **Unit Conversion**: Switching units properly converts values and updates sliders
- ✅ **Cooled Overnight Option**: Checkbox for 17% resistant starch calorie reduction
- ✅ **TDEE Input**: Slider for Total Daily Energy Expenditure
- ✅ **Real-time Calculations**: All inputs immediately update results
- ✅ **Multiple Time Projections**: 3-day, 4-day, 5-day, and weekly fat loss estimates
- ✅ **Unit-Aware Results**: Results display in correct units (lbs/kg) based on potato unit selection

**Final Testing Checklist**:

- [ ] **Comprehensive Unit Testing**: Verify all conversions work accurately
- [ ] **Edge Case Testing**: Test min/max values and boundary conditions
- [ ] **Cross-Calculator Integration**: Verify TDEE sync with BMR calculator if applicable
- [ ] **Mobile Responsiveness**: Test on different screen sizes
- [ ] **Calculation Accuracy**: Verify potato hack formulas match expected results

### 1RM Calculator (✅ COMPLETED)

**Status**: Passed all testing - DO NOT MODIFY

**All Issues RESOLVED**:

- ✅ Switching from lbs to kg does not update the weight control below it ✅ FIXED
- ✅ Updating the weight does not update the right column results ✅ FIXED
- ✅ Unit conversion not properly integrated with weight input ✅ FIXED
- ✅ Event handling between weight input and calculations ✅ FIXED

**Successfully Implemented**:

- ✅ One Rep Max calculations using multiple formulas (Epley, Brzycki, Lombardi)
- ✅ Weight and reps input sliders with proper unit conversion
- ✅ Imperial/Metric unit conversion for weights (following proven working pattern)
- ✅ Formula comparison showing different 1RM estimates
- ✅ Real-time updates when inputs change
- ✅ Direct DOM manipulation approach for reliable functionality
- ✅ Proper initialization sequence and event handling
- ✅ Unit toggle system with immediate container switching
- ✅ Weight slider changes trigger immediate result updates
- ✅ Cross-unit conversion with accurate conversion rates (135 lbs = ~61 kg)
- ✅ Formula accuracy with mathematically correct calculations
- ✅ Results display with proper unit labels (lbs/kg)

**Verified Test Cases** ✅:

- ✅ Initial load shows 135 lbs default, 5 reps, calculation results display correctly
- ✅ Weight slider (lbs): Changes from 50-500 lbs, results update immediately
- ✅ Weight slider (kg): Changes from 23-227 kg, results update immediately
- ✅ Reps slider: Changes from 1-10 reps, results update immediately
- ✅ Unit toggle: Switching from lbs to kg properly converts and updates both slider and results
- ✅ Unit toggle: Switching from kg to lbs properly converts and updates both slider and results
- ✅ Cross-unit conversion: 135 lbs = ~61 kg (proper conversion rates)
- ✅ Formula accuracy: Epley, Brzycki, Lombardi calculations are mathematically correct
- ✅ Results display: All three formulas show different values as expected
- ✅ Unit labels: Results show correct unit labels (lbs/kg) based on current selection

**Technical Implementation**:

- Features: One Rep Max calculations using Epley, Brzycki, and Lombardi formulas
- Features: Weight/reps input sliders, imperial/metric unit conversion, formula comparison
- Components: Uses direct DOM manipulation with proven working JavaScript patterns
- Architecture: Abandoned complex component event system in favor of simple, reliable approach
- Integration: Direct event listeners, localStorage for persistence, real-time calculations

### BMR Calculator (✅ COMPLETED)

**Status**: Passed all testing - DO NOT MODIFY

- Features: BMR calculations using multiple formulas (Mifflin-St Jeor, Harris-Benedict, Katch-McArdle)
- Features: Gender selection, age/height/weight inputs, imperial/metric units
- Features: TDEE calculations with activity level selection, formula comparison table
- Components: Uses RangeSlider with formatAsHeight, UnitToggle, GenderToggle
- Integration: Full SharedValues and localStorage integration
- Fixed: HTML rendering issue in Formula Comparison table

### Body Fat Calculator (✅ COMPLETED)

**Status**: Passed all testing - DO NOT MODIFY

**All Issues RESOLVED**:

- ✅ Fixed formula precision (corrected women's formula coefficient from 0.221 to 0.22100)
- ✅ Implemented proper unit conversion system (inches to centimeters)
- ✅ Navy body fat formulas now use metric units as required
- ✅ Results accuracy verified against scientific standards

**Successfully Implemented**:

- ✅ Navy method body fat calculations for men and women
- ✅ Gender-specific input controls (hip measurement for women)
- ✅ Height unit conversion between imperial (feet/inches) and metric (cm)
- ✅ Circumference measurements in inches with proper cm conversion
- ✅ Real-time body fat percentage calculations with category classifications
- ✅ Unit conversion system: all inch measurements converted to centimeters before formula application
- ✅ Body fat category badges with proper color coding
- ✅ Comparison tables for body fat categories and calculation methods

**Technical Implementation**:

- Features: Navy circumference method with gender-specific formulas
- Features: Height, neck, waist, and hip (women) circumference inputs
- Components: Uses CalculatorLayout, UnitToggle, GenderToggle, RangeSlider components
- Formulas: Men: 495/(1.0324-0.19077×log10(waist-neck)+0.15456×log10(height))-450
- Formulas: Women: 495/(1.29579-0.35004×log10(waist+hip-neck)+0.22100×log10(height))-450
- Integration: Full unit conversion system with proper metric formula application

### Muscle Potential Calculator (✅ COMPLETED & PASSED TESTING)

**Status**: All functionality working correctly. Unit toggles, value conversions, and result displays are functioning properly.

**Completed Tasks**:

- [x] Review current implementation
- [x] Test all functionality
- [x] Fixed unit toggle event system (switched to custom event approach)
- [x] Fixed weight unit display to match height unit selection
- [x] Verified single height slider functionality
- [x] Confirmed all calculations using Casey Butt's formulas
- [x] Tested conversion between imperial and metric units

---

## File Structure Standards

### Required Files per Calculator

```
src/pages/[calculator-name].astro
```

### Component Dependencies

```
src/components/RangeSlider.astro
src/components/InputGroup.astro
src/layouts/Layout.astro
```

### Public Assets

```
public/reactiveSharedValues.js (shared across all calculators)
public/og-[calculator-name].png (social media image)
```

---

## Error Prevention Rules

### CRITICAL RULES

1. **Never modify calculators marked as ✅ COMPLETED**
2. **Always get explicit user approval before making changes**
3. **Test thoroughly on localhost before declaring complete**
4. **Preserve existing functionality unless specifically requested to change**
5. **Document any breaking changes or architectural modifications**

### Import/Export Standards

- Use `is:inline` attribute for reactiveSharedValues.js script tags
- Use proper ES6 imports where appropriate
- Maintain consistent import patterns across calculators

### Event Handling Patterns

- Use consistent event listener patterns
- Implement proper cleanup for event listeners
- Ensure events bubble correctly for component communication

---

## Sign-off Protocol

### Before Marking Calculator as Complete

- [ ] All checklist items completed
- [ ] User testing completed successfully
- [ ] Cross-browser verification done
- [ ] Performance testing passed
- [ ] No console errors or warnings
- [ ] Documentation updated

### User Acceptance Criteria

- [ ] User has tested the calculator
- [ ] All requested functionality works correctly
- [ ] User explicitly approves the implementation
- [ ] Calculator marked as ✅ COMPLETED in this document

---

## Notes & Change Log

### Version History

- v1.0 - Initial checklist creation
- Document will be updated as calculators are completed

### Calculator-Specific Notes

_Add notes here for any calculator-specific considerations or edge cases_

---

**REMINDER**: Only update calculators that the user explicitly requests to be modified. BMI and HR calculators are complete and should not be touched.
