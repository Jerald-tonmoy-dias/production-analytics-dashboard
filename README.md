# Production Analytics Dashboard

SaaS operations console for operators who need to see whether customers and orders are healthy, then find a specific order.

| | |
| --- | --- |
| **Live demo** | [https://production-analytics-dashboard.vercel.app](https://production-analytics-dashboard.vercel.app) |
| **Storybook** | [https://main--6aad3d50a6b3159a11f9a584.chromatic.com](https://main--6aad3d50a6b3159a11f9a584.chromatic.com) — latest publish from `main` |

## What it does

1. **Dashboard** — revenue, orders, active customers, conversion, charts, recent orders, activity.
2. **Orders** — search, status/date filters, pagination, order details.
3. **Shared UX** — loading skeletons, empty/error states, responsive tables (horizontal scroll under a shared min-width).

Architecture (data flow, RSC vs client, API, key decisions): **[docs/architecture.md](./docs/architecture.md)**.

## Stack

Next.js App Router · React · TypeScript (strict) · Tailwind · shadcn/ui · Zod · TanStack Query (Orders list) · Recharts · Storybook/Chromatic · Vitest · Vercel

## Setup

Requires Node.js 20+.

```bash
npm install
npm run dev          # http://localhost:3000
npm run storybook    # http://localhost:6006
npm run lint && npm run typecheck && npm test
```

Chromatic republishes Storybook on **pushes to `main`** when UI/Storybook-related paths change (GitHub secret `CHROMATIC_PROJECT_TOKEN`). The Storybook link above is a stable branch permalink.

## Architecture (short)

```text
data/*.json → Zod → lib/domain → Route Handlers (/api/*)
                              ↘ lib/api/rsc (Dashboard + detail RSC)
Orders list: URL filters + TanStack Query → GET /api/orders
```

UI never imports JSON or computes KPIs. Folder map and decisions: [architecture.md](./docs/architecture.md).

| Surface | Pattern |
| --- | --- |
| `/`, `/orders/[id]` | Server Components + `lib/api/rsc` |
| `/orders` | Client + Query (workspace only) |
| Charts / theme / menus | Client islands |

## Performance

- Domain math once in `lib/domain` (Vitest), not in every card.
- Recharts dynamically imported; date Calendar lazy-loaded on open.
- Query scoped to the Orders workspace; search debounced before URL writes.
- No default `useMemo` / `useCallback` / `React.memo` — add only with measured evidence.

## Assumptions

- No auth, tenancy, websockets, or customer CRUD.
- Revenue = **completed** orders; conversion = customers with a completed order / all customers.
- Charts = last **30 UTC days**; Orders filters live in the URL.
- Some chrome (export, live sync, create order, …) is **demo-only** (toast/local UI); product data still comes from the domain/API path.
