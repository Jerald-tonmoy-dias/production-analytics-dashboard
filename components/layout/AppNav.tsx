"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ListOrdered } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { formatInteger } from "@/lib/format";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/orders", label: "Orders", icon: ListOrdered },
] as const;

type AppNavProps = {
  collapsed?: boolean;
  /** All-time order count (`kpis.orderCount`). Shown on Orders when expanded. */
  orderCount?: number;
};

function isCurrentPath(href: string, pathname: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppNav({ collapsed = false, orderCount }: AppNavProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary">
      <ul className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const current = isCurrentPath(item.href, pathname);
          const Icon = item.icon;
          const showCount = item.href === "/orders" && orderCount != null;
          const tooltipLabel =
            showCount && collapsed
              ? `${item.label} · ${formatInteger(orderCount)}`
              : item.label;

          const link = (
            <Link
              href={item.href}
              aria-current={current ? "page" : undefined}
              className={cn(
                "flex items-center rounded-md border border-transparent text-sm font-medium outline-none transition-colors duration-[var(--motion-fast)] ease-standard",
                "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
                collapsed
                  ? "size-9 justify-center"
                  : "min-h-9 w-full gap-2 px-2.5 py-1.5",
                current
                  ? cn(
                      "bg-sidebar-primary/10 text-sidebar-primary",
                      !collapsed &&
                        "shadow-[inset_2px_0_0_0_var(--sidebar-primary)]"
                    )
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className="size-4 shrink-0" aria-hidden="true" />
              <span className={collapsed ? "sr-only" : "min-w-0 flex-1 truncate"}>
                {item.label}
              </span>
              {showCount && !collapsed ? (
                <Badge
                  variant="secondary"
                  className="ml-auto h-5 shrink-0 px-1.5 tabular-nums"
                >
                  {formatInteger(orderCount)}
                </Badge>
              ) : null}
            </Link>
          );

          return (
            <li
              key={item.href}
              className={collapsed ? "flex justify-center" : undefined}
            >
              {collapsed ? (
                <Tooltip>
                  <TooltipTrigger asChild>{link}</TooltipTrigger>
                  <TooltipContent side="right" sideOffset={8}>
                    {tooltipLabel}
                  </TooltipContent>
                </Tooltip>
              ) : (
                link
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
