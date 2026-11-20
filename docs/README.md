# Scenova — Project Documentation

**Tagline:** Explore Scenarios. Make Better Decisions.  
**Product:** Business & Productivity — Profit & Pricing Simulator  
**Status:** Complete — MVP implemented, verified, deployed at https://scenova-seven.vercel.app/, smoke-tested, and approved.

## Document Structure

```text
scenova/
├── README.md
├── coldstart.md
└── docs/
    ├── 00-step-0-idea-validation.md
    ├── 01-prd.md
    ├── 02-persona-user-flow.md
    ├── 03-wireframes.md
    ├── 04-database-schema.md
    ├── 05-style-mood.md
    └── 09-deployment.md
```

## Delivery Sequence

1. STEP 0 — Idea selection, initial research, and mentor approval.
2. STEP 1 — Product Requirements Document.
3. STEP 2 — Persona and user flow.
4. STEP 3 — Wireframes.
5. STEP 4 — Database schema.
6. STEP 5 — Style and mood.
7. After STEP 1–5 are approved, use `coldstart.md` as the source of truth for the AI app builder.
8. STEP 6–8 — Stack setup, full-stack build, and local testing/debugging.
9. STEP 9 — Deployment and documentation; follow the checklist in `09-deployment.md`.
10. STEP 10 — Product review and final approval.

## Guiding Principles

- Follow the approved MVP scope; do not add features without explicit approval.
- Simulation results are mathematical estimates based on user assumptions, not predictions or guarantees.
- Store monetary values as decimals and display them with a consistent currency format.
- Keep calculations in tested pure TypeScript functions instead of duplicating formulas across the UI.
- Keep the interface responsive, readable, and consistent with the approved visual direction.
- Treat the root `README.md` as the public project entry point and this file as the internal documentation index.
