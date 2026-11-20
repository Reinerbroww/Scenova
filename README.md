# Scenova

**Explore scenarios. Make better decisions.**

Scenova is an interactive business simulation platform for small and medium business owners, entrepreneurs, and operators who need to understand how pricing, costs, and transaction volume affect operating performance. The MVP focuses on one reliable model: **Profit & Pricing Simulator**.

> All results are mathematical estimates based on user-provided assumptions. They are not forecasts, guarantees, or professional financial advice.

---

## Table of Contents

- [Live Demo](#live-demo)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Architecture Notes](#architecture-notes)
- [Testing](#testing)
- [Localization](#localization)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [Documentation](#documentation)

---

## Live Demo

The deployed MVP is available at **[scenova-seven.vercel.app](https://scenova-seven.vercel.app/)**.

---

## Features

- Register, sign in, and manage a personal account.
- Create a business simulation with baseline assumptions.
- Adjust transaction value, variable cost, fixed cost, and volume with numeric inputs and optional sliders.
- See revenue, total cost, operating profit, operating margin, and break-even volume recalculate instantly.
- Reset assumptions back to baseline.
- Save multiple named scenarios, including Baseline, Optimistic, and Conservative.
- Compare scenarios side by side in a table and chart.
- Review results with an explicit assumptions summary and estimate disclaimer.
- Use the core experience on desktop and mobile.
- Switch between English and Indonesian; English is the default.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS 4 |
| Language | TypeScript 5 |
| Database | PostgreSQL on Neon |
| Driver | `pg` |
| Validation | Zod 4 |
| Charts | Recharts 3 |
| Testing | Vitest 5 |
| Linting | ESLint 9 |
| Deployment target | Vercel or another approved public host |

Business calculations live in pure TypeScript functions and are covered by unit tests. User input is validated on both client and server boundaries.

---

## Getting Started

### Prerequisites

- Node.js 20.9 or newer (LTS recommended)
- npm
- PostgreSQL database (Neon branch recommended)
- `psql` or a SQL editor for the initial migration

### Installation

```bash
git clone https://github.com/Reinerbroww/Scenova.git
cd Scenova
npm ci
```

Copy `.env.example` to `.env.local`, then fill in your real values. Never commit `.env.local` or any credential.

Initialize the database schema:

```bash
psql "$DATABASE_URL" -f db/migrations/0001_initial.sql
```

Start the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string. Use a Neon pooled endpoint in production. |
| `APP_URL` | Yes | Application origin reserved for server-side redirects and links, without a trailing slash. Private; not exposed to the browser. |
| `NODE_ENV` | Managed by host | Set automatically by the deployment platform. Do not set manually. |

See `.env.example` for the local template.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server. |
| `npm run build` | Create a production build. |
| `npm run start` | Serve the production build locally. |
| `npm run lint` | Run ESLint across the project. |
| `npm run typecheck` | Run TypeScript with no emit. |
| `npm test -- --run` | Run the Vitest suite once. |
| `npm test:watch` | Run Vitest in watch mode. |

---

## Project Structure

```text
scenova/
├── app/                  # App Router pages, layouts, routes, and error boundaries
├── components/           # UI, forms, charts, navigation, and i18n providers
├── db/migrations/        # Initial PostgreSQL schema and RLS policies
├── docs/                 # Product, planning, and deployment documentation
├── lib/                  # Auth, database, environment, simulation, and i18n utilities
├── tests/                # Vitest unit tests
├── .env.example          # Environment variable template
├── next.config.ts        # Next.js configuration
└── package.json          # Scripts and dependencies
```

---

## Architecture Notes

- The approved plan specified Supabase. Because Supabase credentials were unavailable during implementation, the project uses **Neon PostgreSQL** with a server-side email/password directory in `app_users`. This provider substitution was approved as a fallback and does not change the MVP scope.
- Sessions are stored as hashed tokens in `sessions` and delivered through an httpOnly cookie. The cookie is marked secure in production.
- Business tables use **Row Level Security** with `FORCE ROW LEVEL SECURITY`. Ownership is enforced by server queries plus a transaction-local `app.current_user_id` setting via `withUser()`.
- The backend is colocated with the frontend as Next.js Route Handlers under `app/api`: auth (`/api/auth/*`), simulations (`/api/simulations/*`), and scenarios (`/api/scenarios/[id]`). No separate backend service is required.
- Monetary values are stored as `NUMERIC(14,2)`. Calculations use deterministic pure TypeScript helpers rather than database-side formulas.
- Secrets and `APP_URL` remain server-side; no environment value is exposed to the browser.
- The MVP intentionally excludes AI/ML predictions, Monte Carlo simulation, POS/bank/marketplace integrations, full accounting, industry-specific engines, arbitrary formulas, collaboration, and billing.

---

## Testing

Run the full local verification suite:

```bash
npm ci
npm run lint
npm run typecheck
npm test -- --run
npm run build
```

Latest recorded result: ESLint clean, TypeScript clean, 12 tests passed across 2 files, and production build successful.

---

## Localization

The interface supports English and Indonesian. A language switcher is available in the landing header, application sidebar, mobile navigation, and auth shell.

- Default language: **English**
- Optional language: **Indonesian**
- Storage: `scenova_lang` cookie
- Server rendering reads the cookie and sets `<html lang>` accordingly

English source strings act as dictionary keys, so validation and API messages are translated at display time through the shared `t()` helper.

---

## Deployment

The production deployment is live at [scenova-seven.vercel.app](https://scenova-seven.vercel.app/). Vercel serves both the UI and the API routes; Neon Postgres remains the only external backend dependency.

Deployment preparation is documented in [`docs/09-deployment.md`](docs/09-deployment.md). It covers prerequisites, environment configuration, database migration, pre-release checks, deployment options, production smoke tests, and rollback.

Set `DATABASE_URL` and `APP_URL` in the host environment settings. Because `APP_URL` has no `NEXT_PUBLIC_` prefix, it stays private and is not exposed to the browser. Read-only smoke-test results are recorded in [`docs/09-deployment.md`](docs/09-deployment.md).

---

## Troubleshooting

| Symptom | Check |
|---|---|
| `DATABASE_URL is not configured` | The variable is missing in the host environment. Add it and redeploy. |
| Database connection fails from Vercel | Confirm the Neon branch allows public connections and that the pooled connection string is used. |
| Environment change has no effect | `NEXT_PUBLIC_*` values are inlined at build time; redeploy after any change. This project uses only private variables. |
| Indonesian text does not appear | Check the `scenova_lang` cookie value (`en` or `id`) and refresh the page. |

---

## Contributing

The MVP scope is intentionally fixed. Before adding features, changing the data model, or altering the calculation rules, review [`docs/coldstart.md`](docs/coldstart.md) and get explicit approval. Keep changes small, reuse existing components, and run the full verification suite before opening a pull request.

---

## Documentation

| Document | Purpose |
|---|---|
| [`docs/coldstart.md`](docs/coldstart.md) | Single source of truth for approved MVP scope, model, design, and status |
| [`docs/00-step-0-idea-validation.md`](docs/00-step-0-idea-validation.md) | Idea validation and initial boundaries |
| [`docs/01-prd.md`](docs/01-prd.md) | Product requirements |
| [`docs/02-persona-user-flow.md`](docs/02-persona-user-flow.md) | Persona and user flow |
| [`docs/03-wireframes.md`](docs/03-wireframes.md) | Wireframe requirements |
| [`docs/04-database-schema.md`](docs/04-database-schema.md) | Intended database schema and RLS rules |
| [`docs/05-style-mood.md`](docs/05-style-mood.md) | Visual direction and design system |
| [`docs/09-deployment.md`](docs/09-deployment.md) | Deployment checklist and production readiness |
| [`docs/README.md`](docs/README.md) | Documentation index |

---

## Status

Scenova MVP is complete and approved. The app is live at [scenova-seven.vercel.app](https://scenova-seven.vercel.app/) with EN/ID localization, automated verification, and production smoke-test evidence in [`docs/09-deployment.md`](docs/09-deployment.md).
