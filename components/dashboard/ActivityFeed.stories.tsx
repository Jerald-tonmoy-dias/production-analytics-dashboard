import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import type { Activity } from "@/lib/schemas/activity";

const ACTIVITIES: Activity[] = [
  {
    id: "act_49",
    type: "payment.received",
    message: "Payment received for order ord_1095.",
    createdAt: "2026-09-16T11:05:00.000Z",
    orderId: "ord_1095",
    customerId: "cus_01",
  },
  {
    id: "act_48",
    type: "order.status_changed",
    message: "Order ord_1094 moved to processing.",
    createdAt: "2026-09-16T10:20:00.000Z",
    orderId: "ord_1094",
    customerId: "cus_02",
  },
  {
    id: "act_47",
    type: "order.created",
    message: "Order ord_1093 was created.",
    createdAt: "2026-09-16T09:40:00.000Z",
    orderId: "ord_1093",
    customerId: "cus_03",
  },
  {
    id: "act_46",
    type: "customer.created",
    message: "Customer Beacon Retail was created.",
    createdAt: "2026-09-15T08:00:00.000Z",
    customerId: "cus_03",
  },
];

const meta = {
  title: "Dashboard/ActivityFeed",
  component: ActivityFeed,
} satisfies Meta<typeof ActivityFeed>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { activities: ACTIVITIES },
};

export const Loading: Story = {
  args: { activities: [], state: "loading" },
};

export const Empty: Story = {
  args: { activities: [] },
};

export const Error: Story = {
  args: { activities: [], state: "error" },
};
