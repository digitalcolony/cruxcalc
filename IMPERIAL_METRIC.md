## Global Unit System (Imperial / Metric) – Requirements

### 1. Problem Statement

Multiple calculators each implement their own unit toggles (height vs. weight, or weight only). This creates UI clutter, inconsistency, duplicate logic, and greater risk of values drifting or becoming unsynchronized. We want a single global unit system selector (Imperial | Metric) that applies consistently to all calculators that use physical measurements.

### 2. Goals & Non-Goals

**Goals**

1. Provide a single global unit switch stored in `ReactiveSharedValues` under `unitSystem` (`'imperial' | 'metric'`).
2. Default to `'imperial'` if no preference is stored.
3. Persist user preference across sessions (localStorage via existing reactive manager).
4. Migrate calculators incrementally (BMI → BMR → One Rep Max → Potato Hack → Body Fat last).
5. Maintain backward compatibility with existing keys (`heightUnit`, `weightUnit`) during transition.
6. Avoid double conversion and rounding drift.

**Non-Goals (Phase 1)**

1. Localization or regional formatting beyond units.
2. Server-side personalization.
3. Removal of legacy keys until after final migration.
4. Redesign of existing calculation algorithms.

### 3. Affected Calculators & Current State

| Calculator         | Current Toggles                   | Units Impacted                    | Notes                                               |
| ------------------ | --------------------------------- | --------------------------------- | --------------------------------------------------- |
| BMI                | Separate height + weight toggles  | height + weight                   | Uses bidirectional sync code; recently refactored.  |
| BMR                | Separate height + weight toggles  | height + weight                   | Similar logic to BMI; includes activity multiplier. |
| Body Fat           | Partial metric toggle only at top | height + weight + (future inputs) | Highest complexity; schedule last.                  |
| One Rep Max        | Single weight toggle              | weight                            | Reps unaffected.                                    |
| Potato Hack        | Single weight (confirm specifics) | weight                            | Simpler; after One Rep Max.                         |
| Others (HR / Pace) | No physical dimension toggles     | N/A                               | Likely no global switch display.                    |

### 4. Data Model Changes

Add new key in `ReactiveSharedValues` defaults:

```js
unitSystem: "imperial";
```

Behavior:

- When `unitSystem` changes:
  - If `value === 'metric'` and prior `heightUnit === 'imperial'`, call `syncHeightUnits('metric')`.
  - If `value === 'metric'` and prior `weightUnit === 'imperial'`, call `syncWeightUnits('metric')`.
  - Reverse when switching back to `'imperial'`.
- Maintain `heightUnit` / `weightUnit` as mirrors until all migrations complete; treat them as derived state long-term.

### 5. Functional Requirements

1. A single global toggle appears for calculators requiring measurement conversions.
2. Changing the toggle updates `unitSystem` and emits a new `unit-system-change` event: `{ value, previous }`.
3. Affected calculators listen for this event and re-render measurement inputs (show correct slider group) and recalculate outputs.
4. Conversions must be idempotent; rapid toggling should not accumulate rounding drift.
5. Conversions:
   - Inches ↔ Centimeters: `cm = round(totalInches * 2.54)`, `inches = roundToNearest0.5(cm / 2.54)`.
   - Pounds ↔ Kilograms: `kg = round1(lbs * 0.453592)`, `lbs = round(kg / 0.453592)`.
6. Persistence: On load, if `unitSystem` absent, initialize to `'imperial'` and store.
7. Legacy per-field toggles removed progressively per migration phase (hidden or deleted from DOM).
8. No double dispatch loops: setting `unitSystem` should not trigger redundant per-field events once legacy toggles removed.
9. Accessibility: Toggle is keyboard navigable and screen-reader descriptive.

### 6. UX & Interaction Specification

**Component**: `GlobalUnitToggle.astro`

- Placement: Top of content inside `CalculatorLayout` (beneath title) OR global header (configurable).
- Appearance: Segmented control with two buttons: “Imperial” | “Metric”.
- State: Selected segment visually highlighted; ARIA attributes (`role="tablist"` + `role="tab"` or `role="switch"` alternative).
- Mobile: Full-width pill segmented control.
- Hidden automatically on calculators with no convertible fields.

Empty state: Not applicable (always exactly two options).

### 7. Event & API Design

**New Event**: `unit-system-change`

```ts
detail: {
	value: "imperial" | "metric";
	previous: "imperial" | "metric";
}
```

Dispatch Order:

1. Read previous value
2. `ReactiveSharedValues.set('unitSystem', newValue)`
3. Perform height/weight sync conversions
4. Dispatch `unit-system-change`

