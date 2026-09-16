import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";

const meta = {
  title: "Orders/OrderStatusBadge",
  component: OrderStatusBadge,
} satisfies Meta<typeof OrderStatusBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Pending: Story = {
  args: { status: "pending" },
};

export const Processing: Story = {
  args: { status: "processing" },
};

export const Completed: Story = {
  args: { status: "completed" },
};

export const Cancelled: Story = {
  args: { status: "cancelled" },
};

function StatusRow() {
  return (
    <div className="flex flex-wrap gap-2">
      <OrderStatusBadge status="pending" />
      <OrderStatusBadge status="processing" />
      <OrderStatusBadge status="completed" />
      <OrderStatusBadge status="cancelled" />
    </div>
  );
}

export const AllStatuses: Story = {
  args: { status: "pending" },
  render: () => <StatusRow />,
};

export const AllStatusesDark: Story = {
  args: { status: "pending" },
  render: () => (
    <div className="dark rounded-md bg-background p-4 text-foreground">
      <StatusRow />
    </div>
  ),
};
