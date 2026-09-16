"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
      <div className="flex min-w-0 flex-col gap-1.5">
        <Label htmlFor="order-from">From</Label>
        <Input
          id="order-from"
          type="date"
          value={value.from ?? ""}
          onChange={(event) =>
            onChange({
              ...value,
              from: event.target.value || undefined,
            })
          }
        />
      </div>
      <div className="flex min-w-0 flex-col gap-1.5">
        <Label htmlFor="order-to">To</Label>
        <Input
          id="order-to"
          type="date"
          value={value.to ?? ""}
          onChange={(event) =>
            onChange({
              ...value,
              to: event.target.value || undefined,
            })
          }
        />
      </div>
    </form>
  );
}
