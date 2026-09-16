import Link from "next/link";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";

export default function OrderNotFound() {
  return (
    <div className="min-w-0 space-y-6">
      <PageHeader
        title="Order"
        description="This order could not be found."
      />
      <EmptyState
        title="Order not found"
        description="Check the id, or return to the orders list."
      >
        <Button asChild variant="outline">
          <Link href="/orders">Back to orders</Link>
        </Button>
      </EmptyState>
    </div>
  );
}
