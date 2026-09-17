"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatInteger } from "@/lib/format";
import { buildPageItems } from "@/lib/pagination";
import type { Pagination } from "@/lib/schemas/query";
import { cn } from "@/lib/utils";

type OrderPaginationProps = {
  pagination: Pagination;
  onPageChange: (page: number) => void;
};

function rangeLabel(pagination: Pagination): string {
  const { page, pageSize, total } = pagination;
  if (total === 0) {
    return "No orders";
  }
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  return `${formatInteger(start)}–${formatInteger(end)} of ${formatInteger(total)}`;
}

export function OrderPagination({
  pagination,
  onPageChange,
}: OrderPaginationProps) {
  const { page, totalPages } = pagination;
  const previousDisabled = page <= 1 || totalPages === 0;
  const nextDisabled = totalPages === 0 || page >= totalPages;
  const items = buildPageItems(page, totalPages);

  return (
    <nav
      aria-label="Order pagination"
      className="flex flex-wrap items-center justify-between gap-3"
    >
      <p className="text-muted-foreground text-sm" aria-live="polite">
        {rangeLabel(pagination)}
      </p>
      <div className="flex flex-wrap items-center gap-1.5">
        <Button
          type="button"
          variant="outline"
          className="min-h-9"
          disabled={previousDisabled}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft data-icon="inline-start" />
          Previous
        </Button>
        {items.map((item, index) =>
          item === "ellipsis" ? (
            <span
              key={`ellipsis-${index}`}
              className="text-muted-foreground px-1.5 text-sm"
              aria-hidden="true"
            >
              …
            </span>
          ) : (
            <Button
              key={item}
              type="button"
              variant={item === page ? "default" : "outline"}
              className={cn(
                "min-h-9 min-w-9 px-2 tabular-nums",
                item === page && "pointer-events-none"
              )}
              aria-label={`Page ${item}`}
              aria-current={item === page ? "page" : undefined}
              onClick={() => onPageChange(item)}
            >
              {formatInteger(item)}
            </Button>
          )
        )}
        <Button
          type="button"
          variant="outline"
          className="min-h-9"
          disabled={nextDisabled}
          onClick={() => onPageChange(page + 1)}
        >
          Next
          <ChevronRight data-icon="inline-end" />
        </Button>
      </div>
    </nav>
  );
}
