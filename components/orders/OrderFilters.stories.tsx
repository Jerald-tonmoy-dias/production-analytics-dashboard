import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  OrderFilters,
  type OrderFiltersValue,
} from "@/components/orders/OrderFilters";

const meta = {
  title: "Orders/OrderFilters",
  component: OrderFilters,
} satisfies Meta<typeof OrderFilters>;

export default meta;

type Story = StoryObj<typeof meta>;

function FiltersPlayground({
  initial,
}: {
  initial: OrderFiltersValue;
}) {
  const [value, setValue] = useState(initial);
  return (
    <OrderFilters
      value={value}
      onChange={setValue}
      onClear={() => setValue({ q: "" })}
    />
  );
}

export const Default: Story = {
  args: {
    value: { q: "" },
    onChange: () => {},
  },
  render: () => (
    <div className="rounded-2xl border border-slate-200/90 bg-slate-50/50 p-4">
      <FiltersPlayground initial={{ q: "" }} />
    </div>
  ),
};

export const Filled: Story = {
  args: {
    value: { q: "" },
    onChange: () => {},
  },
  render: () => (
    <div className="rounded-2xl border border-slate-200/90 bg-slate-50/50 p-4">
      <FiltersPlayground
        initial={{
          q: "acme",
          status: "pending",
          from: "2026-09-01",
          to: "2026-09-16",
        }}
      />
    </div>
  ),
};
