"use client";

import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { cn } from "@/lib/utils";

const ALL_STATUSES = "all";

export type OrderFiltersValue = {
  q: string;
  status?: OrderStatus;
  from?: string;
  to?: string;
};

type OrderFiltersProps = {
  value: OrderFiltersValue;
  onChange: (value: OrderFiltersValue) => void;
};

type DateFieldProps = {
  id: string;
  label: string;
  value?: string;
  onChange: (next?: string) => void;
};

function DateField({ id, label, value, onChange }: DateFieldProps) {
  const [open, setOpen] = useState(false);
  const selected = value ? isoDateToLocalDate(value) : undefined;

  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            className={cn(
              "w-full justify-start font-normal",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon data-icon="inline-start" />
            {value ? formatIsoDate(value) : "Pick a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-2">
          <Calendar
            mode="single"
            selected={selected}
            onSelect={(date) => {
              onChange(date ? localDateToIsoDate(date) : undefined);
              if (date) {
                setOpen(false);
              }
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export function OrderFilters({ value, onChange }: OrderFiltersProps) {
  return (
    <form
      className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="flex min-w-0 flex-col gap-1.5">
        <Label htmlFor="order-search">Search</Label>
        <Input
          id="order-search"
          type="search"
          autoComplete="off"
          placeholder="Order id or customer"
          value={value.q}
          onChange={(event) =>
            onChange({ ...value, q: event.target.value })
          }
        />
      </div>
      <div className="flex min-w-0 flex-col gap-1.5">
        <Label htmlFor="order-status">Status</Label>
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
          <SelectTrigger id="order-status" className="w-full">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
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
        label="From"
        value={value.from}
        onChange={(from) => onChange({ ...value, from })}
      />
      <DateField
        id="order-to"
        label="To"
        value={value.to}
        onChange={(to) => onChange({ ...value, to })}
      />
    </form>
  );
}
