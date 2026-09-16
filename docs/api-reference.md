# API Reference

Contract for the mock REST layer.

Implementation must stay aligned with this document. If a ticket changes a contract, update this file in the **same PR**.

Base URL (local): `http://localhost:3000`

All successful responses are JSON. All errors use the envelope below.

Related: [System Design](./system-design.md) · [Decisions](./decisions.md)

---

## Conventions

### Error envelope

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid status filter.",
    "details": [{ "field": "status", "issue": "Invalid enum value" }]
  }
}
```

| HTTP | `error.code` | When |
| --- | --- | --- |
| 400 | `VALIDATION_ERROR` | Query/path failed Zod parse |
| 404 | `NOT_FOUND` | Order id does not exist |
| 500 | `INTERNAL_ERROR` | Unexpected / corrupt dataset |

`details` is optional and never includes stack traces.

### Identifiers

- `id` fields are strings (e.g. `ord_1001`, `cus_12`).
- Dates are ISO-8601 UTC strings (`2026-09-16T08:00:00.000Z`).
- Date **filters** (`from`, `to`) are calendar dates `YYYY-MM-DD`, inclusive, interpreted as UTC midnight to end-of-day.

### Money

- `amount` is a number in **major units** (USD dollars), two-decimal precision in data (e.g. `149.00`).
- Currency is `USD` for every record in v1.

### Pagination

List endpoints return:

```ts
{
  data: T[];
  pagination: {
    page: number;       // 1-indexed
    pageSize: number;
    total: number;
    totalPages: number;
  };
}
```

---

## Domain types

These are the canonical shapes. Zod schemas in `lib/schemas` must match.

### Customer

```ts
{
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive";
  createdAt: string; // ISO-8601
}
```

### Order status

```ts
"pending" | "processing" | "completed" | "cancelled"
```

### Order list item

```ts
{
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  currency: "USD";
  status: OrderStatus;
  createdAt: string;
}
```

### Order detail

`OrderListItem` plus:

```ts
{
  updatedAt: string;
  items: Array<{
    sku: string;
    name: string;
    quantity: number;
    unitPrice: number;
  }>;
  customer: Customer;
}
```

### Activity

```ts
{
  id: string;
  type:
    | "order.created"
    | "order.status_changed"
    | "customer.created"
    | "payment.received";
  message: string;
  createdAt: string;
  orderId?: string;
  customerId?: string;
}
```

### Time series point

```ts
{ date: string; value: number } // date = YYYY-MM-DD
```

---

## `GET /api/analytics`

**Purpose:** Dashboard KPIs and chart series for the last 30 UTC days.

**Company requirement:** Dashboard shows total revenue, orders, active customers, conversion rate, plus revenue and orders charts.

**Engineering assumptions:** See [Decisions](./decisions.md) for conversion rate, active customers, revenue definition, and chart window.

### Query parameters

None in v1. The 30-day window is computed server-side.

### Response `200`

```ts
{
  kpis: {
    totalRevenue: number;      // sum of completed orders (all time)
    orderCount: number;        // all orders, all time
    activeCustomers: number;   // customers with status === "active"
    conversionRate: number;    // 0–1 ratio, not a percentage string
  };
  series: {
    windowDays: 30;
    revenue: Array<{ date: string; value: number }>;
    orders: Array<{ date: string; value: number }>;
  };
}
```

- `series.revenue` / `series.orders` include **every day** in the window, including zeros.
- Revenue series sums **completed** order amounts per day.
- Orders series counts **all** orders created that day.

### Validation

No query params. Dataset parse failures → `500`.

### Example request

```http
GET /api/analytics HTTP/1.1
Host: localhost:3000
```

### Example response

```json
{
  "kpis": {
    "totalRevenue": 128450.5,
    "orderCount": 142,
    "activeCustomers": 37,
    "conversionRate": 0.62
  },
  "series": {
    "windowDays": 30,
    "revenue": [
      { "date": "2026-08-18", "value": 2400 },
      { "date": "2026-08-19", "value": 0 }
    ],
    "orders": [
      { "date": "2026-08-18", "value": 4 },
      { "date": "2026-08-19", "value": 0 }
    ]
  }
}
```

---

## `GET /api/orders`

**Purpose:** Filtered, paginated order list for the Orders workspace.

### Query parameters

| Name | Type | Required | Default | Notes |
| --- | --- | --- | --- | --- |
| `q` | string | no | `""` | Case-insensitive match on order id, customer name, or customer email |
| `status` | OrderStatus | no | all | Exact match |
| `from` | `YYYY-MM-DD` | no | unbounded | Inclusive lower bound on `createdAt` |
| `to` | `YYYY-MM-DD` | no | unbounded | Inclusive upper bound on `createdAt` |
| `page` | integer ≥ 1 | no | `1` | |
| `pageSize` | integer 1–50 | no | `10` | |

If `from > to` → `400 VALIDATION_ERROR`.

If `page` is greater than `totalPages` and `total > 0`, return **empty `data`** with the requested page metadata (do not clamp silently). The UI may then offer to go back. If `total === 0`, `totalPages` is `0`.

### Response `200`

```ts
{
  data: OrderListItem[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}
```

Default sort: `createdAt` descending.

### Example request

```http
GET /api/orders?q=acme&status=pending&page=1&pageSize=10 HTTP/1.1
```

### Example response

```json
{
  "data": [
    {
      "id": "ord_1001",
      "customerId": "cus_12",
      "customerName": "Acme Labs",
      "customerEmail": "ops@acme.test",
      "amount": 1490,
      "currency": "USD",
      "status": "pending",
      "createdAt": "2026-09-14T11:22:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

---

## `GET /api/orders/:id`

**Purpose:** Single order for the details route.

### Path parameters

| Name | Type | Required |
| --- | --- | --- |
| `id` | string | yes |

### Response `200`

`OrderDetail` object (not wrapped in `{ data }`).

### Response `404`

Error envelope with `NOT_FOUND`.

### Example request

```http
GET /api/orders/ord_1001 HTTP/1.1
```

### Example response

```json
{
  "id": "ord_1001",
  "customerId": "cus_12",
  "customerName": "Acme Labs",
  "customerEmail": "ops@acme.test",
  "amount": 1490,
  "currency": "USD",
  "status": "pending",
  "createdAt": "2026-09-14T11:22:00.000Z",
  "updatedAt": "2026-09-15T09:00:00.000Z",
  "items": [
    {
      "sku": "PLAN-PRO",
      "name": "Pro plan — annual",
      "quantity": 1,
      "unitPrice": 1490
    }
  ],
  "customer": {
    "id": "cus_12",
    "name": "Acme Labs",
    "email": "ops@acme.test",
    "status": "active",
    "createdAt": "2025-11-02T00:00:00.000Z"
  }
}
```

---

## `GET /api/activities`

**Purpose:** System activity feed for the Dashboard.

### Query parameters

| Name | Type | Required | Default |
| --- | --- | --- | --- |
| `limit` | integer 1–50 | no | `8` |

### Response `200`

```ts
{
  data: Activity[];
}
```

Sort: `createdAt` descending.

### Example request

```http
GET /api/activities?limit=8 HTTP/1.1
```

### Example response

```json
{
  "data": [
    {
      "id": "act_90",
      "type": "order.status_changed",
      "message": "Order ord_1001 moved to processing.",
      "createdAt": "2026-09-15T09:00:00.000Z",
      "orderId": "ord_1001",
      "customerId": "cus_12"
    }
  ]
}
```

---

## Client usage (non-HTTP)

Pages must not import `data/*.json`. They call `lib/api`:

| Function | Maps to |
| --- | --- |
| `getAnalytics()` | `GET /api/analytics` |
| `getOrders(params)` | `GET /api/orders` |
| `getOrder(id)` | `GET /api/orders/:id` |
| `getActivities(limit?)` | `GET /api/activities` |

RSC uses `getAnalytics` / `getActivities` / `getOrder`. The Orders table uses `getOrders` inside TanStack Query.

---

## Assumptions that affect the contract

| Topic | Assumption | Kind |
| --- | --- | --- |
| Conversion rate | Unique customers with ≥1 completed order / total customers, all time | Engineering assumption |
| Revenue KPI | Sum of **completed** orders, all time | Engineering assumption |
| Chart window | Last 30 UTC days, daily buckets including zeros | Engineering assumption |
| No analytics date query | Dashboard is not filterable in v1 | Engineering decision |
| `conversionRate` is `0–1` | UI formats as percent | Engineering decision |
| No write endpoints | Assignment is read-only | Engineering decision |
| Split resources vs one dashboard blob | Three GETs composed with `Promise.all` on the server | Engineering decision |

If implementation needs to change any row above, log it in [decisions.md](./decisions.md) and patch this file in the same PR.
