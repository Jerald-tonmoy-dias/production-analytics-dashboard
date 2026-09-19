import { AppSidebar } from "@/components/layout/AppSidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { SidebarToggle } from "@/components/layout/SidebarToggle";

type AppShellProps = {
  children: React.ReactNode;
  /** All-time order count for the Orders nav badge (`kpis.orderCount`). */
  orderCount?: number;
  /** Chrome actions (theme + operator). Mobile top bar and desktop toolbar. */
  headerActions?: () => React.ReactNode;
};

export function AppShell({
  children,
  orderCount,
  headerActions,
}: AppShellProps) {
  return (
    <div className="bg-background flex h-full min-h-screen overflow-x-hidden md:h-svh md:overflow-hidden">
      <a
        href="#main-content"
        className="bg-background text-foreground sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-2 focus:rounded-md focus:px-3 focus:py-2 focus:ring-3 focus:ring-ring/50"
      >
        Skip to main content
      </a>
      <AppSidebar orderCount={orderCount} />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <MobileNav actions={headerActions?.()} orderCount={orderCount} />
        <header className="border-border bg-card z-20 hidden h-16 shrink-0 items-center justify-between border-b px-6 md:flex">
          <SidebarToggle />
          <div
            data-slot="shell-actions"
            className="flex shrink-0 items-center gap-3"
          >
            {headerActions?.()}
          </div>
        </header>
        <main
          id="main-content"
          tabIndex={-1}
          className="bg-background min-w-0 flex-1 px-4 py-6 outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:px-6 md:overflow-y-auto lg:px-8"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
