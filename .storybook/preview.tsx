import type { Preview } from "@storybook/nextjs-vite";
import { TooltipProvider } from "@/components/ui/tooltip";
import "../app/globals.css";

const preview: Preview = {
  decorators: [
    (Story) => (
      <TooltipProvider>
        <div className="min-h-screen bg-background p-6 text-foreground antialiased">
          <Story />
        </div>
      </TooltipProvider>
    ),
  ],
  parameters: {
    nextjs: {
      appDirectory: true,
    },
    layout: "fullscreen",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
