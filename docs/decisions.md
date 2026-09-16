# Architecture Decisions

Meaningful trade-offs for this assessment. Trivial coding choices do not belong here.

**Legend for origin**

| Label | Meaning |
| --- | --- |
| **Company requirement** | Written in the task spec, email, or job description |
| **Engineering assumption** | Underspecified in source docs; we chose a reasonable product meaning |
| **Engineering decision** | How we implement a requirement or assumption |
| **Recommendation** | Preferred if time allows; not required to ship |

Status values: `accepted` · `superseded` · `proposed`

When a later ticket changes a decision, mark the old record `superseded` and add a new one. Do not silently edit history.

---

## Decision: Assessment-scoped SaaS console (no platform extras)

Date: 2026-09-16

Context: The JD also describes full-stack, AI, Docker, and cloud platform skills. The assigned task is a frontend analytics dashboard with a mock API.

Problem: Easy to over-build (auth, RAG, microservices) and miss the deadline.

Options considered:

1. Build a “real” multi-service product.
2. Build only what the task and email grade, with production *shape*.

Decision: Option 2. No auth, tenancy, websockets, customer CRUD, Docker, or AI.

Reason: The email and task spec define the rubric: App Router, API layer, state, reuse, performance, UX, a11y, AI-assisted quality.

Trade-offs: Reviewers who wanted a login wall will not see one. We document the omission.

Consequences: Every ticket’s “Out of Scope” inherits these non-goals unless the source documents change.

Origin: Engineering decision (scope). Company requirement (the actual assignment).

Status: accepted

---

## Decision: Next.js App Router + TypeScript strict + Tailwind

Date: 2026-09-16

Context: Task heading specifies Next.js App Router / TypeScript / React / Tailwind CSS.

Problem: None — stack is mandated.

Options considered: Pages Router, CSS Modules, untyped JS.

Decision: Follow the spec. TypeScript `strict` on.

Reason: Company requirement. Strict mode is the mid-senior default and prevents the “unexpected data” bugs the spec mentions.

Trade-offs: Slightly more ceremony in DTOs.

Consequences: Foundation ticket must enable `strict` and App Router.

Origin: Company requirement. Engineering decision (strict flag).

Status: accepted

---

## Decision: shadcn/ui as the primitive layer

Date: 2026-09-16

Context: Need a consistent, accessible primitive set fast. The JD lists Tailwind and reusable architecture, not a specific kit. Stage 2 of this project requires shadcn/ui.

Problem: Hand-rolling Button/Select/Table would burn the three-day window and likely fail a11y.

Options considered:

1. Fully custom primitives.
2. A heavy kit (MUI).
3. shadcn/ui (copy-in Radix + Tailwind).

Decision: shadcn/ui. Primitives in `components/ui`. Domain widgets wrap them only when semantics exist.

Reason: Matches Tailwind, owns the source, Radix handles keyboard/focus, we do not invent a design system.

Trade-offs: Generated files we must not casually rewrite. Some primitives are Client Components — keep them leaves.

Consequences: TASK-002 adds only primitives the next tickets need, not the full catalog. That ticket also adds `cn()` (`clsx` + `tailwind-merge`) for conditional Tailwind classes and conflict resolution. Until then, keep class strings simple. Do not hand-roll class concatenation after `cn()` exists.

Origin: Engineering decision (Stage 2 direction).

Status: accepted

---

## Decision: shadcn CLI Nova + official `cn` package

Date: 2026-09-16

Context: TASK-002 ran the current shadcn CLI. That CLI defaults to style `radix-nova`, the `cn` package (not a hand-written `clsx` + `tailwind-merge` helper), the `radix-ui` umbrella, and runtime `shadcn` + `tw-animate-css`.

Problem: Stage 2 docs assumed the older peer set. Fighting the CLI would fork the primitive layer.

Options considered:

1. Force `clsx` + `tailwind-merge` and per-package `@radix-ui/*`.
2. Keep the generated Nova stack.

Decision: Option 2.

