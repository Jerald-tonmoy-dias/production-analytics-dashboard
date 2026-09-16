# System Design

Architectural source of truth for the Production Analytics Dashboard.

This document explains **why** the system is structured this way. Folder names alone are not the architecture.

Related:

- [API Reference](./api-reference.md)
- [Developer Guidelines](./developer-guidelines.md)
- [Architecture Decisions](./decisions.md)

Work tracking is GitHub Issues + the GitHub Project, not a file in this repository.

---

## 1. System overview

This is a **Next.js App Router** frontend that presents a small SaaS operations console. Operators inspect business health on a Dashboard, then find and open orders in an Orders workspace.

There is **no external backend**. Domain data lives in JSON files. Next.js Route Handlers expose that data as REST. UI components never import the JSON files.

The system is intentionally assessment-sized: production *shape* (typed contracts, service layer, RSC/client split, loading/empty/error states) without production *platform* (auth, tenancy, queues, microservices).

```text
Browser
  └── Next.js App Router
        ├── Server Components (Dashboard first paint)
        ├── Client islands (charts, filters, Query)
        └── Route Handlers  /api/*
              └── Service layer (Zod + transforms)
                    └── JSON datasets
```

---

## 2. Business context

Operators of a commerce-like product need two answers:

1. **Is the business healthy?** — revenue, order volume, active customers, conversion, recent change.
2. **Which order is this, and what is its status?** — search, filter, page, open details.

Users are internal operators, not shoppers. Density, filter reliability, and honest empty/error states matter more than marketing visuals.

Out of scope (explicit non-goals): authentication, multi-tenancy, customer CRUD, realtime sockets, AI features, Laravel/PHP backends.

Product formulas, non-goals, and trade-offs: [decisions.md](./decisions.md).

---

## 3. Application architecture

Three layers, one direction of dependency:

| Layer | Responsibility | May import |
| --- | --- | --- |
| **UI** (`components/`, `app/` pages) | Render, collect intent, show states | DTOs, UI primitives, API client |
| **HTTP** (`app/api/`) | Translate HTTP ↔ service calls | Service layer only |
| **Domain** (`lib/`, `data/`) | Types, validation, transforms, datasets | Nothing from UI |

Rules:

- Pages compose features. Features compose shared UI. Shared UI composes shadcn primitives.
- Business calculations (KPIs, series, filtering, pagination) live in `lib/`, not in JSX.
- `"use client"` marks a browser boundary, not a folder of convenience.

---

## 4. Folder / module structure

Target tree after foundation tickets. Not every file exists yet.

```text
app/
  layout.tsx                     # root HTML, fonts, providers that must be global
  (shell)/                       # shared operator chrome; not a URL segment
    layout.tsx                   # AppShell (nav)
    page.tsx                     # Dashboard (Server Component)
    loading.tsx
    error.tsx
    orders/
      page.tsx                   # Orders workspace (RSC wrapper + client table)
      loading.tsx
      error.tsx
      [id]/
        page.tsx
        loading.tsx
        not-found.tsx
  api/
    analytics/route.ts
    orders/route.ts
    orders/[id]/route.ts
    activities/route.ts
  globals.css

components/
  ui/                            # shadcn primitives only
  shared/                        # EmptyState, ErrorState, PageHeader, skeletons
  layout/                        # AppShell, AppNav (theme control slot on AppShell)
  dashboard/                     # KPI, charts, recent orders, activity feed
  orders/                        # filters, table, pagination, status badge, details
  providers/                     # QueryClientProvider (orders segment only)

lib/
  schemas/                       # Zod source of truth for runtime + types
  domain/                        # pure mappers: KPIs, series, filters, pagination
  api/                           # HTTP client (Orders Query) and `rsc.ts` (Dashboard/details)
  errors.ts                      # typed error classes / HTTP mapping
  constants.ts                   # page size, chart window, status enum

data/
  customers.json
  orders.json
  activities.json

tests/                           # unit tests for lib/domain and lib/schemas
docs/                            # this documentation set
.storybook/
```

Stories are **colocated** next to the component they describe (`KpiCard.stories.tsx`), so a ticket’s UI and states ship in the same PR.

Route group `(shell)` exists so the operator chrome layout does not wrap `/api`. Parentheses mean it is not a URL segment: `app/(shell)/page.tsx` is still `/`. The UI component lives in `components/layout/AppShell.tsx`, not `components/shell/`.

---

## 5. Data flow

```text
data/*.json
    → lib/schemas (Zod parse)
    → lib/domain  (derive KPIs, series, filtered pages)
         ├─ app/api/*          (REST for the browser)
         │    → lib/api        (typed HTTP client, Orders + TanStack Query)
         └─ lib/api/rsc        (Dashboard + details Server Components)
              → feature components (DTO props only)
```

UI components receive **already-shaped DTOs**. They do not filter, paginate, or compute conversion rate.

---

## 6. Server / Client Component strategy

**Default: Server Components.**

Use a Client Component only when the code needs:

