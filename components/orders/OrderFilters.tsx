"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { CalendarIcon, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ORDER_STATUSES } from "@/lib/constants";
import type { OrderStatus } from "@/lib/schemas/order";
import { orderStatusLabel } from "@/components/orders/OrderStatusBadge";
import {
  formatIsoDate,
  isoDateToLocalDate,
  localDateToIsoDate,
} from "@/lib/format";
import { hasOrdersFilters } from "@/lib/orders-url";
import { cn } from "@/lib/utils";

const ALL_STATUSES = "all";

/** Matches shadcn Calendar footprint (`--cell-size` grid) to avoid popover CLS while DayPicker loads. */
function CalendarFallback() {
  return (
    <div
      className="bg-background w-[16.75rem] p-2"
      style={{ minHeight: "17.5rem" }}
      aria-hidden="true"
    />
  );
}

const Calendar = dynamic(
  () =>
    import("@/components/ui/calendar").then((mod) => mod.Calendar),
  {
    ssr: false,
    loading: () => <CalendarFallback />,
  }
);

export type OrderFiltersValue = {
  q: string;
  status?: OrderStatus;
  from?: string;
  to?: string;
};

type OrderFiltersProps = {
  value: OrderFiltersValue;
  onChange: (value: OrderFiltersValue) => void;
  onClear?: () => void;
};

type DateFieldProps = {
  id: string;
  emptyLabel: string;
  value?: string;
  onChange: (next?: string) => void;
};

function DateField({ id, emptyLabel, value, onChange }: DateFieldProps) {
  const [open, setOpen] = useState(false);
  const selected = value ? isoDateToLocalDate(value) : undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          id={id}
          type="button"
          className={cn(
            "inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition",
            "hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700/50",
            value
              ? "font-medium text-slate-700 dark:text-slate-200"
              : "text-slate-700 dark:text-slate-300"
          )}
        >
          <CalendarIcon className="size-3.5 text-slate-400" aria-hidden="true" />
          <span>{value ? formatIsoDate(value) : emptyLabel}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-auto max-w-[calc(100vw-2rem)] rounded-xl p-2"
      >
        {/*
          Popover content mounts on open only; dynamic() therefore fetches
          react-day-picker on first open, not on initial Orders paint.
        */}
        <Calendar
          mode="single"
          selected={selected}
          aria-label={`${emptyLabel} calendar`}
          onSelect={(date) => {
            onChange(date ? localDateToIsoDate(date) : undefined);
            if (date) {
              setOpen(false);
            }
          }}
        />
        {value ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="mt-1 w-full cursor-pointer"
            onClick={() => {
              onChange(undefined);
              setOpen(false);
            }}
          >
            Clear
          </Button>
        ) : null}
      </PopoverContent>
    </Popover>
  );
}

/**
 * Orders filter toolbar — layout matches the HTML mock (search + inline controls).
 */
export function OrderFilters({ value, onChange, onClear }: OrderFiltersProps) {
  const canClear = Boolean(onClear) && hasOrdersFilters(value);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== "k") {
        return;
      }
      const target = event.target as HTMLElement | null;
      if (target?.closest("textarea, [contenteditable=true]")) {
        return;
      }
      event.preventDefault();
      searchRef.current?.focus();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <form
      aria-label="Order filters"
      className="flex flex-col items-stretch justify-between gap-3 md:flex-row md:items-center"
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="relative w-full max-w-md flex-1">
        <Search
          className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        />
        <input
          ref={searchRef}
          id="order-search"
          type="search"
          autoComplete="off"
          aria-label="Search orders"
          placeholder="Search order ID, customer name, email, or product..."
          className={cn(
            "w-full rounded-xl border border-slate-200 bg-white py-2 pr-14 pl-9 text-xs text-slate-900 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition",
            "placeholder:text-slate-400",
            "focus:border-primary focus:ring-primary/30 focus:ring-2 focus:outline-none",
            "dark:border-slate-700/80 dark:bg-slate-800/90 dark:text-white"
          )}
          value={value.q}
          onChange={(event) => onChange({ ...value, q: event.target.value })}
        />
        <kbd className="pointer-events-none absolute top-1/2 right-2.5 hidden -translate-y-1/2 rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-medium text-slate-400 sm:inline-block dark:border-slate-600 dark:bg-slate-700/60 dark:text-slate-500">
          ⌘K
        </kbd>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <div className="relative min-w-[130px]">
          <Select
            value={value.status ?? ALL_STATUSES}
            onValueChange={(next) =>
              onChange({
                ...value,
                status:
                  next === ALL_STATUSES ? undefined : (next as OrderStatus),
              })
            }
          >
            <SelectTrigger
              id="order-status"
              aria-label="Status"
              size="sm"
              className="h-auto w-full min-w-[130px] rounded-xl border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 *:data-[slot=select-value]:text-xs"
            >
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value={ALL_STATUSES}>All statuses</SelectItem>
              {ORDER_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {orderStatusLabel(status)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DateField
          id="order-from"
          emptyLabel="From date"
          value={value.from}
          onChange={(from) => onChange({ ...value, from })}
        />
        <DateField
          id="order-to"
          emptyLabel="To date"
          value={value.to}
          onChange={(to) => onChange({ ...value, to })}
        />

        {canClear ? (
          <button
            type="button"
            className="cursor-pointer rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-rose-50 hover:text-rose-600 dark:text-slate-400 dark:hover:bg-rose-950/30 dark:hover:text-rose-400"
            onClick={onClear}
          >
            Reset
          </button>
        ) : null}
      </div>
    </form>
  );
}
