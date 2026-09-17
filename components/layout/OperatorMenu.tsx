"use client";

import { Button } from "@/components/ui/button";
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
        <Button
          type="button"
          variant="ghost"
          size="icon-lg"
          aria-label="Operator menu"
        >
          <span
            className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-full text-[0.65rem] font-semibold"
            aria-hidden="true"
          >
            {OPERATOR_INITIALS}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-44">
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