- Primitives added (set matches the ticket): Button, Card, Input, Select, Badge, Table, Dialog, Skeleton, Dropdown Menu, Tooltip, Separator, Label.
- TASK-010 later added Calendar (`react-day-picker`) and Popover for order date filters. There is no standalone `date-picker` item in the Nova registry; the picker is Popover + Calendar.
- `lib/utils.ts` is the shadcn `cn` re-export only — not a dumping-ground `utils` module. App code imports `cn` from `@/lib/utils`. Generated `components/ui` files may import `cn` directly; do not rewrite them.
- Root layout wraps children in `TooltipProvider` so Tooltip works without a second provider in later tickets. The provider is a client leaf; RSC pages still pass through as `children`.
- `--radius: 0.4rem` for a denser ops console than Nova’s `0.625rem` default.
- `@theme` font families use the literal Geist names. Tailwind v4 `@theme inline` cannot depend on next/font’s runtime `--font-geist-*` variables.

Reason: Own the files the CLI actually emits. Reviewers see a current shadcn setup, not a reconstructed 2024 one.

Trade-offs: Older notes that named `clsx` / `tailwind-merge` as direct dependencies are outdated; this record replaces that expectation.

Origin: Engineering decision (TASK-002).

Status: accepted

---

## Decision: Storybook from the beginning

Date: 2026-09-16

Context: Stage 2 requires Storybook. The assignment does not mention it.

Problem: Loading/empty/error/zero states are easy to miss if they only exist behind API fixtures.

Options considered:

1. No Storybook; rely on the running app.
2. Storybook for meaningful stateful components.

Decision: Option 2. Colocated stories. No stories for trivial wrappers or uncustomized shadcn primitives.

Reason: Isolates the states the spec grades. Complements unit tests rather than replacing them.

Trade-offs: Setup cost (TASK-003). Extra files in feature PRs.

Consequences: Feature UI tickets include Storybook requirements in their DoD.

Origin: Engineering decision (Stage 2 direction). Not a company requirement.

Status: superseded in part by “Catalog shadcn primitives in Storybook”

---

## Decision: Storybook Vite for Next 16; docs + a11y only

Date: 2026-09-16

Context: TASK-003 needs Storybook on Next.js 16. Current Storybook (10.6) recommends `@storybook/nextjs-vite`. The CLI also offers Webpack, Chromatic, and a Vitest “test” feature.

Problem: A recommended install can pull extra browsers and example Button/Header stories we do not own.

Options considered:

1. Webpack `@storybook/nextjs`.
2. Vite + docs + a11y; skip `test` and Chromatic.
3. Full recommended stack including component tests.

Decision: Option 2.

- Framework: `@storybook/nextjs-vite`. Preview imports `app/globals.css`, sets `nextjs.appDirectory`, and wraps stories in `TooltipProvider` (same client leaf as the root layout).
- Addons: docs and a11y. No Chromatic. No Storybook Vitest addon — domain tests stay in Vitest.
- One smoke story (`.storybook/Smoke.stories.tsx`) proves theme wiring. Feature stories colocate with components in later tickets. Do not story uncustomized shadcn primitives.

Reason: Matches Next 16, keeps the workshop useful for a11y states, and avoids a second test runner before we have widgets.

Trade-offs: We do not demonstrate Storybook interaction tests in this ticket.

Origin: Engineering decision (TASK-003).

Status: superseded in part by “Catalog shadcn primitives in Storybook” (primitive stories). Vite + addons still apply.

---

## Decision: Catalog shadcn primitives in Storybook

Date: 2026-09-16

Context: TASK-003 originally shipped a theme smoke story only, matching the earlier “do not story uncustomized primitives” rule. Reviewers and later tickets still need to see Button, Table, Dialog, and the rest in one workshop.

Problem: A smoke-only Storybook looks empty. A full controls matrix for every size/variant would duplicate shadcn docs and fight the three-day window.

Options considered:

1. Keep smoke-only; wait for feature widgets.
2. Story every primitive permutation.
3. Compact colocated catalog: representative variants, grouped under `Primitives/`.

Decision: Option 3.

- One story file next to each installed primitive (`components/ui/*.stories.tsx`).
- Gallery or a single Default for interactive leaves (Select, Dialog, Dropdown, Tooltip). Not every size/state.
- Feature widgets still own loading/empty/error stories. Do not restyle generated `components/ui` source for Storybook.

Reason: The sidebar is the kit. Feature tickets stay about product states, not reinventing Button.

Trade-offs: Catalog stories can drift if the CLI regenerates a primitive. Acceptable; we re-add the thin story, we do not fork the primitive.

Origin: Engineering decision (TASK-003 amendment).

