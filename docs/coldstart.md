# SCENOVA — COLDSTART DOCUMENT

**Tagline:** Explore Scenarios. Make Better Decisions.  
**Product Category:** Business & Productivity  
**MVP:** Profit & Pricing Simulator  
**Document Version:** 1.0  
**Planning Status:** STEP 0–5 approved by user; mentor approval reported by user.  
**Implementation Status:** Complete — MVP implemented and locally verified; EN/ID localization added.

> This document is the single source of truth for the Scenova MVP. Read it before making product, architecture, or implementation decisions. Do not add features or change the approved scope without explicit approval.

---

# 1. Product Overview

Scenova is an interactive business simulation platform that helps business owners and entrepreneurs understand how changes in transaction value, variable costs, fixed costs, and transaction volume affect estimated business performance.

The long-term vision is a general-purpose simulation platform for exploring business decisions. The MVP is intentionally focused on one reliable model: **Profit & Pricing Simulator**.

The MVP's common model is designed to support both product and service businesses using average transaction value and transaction volume. It does not implement industry-specific formulas.

## 1.1 Problem

Business owners need to consider changes in price, costs, and transaction volume, but may not have the time or skills to build financial spreadsheets and compare scenarios manually.

## 1.2 Solution

Scenova lets users:
1. Set up baseline business assumptions.
2. Adjust key assumptions interactively.
3. See updated financial estimates and visualizations.
4. Save and compare multiple scenarios.

## 1.3 Target Users

- Small and medium business owners.
- Aspiring entrepreneurs.
- Product and service business operators.
- Users who want to explore pricing and operating assumptions.

Primary persona: an illustrative small-business owner who manages daily operations and needs a simple way to compare possible business outcomes without building a spreadsheet from scratch.

---

# 2. Approved MVP Scope

## 2.1 Core Features

### A. Business Model Setup
Input:
- Business or simulation name.
- Business type label: product, service, or other.
- Calculation period.
- Average transaction value.
- Variable cost per transaction.
- Fixed cost per period.
- Transaction volume per period.

### B. Interactive Simulation
- Users can adjust average transaction value, variable cost, fixed cost, and transaction volume.
- Recalculate results whenever an assumption changes.
- Provide numeric inputs; sliders may supplement them where useful.
- Provide reset-to-baseline behavior.

### C. Scenario Comparison
- Save named scenarios.
- Support examples such as Baseline, Optimistic, and Conservative.
- Select and compare multiple saved scenarios.
- Show metrics in a table and chart.

### D. Results & Insights
Display:
- Revenue.
- Total variable cost.
- Fixed cost.
- Total cost.
- Estimated operating profit.
- Operating margin.
- Break-even volume.
- Comparison visualizations.

## 2.2 Out of Scope

Do not build these in the MVP:
- AI or Machine Learning predictions.
- Monte Carlo simulation.
- POS, bank, or marketplace integrations.
- Full accounting or bookkeeping.
- Industry-specific calculation engines.
- Arbitrary formula builder.
- Team collaboration.
- Subscription and billing.
- Automated recommendations that imply guaranteed business outcomes.

## 2.3 Product Truthfulness

All results are mathematical estimates based on user-provided assumptions. They are not forecasts, guarantees, or professional financial advice. Clearly show assumptions, period, and currency. Do not imply the model accounts for taxes, financing, depreciation, demand elasticity, inventory, or other excluded factors.

---

# 3. Calculation Model

Use one period consistently for all inputs.

```text
Revenue = Average Transaction Value × Transaction Volume

Total Variable Cost =
  Variable Cost per Transaction × Transaction Volume

Total Cost = Total Variable Cost + Fixed Cost

Operating Profit = Revenue - Total Cost

Operating Margin =
  (Operating Profit / Revenue) × 100
  only when Revenue > 0

Contribution per Transaction =
  Average Transaction Value - Variable Cost per Transaction

Break-even Volume =
  Fixed Cost / Contribution per Transaction
  only when Contribution per Transaction > 0
```

Break-even volume is displayed as a whole transaction count rounded up. If contribution per transaction is zero or negative, display that break-even cannot be reached under the current assumptions. If revenue is zero, show operating margin as unavailable (`—`) rather than dividing by zero.

Default display currency: IDR (Rp). Keep currency formatting consistent. Do not mix periods across assumptions.

---

# 4. User Flow

1. Landing Page — user understands Scenova and starts.
2. Login / Register — user accesses a personal account.
3. Dashboard — user sees their simulations and creates a new one.
4. Business Setup — user enters baseline assumptions.
5. Simulation Workspace — user adjusts assumptions and sees recalculated metrics.
6. Results & Insights — user reviews financial estimates and assumptions.
7. Scenario Comparison — user compares saved scenarios.
8. User may return to the workspace, adjust assumptions, save another scenario, or reopen a saved simulation.

