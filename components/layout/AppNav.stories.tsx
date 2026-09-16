import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AppNav } from "@/components/layout/AppNav";

const meta = {
  title: "Layout/AppNav",
  component: AppNav,
  decorators: [
    (Story) => (
      <div className="bg-sidebar w-56 rounded-md p-3">
        <Story />
      </div>
    ),
  ],
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/orders",
      },
    },
  },
} satisfies Meta<typeof AppNav>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Current: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/",
      },
    },
  },
};