Status: accepted

---

## Decision: JSON datasets behind Route Handlers and a typed client

Date: 2026-09-16

Context: Spec allows “JSON dataset or mock API” and forbids hardcoding data in UI. Requires a service layer, separated types and transforms.

Problem: Importing JSON in components would fail the spec. A fake axios wrapper over in-memory objects without HTTP would undersell the JD’s REST/Query skills.

Options considered:

1. Direct JSON import in pages.
2. Domain functions only (no HTTP).
3. JSON → Zod → domain → Route Handlers → `lib/api`.

Decision: Option 3.

Reason: Satisfies the spec’s layering and the JD’s REST integration. UI stays backend-agnostic.

Trade-offs: Originally implied RSC must call absolute URLs to own handlers. TASK-014 kept HTTP for Query and moved Server Components to in-process domain (`lib/api/rsc`).

Consequences: TASK-004 (domain) and TASK-005 (HTTP) are separate so UI widgets can consume types before HTTP exists.

Origin: Company requirement (layering). Engineering decision (HTTP shape).

Status: accepted

---

## Decision: Zod at the data boundary

Date: 2026-09-16

Context: Spec requires handling unexpected data. JD lists Zod as a familiar tool.

Problem: `as Order` on `fetch` hides corruption until render.

Options considered:

1. TypeScript-only casts.
2. Zod parse of datasets, query params, and client responses.

Decision: Option 2. Infer types from schemas.

Reason: Unexpected data becomes an error state, which the spec grades. Zod is justified, not decorative.

Trade-offs: Dual parse (server + client) costs a few ms; irrelevant at mock scale.

Consequences: Corrupt mock JSON fails TASK-004 tests. Invalid `status` query returns 400.

Origin: Company requirement (unexpected data). Engineering decision (Zod). JD familiarity.

Status: accepted

---

## Decision: URL search params for Orders filters; no Zustand/Redux

Date: 2026-09-16

Context: Spec asks for “appropriate state management for filters and UI state.” JD lists Zustand/Redux/Context.

Problem: A global store for filters resets on refresh and is not shareable.

Options considered:

1. `useState` only.
2. Zustand.
3. Native `searchParams`.
4. `nuqs`.

Decision: Native Next.js `searchParams` / `useSearchParams` for `q`, `status`, `from`, `to`, `page`. Local `useState` for chrome. No Zustand.

Reason: Filters are server-shaped, shareable, back-button friendly. Zustand would be JD-echo, not a need. `nuqs` is optional if encoding gets painful.

Trade-offs: Slightly more plumbing than `useState`. We do not demonstrate Zustand.

Consequences: TASK-011 owns URL wiring. Do not add a store “for seniority.”

Origin: Engineering decision. Company requirement (filters + appropriate state).

Status: accepted

---

## Decision: TanStack Query only for the Orders list

Date: 2026-09-16

Context: JD lists React Query. Spec forbids duplicate API calls and unnecessary `useEffect` fetching.

Problem: Using Query everywhere fights RSC. Using it nowhere ignores a JD skill and makes filter refetch easy to get wrong.

Options considered:

1. Query for all pages.
2. RSC for all pages (`useEffect` on orders).
3. RSC Dashboard + details; Query on Orders list.

Decision: Option 3. Query provider on the orders segment layout only.

Reason: Dashboard is a first-paint report. Orders is interactive server state (debounce, cache, back to previous filters). That is the genuine Query use case.

Trade-offs: Two data-access styles to explain in the README. Worth it.

Consequences: `@tanstack/react-query` is installed in TASK-011, not in foundation.

Origin: Engineering decision. JD recommended skill. Company requirement (avoid extra fetches / extra effects).

Status: accepted

---

## Decision: RSC by default, client islands for charts and filters

Date: 2026-09-16

Context: Spec requires proper Server vs Client usage and a README explanation. JD lists App Router, RSC, SSR.

Problem: `"use client"` on the root layout is the common assessment failure.

Options considered:

1. All client SPA.
2. All server, no charts library.
3. Server pages + client islands.

Decision: Option 3.

Reason: Directly matches the rubric. Charts and Query need the browser; KPIs and details do not.

Trade-offs: More files. Clearer bundles.

Consequences: Feature tickets must state whether a new file is server or client.

Origin: Company requirement.

Status: accepted

---