## 4.1 Required Pages

- Landing Page
- Login / Register
- Dashboard
- Business Setup
- Simulation Workspace
- Results & Insights
- Scenario Comparison

---

# 5. Wireframe Requirements

## Landing Page
- Scenova brand and navigation.
- Main headline: “Explore scenarios. Make better decisions.”
- Brief product explanation.
- Primary CTA: Start Simulation.
- Three-step “How it works” section.
- Footer with disclaimer and basic links.

## Login / Register
- Email and password fields.
- Sign-in and account-creation paths.
- Validation and clear error states.

## Dashboard
- Navigation.
- New Simulation CTA.
- Summary of simulations and saved scenarios.
- List of the user's simulations.
- Empty state for first-time users.

## Business Setup
- Simulation name.
- Business type label.
- Period.
- Average transaction value.
- Variable cost per transaction.
- Fixed cost per period.
- Transaction volume.
- Validation and continue action.

## Simulation Workspace
- Editable assumptions.
- Numeric input for precise values.
- Optional slider controls.
- Revenue, total cost, operating profit, margin, and break-even metrics.
- Chart.
- Reset and save-scenario actions.

## Results & Insights
- Metric summary.
- Financial overview chart.
- Assumptions used.
- Visible estimate disclaimer.

## Scenario Comparison
- Select saved scenarios.
- Comparison table.
- Comparison chart.
- Return-to-simulation action.

Responsive behavior:
- Desktop may use two-column workspace.
- Mobile stacks assumptions and results vertically.
- Tables can scroll horizontally on narrow screens.
- Charts and controls remain readable and touch-friendly.

---

# 6. Database Schema

Database: PostgreSQL via Supabase. Authentication: Supabase Auth.

### 6.0 Implementation Decision

During build, no Supabase project or credentials were available. With explicit approval, the implementation uses Neon PostgreSQL (`aws-ap-southeast-1`, PostgreSQL 18) while preserving the mandatory PostgreSQL stack. Because Supabase Auth was unavailable, the implementation uses a server-side email/password directory (`app_users`) with hashed session tokens (`sessions`) and an httpOnly cookie.

This is a provider substitution, not an MVP scope change. Business tables remain user-owned and protected with `FORCE ROW LEVEL SECURITY`; ownership is enforced by server-side queries plus a transaction-local `app.current_user_id` GUC used by RLS policies. Monetary columns remain `NUMERIC(14,2)`; calculations use BigInt minor units in pure TypeScript.

## 6.1 `businesses`

| Column | Type | Constraints |
|---|---|---|
| id | UUID | Primary key |
| user_id | UUID | FK → auth.users.id, NOT NULL |
| name | VARCHAR(120) | NOT NULL |
| business_type | VARCHAR(30) | NOT NULL, default `other` |
| created_at | TIMESTAMPTZ | NOT NULL |
| updated_at | TIMESTAMPTZ | NOT NULL |

## 6.2 `simulations`

| Column | Type | Constraints |
|---|---|---|
| id | UUID | Primary key |
| business_id | UUID | FK → businesses.id, NOT NULL |
| user_id | UUID | FK → auth.users.id, NOT NULL |
| name | VARCHAR(120) | NOT NULL |
| period | VARCHAR(20) | NOT NULL, default `monthly` |
| created_at | TIMESTAMPTZ | NOT NULL |
| updated_at | TIMESTAMPTZ | NOT NULL |

## 6.3 `scenarios`

| Column | Type | Constraints |
|---|---|---|
| id | UUID | Primary key |
| simulation_id | UUID | FK → simulations.id, NOT NULL |
| user_id | UUID | FK → auth.users.id, NOT NULL |
| name | VARCHAR(80) | NOT NULL |
| average_transaction_value | NUMERIC(14,2) | NOT NULL, CHECK >= 0 |
| variable_cost_per_transaction | NUMERIC(14,2) | NOT NULL, CHECK >= 0 |
| fixed_cost | NUMERIC(14,2) | NOT NULL, CHECK >= 0 |
| transaction_volume | INTEGER | NOT NULL, CHECK >= 0 |
| created_at | TIMESTAMPTZ | NOT NULL |
| updated_at | TIMESTAMPTZ | NOT NULL |

Relationships:
- One auth user owns many businesses.
- One business has many simulations.
- One simulation has many scenarios.

