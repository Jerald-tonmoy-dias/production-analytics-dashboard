# Developer Guidelines

Practical handbook for this repository. Architecture *why* lives in [system-design.md](./system-design.md). This file is *how we work*.

---

## Ticket workflow (non-negotiable)

```text
1 Ticket = 1 Branch = 1 PR
```

1. Pick the next unblocked **GitHub Issue**.
2. Branch from an up-to-date `main` using `feat/TASK-00X-short-slug` (or `fix/` when that is accurate).
3. Implement only that ticket’s scope.
4. Update public docs/stories/tests required by the ticket.
5. Open a PR titled `TASK-00X …` using `.github/PULL_REQUEST_TEMPLATE.md`. The body must include `Closes #<issue>`.
6. Squash merge, confirm the issue closed, delete the local and remote branch.

Do not start feature work that is not a GitHub Issue. One issue = one branch = one PR.

---

## TypeScript

- `strict` is on. Do not weaken it with `any` to ship faster. If a library forces an escape hatch, isolate it and comment why.
- Prefer **inference from Zod** (`z.infer<typeof OrderSchema>`) for API/domain types so runtime and compile-time match.
- Use `type` for object shapes and unions. Use `interface` only when declaration merging is actually needed (it will almost never be).
- Name types after the domain (`Order`, `OrderStatus`, `AnalyticsKpis`), not after UI (`IOrderDataProps`).
- Do not prefix with `I`. Do not export `Props` types from pages.
- Functions that can fail return/throw typed errors from `lib/errors.ts`. Do not return `null` for “order not found” at the HTTP boundary — throw `NotFoundError`.
- Exported functions in `lib/` use JSDoc (`@param`, `@returns`, `@throws` when it throws). Document formulas and edge cases, not the loop-by-loop implementation.

---

## React

### Server Components (default)

Write components as Server Components unless they need the browser. Do not add `"use client"` at the top of a folder’s `index.ts` to “make imports easier.”

### Client Components

`"use client"` belongs at the **leaf that needs it** (chart, filter bar, Query subscriber). A client parent makes every child a client bundle — keep those parents thin.

### Hooks

| Hook | Allowed when | Not allowed when |
| --- | --- | --- |
| `useEffect` | Real side effects (subscribe, debounce timer, non-React widget) | Fetching data that RSC or Query should own; syncing props → state copies |
| `useMemo` | Expensive derived data (chart series from a large array) | Wrapping primitives so the file “looks optimized” |
| `useCallback` | Passing a function into a memoized child | Stabilizing handlers “just in case” |

If you add `useMemo` / `useCallback`, the PR **Architecture Notes** must say why. The assignment grades this.

### State

- Filters and page number: URL.
- Server data: RSC or TanStack Query.
- Chrome: `useState`.
- Do not introduce Zustand/Redux/Context for server data.

---

## Next.js App Router

- Put routes under `app/(shell)/` so the operator chrome does not wrap `/api`. The group name is not a URL segment. Keep the UI in `components/layout/AppShell.tsx` — do not add `components/shell/`.
- Data fetching for Dashboard and order details: async Server Components calling `lib/api/rsc` (in-process `lib/domain`, same functions as the Route Handlers).
- Data fetching for the Orders table: TanStack Query in a client island, calling `lib/api` HTTP helpers.
- Route Handlers are adapters. They do not contain KPI math.
- `loading.tsx` must **mirror the page layout** (skeletons), not a centered spinner.
- `error.tsx` must offer recovery via `retry()` (Next.js 16.3; prefer `retry` over `reset`).
- `not-found.tsx` on `orders/[id]` for unknown ids.

Do not HTTP-fetch this app's own Route Handlers from a Server Component on Vercel. `VERCEL_URL` is the per-deployment host and that loop fails in production. Browser `fetch("/api/...")` is fine.

---

## Components

### shadcn/ui

- Primitives live only in `components/ui`.
- Add a primitive **when a ticket needs it**, via the shadcn CLI. Do not pre-install the entire catalog.
- Do not re-skin a primitive under a new name unless domain semantics exist (`OrderStatusBadge` is justified; `PrimaryButton` is not).

### Shared vs feature

- `components/shared`: states and chrome reused across Dashboard and Orders.
- `components/dashboard` / `components/orders`: feature widgets.
- Widgets are presentational. No `fetch`, no Zod, no pagination math.

### Size

If a file mixes fetching, filtering, and markup, split it. If a file is a 15-line wrapper over `Card`, delete the wrapper.

---

## Styling