## Decision: Transforms live in `lib/domain`, not in components

Date: 2026-09-16

Context: Spec: keep API calls, types, and data transformation separate from UI.

Problem: Computing conversion in a KPI card duplicates logic and skips zero-customer tests.

Options considered:

1. Derive in JSX.
2. Derive in Route Handlers.
3. Pure functions in `lib/domain`, handlers call them.

Decision: Option 3. Handlers stay thin. Functions are unit-tested.

Reason: Testability and the spec’s layering. Domain can run in Vitest without HTTP.

Consequences: TASK-004 delivers mappers before UI.

Origin: Company requirement.

Status: accepted

---

## Decision: Recharts for dashboard charts

Date: 2026-09-16

Context: Spec requires revenue and orders charts. No library specified.

Problem: Need a client chart library that works with React and Tailwind.

Options considered:

1. Chart.js
2. visx
3. Recharts
4. SVG by hand

Decision: Recharts, dynamically imported in a client island.

Reason: Fast to ship, adequate for two series, common in Next assessments. Hand-rolled SVG is extra risk.

Trade-offs: Bundle size — hence dynamic import. Not the most accessible chart; KPIs + series table/aria mitigate.

Consequences: Dependency added in TASK-007, not earlier.

Origin: Engineering decision.

Status: accepted

---

## Decision: Conversion rate, revenue, active customers, chart window

Date: 2026-09-16

Context: Spec names the KPIs and charts but not the formulas.

Problem: Without assumptions, UI and API will drift.

Options considered: See pre-implementation analysis.

Decision:

- **Revenue KPI:** sum of **completed** order amounts, all time.
- **Order count KPI:** all orders, all time.
- **Active customers:** `customer.status === "active"`.
- **Conversion rate:** (unique customers with ≥1 completed order) / (total customers). `0` if no customers.
- **Charts:** last 30 UTC days, daily buckets including zeros. Revenue series = completed amounts/day; orders series = created count/day.
- **Currency:** USD, `en-US`.
- **Order statuses:** `pending | processing | completed | cancelled`.

Reason: Honest given only customers + orders. Documented so reviewers are not guessing.

Trade-offs: Not a marketing funnel conversion. Charts not user-filterable in v1.

Consequences: Encoded in [api-reference.md](./api-reference.md) and TASK-004 tests.

Origin: Engineering assumption (formulas). Engineering decision (encoding in API).

Status: accepted

---

## Decision: Order details is a route, not a modal

Date: 2026-09-16

Context: Spec requires order details. UX not specified.

Problem: Modal vs `/orders/[id]`.

Options considered: Dialog, drawer, dynamic route.

Decision: `app/(shell)/orders/[id]/page.tsx`.

Reason: Shareable link, App Router dynamic segments, `not-found.tsx`, simpler a11y than a modal stacked on filters.

Trade-offs: Extra navigation. We may still use shadcn Dialog elsewhere.

Consequences: TASK-012. Deep links from activity rows go to this route.

Origin: Engineering decision.

Status: accepted

---

## Decision: Testing pyramid (Vitest + Storybook)

Date: 2026-09-16

Context: JD lists frontend testing. Task does not. Time is three days.

Problem: Zero tests look weak; a large extra suite misses the deadline.

Options considered:

1. No tests.
2. Unit + stories only.

Decision: Unit tests are required for domain math (TASK-004). Stories are required for stateful UI.

Reason: Domain bugs are cheap to catch in Vitest. Visual states are cheap in Storybook.

Trade-offs: No automated multi-page flows. Keyboard and viewport are checked by hand on UI tickets.

Consequences: The test layer is Vitest + Storybook.

Origin: Engineering decision.

Status: accepted

---

## Decision: Folder architecture (route group, colocated stories, no dumping-ground `utils.ts`)

Date: 2026-09-16

Context: Spec asks for scalable folder structure and reusable components.

Problem: `components/index.ts` barrels and `utils.ts` become junk drawers.

Options considered: Atomic design; feature folders; everything under `app/`.

Decision: Feature folders (`dashboard`, `orders`, `shared`, `ui`, `layout`) + `lib/{schemas,domain,api}` + route group `(shell)`. Colocated stories. No global `utils.ts`; name the module (`format-money.ts`).

Reason: Matches ticket boundaries. Reviewers can find a widget without a hunt.

Trade-offs: More directories while the app is small. Fine.

