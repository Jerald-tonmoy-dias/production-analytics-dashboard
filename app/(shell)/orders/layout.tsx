import { QueryProvider } from "@/components/providers/QueryProvider";

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <QueryProvider>{children}</QueryProvider>;
}
