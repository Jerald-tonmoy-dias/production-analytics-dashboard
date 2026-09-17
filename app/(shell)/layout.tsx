import { AppShell } from "@/components/layout/AppShell";
import { ShellChromeActions } from "@/components/layout/ShellChromeActions";
import { getAnalytics } from "@/lib/api/rsc";

export default async function ShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const analytics = await getAnalytics();

  return (
    <AppShell
      orderCount={analytics.kpis.orderCount}
      headerActions={() => <ShellChromeActions />}
    >
      {children}
    </AppShell>
  );
}
