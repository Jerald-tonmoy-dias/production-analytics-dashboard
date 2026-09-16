import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "@/components/ui/button";

const meta = {
  title: "Preview/Theme",
} satisfies Meta;

export default meta;

type Story = StoryObj;

/** Proves globals.css + shadcn tokens load. Not a primitive catalog. */
export const Tokens: Story = {
  render: () => (
    <div className="flex max-w-md flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Ops console theme</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Neutral tokens and compact controls. Feature stories land in later tickets.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button>Primary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="secondary">Secondary</Button>
      </div>
      <div className="rounded-lg border border-border bg-card p-4 text-sm text-card-foreground shadow-sm">
        Card surface
      </div>
    </div>
  ),
};