Consequences: TASK-001 creates the empty tree.

Origin: Engineering decision.

Status: accepted

---

## Decision: Route group named `(app)`, not `(console)`

Date: 2026-09-16

Context: TASK-001 used `app/(console)/` for Dashboard and Orders. PR review asked what “console” meant and whether a clearer name exists.

Problem: `(console)` does not appear in the URL, so the name is only for developers. “Console” was internal jargon (ops console) and was easy to misread as `console.log` or a browser console.

Options considered:

1. Keep `(console)`.
2. `(shell)` — accurate for TASK-006 AppShell, less common.
3. `(dashboard)` — wrong; Orders live here too.
4. `(app)` — Next.js convention for the application segment.

Decision: Rename to `app/(app)/`.

Reason: Reviewers and future tickets will recognize `(app)` immediately. Parentheses still keep it out of the URL (`/` and `/orders` unchanged).

Trade-offs: The word “app” is generic. The comment in `system-design.md` explains why the group exists.

Consequences: Later tickets use `app/(app)/page.tsx`, `app/(app)/orders/`, `app/(app)/orders/[id]/`. Product copy may still say “operations console.”

Origin: Engineering decision (PR review on TASK-001).

Status: superseded by “Route group named `(shell)`”

---

## Decision: Route group named `(shell)`

Date: 2026-09-16

Context: `(console)` was unclear. `(app)` is the common Next.js name for the product segment, but `app/(app)/` reads as duplication. The group’s job is shared operator chrome around Dashboard and Orders.

Problem: Need a route-group name that is not URL-visible, not jargon, and not a second `app` folder.

Options considered:

1. `(app)` — template convention; visually `app/(app)/`.
2. `(workspace)` / `(ops)` — product language.
3. `(shell)` — names the layout reason; UI stays in `components/layout/AppShell`.
4. Drop the group and put the shell in the root layout.

Decision: `app/(shell)/`.

Reason: It describes why the group exists (TASK-006 AppShell). It does not collide with the App Router `app/` directory. Components stay in `components/layout/`; we will not create `components/shell/`.

Trade-offs: `(shell)` is less common in tutorials than `(app)`. Fine for this codebase.

Consequences: Tickets use `app/(shell)/page.tsx`, `app/(shell)/orders/`, `app/(shell)/orders/[id]/`.

Origin: Engineering decision (PR review on TASK-001).

Status: accepted

---

## Decision: Caching is illustrative, not a platform

Date: 2026-09-16

Context: Need to avoid duplicate calls. JD mentions ISR/SSR.

Problem: Over-building Redis/ISR for static JSON.

Options considered: No cache; React Query only; Next cache tags + Query on lists.

Decision: Next `fetch` cache tags for RSC analytics; TanStack Query `staleTime` ~30s for orders lists. No Redis.

Reason: Demonstrates App Router + Query without fake infrastructure.

Trade-offs: Mock data will not be “live.” Acceptable.

Consequences: Document in README performance section.

Origin: Engineering decision.

Status: superseded

---

## Decision: RSC reads domain in-process; HTTP is for the browser

Date: 2026-09-16

Context: TASK-005 wired Server Components to `fetch` this app's Route Handlers with `force-cache` tags. Production Dashboard and `/orders/[id]` then rendered `error.tsx` while `GET /api/*` from the browser returned 200. Orders list (client Query) worked.

Problem: On Vercel, `VERCEL_URL` is the per-deployment host. A Server Component `fetch` to that origin is subject to Deployment Protection and does not get a reliable extra lambda. `force-cache` can also persist a miss. Self-HTTP is the wrong boundary for JSON that already lives in the same process.

Options considered:

1. Set `NEXT_PUBLIC_APP_URL` to the public production host and keep RSC `fetch`.
2. Send `x-vercel-protection-bypass` on server fetches.
3. RSC calls `lib/domain` in-process; Route Handlers remain the REST API for TanStack Query.

Decision: Option 3 (`lib/api/rsc.ts`). Keep HTTP helpers for the Orders workspace. Prefer `VERCEL_PROJECT_PRODUCTION_URL` in `getApiBaseUrl` if anything still fetches on the server. Do not `force-cache` those fetches.

Reason: Same DTOs as the REST API, no Vercel self-fetch, pages still do not import JSON.

