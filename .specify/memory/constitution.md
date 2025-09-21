<!--
Sync Impact Report
- Version: N/A → 1.0.0
- Modified principles: Defined 5 concrete principles (new)
- Added sections: Additional Constraints; Development Workflow & Quality Gates
- Removed sections: None (filled template placeholders)
- Templates updated:
	✅ .specify/templates/plan-template.md (path + version reference, explicit gates)
	✅ .specify/templates/tasks-template.md (QA approach aligned; removed strict TDD gate)
	⚪ .specify/templates/spec-template.md (no conflicting rules; left unchanged)
	⚪ .specify/templates/agent-file-template.md (no constitution references; unchanged)
- Follow-up TODOs: None
-->

# CruxCalc Constitution

## Core Principles

### I. Scientific Accuracy (NON-NEGOTIABLE)

CruxCalc MUST implement formulas from credible sources and ensure results are
mathematically correct. Each calculator page SHOULD cite sources or provide a
brief rationale where ambiguity exists.
Rationale: Trust depends on correctness and transparency.

### II. Consistent Components & UX

Calculators MUST use the shared component library (RangeSlider, UnitToggle,
GenderToggle, ResultCard, ResultValue, CategoryBadge, ComparisonTable,
InputGroup, CalculatorLayout, ValidationDisplay) to ensure consistent UX and
maintainability.
Rationale: Consistency reduces defects and speeds delivery.

### III. Performance and Accessibility

Pages MUST meet performance and accessibility targets: initial load under ~3s
on typical broadband, responsive interactions (~instant updates), semantic
markup with labeled controls and keyboard navigation.
Rationale: Inclusive, fast experiences increase user value.

### IV. Stability and Change Control

Calculators marked COMPLETED in CALCULATOR_CHECKLIST.md MUST NOT be modified
without explicit approval and a clear user request/issue. Any change MUST pass
the project’s quality gates and update relevant docs.
Rationale: Preserve stability and user trust.

### V. Simplicity Over Complexity

Prefer the simplest reliable implementation. Avoid unnecessary abstractions or
cross-cutting changes without strong justification. Keep console free of errors
and remove debug code before merging.
Rationale: Simpler systems are easier to evolve safely.

## Additional Constraints

- Framework: Astro 5.x with TypeScript where applicable, vanilla JS for
  client logic.
- Shared Values: Integrate with `/public/sharedValues.js` and
  `/public/reactiveSharedValues.js` per established patterns.
- Content: Educational and informational; no medical advice or diagnosis.
- Security & Privacy: No secrets in repo; no external calls without review; use
  localStorage/session-only values for convenience.
- Social & SEO: Maintain OG/Twitter coverage using `public/image-templates/`.

## Development Workflow & Quality Gates

All PRs MUST satisfy these gates:

1. Checklist Alignment

- Respect CALCULATOR_CHECKLIST.md statuses (COMPLETED calculators locked).

2. Requirements & Architecture

- Follow CALCULATOR_REQUIREMENTS.md and REFACTOR_PLAN.md (components, patterns,
  conversions, shared values, formatting flags).

3. Build & Types

- `npm run build` MUST succeed. No TypeScript errors. No console errors during
  development.

4. Testing & QA

- Follow TESTING.md: manual QA is REQUIRED. Lightweight, targeted validations
  are encouraged; large brittle E2E suites are not required.

5. Performance & Accessibility

- Meet stated performance and accessibility targets.

6. Documentation

- Update README and relevant docs when user-visible behavior changes. Include
  scientific references where appropriate.

## Governance

- Maintainers: Repo owners act as maintainers and reviewers unless CODEOWNERS
  is defined.
- Decision-Making: Day-to-day changes merge via PR with maintainer approval.
  Disputed changes default to existing behavior unless a clear improvement is
  demonstrated with data or strong reasoning.
- Calculator Changes: Only change calculators with explicit requests/issues;
  COMPLETED calculators require strong justification.
- Architectural Changes: Propose via issue referencing REFACTOR_PLAN.md with
  scope, risks, and migration strategy.
- Amendments: This constitution is updated via PR with maintainer approval.
  Use semantic versioning for the constitution version (see line below). When
  amended, update dependent templates that reference this file.

**Version**: 1.0.0 | **Ratified**: 2025-09-20 | **Last Amended**: 2025-09-20

# [PROJECT_NAME] Constitution

<!-- Example: Spec Constitution, TaskFlow Constitution, etc. -->

## Core Principles

### [PRINCIPLE_1_NAME]

<!-- Example: I. Library-First -->

[PRINCIPLE_1_DESCRIPTION]

<!-- Example: Every feature starts as a standalone library; Libraries must be self-contained, independently testable, documented; Clear purpose required - no organizational-only libraries -->

### [PRINCIPLE_2_NAME]

<!-- Example: II. CLI Interface -->

[PRINCIPLE_2_DESCRIPTION]

<!-- Example: Every library exposes functionality via CLI; Text in/out protocol: stdin/args → stdout, errors → stderr; Support JSON + human-readable formats -->

### [PRINCIPLE_3_NAME]

<!-- Example: III. Test-First (NON-NEGOTIABLE) -->

[PRINCIPLE_3_DESCRIPTION]

<!-- Example: TDD mandatory: Tests written → User approved → Tests fail → Then implement; Red-Green-Refactor cycle strictly enforced -->

### [PRINCIPLE_4_NAME]

<!-- Example: IV. Integration Testing -->

[PRINCIPLE_4_DESCRIPTION]

<!-- Example: Focus areas requiring integration tests: New library contract tests, Contract changes, Inter-service communication, Shared schemas -->

### [PRINCIPLE_5_NAME]

<!-- Example: V. Observability, VI. Versioning & Breaking Changes, VII. Simplicity -->

[PRINCIPLE_5_DESCRIPTION]

<!-- Example: Text I/O ensures debuggability; Structured logging required; Or: MAJOR.MINOR.BUILD format; Or: Start simple, YAGNI principles -->

## [SECTION_2_NAME]

<!-- Example: Additional Constraints, Security Requirements, Performance Standards, etc. -->

[SECTION_2_CONTENT]

<!-- Example: Technology stack requirements, compliance standards, deployment policies, etc. -->

## [SECTION_3_NAME]

<!-- Example: Development Workflow, Review Process, Quality Gates, etc. -->

[SECTION_3_CONTENT]

<!-- Example: Code review requirements, testing gates, deployment approval process, etc. -->

## Governance

<!-- Example: Constitution supersedes all other practices; Amendments require documentation, approval, migration plan -->

[GOVERNANCE_RULES]

<!-- Example: All PRs/reviews must verify compliance; Complexity must be justified; Use [GUIDANCE_FILE] for runtime development guidance -->

**Version**: [CONSTITUTION_VERSION] | **Ratified**: [RATIFICATION_DATE] | **Last Amended**: [LAST_AMENDED_DATE]

<!-- Example: Version: 2.1.1 | Ratified: 2025-06-13 | Last Amended: 2025-07-16 -->
