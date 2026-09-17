"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { AppNav } from "@/components/layout/AppNav";
import { BrandLockup } from "@/components/layout/BrandLockup";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MD_MEDIA_QUERY } from "@/lib/constants";

type MobileNavProps = {
  actions?: React.ReactNode;
  orderCount?: number;
};

export function MobileNav({ actions, orderCount }: MobileNavProps) {
  const pathname = usePathname();
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;

  useEffect(() => {
    const media = window.matchMedia(MD_MEDIA_QUERY);
    function onChange() {
      if (media.matches) {
        setOpenPath(null);
      }
    }
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return (
    <header className="border-sidebar-border bg-sidebar text-sidebar-foreground sticky top-0 z-40 flex items-center gap-2 border-b px-3 py-2 md:hidden">
      <Sheet
        open={open}
        onOpenChange={(next) => setOpenPath(next ? pathname : null)}
      >
        <SheetTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-lg"
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            <Menu className="size-4" aria-hidden="true" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="bg-sidebar text-sidebar-foreground w-[min(18rem,85vw)] gap-0 p-0 duration-[var(--motion-default)] ease-standard"
        >
          <SheetHeader className="border-sidebar-border border-b pr-12">
            <SheetTitle>
              <BrandLockup />
            </SheetTitle>
            <SheetDescription className="sr-only">
              Primary navigation
            </SheetDescription>
          </SheetHeader>
          <div id="mobile-nav" className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
            <AppNav orderCount={orderCount} />
          </div>
        </SheetContent>
      </Sheet>
      <BrandLockup className="min-w-0 flex-1" />
      {actions ? (
        <div data-slot="shell-actions" className="flex shrink-0 items-center">
          {actions}
        </div>
      ) : null}
    </header>
  );
}
