"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatInteger } from "@/lib/format";
import type { Pagination } from "@/lib/schemas/query";

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

  return (
    <nav
      aria-label="Order pagination"
      className="flex flex-wrap items-center justify-between gap-3"
    >
      <p className="text-muted-foreground text-sm">{rangeLabel(pagination)}</p>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={previousDisabled}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft data-icon="inline-start" />
          Previous
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
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
