# RangeSlider to InputGroup + PrecisionRangeSlider Migration Guide

## Overview

This guide documents the migration from the legacy RangeSlider component to the new InputGroup + PrecisionRangeSlider pattern, based on lessons learned during the BMI calculator upgrade. The new pattern provides better touch accessibility, unit conversion synchronization, and cross-calculator value sharing.

## Key Components

### 1. SharedValues System

The application uses a global ReactiveSharedValues system for cross-calculator persistence:

```javascript
// Use ReactiveSharedValues (not the old SharedValues.js)
<script src="/reactiveSharedValues.js" is:inline></script>

// Initialize in DOMContentLoaded
const sharedValues = new (window as any).ReactiveSharedValues();
```

### 2. InputGroup Component

Provides the container structure with proper labeling and unit toggles:

```astro
<InputGroup
    label="Height"
    id="height"
    units={["ft/in", "cm"]}
    activeUnit={heightUnit}
>
    <!-- PrecisionRangeSlider content here -->
</InputGroup>
```

### 3. PrecisionRangeSlider Component

Provides accessible sliders with touch-friendly controls:

```astro
<PrecisionRangeSlider
    id="height-total-inches"
    min="48"
    max="96"
    step="0.5"
    value="68"
    sharedKey="heightTotalInches"
    formatAsHeight={true}
/>
```

## Critical Migration Steps

### Step 1: Update Script Import

**Before (Legacy):**

```astro
<script src="/sharedValues.js" is:inline></script>
```

**After (Reactive):**

```astro
<script src="/reactiveSharedValues.js" is:inline></script>
```

### Step 2: Update SharedValues API Calls

**Before (Legacy API):**

```javascript
const values = sharedValues.load();
sharedValues.save({ key: value });
```

**After (Reactive API):**

```javascript
const values = sharedValues.getAll();
sharedValues.set(key, value);
```

### Step 3: Update Event Listener for PrecisionRangeSlider

**Critical:** Use the correct event name `precision-range-change` (not `precision-range-slider-change`):

```javascript
// Listen for precision range slider changes
document.addEventListener("precision-range-change", (event) => {
    const customEvent = event as CustomEvent;
    const sharedKey = customEvent.detail.sharedKey;
    const value = customEvent.detail.value;

    console.log(`Range change for ${sharedKey}, value: ${value}`);

    // Bidirectional unit sync for height
    if (sharedKey === "heightTotalInches") {
        const cm = Math.round(value * 2.54);
        console.log(`Syncing height: ${value} inches = ${cm} cm`);
        sharedValues.set("heightCm", cm);
    } else if (sharedKey === "heightCm") {
        const totalInches = Math.round((value / 2.54) * 2) / 2;
        console.log(`Syncing height: ${value} cm = ${totalInches} inches`);
        sharedValues.set("heightTotalInches", totalInches);
    }
    // Weight sync logic...

    this.calculate(); // Recalculate results
});
```

### Step 4: Ensure Default Values Include All Units

**Critical:** ReactiveSharedValues must include all unit representations:

```javascript
// In reactiveSharedValues.js defaultValues
{
    heightFeet: 5,
    heightInches: 8,
    heightTotalInches: 68,  // ← Must include this!
    heightCm: 173,
    weightLbs: 160,
    weightKg: 73,
    heightUnit: "imperial",
    weightUnit: "imperial"
}
```

### Step 5: Update Unit Toggle Event Handlers

**Critical:** Use ReactiveSharedValues sync methods and correct event flow:

```javascript
document.addEventListener("unit-toggle-change", (event) => {
    const customEvent = event as CustomEvent;
    console.log("Unit change event received:", customEvent.detail);

    if (customEvent.detail.attribute === "height-unit") {
        console.log("Updating height unit to:", customEvent.detail.value);
        this.sharedValues.set("heightUnit", customEvent.detail.value);

        // Use ReactiveSharedValues sync method for proper conversion
        if (customEvent.detail.value === "metric") {
            this.sharedValues.syncHeightUnits("metric");
        } else {
            this.sharedValues.syncHeightUnits("imperial");
        }

        this.convertAndToggleHeightUnits(customEvent.detail.value);
    } else if (customEvent.detail.attribute === "weight-unit") {
        // Similar logic for weight...
    }
    this.calculate();
});
```

**Simplified Unit Toggle Methods:**

