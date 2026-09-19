"use client";

import { useEffect, useState } from "react";
import { subscribeDemoToast } from "@/lib/demo-toast";
import { cn } from "@/lib/utils";

/**
 * Fixed toast for demo-only chrome (export, sync, create order, etc.).
 */
export function DemoToaster() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let timer: number | undefined;
    return subscribeDemoToast((next) => {
      setMessage(next);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setMessage(null), 2800);
    });
  }, []);

  if (!message) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "pointer-events-none fixed right-4 bottom-4 z-50 max-w-sm",
        "rounded-xl border border-border bg-card px-4 py-3 text-sm shadow-[var(--elevation-hover)]",
        "text-card-foreground"
      )}
    >
      <p className="font-medium">{message}</p>
      <p className="text-muted-foreground mt-0.5 text-xs">Demo only — not wired to an API.</p>
    </div>
  );
}
