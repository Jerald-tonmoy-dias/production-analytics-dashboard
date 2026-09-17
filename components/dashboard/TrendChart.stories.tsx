import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TrendChart } from "@/components/dashboard/TrendChart";
import type { TimeSeriesPoint } from "@/lib/schemas/analytics";

function buildSeries(
  startIsoDate: string,
  values: number[]
): TimeSeriesPoint[] {
  const start = new Date(`${startIsoDate}T00:00:00.000Z`);
  return values.map((value, index) => {
    const date = new Date(start);
    date.setUTCDate(start.getUTCDate() + index);
    return { date: date.toISOString().slice(0, 10), value };
  });
}

const SAMPLE_REVENUE = buildSeries("2026-08-18", [
  2400, 0, 1800, 3200, 900, 4100, 0, 2700, 1500, 3600, 2200, 0, 1900, 2800,
  3100, 800, 4500, 1200, 2600, 0, 3300, 1700, 2100, 3900, 1400, 2500, 0, 1800,
  4200, 1100,
]);

const ZERO_SERIES = buildSeries(
  "2026-08-18",
  Array.from({ length: 30 }, () => 0)
);

const meta = {
  title: "Dashboard/TrendChart",
  component: TrendChart,
} satisfies Meta<typeof TrendChart>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Revenue",
    description: "Completed order amount, last 30 days",
    series: SAMPLE_REVENUE,
    format: "currency",
    variant: "area",
  },
};

export const Orders: Story = {
  args: {
    title: "Orders",
    description: "Orders created, last 30 days",
    series: SAMPLE_REVENUE.map((point) => ({
      ...point,
      value: Math.round(point.value / 800),
    })),
    format: "number",
    variant: "bar",
  },
};

export const Empty: Story = {
  args: {
    title: "Orders",
    description: "Orders created, last 30 days",
    series: [],
    format: "number",
  },
};

export const AllZero: Story = {
  args: {
    title: "Revenue",
    description: "Completed order amount, last 30 days",
    series: ZERO_SERIES,
    format: "currency",
  },
};

export const Pair: Story = {
  args: {
    title: "Revenue",
    series: SAMPLE_REVENUE,
    format: "currency",
  },
  render: () => (
    <div className="grid gap-6 lg:grid-cols-2">
      <TrendChart
        title="Revenue"
        description="Completed order amount, last 30 days"
        series={SAMPLE_REVENUE}
        format="currency"
        variant="area"
      />
      <TrendChart
        title="Orders"
        description="Orders created, last 30 days"
        series={SAMPLE_REVENUE.map((point) => ({
          ...point,
          value: Math.round(point.value / 800),
        }))}
        format="number"
        variant="bar"
      />
    </div>
  ),
};
