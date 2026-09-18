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
npm run build-storybook  # Static Storybook build → storybook-static/
npm run chromatic        # Publish Storybook to Chromatic (needs CHROMATIC_PROJECT_TOKEN)
```

## Storybook (public)

- **Live Storybook:** [https://6aad3d50a6b3159a11f9a584-cptzzpfjvu.chromatic.com/](https://6aad3d50a6b3159a11f9a584-cptzzpfjvu.chromatic.com/) — anyone can open this; no local setup.
- **Local:** `npm run storybook` → [http://localhost:6006](http://localhost:6006)

Published via [Chromatic](https://www.chromatic.com). Owner re-publish: set GitHub secret `CHROMATIC_PROJECT_TOKEN`, then push to `main` (Action) or run `CHROMATIC_PROJECT_TOKEN=… npm run chromatic`.

Setup (one-time, owner only):

1. Sign in at [chromatic.com](https://www.chromatic.com) with **GitHub**.
2. **Add project** → choose this repository (`production-analytics-dashboard`).
3. Copy the **project token** from **Manage → Configure**.
4. GitHub → this repo → **Settings → Secrets and variables → Actions** → New secret  
   `CHROMATIC_PROJECT_TOKEN` = that token.
5. Push to `main` (or run locally: `CHROMATIC_PROJECT_TOKEN=… npm run chromatic`).

Viewers only need the Chromatic Storybook link — no install or config.

## Architecture overview

JSON datasets are parsed with Zod and transformed in a framework-agnostic domain layer. Next.js Route Handlers expose that data as REST. Pages never import the JSON files.

- **Dashboard** is a Server Component. It reads the same domain functions the Route Handlers use (`lib/api/rsc`) so the first paint does not HTTP-fetch this app.
- **Orders list** is a Client island: URL search params + TanStack Query calling `GET /api/orders`.
- **Order details** is a Server Component at `/orders/[id]`, also via `lib/api/rsc`.

UI components receive DTOs. They do not fetch JSON or compute KPIs.

## Theme

Light, Dark, and System. Default is **light** (soft canvas first paint; no forced `dark` class on `<html>`). `next-themes` keeps `.dark` in sync (`attribute="class"`, `defaultTheme="light"`). Tokens live in `app/globals.css` (`:root` / `.dark`). Visual language: soft gray stage, white cards/sidebar, **royal-blue primary**, pastel KPI wells, larger radius, soft card elevation. Status and chart hues stay separate from brand. Theme + a static operator avatar sit in the desktop toolbar and mobile top bar. Storybook Light / Dark toolbar starts in **light**.

Target tree: [system design — folder structure](./docs/system-design.md#4-folder--module-structure).

Work is **one GitHub Issue = one branch = one PR**. See [developer guidelines](./docs/developer-guidelines.md).

## Performance

- Domain math (KPIs, series, filters) runs once in `lib/domain`, not in each card.
- Dashboard and details stay on the server; Recharts is dynamically imported so the chart library is a client island.
- Orders list uses TanStack Query (`staleTime` 30s) keyed by the URL so back/forward does not refetch blindly.
- Search is debounced (300ms) before it writes the query string.
- `loading.tsx` skeletons match page layout.

## Deployment

Hosted on **Vercel**, connected to this GitHub repository. Pushes to `main` redeploy production.

- **Production URL:** [https://production-analytics-dashboard.vercel.app](https://production-analytics-dashboard.vercel.app)
- **Env:** none required. Mock JSON ships in the repo. Optional `NEXT_PUBLIC_APP_URL` if you want the HTTP client to target a specific origin; RSC pages do not need it.
- **Storybook:** Chromatic (see [Storybook (public)](#storybook-public)). Uses GitHub secret `CHROMATIC_PROJECT_TOKEN` only — never commit the token.

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
