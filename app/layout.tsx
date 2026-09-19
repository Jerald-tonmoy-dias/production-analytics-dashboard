import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { DemoToaster } from "@/components/shared/DemoToaster";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Production Analytics Dashboard",
  description: "Operations console for customers, orders, and system activity.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(inter.variable, jetbrainsMono.variable)}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        <ThemeProvider>
          <TooltipProvider>
            {children}
            <DemoToaster />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
