import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";

const meta = {
  title: "Shared/EmptyState",
  component: EmptyState,
} satisfies Meta<typeof EmptyState>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "No orders yet",
    description: "Orders will show up here once customers start checking out.",
  },
};

export const WithAction: Story = {
  args: {
    title: "No matching orders",
    description: "Try a different search or clear the filters.",
    children: <Button variant="outline">Clear filters</Button>,
  },
};
