import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { KpiCard } from "@/components/dashboard/KpiCard";

const meta = {
  title: "Dashboard/KpiCard",
  component: KpiCard,
} satisfies Meta<typeof KpiCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Total revenue",
    hint: "Completed orders, all time",
    value: 321752,
    format: "currency",
  },
};

export const Loading: Story = {
  args: {
    label: "Total revenue",
    format: "currency",
    state: "loading",
  },
};

export const ZeroValue: Story = {
  args: {
    label: "Conversion rate",
    hint: "Customers with a completed order",
    value: 0,
    format: "percent",
  },
};

export const Error: Story = {
  args: {
    label: "Active customers",
    format: "number",
    state: "error",
  },
};
