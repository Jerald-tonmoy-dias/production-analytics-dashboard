import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const meta = {
  title: "Primitives/Input",
  component: Input,
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Gallery: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="search">Search</Label>
        <Input id="search" placeholder="Order id or customer" />
      </div>
      <Input disabled placeholder="Disabled" />
      <Input aria-invalid placeholder="Invalid" defaultValue="bad value" />
    </div>
  ),
};
