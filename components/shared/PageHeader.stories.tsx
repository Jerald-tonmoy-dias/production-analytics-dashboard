import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";

const meta = {
  title: "Shared/PageHeader",
  component: PageHeader,
} satisfies Meta<typeof PageHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Dashboard",
    description: "Revenue, orders, customers, and recent activity.",
  },
};

export const WithActions: Story = {
  args: {
    title: "Orders",
    description: "Search, filter, and inspect orders.",
    children: <Button variant="outline">Export</Button>,
  },
};