Trade-offs: Dashboard no longer exercises HTTP on the server. The Orders list still does, which is what the JD grades (REST + Query).

Consequences: Production dashboard and details work without localhost. Documented in README and [system-design.md](./system-design.md).

Origin: Engineering decision (TASK-014 production smoke).

Status: accepted

---

## Decision: Vercel for the live URL; deploy in TASK-001

Date: 2026-09-16

Context: Email requires a live deployment link. Spec says “working demo if available.”

Problem: Leaving deploy until the last hour is a common fail.

Options considered: Netlify, GitHub Pages, Vercel, last-day deploy.

Decision: Vercel. Scaffold deploys in TASK-001. Later pushes update the URL.

Reason: Email is the submission contract. Native Next.js target. Early URL removes a risk.

Trade-offs: Requires a Vercel account and GitHub remote.

Consequences: TASK-014 records the production URL in the README and verifies Dashboard, Orders, and details on that host.

Origin: Company requirement (live link, email). Engineering decision (when/where).

Status: accepted

---

## Decision: Native fetch; no axios

Date: 2026-09-16

Context: Need an HTTP client.

Problem: Axios is habit, not a need.

Decision: `fetch` only.

Reason: Available in RSC and the browser. One less dependency.

Origin: Engineering decision. Avoid.

Status: accepted

---

## Decision: Do not install Framer Motion, RHF, Three.js, next-auth

Date: 2026-09-16

Context: JD lists several preferred libraries.

Problem: Decorative dependencies read as JD-keyword stuffing.

Decision: Skip unless a later ticket has a concrete UX need (unlikely).

Reason: No complex forms, 3D, or auth in the spec. Motion can harm a11y if used as decoration.

Origin: Engineering decision. Avoid.

Status: accepted

---

## Decision: GitHub Issues are the team tracker; local task file is gitignored

Date: 2026-09-16

Context: The assessment needs both a professional GitHub workflow and a compact state file for local AI-assisted execution. Company source files must stay on disk for Cursor context.

Problem: Committing the original assignment briefs or a private execution log would leak hiring materials and duplicate GitHub Issues.

Options considered:

1. Commit everything, including briefs and the full backlog markdown.
2. Gitignore briefs + local tracker; GitHub Issues/Project for team-facing work; public `docs/` for architecture.

Decision: Option 2.

- Local-only (gitignored): `job-description.txt`, `task-confirmation-mail.txt`, `Frontend_Task1_Analytics_Dashboard.md`, `docs/task-tracking.md`.
- Public: `README.md`, `docs/system-design.md`, `docs/api-reference.md`, `docs/developer-guidelines.md`, `docs/decisions.md`.
- Team process: GitHub Issues, labels, milestones, Project board. `1 Issue = 1 Branch = 1 PR` with `Closes #<n>`.

Reason: Reviewers should see architecture, not the company’s original files or an AI scratchpad. Agents still need local status.

Trade-offs: `task-tracking.md` will not appear on GitHub; agents must keep it in sync with Issue numbers by hand.

Consequences: README must not link the tracker or the briefs. TASK-014 must not commit those files.

Origin: Engineering decision.

Status: accepted

---

## Decision: UI/UX refinement after assessment; no RTL ticket

Date: 2026-09-16

Context: TASK-001–014 are done. The product is structurally complete and visually flat.

Problem: Treating polish as incidental nits would leave a competent assessment, not a production-feeling SaaS console.

Decision: Run a dedicated UI/UX phase as GitHub issues **UX-015–UX-022**. Preserve App Router, data contracts, and `1 ticket = 1 branch = 1 PR`. Do **not** create an RTL product ticket: the console is `en-US` with English mock copy. Prefer logical CSS properties only when already editing layout. Keep using `lucide-react` and `tw-animate-css`; do not add another icon or animation library.

Origin: Engineering decision (post-assessment).

Status: accepted

---

## Decision: Semantic status and chart color tokens (UX-015)

Date: 2026-09-16

Context: Nova neutral left `--destructive` as the only hue. Status badges reuse generic variants; both charts share gray `--chart-2`.

Decision: Add semantic CSS variables in `:root` and `.dark`, mapped through Tailwind `@theme`. Status stays **text + color**. No new business metrics.

| Token | Use |
| --- | --- |
| `--success` / `--success-foreground` | completed |
| `--warning` | pending |
| `--info` | processing |
| `--destructive` | cancelled (already existed) |
| `--chart-revenue` | Revenue series |
| `--chart-orders` | Orders series |

