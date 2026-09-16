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
  render: () => <FiltersPlayground initial={{ q: "" }} />,
};

export const Filled: Story = {
  args: {
    value: { q: "" },
    onChange: () => {},
  },
  render: () => (
    <FiltersPlayground
      initial={{
        q: "acme",
        status: "pending",
        from: "2026-09-01",
        to: "2026-09-16",
      }}
    />
  ),
};
