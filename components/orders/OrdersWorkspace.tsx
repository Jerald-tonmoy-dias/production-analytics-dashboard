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
    <div className="min-w-0 space-y-4">
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
      <div className="space-y-5">
        <div className="rounded-2xl border border-slate-200/90 bg-slate-50/50 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
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
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {selectedOnPage.length > 0 ? (
            <div className="border-primary/20 bg-primary/5 flex items-center justify-between border-b px-5 py-2.5">
              <div className="text-primary flex flex-wrap items-center gap-3 text-xs font-semibold">
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
              <button
                type="button"
                className="cursor-pointer text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-white"
                onClick={() => setSelectedIds([])}
              >
                Deselect all
              </button>
            </div>
          ) : null}

          <div
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
          </div>

          {listQuery.data ? (
            <div className="border-t border-slate-100 px-6 py-4 dark:border-slate-800">
              <OrderPagination
                pagination={listQuery.data.pagination}
                onPageChange={(page) => pushState({ ...urlState, page })}
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
