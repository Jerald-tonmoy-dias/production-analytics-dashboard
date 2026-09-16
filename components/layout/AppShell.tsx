import { AppNav } from "@/components/layout/AppNav";
import { PRODUCT_NAME } from "@/lib/constants";

type AppShellProps = {
  children: React.ReactNode;
  /** Reserved for the UX-016 theme control. Rendered once (mobile: top bar, desktop: sidebar foot). */
  headerActions?: React.ReactNode;
};

export function AppShell({ children, headerActions }: AppShellProps) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <a
        href="#main-content"
        className="bg-background text-foreground sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-2 focus:rounded-md focus:px-3 focus:py-2 focus:ring-3 focus:ring-ring/50"
      >
        Skip to main content
      </a>
      <div className="md:grid md:grid-cols-[13.5rem_minmax(0,1fr)]">
        <div className="border-sidebar-border bg-sidebar text-sidebar-foreground border-b md:min-h-svh md:border-r md:border-b-0">
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 px-3 py-2.5 md:sticky md:top-0 md:min-h-svh md:flex-col md:items-stretch md:gap-5 md:px-3 md:py-4">
            <p className="font-heading min-w-0 text-sm font-semibold tracking-tight">
              {PRODUCT_NAME}
            </p>
            <div className="order-3 w-full md:order-none md:w-auto">
              <AppNav />
            </div>
            <div
              data-slot="shell-actions"
              className="order-2 flex shrink-0 items-center md:order-none md:mt-auto"
            >
              {headerActions}
            </div>
          </div>
        </div>
        <main
          id="main-content"
          tabIndex={-1}
          className="min-w-0 max-w-full px-4 py-5 outline-none focus-visible:ring-3 focus-visible:ring-ring/50 md:px-6 md:py-6"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
