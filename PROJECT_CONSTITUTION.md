# CruxCalc Project Constitution

This constitution defines how the CruxCalc project is governed, how decisions are made, and the quality standards that changes must meet. It complements existing docs like CALCULATOR_CHECKLIST.md, CALCULATOR_REQUIREMENTS.md, REFACTOR_PLAN.md, TESTING.md, and the MIT LICENSE.

## 1) Mission and Scope

- Mission: Provide fast, accurate, and user-friendly health and fitness calculators with a consistent design and excellent performance across devices.
- Scope: Public website and assets in this repository, including Astro pages, components, styles, shared values scripts, social images tooling, and documentation.
- Non-goals: Medical diagnosis or personalized clinical guidance. Content is educational and informational.

## 2) Values and Principles

- Accuracy first: Implement formulas from credible sources with clear references.
- Consistency: Reuse the shared component library and patterns across all calculators.
- Performance and accessibility: Target <3s first load on typical broadband and meet accessible, keyboard-navigable UI standards.
- Stability: Do not modify calculators marked as COMPLETED without explicit approval and a clear user request.
- Simplicity: Prefer the simplest reliable implementation; avoid unnecessary complexity.

## 3) Ownership and Roles

- Maintainer(s): Responsible for triage, roadmap, releases, and enforcing this constitution.
- Contributor(s): Anyone submitting PRs or issues following the process below.
- Reviewer(s): Maintainer(s) or delegates responsible for code review and quality gates.

Notes: Specific individuals may be listed in CODEOWNERS in the future. Until then, the repo owner(s) on GitHub act as maintainers.

## 4) Decision-Making

- Day-to-day changes: Maintainer review and approval via pull request (PR) required.
- Disputed changes: Default to “keep existing behavior” unless a clear improvement is demonstrated with data or strong reasoning.
- Calculator changes: Only update calculators with explicit request/issue. Calculators marked as COMPLETED require strong justification.
- Architectural changes: Propose via issue that references REFACTOR_PLAN.md with scope, risks, and migration strategy.

## 5) Branching and Releases

- Default branch: `main`
- Feature branches: `feature/<short-name>` or topical (e.g., `protein`) per current practice.
- PR policy: All changes land through PRs with at least one maintainer approval and passing checks.
- Releases: Deployments follow Astro build outputs from `main`. Tag releases optionally with semantic tags (e.g., `vX.Y.Z`).

## 6) Change Control and Quality Gates

Every PR must satisfy the following:

- Checklist alignment: Follow CALCULATOR_CHECKLIST.md and do not modify calculators marked COMPLETED without approval.
- Requirements: Ensure changes comply with CALCULATOR_REQUIREMENTS.md and REFACTOR_PLAN.md standards.
- Build: `npm run build` completes successfully.
- Lint/Types: No TypeScript errors (tsconfig enforced). Keep console free of errors during dev.
- Testing & QA: Follow TESTING.md manual QA checklist. Prefer quick, targeted validations.
- Performance: Respect performance targets (<3s initial load; ~instant input response).
- Accessibility: Labels, keyboard navigation, and reasonable contrast.
- Docs: Update README, requirements, or checklist when user-visible behavior changes.

## 7) Calculator Lifecycle

Statuses for each calculator live in CALCULATOR_CHECKLIST.md. Lifecycle stages:

1. Proposal: Requirements described or issue opened.
2. Implementation: Work on a feature branch using shared components and patterns.
3. Verification: Manual QA per TESTING.md and the technical checklist.
4. Completion: Marked as COMPLETED in CALCULATOR_CHECKLIST.md and locked against drive-by edits.
5. Revisions: Only with explicit approval and updated status notes.

## 8) Code Standards

- Framework: Astro 5.x, TypeScript where applicable, Vanilla JS for client-side logic.
- Components: Use established components (`RangeSlider`, `UnitToggle`, `GenderToggle`, `ResultCard`, `ResultValue`, `CategoryBadge`, `ComparisonTable`, `InputGroup`, `CalculatorLayout`, `ValidationDisplay`).
- Shared values: Integrate with `/public/sharedValues.js` and `/public/reactiveSharedValues.js` using the approved event model.
- Imports: Use consistent ES module style; for shared values use the documented `script` pattern when required.
- Formatting/Precision: Use component props such as `formatAsPace` or `formatAsHeight` as designed.

## 9) Content Standards

- Scientific references: Link or cite formula sources in page content where helpful.
- Language: Clear, neutral, user-focused explanations. No medical claims.
- Social/SEO: Maintain OG/Twitter card coverage using `public/image-templates/` tooling when adding new pages.

## 10) Security and Privacy

- No collection of personal data beyond in-session/localStorage values used for convenience.
- No secrets committed to the repo. Do not add external network calls without review.

## 11) Community and Contributions

- License: MIT (see LICENSE).
- Code of Conduct: Be respectful and constructive. A separate CODE_OF_CONDUCT.md may be added if community size warrants it.
- How to contribute:
  - Open an issue describing the change or bug.
  - Create a feature branch and a PR referencing the issue.
  - Pass quality gates and request a maintainer review.

## 12) Governance Changes

This constitution can be updated through a PR with maintainer approval. Substantive changes should be summarized in the PR and, when relevant, linked from README.md.

## 13) References

- CALCULATOR_CHECKLIST.md
- CALCULATOR_REQUIREMENTS.md
- REFACTOR_PLAN.md
- TESTING.md
- README.md
- LICENSE

---

Version: 1.0 (2025-09-20)
