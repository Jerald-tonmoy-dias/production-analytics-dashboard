# Production Analytics Dashboard

SaaS operations console for operators who need to see whether customers and orders are healthy, then find a specific order.

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
| Styling | Tailwind CSS, shadcn/ui |
| Validation | Zod |
| Server state (Orders list) | TanStack Query |
| Charts | Recharts |
| Component workshop | Storybook |
| Tests | Vitest (domain); Playwright optional |
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
npm run dev          # Next.js app
npm run lint         # ESLint
npm run typecheck    # TypeScript (`tsc --noEmit`)
npm test             # Vitest
npm run storybook    # Storybook at http://localhost:6006
```

Domain tests land in TASK-004. Playwright, if added, is TASK-013.

## Architecture overview

JSON datasets are parsed with Zod, transformed in a framework-agnostic domain layer, exposed as REST Route Handlers, and consumed through `lib/api`.

- **Dashboard** is a Server Component (first paint).
- **Orders list** is a Client island with URL search params + TanStack Query.
- **Order details** is a Server Component at `/orders/[id]`.

UI components receive DTOs. They do not fetch JSON or compute KPIs.

Target tree: [system design — folder structure](./docs/system-design.md#4-folder--module-structure).

Work is **one GitHub Issue = one branch = one PR**. See [developer guidelines](./docs/developer-guidelines.md).

## Deployment

Vercel is configured manually later. This repository does not create or connect a Vercel project.

Live URL: _pending_

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
