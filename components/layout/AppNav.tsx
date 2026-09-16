"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ListOrdered } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/orders", label: "Orders", icon: ListOrdered },
] as const;

type AppNavProps = {
  collapsed?: boolean;
};

function isCurrentPath(href: string, pathname: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppNav({ collapsed = false }: AppNavProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary">
      <ul className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const current = isCurrentPath(item.href, pathname);
          const Icon = item.icon;

          const link = (
            <Link
              href={item.href}
              aria-current={current ? "page" : undefined}
              className={cn(
                "flex items-center rounded-md border border-transparent text-sm font-medium outline-none transition-colors duration-[var(--motion-fast)] ease-standard",
                "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
                collapsed
                  ? "size-8 justify-center"
                  : "gap-2 px-2.5 py-1.5",
                current
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className="size-4 shrink-0" aria-hidden="true" />
              <span className={collapsed ? "sr-only" : undefined}>{item.label}</span>
            </Link>
          );

          return (
            <li key={item.href} className={collapsed ? "flex justify-center" : undefined}>
              {collapsed ? (
                <Tooltip>
                  <TooltipTrigger asChild>{link}</TooltipTrigger>
                  <TooltipContent side="right" sideOffset={8}>
                    {item.label}
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
