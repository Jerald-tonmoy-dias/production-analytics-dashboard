import { AppShell } from "@/components/layout/AppShell";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export default function ShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell headerActions={<ThemeToggle />}>{children}</AppShell>;
}
