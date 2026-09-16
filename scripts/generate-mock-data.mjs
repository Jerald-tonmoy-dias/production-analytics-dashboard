import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = join(root, "data");

function mulberry32(seed) {
  return function rand() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function money(value) {
  return Math.round(value * 100) / 100;
}

function pad(n, width) {
  return String(n).padStart(width, "0");
}

function iso(day, hour = 12, minute = 0) {
  return new Date(`${day}T${pad(hour, 2)}:${pad(minute, 2)}:00.000Z`).toISOString();
}

function addDays(day, days) {
  const date = new Date(`${day}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

const rand = mulberry32(20260916);
const companies = [
  "Acme Labs",
  "Northwind Ops",
  "Blue Harbor",
  "Cedar & Co",
  "Helios Freight",
  "Pinnacle Retail",
  "Orbit Media",
  "Lumen Health",
  "Granite Bank",
  "Willow Foods",
  "Atlas Robotics",
  "Nimbus Cloud",
  "Redwood Legal",
  "Harborline",
  "Kite Apparel",
  "Solstice Energy",
  "Brightpath Ed",
  "Copperfield",
  "Fieldstone",
  "Maple Analytics",
  "Ironclad Security",
  "Quartz Payments",
  "Vesper Hotels",
  "Canvas Studio",
  "Driftwood Coffee",
  "Summit Logistics",
  "Arc Light",
  "Beacon Pharma",
  "Cinder Labs",
  "Dove Street",
  "Echo Ventures",
  "Frostline",
  "Goldleaf",
  "Horizon Mutual",
  "Indigo Press",
  "Juniper Bio",
  "Keel Marine",
  "Lark Design",
  "Mosaic Farms",
  "Nova Tickets",
];

const catalogs = [
  { sku: "PLAN-START", name: "Starter plan — monthly", unitPrice: 49 },
  { sku: "PLAN-PRO", name: "Pro plan — annual", unitPrice: 1490 },
  { sku: "PLAN-ENT", name: "Enterprise plan — annual", unitPrice: 4800 },
  { sku: "ADDON-SEAT", name: "Extra seat", unitPrice: 18 },
  { sku: "ADDON-STORE", name: "Storage pack", unitPrice: 29.5 },
];

const customers = companies.map((name, index) => {
  const n = index + 1;
  const id = `cus_${pad(n, 2)}`;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const inactive = n <= 8;
  const createdDay = addDays("2025-06-01", n * 7);
  return {
    id,
    name,
    email: `ops@${slug}.test`,
    status: inactive ? "inactive" : "active",
    createdAt: iso(createdDay, 9, 0),
  };
});

const zeroOrderIds = new Set([
  "cus_07",
  "cus_08",
  "cus_36",
  "cus_37",
  "cus_38",
  "cus_39",
  "cus_40",
]);
const orderCustomerIds = customers
  .map((c) => c.id)
  .filter((id) => !zeroOrderIds.has(id));

const ZERO_ORDER_DAY = "2026-09-03";
const ZERO_REVENUE_DAY = "2026-09-04";

function randomDay(start, end) {
  const startDate = new Date(`${start}T00:00:00.000Z`);
  const endDate = new Date(`${end}T00:00:00.000Z`);
  const span = Math.round((endDate - startDate) / 86400000);
  let day;
  do {
    day = addDays(start, Math.floor(rand() * (span + 1)));
  } while (day === ZERO_ORDER_DAY || day === ZERO_REVENUE_DAY);
  return day;
}

function pickStatus() {
  const roll = rand();
  if (roll < 0.52) return "completed";
  if (roll < 0.7) return "pending";
  if (roll < 0.85) return "processing";
  return "cancelled";
}

function buildItems() {
  const count = 1 + Math.floor(rand() * 3);
  const items = [];
  for (let i = 0; i < count; i += 1) {
    const catalog = catalogs[Math.floor(rand() * catalogs.length)];
    items.push({
      sku: catalog.sku,
      name: catalog.name,
      quantity: 1 + Math.floor(rand() * 3),
      unitPrice: catalog.unitPrice,
    });
  }
  const amount = money(
    items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
  );
  return { items, amount };
}

const orders = [];

function pushOrder({ customerId, day, hour, minute, status }) {
  const { items, amount } = buildItems();
  const createdAt = iso(day, hour, minute);
  const updatedAt =
    status === "pending"
      ? createdAt
      : iso(day, Math.min(hour + 2, 23), minute);
  const id = `ord_${1000 + orders.length + 1}`;
  orders.push({
    id,
    customerId,
    amount,
    currency: "USD",
    status,
    createdAt,
    updatedAt,
    items,
  });
  return id;
}

for (let i = 0; i < 3; i += 1) {
  pushOrder({
    customerId: orderCustomerIds[i % orderCustomerIds.length],
    day: ZERO_REVENUE_DAY,
    hour: 10 + i,
    minute: 15,
    status: i === 0 ? "pending" : "cancelled",
  });
}

const remaining = 120 - orders.length;
for (let i = 0; i < remaining; i += 1) {
  const customerId = orderCustomerIds[i % orderCustomerIds.length];
  const day = randomDay("2026-08-01", "2026-09-18");
  pushOrder({
    customerId,
    day,
    hour: 8 + Math.floor(rand() * 12),
    minute: Math.floor(rand() * 60),
    status: pickStatus(),
  });
}

const customerById = Object.fromEntries(customers.map((c) => [c.id, c]));
const activities = [];

function pushActivity({ type, message, createdAt, orderId, customerId }) {
  activities.push({
    id: `act_${pad(activities.length + 1, 2)}`,
    type,
    message,
    createdAt,
    ...(orderId ? { orderId } : {}),
    ...(customerId ? { customerId } : {}),
  });
}

for (const customer of customers.slice(0, 12)) {
  pushActivity({
    type: "customer.created",
    message: `Customer ${customer.name} was added.`,
    createdAt: customer.createdAt,
    customerId: customer.id,
  });
}

for (const order of orders.slice(-20)) {
  const customer = customerById[order.customerId];
  pushActivity({
    type: "order.created",
    message: `Order ${order.id} created for ${customer.name}.`,
    createdAt: order.createdAt,
    orderId: order.id,
    customerId: order.customerId,
  });
  if (order.status !== "pending") {
    pushActivity({
      type: "order.status_changed",
      message: `Order ${order.id} moved to ${order.status}.`,
      createdAt: order.updatedAt,
      orderId: order.id,
      customerId: order.customerId,
    });
  }
  if (order.status === "completed") {
    pushActivity({
      type: "payment.received",
      message: `Payment received for ${order.id}.`,
      createdAt: order.updatedAt,
      orderId: order.id,
      customerId: order.customerId,
    });
  }
}

mkdirSync(dataDir, { recursive: true });
writeFileSync(join(dataDir, "customers.json"), `${JSON.stringify(customers, null, 2)}\n`);
writeFileSync(join(dataDir, "orders.json"), `${JSON.stringify(orders, null, 2)}\n`);
writeFileSync(join(dataDir, "activities.json"), `${JSON.stringify(activities, null, 2)}\n`);

console.log(
  JSON.stringify(
    {
      customers: customers.length,
      orders: orders.length,
      activities: activities.length,
      zeroOrderCustomers: [...zeroOrderIds],
      zeroOrderDay: ZERO_ORDER_DAY,
      zeroRevenueDay: ZERO_REVENUE_DAY,
    },
    null,
    2
  )
);
