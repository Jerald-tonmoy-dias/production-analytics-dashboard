"use client";

import { useEffect, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  OrderFilters,
  type OrderFiltersValue,
} from "@/components/orders/OrderFilters";
import { OrderPagination } from "@/components/orders/OrderPagination";
import {
  OrdersTable,
  type OrdersTableState,
} from "@/components/orders/OrdersTable";
import { getOrders } from "@/lib/api/orders";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import {
  clearedOrdersUrl,
  hasOrdersFilters,
  readOrdersUrl,
  writeOrdersSearch,
  type OrdersUrlState,
} from "@/lib/orders-url";
import { cn } from "@/lib/utils";

const SEARCH_DEBOUNCE_MS = 300;

export function OrdersWorkspace() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const urlState = readOrdersUrl(searchParams);
  const [qDraft, setQDraft] = useState(urlState.q);
  const [prevUrlQ, setPrevUrlQ] = useState(urlState.q);
  if (urlState.q !== prevUrlQ) {
    setPrevUrlQ(urlState.q);
    setQDraft(urlState.q);
  }

  useEffect(() => {
    if (qDraft === urlState.q) {
      return;
    }

    const timer = window.setTimeout(() => {
      const query = writeOrdersSearch({
        q: qDraft,
        status: urlState.status,
        from: urlState.from,
        to: urlState.to,
        page: 1,
      });
      const href = query ? `${pathname}?${query}` : pathname;
      if (searchParams.toString() === query) {
        return;
      }
      router.push(href, { scroll: false });
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [
    qDraft,
    pathname,
    router,
    searchParams,
    urlState.from,
    urlState.q,
    urlState.status,
    urlState.to,
  ]);

  function pushState(next: OrdersUrlState) {
    const query = writeOrdersSearch(next);
    const href = query ? `${pathname}?${query}` : pathname;
    if (searchParams.toString() === query) {
      return;
    }
    router.push(href, { scroll: false });
  }

  function clearFilters() {
    setQDraft("");
    pushState(clearedOrdersUrl());
  }

  const listQuery = useQuery({
    queryKey: [
      "orders",
      urlState.q,
      urlState.status ?? "",
      urlState.from ?? "",
      urlState.to ?? "",
      urlState.page,
    ],
    queryFn: () =>
      getOrders({
        q: urlState.q.trim() || undefined,
        status: urlState.status,
        from: urlState.from,
        to: urlState.to,
        page: urlState.page,
        pageSize: DEFAULT_PAGE_SIZE,
      }),
    placeholderData: keepPreviousData,
  });

  const filters: OrderFiltersValue = {
    q: qDraft,
    status: urlState.status,
    from: urlState.from,
    to: urlState.to,
  };

  let tableState: OrdersTableState = "default";
  if (listQuery.isPending) {
    tableState = "loading";
  } else if (listQuery.isError) {
    tableState = "error";
  } else if (listQuery.data && listQuery.data.data.length === 0) {
    tableState = hasOrdersFilters(urlState) ? "noResults" : "empty";
  }

  const isRefreshing = listQuery.isFetching && listQuery.isPlaceholderData;

  return (
    <div className="min-w-0 space-y-4">
      <OrderFilters
        value={filters}
        onClear={clearFilters}
        onChange={(next) => {
          setQDraft(next.q);
          if (
            next.status !== urlState.status ||
            next.from !== urlState.from ||
            next.to !== urlState.to
          ) {
            pushState({
              q: next.q,
              status: next.status,
              from: next.from,
              to: next.to,
              page: 1,
            });
          }
        }}
      />
      <div
        aria-busy={isRefreshing || undefined}
        className={cn(isRefreshing && "opacity-60")}
      >
        <OrdersTable
          orders={listQuery.data?.data ?? []}
          state={tableState}
          onClearFilters={clearFilters}
          onRetry={() => {
            void listQuery.refetch();
          }}
        />
      </div>
      {listQuery.data ? (
        <OrderPagination
          pagination={listQuery.data.pagination}
          onPageChange={(page) => pushState({ ...urlState, page })}
        />
      ) : null}
    </div>
  );
}