**Legacy Events**: `unit-toggle-change` continue only where old toggles exist (phased out).

### 8. Migration & Rollout Plan

Order (lowest → highest complexity):

1. BMI
2. BMR
3. One Rep Max
4. Potato Hack
5. Body Fat

Per Phase Checklist:

1. Insert `GlobalUnitToggle` component.
2. Remove local unit toggle markup (comment out initially for easy rollback).
3. Replace any `heightUnit`/`weightUnit` branching with `unitSystem` derived logic.
4. Ensure conversions trigger exactly once on switch.
5. Update tests & manual smoke scenarios.
6. Tag migration complete in CHANGELOG (optional).

Rollback Plan: Re-enable legacy toggles (kept commented) + ignore `unitSystem` event temporarily.

### 9. Per-Calculator Adaptation Steps

**BMI**

- Remove separate height & weight toggles.
- Listen for `unit-system-change` and re-run `showCurrentUnitInputs()` + `updateRangeSliders()`; recalc BMI.
- Ensure Asian scale unaffected.

**BMR**

- Same removal and listener addition.
- Confirm activity multiplier unchanged.
- Use `unitSystem` to derive both height/weight.

**One Rep Max**

- Remove per-weight toggle.
- Store original weight in lbs internally; convert display if metric.
- Only one weight control visible at a time.

**Potato Hack**

- Replace local toggle with global; verify nutrition conversion consistency.

**Body Fat (Last)**

- Expand metric support to all measurement-dependent inputs.
- Centralize canonical storage (e.g., store height in cm, weight in kg internally).
- Provide derived imperial display where needed.

### 10. Testing Strategy

**Unit Tests (future)**: Conversion helpers (round-trip invariance).
**Integration**: Simulate `unit-system-change` and assert slider value swaps & recomputed outputs.
**E2E (future Playwright)**:

1. Toggle units 5 times quickly → values stable within tolerance.
2. Set values in BMI → navigate to BMR; units persist.
3. Reload retains selection.

**Round-Trip Tolerances**

- Height: Return to within 0.5 in of original.
- Weight: Return to within 1 lb of original.

**Matrix** (sample points):

- Heights: 60, 68, 72.5 in.
- Weights: 100, 135, 180, 250 lbs.

### 11. Risks & Mitigations

| Risk                   | Impact                  | Mitigation                                         |
| ---------------------- | ----------------------- | -------------------------------------------------- |
| Double conversion      | Value drift             | Convert from canonical stored value only, not DOM. |
| Legacy toggle leftover | UI confusion            | Phase checklist & grep for `.unit-toggle`.         |
| Race conditions        | Flicker / stale display | Atomic update order; dispatch after sync.          |
| Body Fat delay         | Inconsistent UX         | Document phased rollout expectation.               |
| Rounding differences   | User distrust           | Document rounding rules; consistent formatting.    |

### 12. Acceptance Criteria

Feature accepted when:

1. `unitSystem` key present and persists.
2. Global toggle visible on all migrated calculators (and only those needing it).
3. No local unit toggle remains in migrated calculators.
4. Switching recalculates results immediately (BMI, BMR, One Rep Max, Potato Hack).
5. Body Fat migrated last with full parity.
6. Round-trip conversion within tolerances.
7. No console errors on rapid toggling.

### 13. Performance & Telemetry (Optional / Nice-to-Have)

- Count toggle uses per session (dev mode log only initially).
- Track first-run default assignment vs returning preference.
- (Future) Collect median time between toggles to detect confusion.

### 14. Implementation Outline (High-Level)

1. Add `unitSystem` to `ReactiveSharedValues` defaults & set method enhancements.
2. Create `GlobalUnitToggle.astro` (segmented control) with event dispatch.
3. Inject component into `CalculatorLayout` (prop gate like `showUnitToggle`).
4. BMI migration (remove local toggles, adopt global event).
5. BMR migration.
6. One Rep Max migration.
7. Potato Hack migration.
8. Body Fat full refactor.
9. Cleanup: Remove legacy unit toggle component instances where obsolete.
10. Add conversion utility centralization (optional refactor pass).

### 15. Open Questions

1. Should global toggle appear on calculators without dimensional inputs? (Proposed: hide.)
2. Do we want a user-facing notice when switching units (toast)? (Probably not initially.)
3. Keep separate `heightUnit` & `weightUnit` after full migration? (Proposed: deprecate but keep for backward compatibility for one release.)

### 16. Next Immediate Step

Implement Step 1 & 2: Add `unitSystem` to `ReactiveSharedValues` and scaffold `GlobalUnitToggle.astro`. Then migrate BMI.

---

End of Requirements Document.
