# Production Analytics Dashboard

An internal tool for checking business health and finding orders.

| | |
| --- | --- |
| **Live demo** | [https://production-analytics-dashboard.vercel.app](https://production-analytics-dashboard.vercel.app) |
| **Storybook** | [https://main--6aad3d50a6b3159a11f9a584.chromatic.com](https://main--6aad3d50a6b3159a11f9a584.chromatic.com) |

## What you can do

1. **Dashboard** — see revenue, orders, customers, conversion, charts, recent orders, and activity.
2. **Orders** — search and filter orders, move between pages, open order details.
3. **Basic states** — loading, empty, and error screens; layout works on phone and desktop.

How the app is built: **[docs/architecture.md](./docs/architecture.md)**.

## Tools used

- **App:** Next.js, React, TypeScript, Tailwind, shadcn/ui
- **Data:** Zod (validation), TanStack Query (orders list)
- **Charts:** Recharts
- **UI workshop:** Storybook (hosted on Chromatic)
- **Tests:** Vitest
- **Hosting:** Vercel

## How to run it

You need Node.js 20 or newer.

```bash
npm install
npm run dev          # app → http://localhost:3000
npm run storybook    # Storybook → http://localhost:6006
npm run lint && npm run typecheck && npm test
```

Storybook online updates when we push UI-related changes to `main` (uses the GitHub secret `CHROMATIC_PROJECT_TOKEN`).

## How data moves (short)

1. Mock data lives in JSON files.
2. The app checks that data with Zod, then prepares numbers and lists in `lib/domain`.
3. Pages show that prepared data. They do **not** read the JSON files directly.

- Dashboard and order details load data on the server.
- The orders list loads data in the browser from `/api/orders`, using the filters in the URL.

More detail: [architecture.md](./docs/architecture.md).

## Speed and rendering

- Heavy math runs once in `lib/domain`, then tests cover it.
- Charts load only when needed. The date picker loads only when you open it.
- We do not add `useMemo` / `useCallback` / `React.memo` unless we measure a real problem.

## What we left out on purpose

- No login, no multi-tenant setup, no live websocket sync, no customer editing.
- Revenue counts **completed** orders only.
- Charts use the last **30 days**.
- Order filters are stored in the URL so you can refresh or share the link.
- Some buttons (export, live sync, create order, and similar) are **demo only**. They show a toast; they do not call a real backend. Real numbers still come from the API/domain layer.
