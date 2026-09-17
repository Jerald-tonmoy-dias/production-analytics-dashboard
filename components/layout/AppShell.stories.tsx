import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AppShell } from "@/components/layout/AppShell";
import { ShellChromeActions } from "@/components/layout/ShellChromeActions";
import { PageHeader } from "@/components/shared/PageHeader";

const placeholderPage = (
  <div className="space-y-6">
    <PageHeader
      title="Dashboard"
      description="Revenue, orders, customers, and recent activity."
    />
    <p className="text-muted-foreground text-sm">Placeholder content.</p>
  </div>
);

const renderChromeActions = () => <ShellChromeActions />;

const meta = {
  title: "Layout/AppShell",
  component: AppShell,
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/",
      },
    },
  },
} satisfies Meta<typeof AppShell>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Dashboard: Story = {
  args: {
    orderCount: 120,
    headerActions: renderChromeActions,
    children: placeholderPage,
  },
};

export const Orders: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/orders",
      },
    },
  },
  args: {
    orderCount: 120,
    headerActions: renderChromeActions,
    children: (
      <div className="space-y-6">
        <PageHeader
          title="Orders"
          description="Search, filter, and inspect orders."
        />
        <p className="text-muted-foreground text-sm">Placeholder content.</p>
      </div>
    ),
  },
};

export const Mobile: Story = {
  args: {
    orderCount: 120,
    headerActions: renderChromeActions,
    children: placeholderPage,
  },
  decorators: [
    (Story) => (
      <div className="max-w-[390px] overflow-hidden rounded-md border border-border">
        <Story />
      </div>
    ),
  ],
};
