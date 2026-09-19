"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { OPERATOR_INITIALS, OPERATOR_NAME } from "@/lib/constants";

export function OperatorMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Operator menu"
          className="bg-primary text-primary-foreground ring-primary/20 hover:bg-primary/90 flex size-8 cursor-pointer items-center justify-center rounded-full text-xs font-bold shadow-sm outline-none ring-2 transition focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {OPERATOR_INITIALS}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-44 rounded-xl">
        <DropdownMenuLabel className="font-normal">
          <span className="text-muted-foreground block text-xs font-normal">
            Operator
          </span>
          <span className="text-sm font-medium">{OPERATOR_NAME}</span>
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
