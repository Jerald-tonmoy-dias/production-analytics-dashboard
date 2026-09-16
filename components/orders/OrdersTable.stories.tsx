import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { OrdersTable } from "@/components/orders/OrdersTable";
import type { OrderListItem } from "@/lib/schemas/order";

const ORDERS: OrderListItem[] = [
  {
    id: "ord_1095",
    customerId: "cus_01",
    customerName: "Acme Labs",
    customerEmail: "ops@acme.test",
    amount: 1490,
    currency: "USD",
    status: "completed",
    createdAt: "2026-09-16T11:00:00.000Z",
  },
  {
    id: "ord_1094",
    customerId: "cus_02",
    customerName: "Northwind Ops",
    customerEmail: "hello@northwind.test",
    amount: 320,
    currency: "USD",
    status: "processing",
    createdAt: "2026-09-16T10:15:00.000Z",
  },
  {
    id: "ord_1093",
    customerId: "cus_03",
    customerName: "Beacon Retail",
    customerEmail: "team@beacon.test",
    amount: 88.5,
    currency: "USD",
    status: "pending",
    createdAt: "2026-09-16T09:40:00.000Z",
  },
  {
    id: "ord_1092",
    customerId: "cus_04",
    customerName: "Harbor Freight Co",
    customerEmail: "ap@harbor.test",
    amount: 2400,
    currency: "USD",
    status: "cancelled",
    createdAt: "2026-09-15T18:00:00.000Z",
  },
];

const meta = {
  title: "Orders/OrdersTable",
  component: OrdersTable,
} satisfies Meta<typeof OrdersTable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { orders: ORDERS },
};

export const Loading: Story = {
  args: { orders: [], state: "loading" },
};

export const Empty: Story = {
  args: { orders: [], state: "empty" },
};

export const NoResults: Story = {
  args: { orders: [], state: "noResults" },
};

export const Error: Story = {
  args: { orders: [], state: "error" },
};
