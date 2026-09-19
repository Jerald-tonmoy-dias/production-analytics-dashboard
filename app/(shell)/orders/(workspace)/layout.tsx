import { QueryProvider } from "@/components/providers/QueryProvider";

export default function OrdersWorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <QueryProvider>{children}</QueryProvider>;
}
