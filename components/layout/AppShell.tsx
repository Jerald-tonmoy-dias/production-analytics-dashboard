import { AppSidebar } from "@/components/layout/AppSidebar";
import { MobileNav } from "@/components/layout/MobileNav";

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
    <div className="min-h-screen overflow-x-hidden bg-background md:h-svh md:overflow-hidden">
      <a
        href="#main-content"
        className="bg-background text-foreground sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-2 focus:rounded-md focus:px-3 focus:py-2 focus:ring-3 focus:ring-ring/50"
      >
        Skip to main content
      </a>
      <div className="md:flex md:h-svh">
        <AppSidebar orderCount={orderCount} />
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <MobileNav actions={headerActions?.()} orderCount={orderCount} />
          <header className="border-border hidden shrink-0 items-center justify-end gap-1 border-b px-6 py-2 md:flex">
            <div
              data-slot="shell-actions"
              className="flex shrink-0 items-center gap-0.5"
            >
              {headerActions?.()}
            </div>
          </header>
          <main
            id="main-content"
            tabIndex={-1}
            className="min-w-0 flex-1 px-4 py-5 outline-none focus-visible:ring-3 focus-visible:ring-ring/50 md:overflow-y-auto md:px-6 md:py-6"
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
