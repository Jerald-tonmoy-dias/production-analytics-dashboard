import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { OrderDetails } from "@/components/orders/OrderDetails";
import type { OrderDetail } from "@/lib/schemas/order";

const ORDER: OrderDetail = {
  id: "ord_1001",
  customerId: "cus_01",
  customerName: "Acme Labs",
  customerEmail: "ops@acme.test",
  productName: "Enterprise plan — annual",
  productSku: "PLAN-ENT",
  itemCount: 2,
  amount: 9688.5,
  currency: "USD",
  status: "pending",
  createdAt: "2026-09-04T10:15:00.000Z",
  updatedAt: "2026-09-04T10:15:00.000Z",
  items: [
    {
      sku: "PLAN-ENT",
      name: "Enterprise plan — annual",
      quantity: 2,
      unitPrice: 4800,
    },
    {
      sku: "ADDON-STORE",
      name: "Storage pack",
      quantity: 3,
      unitPrice: 29.5,
    },
  ],
  customer: {
    id: "cus_01",
    name: "Acme Labs",
    email: "ops@acme.test",
    status: "active",
    createdAt: "2025-11-02T00:00:00.000Z",
  },
};

const meta = {
  title: "Orders/OrderDetails",
  component: OrderDetails,
} satisfies Meta<typeof OrderDetails>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { order: ORDER },
};

export const Error: Story = {
  args: { state: "error" },
};
