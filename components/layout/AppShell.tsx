import { AppSidebar } from "@/components/layout/AppSidebar";
import { MobileNav } from "@/components/layout/MobileNav";

type AppShellProps = {
  children: React.ReactNode;
  /** Chrome actions (theme toggle). Called once per shell (mobile top bar, desktop sidebar foot). */
  headerActions?: () => React.ReactNode;
};

export function AppShell({ children, headerActions }: AppShellProps) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background md:h-svh md:overflow-hidden">
      <a
        href="#main-content"
        className="bg-background text-foreground sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-2 focus:rounded-md focus:px-3 focus:py-2 focus:ring-3 focus:ring-ring/50"
      >
        Skip to main content
      </a>
      <div className="md:flex md:h-svh">
        <AppSidebar footer={headerActions?.()} />
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <MobileNav actions={headerActions?.()} />
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
