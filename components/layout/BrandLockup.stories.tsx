import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BrandLockup } from "@/components/layout/BrandLockup";

const meta = {
  title: "Layout/BrandLockup",
  component: BrandLockup,
  decorators: [
    (Story) => (
      <div className="bg-sidebar text-sidebar-foreground w-56 rounded-md p-3">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof BrandLockup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Compact: Story = {
  args: {
    compact: true,
  },
  decorators: [
    (Story) => (
      <div className="bg-sidebar text-sidebar-foreground w-14 rounded-md p-2">
        <Story />
      </div>
    ),
  ],
};
