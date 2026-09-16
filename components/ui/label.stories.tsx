import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const meta = {
  title: "Primitives/Label",
  component: Label,
} satisfies Meta<typeof Label>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-1.5">
      <Label htmlFor="customer">Customer</Label>
      <Input id="customer" placeholder="Name" />
    </div>
  ),
};
