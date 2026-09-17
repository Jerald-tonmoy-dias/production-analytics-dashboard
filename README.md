# Production Analytics Dashboard

SaaS operations console for operators who need to see whether customers and orders are healthy, then find a specific order.

**Live demo:** [https://production-analytics-dashboard.vercel.app](https://production-analytics-dashboard.vercel.app)

## Business purpose

Internal operators (support, ops, founders) need two answers:

1. Is the business healthy? — revenue, order volume, active customers, conversion, recent change.
2. Which order is this? — search, filter, page, open details.

There is no shopper-facing storefront and no customer CRUD.

## Main features

- **Dashboard:** total revenue, orders, active customers, conversion rate, revenue/orders charts, recent orders, system activity.
- **Orders workspace:** search, status filter, date filter, pagination, order details.

Loading skeletons, empty states, error states, and responsive layout are first-class. See [system design](./docs/system-design.md).

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js App Router, React, TypeScript (strict) |
| Styling | Tailwind CSS, shadcn/ui, next-themes |
| Validation | Zod |
| Server state (Orders list) | TanStack Query |
| Charts | Recharts |
| Component workshop | Storybook |
| Tests | Vitest (domain + API); Storybook (UI states) |
| Hosting | Vercel |

Why these, and what we refuse to add: [decisions.md](./docs/decisions.md).

## Local setup

Requires Node.js 20+.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the dashboard. [http://localhost:3000/orders](http://localhost:3000/orders) is the filterable list; refresh and the back button keep the query string.

## Commands

```bash
npm run dev          # Next.js app at http://localhost:3000
npm run lint         # ESLint
npm run typecheck    # TypeScript (`tsc --noEmit`)
npm test             # Vitest
npm run storybook    # Storybook at http://localhost:6006
```

## Architecture overview

JSON datasets are parsed with Zod and transformed in a framework-agnostic domain layer. Next.js Route Handlers expose that data as REST. Pages never import the JSON files.

- **Dashboard** is a Server Component. It reads the same domain functions the Route Handlers use (`lib/api/rsc`) so the first paint does not HTTP-fetch this app.
- **Orders list** is a Client island: URL search params + TanStack Query calling `GET /api/orders`.
- **Order details** is a Server Component at `/orders/[id]`, also via `lib/api/rsc`.

UI components receive DTOs. They do not fetch JSON or compute KPIs.

## Theme

Light, Dark, and System. Default is **dark** (including first paint: `class="dark"` on `<html>`). `next-themes` then keeps `.dark` in sync (`attribute="class"`, `defaultTheme="dark"`). Tokens stay in `app/globals.css` (`:root` / `.dark`); there is no parallel hex theme. Surfaces use a **cool graphite** tint (not flat Nova gray). **`--primary` is punchier teal-cyan** (hue ~200) for buttons, focus rings, and active nav. Status and chart hues stay separate. Theme + a static operator avatar sit in the desktop toolbar and mobile top bar. The shell menu persists the theme in `localStorage` (`theme`). Storybook has a Light / Dark toolbar on the same tokens (starts in dark).

Target tree: [system design — folder structure](./docs/system-design.md#4-folder--module-structure).

Work is **one GitHub Issue = one branch = one PR**. See [developer guidelines](./docs/developer-guidelines.md).

## Performance

- Domain math (KPIs, series, filters) runs once in `lib/domain`, not in each card.
- Dashboard and details stay on the server; Recharts is dynamically imported so the chart library is a client island.
- Orders list uses TanStack Query (`staleTime` 30s) keyed by the URL so back/forward does not refetch blindly.
- Search is debounced (300ms) before it writes the query string.
- `loading.tsx` skeletons match page layout.

### Why almost no `useMemo` / `useCallback`

The assessment asks for those hooks when they help. Here, expensive work already lives in `lib/domain` (server) or in TanStack Query’s cache key. Client islands mostly render DTOs. Adding `useMemo`/`useCallback` by default would be cargo-cult. The meaningful client side-effect is the search debounce (`useEffect` + timer). Chart geometry uses `isAnimationActive={false}` instead of client memoization for draw cost.

## Deployment

Hosted on **Vercel**, connected to this GitHub repository. Pushes to `main` redeploy production.

- **Production URL:** [https://production-analytics-dashboard.vercel.app](https://production-analytics-dashboard.vercel.app)
- **Env:** none required. Mock JSON ships in the repo. Optional `NEXT_PUBLIC_APP_URL` if you want the HTTP client to target a specific origin; RSC pages do not need it.

## Documentation

- [System Design](./docs/system-design.md)
- [API Reference](./docs/api-reference.md)
- [Developer Guidelines](./docs/developer-guidelines.md)
- [Architecture Decisions](./docs/decisions.md)

## Important assumptions

Documented fully in [decisions.md](./docs/decisions.md). Short version:

- No auth, tenancy, websockets, or customer CRUD.
- Revenue counts **completed** orders. Conversion is customers with a completed order / all customers.
- Charts are the last 30 UTC days. Orders filters live in the URL.