`--chart-1`…`--chart-5` remain the Nova gray ramp for unused shadcn chart slots. Feature code uses the named series tokens, not `--chart-2`.

Origin: Engineering decision (UX-015).

Status: accepted

---

## Decision: next-themes for Light / Dark / System (UX-016)

Date: 2026-09-16

Context: `.dark` tokens exist but nothing sets the class. Options: a minimal inline script + `localStorage`, or `next-themes`.

Decision: **`next-themes`**, `attribute="class"`, `defaultTheme="system"`. Class strategy matches shadcn. The package exists to handle SSR/FOUC and system preference; a custom script is more likely to flash. Keep the provider a leaf around `{children}` (same as `TooltipProvider`). Do not introduce a second token system.

Trade-offs: one small Recommended dependency.

Origin: Engineering decision (UX-016).

Status: accepted

---

## Decision: Motion tokens in UX-022; a11y audit in UX-021

Date: 2026-09-16

Context: Polish needs hover/lift/shimmer without a flashy motion language. Reduced-motion must be respected. Splitting “animation” across two tickets would duplicate work.

Decision: **UX-022 owns** duration/easing tokens, KPI icons (lucide), elevation, hover, skeleton shimmer, and `prefers-reduced-motion` for that polish. Charts stay `isAnimationActive={false}`. **UX-021 owns** the broader accessibility review (contrast, hit targets, keyboard, and verifying reduced-motion across polish **and** shadcn popovers). UX-021 must not redefine the motion scale. No Framer Motion.

Origin: Engineering decision (UX-021 / UX-022).

Status: accepted

---

## Decision: Tables scroll at a shared min-width (UX-020)

Date: 2026-09-16

Context: `overflow-x-auto` already wrapped tables, but customer cells used `whitespace-normal` + `break-all`, so the table shrank at ~390px and emails split mid-token.

Decision: One inherited rule: `min-w-[40rem]` on the shared `Table` element. Drop the wrapping/break overrides so cells keep nowrap. No card-list layout for rows. Desktop surfaces wider than 40rem stay `w-full`.

Origin: Engineering decision (UX-020).

Status: accepted

---

## Decision: Filter recovery keeps placeholder data (UX-018)

Date: 2026-09-16

Context: `keepPreviousData` already prevents an empty flash, but a refetch looked frozen. Empty filtered lists had no way back besides editing each control.

Decision: Clear-all writes `clearedOrdersUrl()` (`writeOrdersSearch` → `""`). Date popovers get a Clear control. No-results includes the same clear action. While `isFetching && isPlaceholderData`, keep the previous rows and mute the table (`opacity-60` + `aria-busy`) instead of swapping to the skeleton.

Origin: Engineering decision (UX-018).

Status: accepted

---

## Dependency register (summary)

| Package | Class | When installed | Why |
| --- | --- | --- | --- |
| `next`, `react`, `react-dom` | Required | TASK-001 | Company stack |
| TypeScript, ESLint, Tailwind | Required | TASK-001 | Company stack |
| Vitest | Required | TASK-001 (config) / used TASK-004 | Domain tests |
| shadcn/ui (`class-variance-authority`, `cn`, `lucide-react`, `radix-ui`, `shadcn`, `tw-animate-css`) | Required | TASK-002 | Primitive layer |
| Storybook 10 (`@storybook/nextjs-vite`, addon-docs, addon-a11y, `vite`) | Recommended | TASK-003 | Stateful UI review |
| `zod` | Recommended | TASK-004 | Unexpected data |
| `@tanstack/react-query` | Recommended | TASK-011 | Interactive list server state |
| `recharts` | Recommended | TASK-007 | Charts |
| `react-day-picker`, `date-fns` | Required | TASK-010 | shadcn Calendar for order date filters |
| `next-themes` | Recommended | UX-016 | Class-strategy light/dark/system without FOUC |
| `nuqs` | Optional | only if URL encoding hurts | Not planned |
| Extra icon packs, extra animation kits | Avoid | never | Use `lucide-react` + `tw-animate-css` |
| Zustand, Redux, axios, RHF, Framer Motion, next-auth, Prisma, Three.js, Docker | Avoid | never | No problem they uniquely solve here |
