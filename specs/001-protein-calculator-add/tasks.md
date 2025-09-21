# Tasks: Protein Calculator

**Input**: Design documents from `/specs/001-protein-calculator-add/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)

```
1. Load plan.md from feature directory
   → If not found: ERROR "No implementation plan found"
   → Extract: tech stack, libraries, structure
2. Load optional design documents:
   → data-model.md: Extract entities → model tasks
   → contracts/: Each file → contract test task
   → research.md: Extract decisions → setup tasks
3. Generate tasks by category:
   → Setup: project init, dependencies, linting
   → Tests: contract tests, integration tests
   → Core: models, services, CLI commands
   → Integration: DB, middleware, logging
   → Polish: unit tests, performance, docs
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness:
   → All contracts have tests?
   → All entities have models?
   → All endpoints implemented?
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Phase 3.1: Setup

- [ ] T001 Add new page `src/pages/protein.astro`
- [ ] T002 Add home card link to `src/pages/index.astro`
- [ ] T003 [P] Update README with new calculator route

## Phase 3.2: Tests and QA Inputs

**Guidance**: Prefer small, focused checks. Manual QA is required per TESTING.md.
Where contract tests are defined, write them early and validate designs; large,
brittle E2E suites are optional and not required.

- [ ] T004 [P] Document calculation examples in `specs/001-protein-calculator-add/contracts/protein.md`
- [ ] T005 [P] Add quick sanity assertions in page script for edge values

## Phase 3.3: Core Implementation

- [ ] T006 Build UI with `CalculatorLayout`, `UnitToggle`, `GenderToggle`, age & weight sliders
- [ ] T007 Wire SharedValues for age/weight/gender; instant updates
- [ ] T008 Add checkboxes for bodybuilding and pregnancy (female-only visibility)
- [ ] T009 Add optional calories input for longevity guidance
- [ ] T010 Implement protein recommendations (USA/CA/UK, seniors, pregnancy, bodybuilding, longevity)
- [ ] T011 Display ranges and single values with clear labels and rounding rules
- [ ] T012 Add short source notes/citations in page copy

## Phase 3.4: Polish

- [ ] T013 Accessibility pass (labels, keyboard nav, ARIA where needed)
- [ ] T014 Performance check (no console errors, quick updates)
- [ ] T015 Cross-browser manual QA (Chrome/Edge/Firefox; mobile)
- [ ] T016 Update social images if needed (optional)

## Dependencies

- T001 precedes core UI tasks (T006-T012)
- SharedValues wiring (T007) precedes real-time calculations (T010)
- Optional calories (T009) precedes longevity display (T010 subset)

## Validation Checklist

- [ ] Home card navigates to /protein
- [ ] Female-only pregnancy visibility
- [ ] Seniors at age ≥ 65 shows seniors range alongside adult RDA
- [ ] Unit conversions correct; bodybuilding shows 1.0 g/lb and 1.6–2.2 g/kg
- [ ] Longevity hidden until calories provided; values 10–15%/4
- [ ] Rounding to whole grams; ranges as integers
- [ ] Citations present in page copy
