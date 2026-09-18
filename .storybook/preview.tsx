import type { Preview } from "@storybook/nextjs-vite";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import "../app/globals.css";

const preview: Preview = {
  globalTypes: {
    theme: {
      description: "Color theme",
      toolbar: {
        title: "Theme",
        icon: "circlehollow",
        items: [
          { value: "light", title: "Light", icon: "sun" },
          { value: "dark", title: "Dark", icon: "moon" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: "light",
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme === "dark" ? "dark" : "light";
      return (
        <ThemeProvider
          key={theme}
          forcedTheme={theme}
          enableSystem={false}
          disableTransitionOnChange
        >
          <TooltipProvider>
            <div className="min-h-screen bg-background p-6 text-foreground antialiased">
              <Story />
            </div>
          </TooltipProvider>
        </ThemeProvider>
      );
    },
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
