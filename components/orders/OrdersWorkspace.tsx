"use client";

import { useEffect, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  OrderFilters,
  type OrderFiltersValue,
} from "@/components/orders/OrderFilters";
import { OrdersDemoChrome } from "@/components/orders/OrdersDemoChrome";
import { OrderPagination } from "@/components/orders/OrderPagination";
import {
  OrdersTable,
  type OrdersTableState,
} from "@/components/orders/OrdersTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { getOrders } from "@/lib/api/orders";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { showDemoToast } from "@/lib/demo-toast";
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
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
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
  const pageIds = (listQuery.data?.data ?? []).map((order) => order.id);
  const selectedOnPage = selectedIds.filter((id) => pageIds.includes(id));

  return (
    <div className="mx-auto min-w-0 max-w-[1360px] space-y-4">
      <OrdersDemoChrome
        totalCount={listQuery.data?.pagination.total}
        activeStatus={urlState.status}
        onStatusChange={(status) =>
          pushState({
            ...urlState,
            status,
            page: 1,
          })
        }
      />
      <Card className="min-w-0 overflow-hidden rounded-2xl">
        <CardContent className="bg-muted/30 border-b">
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
        </CardContent>
        {selectedOnPage.length > 0 ? (
          <div className="bg-primary/5 border-b px-5 py-2.5">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-semibold">
              <div className="text-primary flex flex-wrap items-center gap-3">
                <span>{selectedOnPage.length} selected</span>
                <span className="text-primary/40">|</span>
                <button
                  type="button"
                  className="hover:underline cursor-pointer"
                  onClick={() =>
                    showDemoToast(
                      "Mark completed is demo-only — no order mutations."
                    )
                  }
                >
                  Mark completed
                </button>
                <button
                  type="button"
                  className="hover:underline cursor-pointer"
                  onClick={() =>
                    showDemoToast("Export selected is demo-only.")
                  }
                >
                  Export selected
                </button>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="cursor-pointer text-xs"
                onClick={() => setSelectedIds([])}
              >
                Deselect all
              </Button>
            </div>
          </div>
        ) : null}
        <CardContent
          aria-busy={isRefreshing || undefined}
          className={cn("min-w-0", isRefreshing && "opacity-60")}
        >
          <OrdersTable
            orders={listQuery.data?.data ?? []}
            state={tableState}
            selectedIds={selectedOnPage}
            onSelectedIdsChange={(ids) => {
              const otherPages = selectedIds.filter(
                (id) => !pageIds.includes(id)
              );
              setSelectedIds([...otherPages, ...ids]);
            }}
            onClearFilters={clearFilters}
            onRetry={() => {
              void listQuery.refetch();
            }}
          />
        </CardContent>
        {listQuery.data ? (
          <CardFooter className="w-full bg-transparent">
            <OrderPagination
              pagination={listQuery.data.pagination}
              onPageChange={(page) => pushState({ ...urlState, page })}
            />
          </CardFooter>
        ) : null}
      </Card>
    </div>
  );
}