- browser APIs or event handlers
- React state / effects
- a library that is client-only (Recharts, TanStack Query)
- shadcn primitives that require client (most interactive ones)

Practical split:

| Surface | Component type | Why |
| --- | --- | --- |
| Root layout, console shell chrome that is just markup | Server, with small client nav island if needed | No hooks required for static links |
| Dashboard page | Server | First paint from in-process domain (`lib/api/rsc`) |
| KPI cards | Server-safe presentational | Numbers in, markup out |
| Charts | Client island | Recharts needs DOM |
| Recent orders / activity as lists | Server-safe if links only | Client only if they poll (they will not) |
| Orders filters, table interactions | Client | URL updates, Query |
| Order details | Server | One in-process load by id |

The Query provider is mounted on the **orders segment layout**, not the root layout, so the Dashboard does not pay for a client provider it does not use.

---

## 7. API architecture

REST over Next.js Route Handlers. Four read resources:

| Method | Route | Consumer |
| --- | --- | --- |
| `GET` | `/api/analytics` | HTTP clients / REST demo (Dashboard RSC uses `lib/api/rsc`) |
| `GET` | `/api/orders` | Orders workspace (Query) |
| `GET` | `/api/orders/:id` | HTTP clients / REST demo (Details RSC uses `lib/api/rsc`) |
| `GET` | `/api/activities` | HTTP clients / REST demo (Dashboard RSC uses `lib/api/rsc`) |

Contracts: [API Reference](./api-reference.md).

Why HTTP at all, given local JSON?

- The task forbids hardcoding data in UI and requires an API service layer.
- The JD evaluates REST integration and TanStack Query.
- Replacing JSON with a real backend later should not rewrite components.

No mutations in v1. No POST/PUT/PATCH/DELETE.

---

## 8. Service layer

`lib/domain` is framework-agnostic:

- parse datasets with Zod
- compute dashboard aggregates
- apply order search / status / date filters
- paginate
- load a single order with its customer

`app/api/*` is a thin adapter: parse query/path params, call domain, map errors to HTTP.

`lib/api` is the only module pages import for data. Server Components import `lib/api/rsc`, which calls `lib/domain` in-process (same functions as the Route Handlers). Client islands import the HTTP helpers and `fetch` same-origin `/api/*` through TanStack Query. That split exists because a Server Component `fetch` to `https://$VERCEL_URL/api/…` fails on Vercel (deployment host + Deployment Protection / no extra lambda). Route Handlers remain so the Orders list is a real REST + Query integration and a later backend swap does not rewrite components.

---

## 9. State management

Three kinds of state, three homes:

| Kind | Home | Examples |
| --- | --- | --- |
| **URL state** | `searchParams` | `q`, `status`, `from`, `to`, `page` |
| **Server state** | RSC payload or TanStack Query | lists, details, analytics |
| **Ephemeral UI** | `useState` | sidebar open, popover |

No Redux. No Zustand. Filter state is shareable and must survive refresh; the URL is the correct store.

---

## 10. URL state

Orders workspace query string:

```text
/orders?q=acme&status=pending&from=2026-08-01&to=2026-09-16&page=2
```

- Missing params use defaults (`page=1`, no status, no date bounds, empty search).
- Search is debounced before it writes to the URL / Query key (implementation detail of TASK-011).
- Dashboard has **no** global date picker in v1. Charts use a fixed 30-day window computed in the domain layer.

Native Next.js `searchParams` is preferred over `nuqs` unless URL encoding becomes painful. See [decisions](./decisions.md).

---

## 11. Server state

- **Dashboard:** in-process domain read per request (`force-dynamic` because the series window uses wall-clock `now`). No Query.
- **Orders list:** TanStack Query, query key = serialized filter set. Prevents duplicate calls when toggling back to a previous filter.
- **Order details:** RSC in-process load by id. Query is unnecessary for a mostly-static details page.

---

## 12. Caching

- Route Handlers read JSON from disk; no Redis.
- Dashboard and details do not `fetch` this app’s Route Handlers. Duplicate RSC work is avoided by calling domain once per page.
- TanStack Query `staleTime` on the order of 30s for lists. No infinite stale; operators expect reasonably fresh mock data after reload.

This is **demonstration-scale** caching, not a CDN strategy.

---

## 13. Validation

Zod schemas are the runtime contract:

- JSON datasets are parsed at the service boundary (fail loud in development if mock data is corrupt).
- Query params (`page`, `status`, dates) are parsed in the route handler; invalid input → `400`.
- API responses consumed on the client are parsed again in `lib/api` so unexpected data becomes an error state, not a blank UI. This is an explicit task requirement.

Types are inferred from Zod (`z.infer`) so compile-time and runtime cannot drift by accident.

---

## 14. Error handling

Typed errors in `lib/errors.ts`, mapped in Route Handlers:

| Class | HTTP | UI |
| --- | --- | --- |
| `ValidationError` | 400 | ErrorState with the field message |
| `NotFoundError` | 404 | `not-found.tsx` on details; ErrorState on lists |
| `UpstreamError` / unexpected | 500 | ErrorState + retry |

