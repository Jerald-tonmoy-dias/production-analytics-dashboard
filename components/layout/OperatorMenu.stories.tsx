import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { OperatorMenu } from "@/components/layout/OperatorMenu";

const meta = {
  title: "Layout/OperatorMenu",
  component: OperatorMenu,
} satisfies Meta<typeof OperatorMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
