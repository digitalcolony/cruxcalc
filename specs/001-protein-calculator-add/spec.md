# Feature Specification: Protein Calculator

**Feature Branch**: `001-protein-calculator-add`  
**Created**: 2025-09-20  
**Status**: Draft  
**Input**: User description: "Protein calculator: add page and home card; inputs: UnitToggle, GenderToggle, Age, Weight; recommendations for USA/CA/UK RDA, Bodybuilding, Pregnancy (female only), Seniors (65+), Longevity (calorie-based); checkboxes for pregnancy and bodybuilding; match existing UX/components."

## Execution Flow (main)

```
1. Parse user description from Input
   → If empty: ERROR "No feature description provided"
2. Extract key concepts from description
   → Identify: actors, actions, data, constraints
3. For each unclear aspect:
   → Mark with [NEEDS CLARIFICATION: specific question]
4. Fill User Scenarios & Testing section
   → If no clear user flow: ERROR "Cannot determine user scenarios"
5. Generate Functional Requirements
   → Each requirement must be testable
   → Mark ambiguous requirements
6. Identify Key Entities (if data involved)
7. Run Review Checklist
   → If any [NEEDS CLARIFICATION]: WARN "Spec has uncertainties"
   → If implementation details found: ERROR "Remove tech details"
8. Return: SUCCESS (spec ready for planning)
```

---

## ⚡ Quick Guidelines

- ✅ Focus on WHAT users need and WHY
- ❌ Avoid HOW to implement (no tech stack, APIs, code structure)
- 👥 Written for business stakeholders, not developers

### Section Requirements

- **Mandatory sections**: Must be completed for every feature
- **Optional sections**: Include only when relevant to the feature
- When a section doesn't apply, remove it entirely (don't leave as "N/A")

### For AI Generation

When creating this spec from a user prompt:

1. **Mark all ambiguities**: Use [NEEDS CLARIFICATION: specific question] for any assumption you'd need to make
2. **Don't guess**: If the prompt doesn't specify something (e.g., "login system" without auth method), mark it
3. **Think like a tester**: Every vague requirement should fail the "testable and unambiguous" checklist item
4. **Common underspecified areas**:
   - User types and permissions
   - Data retention/deletion policies
   - Performance targets and scale
   - Error handling behaviors
   - Integration requirements
   - Security/compliance needs

---

## User Scenarios & Testing _(mandatory)_

### Primary User Story

As a user planning my nutrition, I want a protein intake calculator that provides daily protein recommendations tailored to my demographic (age, gender), weight, and preferences (e.g., bodybuilding, pregnancy), so I can choose a guideline that fits my goals and context.

### Acceptance Scenarios

1. **Given** the Protein calculator page is open with default values, **When** I adjust weight and unit toggle, **Then** all protein recommendations update in real time and reflect the selected unit correctly.
2. **Given** I select female gender and enable the pregnancy option, **When** I view recommendations, **Then** a pregnancy-specific recommendation appears using pre-pregnancy weight logic, and non-applicable options remain available but clearly labeled.
3. **Given** I enable the bodybuilding option, **When** I view recommendations, **Then** bodybuilding-specific guidance is shown (kg: 1.6–2.2 g/kg, lb: 1.0 g/lb) alongside standard RDAs.
4. **Given** I enter an age of 65 or higher, **When** I view recommendations, **Then** a seniors (65+) recommendation appears using 1.0–1.2 g/kg.
5. **Given** I provide daily calories in a longevity-focused mode, **When** I view recommendations, **Then** a longevity recommendation appears using 10–15% of calories ÷ 4; if calories are not provided, **Then** the longevity recommendation is clearly unavailable or prompts for calories.

### Edge Cases