- Tailwind utility classes. Use `cn()` from `@/lib/utils` for conditional classes.
- Tokens come from the shadcn theme (CSS variables). Semantic hues: `success`, `warning`, `info`, `destructive`; chart series: `chart-revenue`, `chart-orders`. Do not scatter raw hex in feature files.
- Responsive: mobile-first. KPIs stack. Tables keep a min-width (`min-w-[40rem]` on `Table`) and scroll horizontally; they do not reflow into a card list.
- Density: this is an ops console. Prefer compact tables over large marketing cards.

---

## Accessibility

Minimum bar for every UI ticket:

- Correct heading level (`PageHeader` owns `h1`).
- Labels on inputs and selects.
- Keyboard path through filters, pagination, dialogs.
- Visible focus.
- Status text, not color alone.
- `aria-busy` / `aria-live` on loading/error regions where it helps.

Do not disable scrolling or trap focus except inside dialogs.

---

## Testing

- **Unit (Vitest):** `lib/domain` and `lib/schemas`. Conversion divide-by-zero, filter combinations, page bounds, invalid status.
- **Storybook:** states listed in [system-design.md](./system-design.md#16-storybook-strategy).

Run locally:

```bash
npm test              # Vitest
npm run storybook     # Storybook at http://localhost:6006
```

Do not add tests that assert class names or copy that will churn.

---

## Storybook

- Colocate `*.stories.tsx` with the component.
- One story file per meaningful component.
- Cover states, not every prop permutation. Primitives: representative variants only (`Primitives/` in Storybook).
- Preview must include global CSS / shadcn theme so stories look like the app. `.storybook/preview.tsx` already imports `app/globals.css` and wraps stories in `TooltipProvider`.

---

## Dependencies

Before adding a package, classify it in the PR:

**Required / Recommended / Optional / Avoid** — see [decisions.md](./decisions.md).

Rules:

- It must solve a problem we have **now**.
- It must not exist only to echo the job description.
- Prefer stdlib + Next.js (`fetch`, `URLSearchParams`, `Intl`) over a kit.
- Adding a dependency in a ticket that does not need it is out of scope.

Install in the ticket that first needs it (Recharts in dashboard charts, Query in Orders wiring). Do not “preload” libraries in foundation.

---

## Git

### Branches

```text
feat/TASK-001-project-foundation
feat/TASK-002-design-system
feat/TASK-003-storybook
feat/TASK-004-data-contracts
feat/TASK-005-api-service
feat/TASK-006-app-shell
feat/TASK-007-dashboard-analytics-widgets
feat/TASK-008-dashboard-lists
feat/TASK-009-dashboard-page
feat/TASK-010-orders-table-system
feat/TASK-011-orders-workspace
feat/TASK-012-order-details
feat/TASK-013-quality-hardening
feat/TASK-014-submission-ready
```

Use `fix/` or `refactor/` if the ticket is truly that. IDs stay in the branch name.

Never commit directly to `main` after the repo is initialized.

### Commits

Conventional Commits, focused:

```text
feat(api): add GET /api/orders pagination
fix(orders): treat from > to as validation error
docs(api): document empty page behavior
test(domain): cover conversion rate with zero customers
chore: add vitest config
```

Do not mix feature and unrelated formatting. Do not use `--no-verify`.

### PRs

- Title: `TASK-00X Short title`
- Body starts with `Closes #<issue>` so GitHub closes the ticket on merge.
- Template sections that apply (omit empty ones).
- One ticket. No drive-by refactors.
- If the API contract changed, include the `api-reference.md` diff.

### Merge

Prefer **squash merge** so `main` reads as one commit per ticket (`TASK-00X …`).

### Cleanup (after merge)

```bash
git switch main
git pull origin main
git branch -d feat/TASK-00X-slug
git push origin --delete feat/TASK-00X-slug
```

Enable “Automatically delete head branches” on GitHub if the account allows it.

---

## Documentation updates (same PR)

| Change | Update |
| --- | --- |
| Architecture / folders / RSC split | `docs/system-design.md` |
| Endpoint or DTO | `docs/api-reference.md` |
| How we work | `docs/developer-guidelines.md` |
| Meaningful trade-off | `docs/decisions.md` |
| Ticket status | GitHub Issue + Project (not a committed file) |
| How to run / stack | `README.md` only if the entry point changed |

---

## Definition of Done (every ticket)

Where applicable:

- [ ] TypeScript passes
- [ ] ESLint passes
- [ ] Tests related to the ticket pass
- [ ] Storybook updated for new UI states
- [ ] Accessibility considered
- [ ] Responsive behavior handled
- [ ] Loading / empty / error handled if the ticket owns a surface
- [ ] RSC vs client boundary correct
- [ ] No new unnecessary dependency
- [ ] No dead code
- [ ] No unrelated files
- [ ] Docs updated
- [ ] Decision log updated if a trade-off was made
- [ ] PR is one ticket and reviewable

A ticket is not done because “it works on my machine.”