```javascript
private convertAndToggleHeightUnits(unit: string): void {
    const imperialGroup = document.querySelector(".imperial-height") as HTMLElement;
    const metricGroup = document.querySelector(".metric-height") as HTMLElement;

    if (imperialGroup && metricGroup) {
        if (unit === "imperial") {
            imperialGroup.style.display = "block";
            metricGroup.style.display = "none";
        } else {
            imperialGroup.style.display = "none";
            metricGroup.style.display = "block";
        }
        // ReactiveSharedValues sync methods handle the actual conversion
    }
}
```

### Step 6: Implement Bidirectional Unit Synchronization

**The Core Fix:** When any unit value changes, immediately sync its equivalent:

```javascript
// In slider event handlers - this runs during user input
if (sharedKey === "heightTotalInches") {
	const totalInches = parseFloat(rangeInput.value);
	const cm = Math.round(totalInches * 2.54);
	console.log(`Syncing height: ${totalInches} inches = ${cm} cm`);
	sharedValues.set("heightCm", cm);
} else if (sharedKey === "heightCm") {
	const cm = parseFloat(rangeInput.value);
	const totalInches = Math.round((cm / 2.54) * 2) / 2; // Round to nearest 0.5
	console.log(`Syncing height: ${cm} cm = ${totalInches} inches`);
	sharedValues.set("heightTotalInches", totalInches);
}
// Similar logic for weight
else if (sharedKey === "weightLbs") {
	const lbs = parseFloat(rangeInput.value);
	const kg = Math.round(lbs * 0.453592 * 10) / 10; // Round to 1 decimal
	sharedValues.set("weightKg", kg);
} else if (sharedKey === "weightKg") {
	const kg = parseFloat(rangeInput.value);
	const lbs = Math.round(kg / 0.453592);
	sharedValues.set("weightLbs", lbs);
}
```

**Apply this sync logic to ALL input events:**

- Range slider `input` event ✓
- Number input `input` event ✓
- Increment button `click` event ✓
- Decrement button `click` event ✓

### Step 7: Update Unit Conversion Logic

Ensure the ReactiveSharedValues sync methods use `heightTotalInches`:

```javascript
// In reactiveSharedValues.js
syncHeightUnits(newUnit) {
    if (this.values.heightUnit !== newUnit) {
        if (newUnit === "metric") {
            // Convert imperial to metric - prioritize heightTotalInches
            const totalInches =
                this.values.heightTotalInches ||
                (this.values.heightFeet * 12 + this.values.heightInches);
            const cm = Math.round(totalInches * 2.54);
            this.update({
                heightUnit: newUnit,
                heightCm: cm,
                heightTotalInches: totalInches
            });
        } else {
            // Convert metric to imperial
            const totalInches = Math.round((this.values.heightCm / 2.54) * 2) / 2;
            const feet = Math.floor(totalInches / 12);
            const inches = Math.round((totalInches % 12) * 2) / 2;
            this.update({
                heightUnit: newUnit,
                heightFeet: feet,
                heightInches: inches,
                heightTotalInches: totalInches,
            });
        }
    }
}
```

Ensure the ReactiveSharedValues sync methods use `heightTotalInches`:

```javascript
// In reactiveSharedValues.js
syncHeightUnits(newUnit) {
    if (this.values.heightUnit !== newUnit) {
        if (newUnit === "metric") {
            // Convert imperial to metric - prioritize heightTotalInches
            const totalInches =
                this.values.heightTotalInches ||
                (this.values.heightFeet * 12 + this.values.heightInches);
            const cm = Math.round(totalInches * 2.54);
            this.update({
                heightUnit: newUnit,
                heightCm: cm,
                heightTotalInches: totalInches
            });
        } else {
            // Convert metric to imperial
            const totalInches = Math.round((this.values.heightCm / 2.54) * 2) / 2;
            const feet = Math.floor(totalInches / 12);
            const inches = Math.round((totalInches % 12) * 2) / 2;
            this.update({
                heightUnit: newUnit,
                heightFeet: feet,
                heightInches: inches,
                heightTotalInches: totalInches,
            });
        }
    }
}
```

## Common Pitfalls and Solutions

### Problem 1: Wrong Event Name

**Issue:** Unit conversion not working, no sync happening

**Root Cause:** Using incorrect event name `precision-range-slider-change` instead of `precision-range-change`

**Solution:** Use the correct event name that PrecisionRangeSlider actually dispatches:

```javascript
// WRONG:
document.addEventListener("precision-range-slider-change", ...);

// CORRECT:
document.addEventListener("precision-range-change", ...);
```

### Problem 2: Stale Cached Values