Security:
- Enable RLS on every application table.
- Users can access only rows where `user_id = auth.uid()`.
- Validate parent ownership when creating or changing foreign-key relationships.
- Never expose Supabase service-role credentials to the client.
- Use `NUMERIC` for monetary values, not floating-point database types.

---

# 7. Visual Design & Design System

## 7.1 Approved Direction

**Style:** Botanical Editorial — Modern, Warm, Minimal, Refined.

The visual reference provided by the user features an editorial lifestyle brand layout, generous whitespace, expressive serif typography, botanical illustration, and a forest-green / cream / coral palette.

Scenova adapts that visual language to a business simulation product. The landing page can use expressive editorial composition and botanical/geometric illustration. The dashboard and simulation workspace must prioritize data clarity and readability.

## 7.2 Color Palette

| Color | Hex | Ratio | Use |
|---|---|---:|---|
| Forest Green | `#2F4A3A` | 60% | Primary brand, headings, navigation, primary actions, chart base |
| Cream | `#F3EBDD` | 30% | Main background, surfaces, cards, content areas |
| Coral | `#F47E6A` | 10% | Accent, secondary CTA, highlights, selected states |

The 60–30–10 ratio is a visual guideline. Maintain accessible contrast; do not use color alone to convey status.

## 7.3 Typography

- Display / headings: DM Serif Display or Playfair Display.
- Body / interface: DM Sans or Inter.
- Serif headings create editorial character.
- Sans-serif is used for forms, tables, labels, metrics, and explanatory text.

## 7.4 UI Principles

- Generous whitespace.
- Moderate rounded corners.
- Subtle borders; avoid heavy shadows.
- Forest-green primary buttons.
- Coral used sparingly.
- Clear labels, units, currency, and period.
- Charts with readable labels and accessible distinctions.
- Include loading, empty, error, and success states.
- Fully responsive desktop, tablet, and mobile layouts.

---

# 8. Technical Stack — Mandatory SOP Stack

Use the following stack:

| Layer | Technology |
|---|---|
| Framework | Next.js |
| UI Library | React |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | PostgreSQL via Supabase or Neon |
| Recommended database provider | Supabase |
| Deployment target | Vercel (or another approved public host) |

Implementation notes:
- Keep business calculations in pure TypeScript functions.
- Validate all user inputs on both client and server boundaries.
- Use Supabase Auth for account access if Supabase is selected.
- Use Row Level Security for user-owned records.
- Choose one chart library only when implementation begins.
- Do not introduce extra backend services or AI/ML in the MVP.
- Confirm the selected AI app builder can preserve the mandatory stack before coding.
- Keep secrets server-side and out of source control.

---

# 9. Definition of Done — MVP

The MVP is functionally complete when a user can:

1. Register and sign in.
2. Open their dashboard.
3. Create a business simulation.
4. Enter baseline assumptions.
5. See calculated results.
6. Change assumptions and see results update.
7. Save at least two named scenarios.
8. Compare saved scenarios.
9. Reopen their own simulations.
10. Use the core experience on desktop and mobile.
11. See clear validation and error messages.
12. Access only their own data.

All calculation edge cases must be tested, including zero revenue and non-positive contribution per transaction.

---

# 10. Build & Delivery Rules

- Follow the approved PRD and this coldstart document.
- Do not add unapproved features.
- Preserve the mandatory stack.
- Build the core user flow before polishing secondary details.
- Reuse existing components where possible.
- Keep client and server responsibilities clear.
- Keep secrets server-side.
- Validate all inputs.
- Fix root causes, not symptoms.
- Test each core feature and inspect browser/server logs.
- Update this document when an approved decision changes.
- Ask for explicit approval before changing MVP scope, database structure, or core architecture.

---

# 11. Project Status

| Step | Deliverable | Status |
|---|---|---|
| STEP 0 | Idea selection and mentor approval | Approved |
| STEP 1 | PRD | Approved |
| STEP 2 | Persona & User Flow | Approved |
| STEP 3 | Wireframe | Approved |
| STEP 4 | Database Schema | Approved |
| STEP 5 | Style & Mood | Approved |
| STEP 6 | Stack, database, AI builder setup | Complete — Neon fallback approved |
| STEP 7 | Full-stack build | Complete — MVP flows implemented |
| STEP 8 | Testing & debugging | Complete — local checks passed |
| STEP 9 | Deployment & documentation | Complete — live at https://scenova-seven.vercel.app/; checklist in `docs/09-deployment.md` |
| STEP 10 | Product review (additional review) | In progress — production smoke-test evidence recorded in `docs/09-deployment.md`; awaiting final approval |

**Current milestone:** MVP build, local verification, localization, production deployment, and read-only production smoke tests are complete. Final product approval is pending.
