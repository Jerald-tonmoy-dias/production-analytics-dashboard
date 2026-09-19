# Architecture

Concise architecture for the Production Analytics Dashboard. For setup and the live demo, see the [README](../README.md).

## Overview

Next.js App Router frontend for a small SaaS **operations console**. Operators check business health on the Dashboard, then find and open orders.

There is **no external backend**. JSON in `data/` is validated with Zod, transformed in `lib/domain`, and exposed as REST via Route Handlers. UI components never import JSON and never compute KPIs.

```text
Browser
  ├── RSC pages (Dashboard, order detail) → lib/api/rsc → lib/domain → data/*.json
  └── Orders list (client) → TanStack Query → GET /api/orders → domain + Zod

Storybook / Chromatic → component states
Vitest → lib/domain + schemas
```

## Folder structure

```text
app/
  (shell)/                 # shared chrome (not a URL segment)
    page.tsx               # Dashboard (RSC)
    orders/(workspace)/    # list + QueryProvider
    orders/[id]/           # details (RSC)
  api/                     # Route Handlers (REST)

components/
  ui/                      # shadcn primitives
  layout/ dashboard/ orders/ shared/ providers/

lib/
  schemas/                 # Zod → inferred types
  domain/                  # pure transforms (KPIs, series, filters)
  api/                     # browser HTTP + rsc.ts (in-process)

data/                      # customers, orders, activities JSON
tests/                     # Vitest for domain / API helpers
.storybook/
```

Stories are colocated next to components (`*.stories.tsx`).

## Data flow

1. Parse JSON with Zod (`lib/schemas`).
2. Derive KPIs, 30-day series, filtered/paginated orders (`lib/domain`).
3. Serve via thin Route Handlers **or** call domain in-process from RSC (`lib/api/rsc`).
4. Pass DTOs into UI.

| Consumer | Path |
| --- | --- |
| Dashboard, order detail | `lib/api/rsc` (in-process) |
| Orders list | HTTP `GET /api/orders` + TanStack Query |
| REST demo / tools | `GET /api/analytics`, `/api/orders`, `/api/orders/:id`, `/api/activities` |

RSC does **not** `fetch` this app’s own `/api` on the server — that failed on Vercel. Route Handlers remain so the Orders workspace is a real REST + Query integration.

## Server vs Client

**Default: Server Components.** Add `"use client"` only for browser APIs, state/effects, or client-only libraries.

| Surface | Type |
| --- | --- |
| Dashboard, order detail | RSC |
| Orders filters / list / pagination | Client + Query (provider on `(workspace)` only) |
| Charts (Recharts) | Client island (`next/dynamic`) |
| Theme, menus, demo toasts | Client islands |

## State

| Kind | Where |
| --- | --- |
| Filters / page | URL: `q`, `status`, `from`, `to`, `page` |
| Orders list data | TanStack Query (`staleTime` ~30s, keyed by URL) |
| Chrome (sidebar, popovers) | Local `useState` |

No Redux/Zustand. Search is debounced (~300ms) before writing the URL.

## API (mock REST)

All errors use `{ error: { code, message, details? } }` (`VALIDATION_ERROR` 400, `NOT_FOUND` 404, `INTERNAL_ERROR` 500).

| Method | Route | Notes |
| --- | --- | --- |
| `GET` | `/api/analytics` | KPIs + 30-day series |
| `GET` | `/api/orders` | `q`, `status`, `from`, `to`, `page`, `pageSize` |
| `GET` | `/api/orders/:id` | Detail + customer |
| `GET` | `/api/activities` | Recent system activity |

No mutations in v1. Source of truth for shapes: Zod schemas in `lib/schemas` + Vitest.

### Product formulas

- **Revenue:** sum of **completed** order amounts.
- **Conversion:** customers with ≥1 completed order / all customers.
- **Charts:** last **30 UTC days** (revenue daily/weekly rollup from the same series).
- **Active customers:** defined in domain tests / `lib/domain/kpis.ts`.

## Key decisions

| Decision | Choice | Trade-off |
| --- | --- | --- |
| Scope | Assessment console — no auth, tenancy, websockets, customer CRUD | Doesn’t demo every JD keyword |
| UI kit | shadcn/ui (Nova) + Tailwind | Tied to that primitive set |
| Validation | Zod at the boundary; types inferred | Slight ceremony vs raw TS |
| Domain | Transforms in `lib/domain`, unit-tested | Extra layer vs computing in components |
| Orders state | URL search params + TanStack Query on the list only | Two fetching styles (intentional) |
| Charts | Recharts, dynamically imported | Bundle cost on Dashboard only |
| Details | `/orders/[id]` route, not a modal | Extra route; deep-linkable |
| Memoization | No default `useMemo` / `useCallback` / `React.memo` | Prefer domain + Query + measured splits |
| Visual chrome | Enterprise slate look; export/live-sync/etc. are **demo stubs** | Some controls are non-functional by design |
| Docs | README + this file only | History lives in git, not a long ADR log |

## Testing

- **Vitest:** domain math, schemas, URL helpers, thin API adapters.
- **Storybook + Chromatic:** UI states (loading/empty/error) and primitives; publishes from `main` when Storybook-relevant paths change.

## Non-goals

Authentication, multi-tenancy, realtime sync backends, CSV export APIs, order mutations, Zustand/Redux, Playwright E2E, growing the mock API into a product backend.
