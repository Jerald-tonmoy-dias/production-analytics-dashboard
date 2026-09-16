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
    tone: "revenue",
    className: "border-chart-revenue/40",
  },
};

export const Loading: Story = {
  args: {
    label: "Total revenue",
    format: "currency",
    state: "loading",
    tone: "revenue",
  },
};

export const ZeroValue: Story = {
  args: {
    label: "Conversion rate",
    hint: "Customers with a completed order",
    value: 0,
    format: "percent",
    tone: "conversion",
  },
};

export const Error: Story = {
  args: {
    label: "Active customers",
    format: "number",
    state: "error",
    tone: "customers",
  },
};

export const TwoByTwo: Story = {
  args: {
    label: "Total revenue",
    format: "currency",
    value: 321752,
    tone: "revenue",
  },
  render: () => (
    <div className="grid max-w-[390px] grid-cols-2 gap-3">
      <KpiCard
        label="Total revenue"
        hint="Completed orders, all time"
        value={321752}
        format="currency"
        tone="revenue"
        className="border-chart-revenue/40"
      />
      <KpiCard
        label="Orders"
        hint="All orders, all time"
        value={120}
        format="number"
        tone="orders"
      />
      <KpiCard
        label="Active customers"
        hint="Customers with status active"
        value={32}
        format="number"
        tone="customers"
      />
      <KpiCard
        label="Conversion rate"
        hint="Customers with a completed order"
        value={0.8}
        format="percent"
        tone="conversion"
      />
    </div>
  ),
};
