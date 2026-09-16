import { PageHeader } from "@/components/shared/PageHeader";

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Orders"
        description="Search, filter, and inspect orders."
      />
      <p className="text-muted-foreground text-sm">
        The orders table will be composed here.
      </p>
    </div>
  );
}
