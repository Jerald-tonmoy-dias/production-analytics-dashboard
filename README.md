# Production Analytics Dashboard

SaaS operations console for operators who need to see whether customers and orders are healthy, then find a specific order.

| | |
| --- | --- |
| **Live demo** | [https://production-analytics-dashboard.vercel.app](https://production-analytics-dashboard.vercel.app) |
| **Storybook** | [https://main--6aad3d50a6b3159a11f9a584.chromatic.com](https://main--6aad3d50a6b3159a11f9a584.chromatic.com) — always the latest publish from `main` |

## Business purpose

Internal operators (support, ops, founders) need two answers:

1. Is the business healthy? — revenue, order volume, active customers, conversion, recent change.
2. Which order is this? — search, filter, page, open details.

There is no shopper-facing storefront and no customer CRUD.

## Main features

- **Dashboard:** total revenue, orders, active customers, conversion rate, revenue/orders charts, recent orders, system activity.
- **Orders workspace:** search, status filter, date filter, pagination, order details.
- **Shared UX:** loading skeletons, empty states, error handling, responsive layout (tables scroll horizontally below a shared min-width).

See [system design](./docs/system-design.md) for the full product model.

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js App Router, React, TypeScript (strict) |
| Styling | Tailwind CSS, shadcn/ui, next-themes |
| Validation | Zod |
| Server state (Orders list) | TanStack Query |
| Charts | Recharts (dynamically imported) |
| Component workshop | Storybook + Chromatic |
| Tests | Vitest (domain); Storybook (UI states) |
| Hosting | Vercel |

Why these (and what we refuse to add): [decisions.md](./docs/decisions.md).

## Local setup

Requires Node.js 20+.

```bash
npm install
npm run dev
```

- App: [http://localhost:3000](http://localhost:3000)
- Orders: [http://localhost:3000/orders](http://localhost:3000/orders) — refresh and the back button keep the query string
- Storybook (local): `npm run storybook` → [http://localhost:6006](http://localhost:6006)

### Commands

```bash
npm run dev              # Next.js app
npm run lint             # ESLint
npm run typecheck        # TypeScript (`tsc --noEmit`)
npm test                 # Vitest
npm run storybook        # Local Storybook
npm run build-storybook  # Static build → storybook-static/
npm run chromatic        # Publish to Chromatic (needs CHROMATIC_PROJECT_TOKEN)
```

Chromatic publishes automatically on **pushes to `main`** (GitHub Action + repo secret `CHROMATIC_PROJECT_TOKEN`). The Storybook link at the top is a **branch permalink** — it always resolves to the latest `main` publish, so the README does not need a new URL after each deploy.

## Architecture & folder structure

Target tree and module boundaries: [system design — folder structure](./docs/system-design.md#4-folder--module-structure).

High level:

```
app/                 # App Router routes, Route Handlers, layouts
components/          # ui (shadcn), layout, dashboard, orders, shared
lib/schemas          # Zod contracts (types inferred)
lib/domain           # KPI math, series, filters — no React
lib/api              # Browser HTTP client + RSC in-process accessors
data/                # JSON datasets (never imported by UI)
```

Work is **one GitHub Issue = one branch = one PR**. See [developer guidelines](./docs/developer-guidelines.md).

## API / data-fetching approach

- Mock data lives in `data/*.json`. Route Handlers under `app/api/*` expose REST.
- Zod validates at the boundary; `lib/domain` transforms (KPIs, 30-day series, order filters/pagination).
- **UI components never import JSON** and do not compute KPIs. They receive DTOs.
- Full contract: [api-reference.md](./docs/api-reference.md).

### Server vs Client Components

| Surface | Pattern | Why |
| --- | --- | --- |
| Dashboard (`/`) | Server Component + `lib/api/rsc` | Read-mostly; in-process domain (no self-HTTP on the server) |
| Order details (`/orders/[id]`) | Server Component + `lib/api/rsc` | Same as dashboard |
| Orders list (`/orders`) | Client island + TanStack Query → `GET /api/orders` | Interactive filters; URL is source of truth |
| Charts / theme / menus | Client islands | Browser APIs / interaction only |

## Performance decisions

Task-1 asks about `useMemo` / `useCallback` / memoization. In this codebase:

- **Expensive work lives in `lib/domain`**, unit-tested once — not re-derived in every card render.
- **Dashboard and details stay on the server**; **Recharts** is `next/dynamic` so the chart library is not on every route’s critical path.
- **Orders list:** TanStack Query (`staleTime` 30s) keyed by URL; search debounced (300ms) before writing the query string; `keepPreviousData` avoids empty flashes while refetching.
- **Date Calendar (`react-day-picker`)** is lazy-loaded when the date popover opens — not on initial Orders paint.
- **QueryProvider** wraps only the Orders workspace route, not `/orders/[id]`.
- **No `useMemo` / `useCallback` / `React.memo` in app UI** by default. We add them only with measured evidence of wasted renders; none was found in the production bundle/Lighthouse pass. Avoiding them keeps the React tree honest under the React Compiler-era guidance used on this project.

## Theme & visual language

Light, Dark, and System via `next-themes` (`attribute="class"`, default **light**). Tokens in `app/globals.css`.

Current look: enterprise slate canvas (`#f8fafc`), blue-600 brand (`#2563eb`), Inter + JetBrains Mono, denser operator chrome. Some toolbar controls (export, live sync, create order, etc.) are **demo stubs** (toast / local UI only) — product data still comes from the domain/API path. Details: [decisions.md](./docs/decisions.md) (UX-029).

## Deployment

Hosted on **Vercel** (GitHub → `main` redeploys production).

- **Production:** [https://production-analytics-dashboard.vercel.app](https://production-analytics-dashboard.vercel.app)
- **Env:** none required for the mock. Optional `NEXT_PUBLIC_APP_URL` if the browser HTTP client should target a specific origin; RSC pages do not need it.
- **Storybook secret:** `CHROMATIC_PROJECT_TOKEN` in GitHub Actions only — never commit the token.

## Documentation

- [System Design](./docs/system-design.md)
- [API Reference](./docs/api-reference.md)
- [Developer Guidelines](./docs/developer-guidelines.md)
- [Architecture Decisions](./docs/decisions.md)

## Important assumptions

Documented fully in [decisions.md](./docs/decisions.md). Short version:

- No auth, tenancy, websockets, or customer CRUD.
- Revenue counts **completed** orders. Conversion is customers with a completed order / all customers.
- Charts are the last 30 UTC days. Orders filters live in the URL (`q`, `status`, `from`, `to`, `page`).