**Issue:** Unit conversion shows wrong values (e.g., 6'2" = 173cm instead of 188cm)

**Root Cause:** Different unit representations get out of sync in localStorage

**Solution:** Implement bidirectional sync (Step 6) so changing any unit value immediately updates its equivalent

### Problem 3: Multiple SharedValues Instances

**Issue:** Slider changes don't persist to unit conversion

**Root Cause:** Calculator class and page scripts use different SharedValues instances

**Solution:** Use single global ReactiveSharedValues instance throughout

### Problem 4: Missing Unit Properties

**Issue:** `Cannot read property 'heightTotalInches' of undefined`

**Root Cause:** ReactiveSharedValues defaults missing properties used by specific calculators

**Solution:** Ensure all unit representations are in `defaultValues` (Step 4)

### Problem 5: Incomplete Sync Logic

**Issue:** Only some input methods trigger sync, others don't

**Root Cause:** Sync logic only added to slider events, not buttons/number inputs

**Solution:** Add sync logic to ALL input event handlers (Step 6)

### Problem 6: Unit Toggle Not Triggering Display Updates

**Issue:** When switching units, sliders show old cached values instead of converted values

**Root Cause:** Unit toggle handlers don't use ReactiveSharedValues sync methods

### Problem 7: Unit Conversion Shows Wrong Values After User Input

**Issue:** User sets weight to 172 lbs, switches to metric, but sees 73 kg instead of 78 kg

**Root Cause:** Sliders initialize from hardcoded HTML template values (`value={160}`, `value={73}`) instead of loading current SharedValues when they become visible during unit toggle.

**Debugging Steps:**

1. **Add debug logging to unit toggle handlers:**

```javascript
console.log("Current weight values before unit change:", {
	weightLbs: this.sharedValues.get("weightLbs"),
	weightKg: this.sharedValues.get("weightKg"),
	weightUnit: this.sharedValues.get("weightUnit"),
});
```

2. **Add debug logging to ReactiveSharedValues sync methods:**

```javascript
syncWeightUnits(newUnit) {
    console.log("syncWeightUnits called with newUnit:", newUnit);
    console.log("Current weight values:", {
        weightLbs: this.values.weightLbs,
        weightKg: this.values.weightKg
    });
    // ... rest of method
}
```

3. **Check if sliders reload values when becoming visible:**

```javascript
private convertAndToggleWeightUnits(unit: string): void {
    // Add logging to see what values are being set
    console.log(`Converting weight units to: ${unit}`);

    if (unit === "metric") {
        const weightKg = this.sharedValues.get("weightKg") || 73;
        console.log(`Should show metric weight: ${weightKg} kg`);
    }
}
```

**Solution:** Force sliders to reload from SharedValues when they become visible using **correct CSS selectors**:

```javascript
private updateVisibleSliders(): void {
    const currentUnit = this.reactiveSharedValues.get("weightUnit") || "imperial";

    if (currentUnit === "imperial") {
        // CRITICAL: Use correct PrecisionRangeSlider CSS classes
        const imperialSlider = document.querySelector(".imperial-weight .precision-range-input") as HTMLInputElement;
        const imperialNumberInput = document.querySelector(".imperial-weight .precision-number-input") as HTMLInputElement;
        const imperialDisplay = document.querySelector(".imperial-weight #weight-display") as HTMLElement;

        if (imperialSlider) {
            const weightLbs = this.reactiveSharedValues.get("weightLbs") || 135;
            imperialSlider.value = weightLbs.toString();
            if (imperialNumberInput) {
                imperialNumberInput.value = weightLbs.toString();
            }
            if (imperialDisplay) {
                imperialDisplay.textContent = weightLbs.toString();
            }
            imperialSlider.dispatchEvent(new Event("input", { bubbles: true }));
        }
    } else {
        // CRITICAL: Use correct PrecisionRangeSlider CSS classes
        const metricSlider = document.querySelector(".metric-weight .precision-range-input") as HTMLInputElement;
        const metricNumberInput = document.querySelector(".metric-weight .precision-number-input") as HTMLInputElement;
        const metricDisplay = document.querySelector(".metric-weight #weight-kg-display") as HTMLElement;

        if (metricSlider) {
            const weightKg = this.reactiveSharedValues.get("weightKg") || 73;
            metricSlider.value = weightKg.toString();
            if (metricNumberInput) {
                metricNumberInput.value = weightKg.toString();
            }
            if (metricDisplay) {
                metricDisplay.textContent = weightKg.toString();
            }
            metricSlider.dispatchEvent(new Event("input", { bubbles: true }));
        }
    }
}

// Complete unit toggle event handler pattern
document.addEventListener("unit-toggle-change", (event) => {
    const customEvent = event as CustomEvent;
    if (customEvent.detail.attribute === "unit") {
        // 1. Set unit preference
        this.reactiveSharedValues.set("weightUnit", customEvent.detail.value);

        // 2. Use sync method for conversion
        if (customEvent.detail.value === "metric") {
            this.reactiveSharedValues.syncWeightUnits("metric");
        } else {
            this.reactiveSharedValues.syncWeightUnits("imperial");
        }

        // 3. Toggle display
        this.toggleWeightUnit(customEvent.detail.value);

        // 4. Update visible sliders with converted values
        this.updateVisibleSliders();
    }
    this.calculate();
});
```

**Key Points:**

- **CRITICAL CSS Selector Fix:** PrecisionRangeSlider uses `.precision-range-input` and `.precision-number-input` (NOT `.range-input` and `.number-input`)
- Use ReactiveSharedValues `syncWeightUnits()` method for proper conversion
- Update all three elements: range input, number input, and display span
- Call `updateVisibleSliders()` AFTER the sync method completes

### Problem 8: Incorrect CSS Selectors for PrecisionRangeSlider Elements

**Issue:** Unit conversion appears to work in SharedValues but sliders don't update visually

**Root Cause:** Using wrong CSS class names when selecting PrecisionRangeSlider elements for manual updates

**Common Mistake:**

```javascript
// WRONG - these classes don't exist in PrecisionRangeSlider
const slider = document.querySelector(".range-input");
const numberInput = document.querySelector(".number-input");
```

**Correct Solution:**

```javascript
// CORRECT - actual PrecisionRangeSlider CSS classes
const slider = document.querySelector(".precision-range-input");
const numberInput = document.querySelector(".precision-number-input");
const display = document.querySelector(`#${id}-display`);
```

**PrecisionRangeSlider DOM Structure:**

```html
<div class="precision-range-wrapper">
	<input class="precision-range-input" type="range" id="weight-kg" />
	<div class="precision-controls">
		<button class="precision-decrement">−</button>
		<input class="precision-number-input" type="number" id="weight-kg-number" />
		<button class="precision-increment">+</button>
	</div>
	<div class="precision-display">
		<span id="weight-kg-display">73</span>
		<span class="precision-unit">kg</span>
	</div>
</div>
```

**Elements to Update When Force-Reloading:**

1. **Range Slider:** `.precision-range-input` - Sets the slider position
2. **Number Input:** `.precision-number-input` - Sets the number input value
3. **Display Span:** `#${id}-display` - Sets the visual display text
4. **Trigger Event:** Dispatch `input` event to update component state

**Complete Update Pattern:**

```javascript
private updateSliderElements(containerId: string, value: number, unit: string): void {
    const container = document.querySelector(containerId);
    if (container) {
        const slider = container.querySelector(".precision-range-input") as HTMLInputElement;
        const numberInput = container.querySelector(".precision-number-input") as HTMLInputElement;
        const display = container.querySelector(".precision-display span") as HTMLElement;

        if (slider) {
            slider.value = value.toString();
            slider.dispatchEvent(new Event("input", { bubbles: true }));
        }
        if (numberInput) {
            numberInput.value = value.toString();
        }
        if (display) {
            display.textContent = value.toString();
        }
    }
}
```

**Key Insight:** Always check the actual component's rendered HTML structure rather than assuming CSS class names. The PrecisionRangeSlider component uses `precision-` prefixed classes, not generic `range-` or `number-` classes.

## Conversion Formulas Reference

### Height Conversions

```javascript
// Inches to CM
const cm = Math.round(totalInches * 2.54);

// CM to Inches (round to nearest 0.5)
const totalInches = Math.round((cm / 2.54) * 2) / 2;

// Total inches to feet/inches
const feet = Math.floor(totalInches / 12);
const inches = Math.round((totalInches % 12) * 2) / 2;
```

### Weight Conversions

```javascript
// Pounds to Kilograms (round to 1 decimal)
const kg = Math.round(lbs * 0.453592 * 10) / 10;

// Kilograms to Pounds (round to whole number)
const lbs = Math.round(kg / 0.453592);
```

## Testing Checklist

After migration, verify:

- [ ] Default values load correctly on page refresh
- [ ] Slider adjustments immediately update SharedValues
- [ ] Unit conversions show mathematically correct values
- [ ] All input methods (slider, number input, +/- buttons) trigger sync
- [ ] Cross-calculator persistence works (values persist between pages)
- [ ] No console errors related to undefined properties
- [ ] Touch accessibility works on mobile devices
- [ ] **CSS selectors target correct PrecisionRangeSlider elements** (`.precision-range-input`, not `.range-input`)
- [ ] **Unit toggle updates all three elements:** range slider, number input, and display span
- [ ] **Force reload pattern works:** Set weight to 300 lbs → switch to metric → should show 136.1 kg (not fallback values)

## Debugging Checklist

When unit conversion isn't working:

1. **Check console logs:** Look for "SharedValues sync" debug output
2. **Verify CSS selectors:** Ensure using `.precision-range-input` classes
3. **Test sync methods:** Verify `syncWeightUnits()` is being called
4. **Check element updates:** All three elements (slider, input, display) should update
5. **Test cross-calculator:** Values should persist between different calculator pages

## Example: Complete Migration Pattern

```astro
<!-- 1. Import ReactiveSharedValues -->
<script src="/reactiveSharedValues.js" is:inline></script>

<script>
document.addEventListener("DOMContentLoaded", () => {
    // 2. Single global instance
    const sharedValues = new (window as any).ReactiveSharedValues();

    // 3. Initialize precision sliders with sync logic
    function initializePrecisionRangeSliders() {
        document.querySelectorAll(".precision-range-wrapper").forEach((wrapper) => {
            const rangeInput = wrapper.querySelector(".range-input") as HTMLInputElement;
            const sharedKey = rangeInput.dataset.sharedKey;

            // Event handler with bidirectional sync
            rangeInput.addEventListener("input", () => {
                if (sharedKey) {
                    const value = parseFloat(rangeInput.value);
                    sharedValues.set(sharedKey, value);

                    // 4. Critical: Sync equivalent unit values
                    if (sharedKey === "heightTotalInches") {
                        const cm = Math.round(value * 2.54);
                        sharedValues.set("heightCm", cm);
                    } else if (sharedKey === "heightCm") {
                        const totalInches = Math.round((value / 2.54) * 2) / 2;
                        sharedValues.set("heightTotalInches", totalInches);
                    }
                    // Add weight sync logic similarly...
                }
            });
        });
    }

    initializePrecisionRangeSliders();
});
</script>
```

## Performance Considerations

> **Note:** Performance optimizations should be implemented **AFTER** all calculator migrations are complete. Focus on core functionality and unit conversion accuracy first, then apply debouncing consistently across all calculators.

- **Debounced localStorage writes:** The sync logic writes to localStorage on every input change. For range sliders with frequent updates, implement debouncing:

```javascript
// Debounce utility function
function createDebounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// Debounced sync function
const debouncedSync = createDebounce((sharedKey, value) => {
    sharedValues.set(sharedKey, value);

    // Apply unit conversions
    if (sharedKey === "heightTotalInches") {
        const cm = Math.round(value * 2.54);
        sharedValues.set("heightCm", cm);
    }
    // ... other conversions
}, 150); // 150ms delay for smooth UX

// In range slider event handler
rangeInput.addEventListener("input", () => {
    // Update UI immediately (no delay for visual feedback)
    syncSliderValues(rangeInput, numberInput, display);
    if ((window as any).bmiCalculator) (window as any).bmiCalculator.calculate();

    // Debounce localStorage writes
    if (sharedKey) {
        debouncedSync(sharedKey, parseFloat(rangeInput.value));
    }
});
```

**Debounce Strategy by Input Type:**

- **Range Sliders:** 150ms delay (frequent drag events)
- **Number Inputs:** 300ms delay (typing completion)
- **+/- Buttons:** No debounce (discrete actions)
- **Unit Toggles:** No debounce (single action)

**Implementation Timing:**

- **Phase 1:** Complete all calculator migrations using the InputGroup + PrecisionRangeSlider pattern
- **Phase 2:** Apply debounce optimization consistently across all converted calculators
- **Benefits:** Simpler migrations, consistent performance optimization, easier testing

- **Minimize DOM queries:** Cache element references instead of querying repeatedly.
- **Batch updates:** Use `sharedValues.batch()` for multiple related changes.

## Future Enhancements

1. **Performance Optimization (Phase 2):** Implement debounce strategy consistently across all migrated calculators
2. **Reactive Subscriptions:** Use the ReactiveSharedValues event system for automatic UI updates
3. **Validation Integration:** Add unit-aware validation to the sync logic
4. **Animation Support:** Smooth transitions when switching between units
5. **Accessibility Improvements:** Enhanced screen reader support for unit changes

---

**Last Updated:** September 13, 2025  
**Based on:** BMI Calculator + BMR Calculator migration experience
