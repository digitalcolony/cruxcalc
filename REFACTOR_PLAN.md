# 🚀 Component Refactoring Plan

## Overview

Refactoring the CruxCalc calculators to use reusable Astro components for better maintainability, consistency, and developer experience.

## Phase 1: Core Input Components ✅ (IN PROGRESS)

**Priority 1 - Most impactful components**

### 1.1 `RangeSlider.astro` Component

- **Usage**: 15+ times across all calculators
- **Props**: `id`, `label`, `min/max/step/value`, `unit`, `helpText`, `class`
- **Features**: Debounced events, SharedValues sync via `data-shared-key`
- **Status**: 🔄 Building

### 1.2 `UnitToggle.astro` Component

- **Usage**: 6+ calculators for Imperial/Metric switching
- **Props**: `options` array, `activeValue`, `dataAttribute`
- **Status**: ⏳ Planned

### 1.3 `GenderToggle.astro` Component

- **Usage**: BMR, Body Fat calculators
- **Props**: `activeGender` with auto SharedValues sync
- **Status**: ⏳ Planned

## Phase 2: Result & Display Components

**Priority 2 - Result presentation**

### 2.1 `ResultCard.astro` Component

- **Usage**: Base card for all result displays
- **Props**: `title`, `variant`, `class`
- **Slots**: Default content, `badge` slot
- **Status**: ⏳ Planned

### 2.2 `ResultValue.astro` Component

- **Usage**: Displaying calculated values
- **Props**: `value`, `unit`, `precision`, `size`
- **Status**: ⏳ Planned

### 2.3 `CategoryBadge.astro` Component

- **Usage**: Dynamic colored category badges
- **Props**: `category`, `color`, `size`
- **Status**: ⏳ Planned

### 2.4 `ComparisonTable.astro` Component

- **Usage**: BMI categories, body fat ranges, etc.
- **Props**: `headers`, `rows`, `highlightRow`
- **Status**: ⏳ Planned

## Phase 3: Layout Components

**Priority 3 - Structural consistency**

### 3.1 `CalculatorLayout.astro` Component

- **Usage**: Standardized two-column layout
- **Props**: `title`, `description`
- **Slots**: `inputs`, `results`
- **Status**: ⏳ Planned

### 3.2 `InputGroup.astro` Component

- **Usage**: Label + input + help text wrapper
- **Props**: `label`, `helpText`, `required`
- **Status**: ⏳ Planned

## Phase 4: Enhanced SharedValues System

**Priority 4 - Reactive data management**

### 4.1 Reactive SharedValues ✅ (APPROVED)

- **Features**: Event-driven updates, component registration, auto two-way binding
- **Benefits**: Components auto-update when SharedValues change in other calculators
- **Implementation**: Custom events, component registration system
- **Status**: ⏳ Planned

### 4.2 `withSharedValues()` HOC Pattern

- **Usage**: Astro component wrapper for automatic SharedValues integration
- **Status**: ⏳ Planned

## Phase 5: CSS Strategy

**Component-scoped styles with CSS custom properties**

### 5.1 Component Encapsulation

- Each component gets its own `<style>` block
- Use global CSS custom properties for consistency
- No style bleeding between components
- **Status**: ⏳ Planned

### 5.2 Enhanced Design System

- Add component-specific CSS custom properties
- Standardize component sizing, colors, variants
- **Status**: ⏳ Planned

## Migration Strategy

### Calculator Refactoring Order

1. **BMI Calculator** ✅ (IN PROGRESS) - Simplest, good validation case
2. **Body Fat Calculator** - Most component variety
3. **Heart Rate Zones** - Medium complexity
4. **BMR Calculator** - Multiple formulas
5. **Remaining Calculators** - Apply learned patterns

### Bundle Size Strategy

**Decision**: Slightly larger but feature-complete components over very granular ones

- Reduces import overhead
- Better developer experience
- Easier maintenance
- Acceptable bundle size impact for better functionality

## Future Enhancements

**Post-refactor improvements to consider**

### Animation & Transitions 🎬

- Smooth value changes in sliders
- Card transition animations
- Category badge color transitions
- Result value count-up animations
- **Status**: 📋 For later consideration

### Component Showcase Page

- `/components` route for testing and documentation
- Live examples of all components
- Props playground
- **Status**: ✅ Approved for Phase 1

### Advanced Features

- TypeScript prop validation (when needed)
- Accessibility enhancements
- Performance optimizations
- **Status**: 📋 Future consideration

## Notes & Decisions

### Technical Decisions

- **Reactive SharedValues**: Approved for enhanced user experience
- **Component Showcase**: Build during Phase 1 for validation
- **CSS Strategy**: Component-scoped with global design tokens
- **Migration First**: BMI calculator for pattern validation

### Development Principles

- Functionality first, animations later
- Validate approach with BMI before proceeding
- Maintain current performance characteristics
- Progressive enhancement approach

---

## Current Status: Phase 1 - Building components and refactoring BMI Calculator ✅ (ACTIVE)

**Completed:**

- ✅ Created `RangeSlider.astro` component with SharedValues integration
- ✅ Created `UnitToggle.astro` component with event system
- ✅ Created `GenderToggle.astro` component with SharedValues auto-sync
- ✅ Created component showcase page (`/components`) for testing
- ✅ Started BMI calculator refactoring using new components
- 🔄 BMI JavaScript class integration (in progress)

**Next Steps:**

1. ✅ Complete BMI calculator JavaScript integration
2. ⏳ Test BMI calculator functionality
3. ⏳ Clean up redundant CSS from BMI calculator
4. ⏳ Validate component approach and performance
5. ⏳ Proceed with remaining Phase 1 components

**Last Updated**: August 2, 2025
