# Architecture

This page explains how the Production Analytics Dashboard is put together.  
For setup and links, see the [README](../README.md).

## Big picture

This is a Next.js front-end for an internal ops dashboard. People use it to:

1. Check if the business looks healthy (Dashboard).
2. Find and open a specific order (Orders).

There is **no real backend**. Sample data sits in JSON files. The app:

1. Checks the data with **Zod**.
2. Turns it into KPIs, charts, and filtered lists in **`lib/domain`**.
3. Serves it through simple **API routes** (`/api/...`).
4. Shows it in the UI.

UI files never import the JSON files. They only receive ready-to-show data.

```text
Browser
  ├── Dashboard + order detail (server) → lib/api/rsc → lib/domain → data/*.json
  └── Orders list (browser) → TanStack Query → GET /api/orders → same domain layer

Storybook → UI states in isolation
Vitest → tests for domain math and schemas
```

## Folders

```text
app/
  (shell)/                 # shared sidebar/header (not part of the URL)
    page.tsx               # Dashboard (server)
    orders/(workspace)/    # orders list
    orders/[id]/           # order details (server)
  api/                     # /api/... routes

components/
  ui/                      # base UI pieces (shadcn)
  layout/ dashboard/ orders/ shared/ providers/

lib/
  schemas/                 # Zod shapes + TypeScript types
  domain/                  # KPI math, charts series, filters (no React)
  api/                     # browser fetch helpers + server helpers (rsc.ts)

data/                      # JSON sample data
tests/                     # Vitest tests
.storybook/                # Storybook config
```

Story files live next to their components (`Something.stories.tsx`).

## How data flows

1. Read JSON.
2. Validate with Zod (`lib/schemas`).
3. Build KPIs, 30-day chart series, and filtered order pages (`lib/domain`).
4. Either:
   - call that logic directly on the server (`lib/api/rsc`), or
   - expose it on `/api/...` for the browser.
5. Pass the result into components as props.

| Screen | How it loads data |
| --- | --- |
| Dashboard, order details | Server helper `lib/api/rsc` (same logic as the API, no HTTP hop) |
| Orders list | Browser calls `GET /api/orders` with TanStack Query |
| Anyone testing the API | `GET /api/analytics`, `/api/orders`, `/api/orders/:id`, `/api/activities` |

**Why two ways?** Loading the Dashboard by calling our own `/api` on the server broke on Vercel. So server pages call domain code directly. The `/api` routes stay so the Orders page still works like a normal REST + Query app.

## Server vs browser code

Most pages run on the **server**.  
We mark a file `"use client"` only when it needs the browser (clicks, local state, chart library, and so on).

| Screen | Runs on |
| --- | --- |
| Dashboard, order details | Server |
| Orders filters, table, pagination | Browser (+ TanStack Query) |
| Charts | Browser (loaded only when needed) |
| Theme switch, menus, demo toasts | Browser |

TanStack Query is wrapped only around the orders list, not the whole app.

## What holds the filters

| Kind of state | Where it lives |
| --- | --- |
| Search, status, dates, page | In the URL (`q`, `status`, `from`, `to`, `page`) |
| Orders list results | TanStack Query (keeps data ~30 seconds, key = URL) |
| Sidebar open, popovers | Local React state |

We do not use Redux or Zustand. Typing in search waits a short moment (~300ms) before updating the URL.

## API routes

Errors look like:

```json
{ "error": { "code": "VALIDATION_ERROR", "message": "…", "details": [] } }
```

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/analytics` | KPIs and chart series |
| `GET` | `/api/orders` | Filtered order list (`q`, `status`, `from`, `to`, `page`, `pageSize`) |
| `GET` | `/api/orders/:id` | One order + customer |
| `GET` | `/api/activities` | Recent activity |

No create/update/delete in this version. Exact shapes live in `lib/schemas` and the Vitest tests.

### How numbers are defined

- **Revenue** — sum of **completed** order amounts.
- **Conversion** — customers with at least one completed order ÷ all customers.
- **Charts** — last **30 days** (daily, or weekly rollup of that same data).
- **Active customers** — see `lib/domain/kpis.ts` and its tests.

## Main choices

| Topic | What we chose | Why / trade-off |
| --- | --- | --- |
| Scope | No login, no multi-tenant, no websockets | Keeps the assessment focused |
| UI kit | shadcn/ui + Tailwind | Fast, consistent components |
| Validation | Zod at the edge | Safe data in, clear types |
| Business logic | `lib/domain` + unit tests | UI stays simple |
| Orders filters | URL + TanStack Query on the list only | Shareable links; Query only where needed |
| Charts | Recharts, loaded on demand | Keeps other pages lighter |
| Order details | Own page `/orders/[id]` | Easy to link and bookmark |
| Memo hooks | Not used by default | Fix real slowdowns when we measure them |
| Extra UI buttons | Some are demo-only | Look complete without fake backends |
| Docs | README + this file | Easy for reviewers to read |

## Tests

- **Vitest** — KPI math, schemas, URL helpers, API helpers.
- **Storybook / Chromatic** — UI states (loading, empty, error). Online Storybook updates from `main` when UI files change.

## Not in scope

Login, multi-tenant apps, real-time sync servers, CSV export APIs, editing orders, Redux/Zustand, full end-to-end browser test suites, or turning the mock API into a full product backend.
