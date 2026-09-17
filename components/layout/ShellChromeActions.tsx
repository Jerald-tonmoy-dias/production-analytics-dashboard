"use client";

import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { OperatorMenu } from "@/components/layout/OperatorMenu";

/** Theme + static operator. Rendered in the mobile top bar and the desktop toolbar. */
export function ShellChromeActions() {
  return (
    <>
      <ThemeToggle />
      <OperatorMenu />
    </>
  );
}