Dashboard uses `error.tsx` for render failures and **section-level** ErrorState if a single widget’s data is missing. Prefer failing a section over a white screen when `Promise.allSettled` is used. v1 may use `Promise.all` (one failure fails the page) if time is short; the hardening ticket can split.

Never render raw Zod issues or stack traces to operators.

---

## 15. Component architecture

```text
shadcn primitives   →  shared states / layout  →  feature widgets  →  pages
```

- **Do not** wrap every shadcn primitive in a second identity-less wrapper.
- **Do** build `OrderStatusBadge` (maps domain status → semantic tokens + label) and `KpiCard` (KPI semantics on top of Card, including lucide `tone` icons).

Status and chart hues live in `app/globals.css` (`--success`, `--warning`, `--info`, `--destructive`, `--chart-revenue`, `--chart-orders`). Motion durations and elevation live there too (`--motion-fast`, `--motion-default`, `--elevation-hover`). Do not hardcode hex in feature widgets.
- Feature widgets are presentational: props in, events out. They do not fetch.
- Pages / thin client containers fetch or receive server data and pass DTOs down.

Stories cover widget states (loading, empty, error, zero).

---

## 16. Storybook strategy

Storybook is a **development and review tool**, not a second product.

Write stories for:

- shadcn primitives we installed (compact catalog under `Primitives/`)
- reusable feature components
- components with multiple visual states
- accessibility-sensitive controls (filters, pagination, table)

Do not write stories for:

- page-level route files
- one-line wrappers
- every prop permutation of a primitive

Required state matrix (minimum):

| Component | States |
| --- | --- |
| `KpiCard` | Default, Loading, ZeroValue, Error |
| `OrdersTable` | Default, Loading, Empty, NoResults, Error |
| `OrderStatusBadge` | Pending, Processing, Completed, Cancelled |
| `EmptyState` / `ErrorState` | Default |
| Charts | Default, Empty series |

---

## 17. Testing strategy

Optimize for meaningful coverage, not count.

| Layer | Tool | What |
| --- | --- | --- |
| Unit | Vitest | Zod schemas, KPI math, conversion (zero customers), filter/query builder, pagination bounds |
| Visual / a11y states | Storybook | matrices above |

Do not add Testing Library tests that duplicate Storybook states unless a behavior is easier to assert in code (e.g. debounce).

---

## 18. Performance strategy

- Aggregate once in `lib/domain`, not in each card.
- Debounce search.
- Query keys prevent duplicate list fetches.
- `useMemo` only for real derived work (chart series on the client).
- `useCallback` only when a child is memoized and the reference is the dependency.
- Dynamic import Recharts so the dashboard server graph does not pull the chart library into every RSC child unnecessarily.
- Skeletons that match layout (`loading.tsx`) to avoid layout jump.

No invented LCP budget. The spec grades **architectural** performance.

---

## 19. Accessibility strategy

- Semantic landmarks: `nav`, `main`, table headers, heading hierarchy.
- Every input has a visible label (placeholder is not a label).
- Keyboard: filters, pagination, dialogs, table row activation.
- Status is not color-only (`OrderStatusBadge` includes text).
- Charts have a text summary or table alternative for the same series (minimum: aria label + KPI totals already on the page).
- Focus visible; do not `outline-none` without a replacement.
- UX-022 motion (shimmer, dashboard enter, duration tokens) respects `prefers-reduced-motion`. UX-021 audits the rest.

---

## 20. Deployment

- **Platform:** Vercel (native Next.js).
- **When:** Production is connected to GitHub; pushes to `main` redeploy.
- **URL:** https://production-analytics-dashboard.vercel.app
- **Env:** none required for v1 (no secrets). RSC pages do not self-fetch, so `VERCEL_URL` is not required for the dashboard.

Submission requires the live link (email is stricter than the task spec).

---

## 21. Security considerations

- No auth in v1 (documented assumption).
- Treat activity `message` as untrusted text; never `dangerouslySetInnerHTML`.
- Validate all query params; do not pass raw strings into domain logic unchecked.
- No secrets in client bundles.
- Route Handlers are public; mock data is non-sensitive.

---

## 22. Scalability considerations

What this design *would* do if data grew:

- Pagination is already server-side (domain slices the list). A real DB would replace the in-memory filter with SQL.
- Analytics would become a pre-aggregated table or materialized view; the DTO would not change.
- Query cache and RSC cache tags stay valid.

What we will **not** build now: connection pools, Redis, CDN rules, ISR for user-specific data, horizontal scaling.

---

## 23. Why this architecture

The assignment and JD together ask for App Router literacy, a real API boundary, filter state, performance judgment, and reusable UI. This design answers those directly:

- RSC Dashboard demonstrates Server Components.
- Orders + URL + Query demonstrates client server-state without a global store.
- Zod + service layer demonstrates unexpected-data handling.
- shadcn + colocated stories demonstrate a sustainable UI workflow without inventing a design system.
- Explicit non-goals keep a three-day assessment shippable.
