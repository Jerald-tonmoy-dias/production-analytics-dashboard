export type PageItem = number | "ellipsis";

/**
 * Build numbered page control items with ellipses for a compact pager.
 *
 * Always includes the first and last page when there are enough pages.
 * Keeps a small window around the current page. Does not change the API
 * contract — callers still pass a single 1-indexed `page`.
 *
 * @param page - Current 1-indexed page.
 * @param totalPages - Total pages (`0` when the list is empty).
 * @returns Page numbers and `"ellipsis"` markers in display order.
 */
export function buildPageItems(page: number, totalPages: number): PageItem[] {
  if (totalPages <= 0) {
    return [];
  }

  const current = Math.min(Math.max(page, 1), totalPages);

  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const items: PageItem[] = [1];
  const windowStart = Math.max(2, current - 1);
  const windowEnd = Math.min(totalPages - 1, current + 1);

  if (windowStart > 2) {
    items.push("ellipsis");
  }

  for (let value = windowStart; value <= windowEnd; value += 1) {
    items.push(value);
  }

  if (windowEnd < totalPages - 1) {
    items.push("ellipsis");
  }

  items.push(totalPages);
  return items;
}