- Very low or high body weights return calculated ranges but include a caution note if outside typical adult ranges.
- Pregnancy toggle is only visible for female; enabling bodybuilding and pregnancy together still displays both recommendations for user comparison (with notes that they represent different intents).
- Unit switching converts and preserves intended meaning (e.g., 1.0 g/lb ≈ 2.2 g/kg) and displays appropriate ranges.
- Age exactly 65 triggers seniors guidance; ages below 65 do not.
- Missing calories hides longevity recommendation or shows a minimal prompt hint.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST add a new Protein calculator page with a tile/card on the home page.
- **FR-002**: System MUST support weight input with unit toggle (imperial/metric) and gender selection consistent with existing calculators.
- **FR-003**: System MUST capture age to enable seniors (65+) guidance.
- **FR-004**: System MUST provide checkboxes for Pregnancy and Bodybuilding.
- **FR-005**: Pregnancy checkbox MUST be visible only when female is selected.
- **FR-006**: System MUST compute and display, in the results column, the following recommendations based on weight (converted to kg as needed):
  - USA RDA: 0.8 g/kg/day
  - Canada RDA: 0.66–0.80 g/kg/day
  - UK RDA: 0.75 g/kg/day
  - Bodybuilding: 1.6–2.2 g/kg/day (and 1.0 g/lb/day shown when imperial selected)
  - Pregnancy (if enabled & female): pre-pregnancy weight × 1.1 g/kg/day (or baseline RDA + 25 g/day; show both if appropriate)
  - Seniors (65+): 1.0–1.2 g/kg/day
  - Longevity-focused: (Calories × 0.10–0.15) ÷ 4 g/day (requires user-provided calories)
- **FR-007**: System MUST clearly label each recommendation with source region/category and show units consistent with current unit selection.
- **FR-008**: System MUST update recommendations instantly on input changes (age, gender, weight, unit, checkboxes, calories).
- **FR-009**: System MUST integrate with SharedValues for age, weight, and gender where applicable.
- **FR-010**: System MUST include short explanatory text for each recommendation explaining its typical use context (general population, seniors, athletes, pregnancy, longevity/plant-forward).
- **FR-011**: Home page card MUST navigate to the Protein calculator page.

_Ambiguity markers to resolve during design:_

- **FR-012**: Pregnancy guidance: [NEEDS CLARIFICATION: Should we present both 1.1 g/kg and RDA + 25 g/day, or choose one primary and list the other as alternative?]
- **FR-013**: Longevity mode: [NEEDS CLARIFICATION: Where does the user input calories? A small input on the page vs. a toggle to reveal?]
- **FR-014**: Seniors threshold: [NEEDS CLARIFICATION: Age 65 inclusive is specified; confirm exact cutoff and whether to show both adult RDA and seniors range concurrently.]
- **FR-015**: Rounding/precision: [NEEDS CLARIFICATION: Standard rounding to whole grams vs 0.1 g precision?]

### Key Entities _(include if feature involves data)_

- **ProteinRecommendation**: Represents a named guidance line (e.g., "USA RDA") with min/max or single value, unit context (g/day), applicable conditions (e.g., age>=65, gender=female, pregnancy=true), and short description.
- **UserProfileInputs**: Age, gender, weight, unit, bodybuilding (bool), pregnancy (bool), optional calories for longevity recommendation.

---

## Review & Acceptance Checklist

_GATE: Automated checks run during main() execution_

### Content Quality

- [x] No implementation details (languages, frameworks, APIs)
- [x] Focused on user value and business needs
- [x] Written for non-technical stakeholders
- [x] All mandatory sections completed

### Requirement Completeness

- [ ] No [NEEDS CLARIFICATION] markers remain
- [x] Requirements are testable and unambiguous
- [x] Success criteria are measurable
- [x] Scope is clearly bounded
- [x] Dependencies and assumptions identified

---

## Execution Status

_Updated by main() during processing_

- [x] User description parsed
- [x] Key concepts extracted
- [x] Ambiguities marked
- [x] User scenarios defined
- [x] Requirements generated
- [x] Entities identified
- [ ] Review checklist passed

---
