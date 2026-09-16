import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Calendar } from "@/components/ui/calendar";

const meta = {
  title: "Primitives/Calendar",
  component: Calendar,
} satisfies Meta<typeof Calendar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    mode: "single",
    defaultMonth: new Date(2026, 8, 16),
  },
};
