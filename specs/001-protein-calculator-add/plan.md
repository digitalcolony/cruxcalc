# Implementation Plan: Protein Calculator

**Branch**: `001-protein-calculator-add` | **Date**: 2025-09-20 | **Spec**: C:\_CODE\sites\cruxcalc\specs\001-protein-calculator-add\spec.md
**Input**: Feature specification from `/specs/001-protein-calculator-add/spec.md`

## Execution Flow (/plan command scope)

```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, `GEMINI.md` for Gemini CLI, `QWEN.md` for Qwen Code or `AGENTS.md` for opencode).
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:

- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary

Introduce a Protein calculator page and home card that provides daily protein recommendations across multiple guidelines (USA/CA/UK RDA, Bodybuilding, Pregnancy, Seniors 65+, Longevity-calorie-based). Inputs: Unit toggle, Gender, Age, Weight; optional Calories for longevity; checkboxes for Pregnancy (female only) and Bodybuilding. Instant updates and consistent UX with existing components.

## Technical Context

**Language/Version**: Astro 5.13.2, TypeScript 5.9, Vanilla JS (per repo)  
**Primary Dependencies**: Astro components (RangeSlider, UnitToggle, GenderToggle, CalculatorLayout, ResultCard/Value, etc.)  
**Storage**: localStorage via SharedValues helpers (session convenience)  
**Testing**: Manual QA per TESTING.md; targeted validations  
**Target Platform**: Static site (web)  
**Project Type**: web  
**Performance Goals**: ~instant input updates; initial page load < 3s  
**Constraints**: Accessibility, consistent component usage, unit conversions, simplicity (per constitution)  
**Scale/Scope**: Single calculator page + home card navigation

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- Scientific Accuracy: Provide sources for RDA and athletes/seniors/pregnancy ranges. PASS (will include citations in page copy).
- Consistent Components & UX: Use established components. PASS.
- Performance & Accessibility: Minimal JS; semantic markup via Astro components. PASS.
- Stability & Change Control: New calculator; does not alter COMPLETED ones. PASS.
- Simplicity Over Complexity: Simple calculations; no external calls. PASS.

## Project Structure

### Documentation (this feature)

```
specs/001-protein-calculator-add/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
└── spec.md
```

### Source Code (repository root)

```
src/
├── pages/
│  └── protein.astro
├── components/
│  └── (reuse existing)
└── styles/
```

**Structure Decision**: Option 1 (single web app) per existing repo.

## Phase 0: Outline & Research

1. Unknowns to resolve:
   - Pregnancy guidance: show both (1.1 g/kg) and (RDA +25 g) or designate one?
   - Longevity calories: where/how to input (visible field vs toggle)?
   - Seniors cutoff behavior: show adult + seniors concurrently at ≥65?
   - Rounding/precision: whole grams vs 0.1 g?
   - Citations: finalize sources for RDA values and athlete ranges.
2. Research tasks:
   - Gather official RDA references (USA/Canada/UK) and athlete/pregnancy/seniors references.
   - Confirm acceptable display ranges and unit equivalences (1.0 g/lb ≈ 2.2 g/kg).
3. Consolidate decisions in research.md.

**Output**: research.md

## Phase 1: Design & Contracts

1. Data Model (data-model.md):
   - Entities: ProteinRecommendation, UserProfileInputs
   - Validation rules: age ≥ 0; age ≥ 65 triggers seniors; pregnancy only when female; calories optional; unit conversions.
2. Contracts (contracts/protein.md):
   - Calculation contract documenting inputs → outputs (recommendations array with label, min/max/single value, rationale, conditions met).
3. Quickstart (quickstart.md):
   - Steps to view the calculator and test scenarios.

**Output**: data-model.md, contracts/, quickstart.md

## Phase 2: Task Planning Approach

- Generate tasks.md later from template (/tasks) with setup, tests/QA notes, core implementation, and polish, referencing exact file paths (`src/pages/protein.astro`, README update for new card link if needed).

## Phase 3+: Future Implementation

- Out of scope for this planning step.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --------- | ---------- | ------------------------------------ |
| —         | —          | —                                    |

## Progress Tracking

**Phase Status**:

- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [ ] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:

- [x] Initial Constitution Check: PASS
- [ ] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [ ] Complexity deviations documented

---

_Based on Constitution v1.0.0 - See `.specify/memory/constitution.md`_
