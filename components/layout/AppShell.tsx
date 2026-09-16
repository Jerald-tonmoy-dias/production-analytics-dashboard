import { AppNav } from "@/components/layout/AppNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <a
        href="#main-content"
        className="bg-background text-foreground sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-2 focus:rounded-md focus:px-3 focus:py-2 focus:ring-3 focus:ring-ring/50"
      >
        Skip to main content
      </a>
      <div className="md:grid md:grid-cols-[13.5rem_minmax(0,1fr)]">
        <div className="border-sidebar-border bg-sidebar text-sidebar-foreground border-b md:border-r md:border-b-0">
          <div className="flex items-center justify-between gap-3 px-3 py-2.5 md:sticky md:top-0 md:flex-col md:items-stretch md:gap-5 md:px-3 md:py-4">
            <p className="font-heading text-sm font-semibold tracking-tight">
              Analytics
            </p>
            <AppNav />
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
