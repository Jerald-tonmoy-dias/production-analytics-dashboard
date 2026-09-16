import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/shared/ErrorState";

const meta = {
  title: "Shared/ErrorState",
  component: ErrorState,
} satisfies Meta<typeof ErrorState>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    description: "The page failed to load. You can try again.",
  },
};

export const WithRetry: Story = {
  args: {
    title: "Could not load orders",
    description: "Check your connection, then try again.",
    children: <Button>Try again</Button>,
  },
};
