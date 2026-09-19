"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ListOrdered } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
      <ul className={cn("flex flex-col", collapsed ? "gap-1" : "gap-2")}>
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
                "flex w-full items-center rounded-xl text-sm font-semibold outline-none transition-all",
                "focus-visible:ring-3 focus-visible:ring-ring/50",
                collapsed
                  ? "size-9 justify-center"
                  : "justify-between gap-3 px-3.5 py-2.5",
                current
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-[var(--shadow-brand-sm)]"
                  : "text-[#334155] hover:bg-primary/10 hover:text-primary dark:text-slate-300 dark:hover:bg-slate-800/60"
              )}
            >
              <span
                className={cn(
                  "flex min-w-0 items-center",
                  collapsed ? "justify-center" : "gap-3"
                )}
              >
                <Icon
                  className={cn(
                    "size-[18px] shrink-0",
                    !current && "text-slate-400"
                  )}
                  aria-hidden="true"
                />
                <span
                  className={collapsed ? "sr-only" : "min-w-0 flex-1 truncate"}
                >
                  {item.label}
                </span>
              </span>
              {showCount && !collapsed ? (
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs font-semibold",
                    current
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                  )}
                >
                  {formatInteger(orderCount)}
                </span>
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
