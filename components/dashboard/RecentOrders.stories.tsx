import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { RecentOrders } from "@/components/dashboard/RecentOrders";
import type { OrderListItem } from "@/lib/schemas/order";

const ORDERS: OrderListItem[] = [
  {
    id: "ord_1095",
    customerId: "cus_01",
    customerName: "Acme Labs",
    customerEmail: "ops@acme.test",
    productName: "Pro plan — annual",
    productSku: "PLAN-PRO",
    itemCount: 1,
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
    productName: "Starter plan — monthly",
    productSku: "PLAN-START",
    itemCount: 2,
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
    productName: "Extra seat",
    productSku: "ADDON-SEAT",
    itemCount: 1,
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
    productName: "Enterprise plan — annual",
    productSku: "PLAN-ENT",
    itemCount: 1,
    amount: 2400,
    currency: "USD",
    status: "cancelled",
    createdAt: "2026-09-15T18:00:00.000Z",
  },
];

const meta = {
  title: "Dashboard/RecentOrders",
  component: RecentOrders,
} satisfies Meta<typeof RecentOrders>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { orders: ORDERS },
};

export const Loading: Story = {
  args: { orders: [], state: "loading" },
};

export const Empty: Story = {
  args: { orders: [] },
};

export const Error: Story = {
  args: { orders: [], state: "error" },
};
