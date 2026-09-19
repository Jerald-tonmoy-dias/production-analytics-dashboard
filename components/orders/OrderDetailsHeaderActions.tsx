"use client";

import { Copy } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { showDemoToast } from "@/lib/demo-toast";

type OrderDetailsHeaderActionsProps = {
  orderId: string;
};

export function OrderDetailsHeaderActions({
  orderId,
}: OrderDetailsHeaderActionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        className="cursor-pointer rounded-xl"
        aria-label={`Copy ${orderId}`}
        title="Copy order id"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(orderId);
            showDemoToast(`Copied ${orderId}`);
          } catch {
            showDemoToast("Could not copy — clipboard blocked.");
          }
        }}
      >
        <Copy className="size-4" aria-hidden="true" />
      </Button>
      <Button asChild variant="outline" className="min-h-9 cursor-pointer rounded-xl">
        <Link href="/orders">Back to orders</Link>
      </Button>
    </div>
  );
}
