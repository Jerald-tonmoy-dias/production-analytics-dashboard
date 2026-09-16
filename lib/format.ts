import { CURRENCY } from "@/lib/constants";

/**
 * Format a USD amount in major units for operator display.
 *
 * @param amount - Dollars (e.g. `1490` → `$1,490.00`).
 */
export function formatUsd(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: CURRENCY,
  }).format(amount);
}

/**
 * Format a whole number with grouping separators.
 *
 * @param value - Count (orders, customers).
 */
export function formatInteger(value: number): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(
    value
  );
}

/**
 * Format a 0–1 ratio as a percentage. The API stores conversion as a ratio.
 *
 * @param ratio - `0.8` → `80%`.
 */
export function formatPercent(ratio: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    maximumFractionDigits: 1,
  }).format(ratio);
}

/**
 * Short UTC calendar label for chart axes.
 *
 * @param isoDate - `YYYY-MM-DD`.
 * @returns e.g. `Aug 18`.
 */
export function formatChartDay(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

/**
 * Compact axis tick for crowded chart Y axes.
 *
 * @param value - Raw series value.
 * @param format - Currency uses compact USD; otherwise a compact integer.
 */
export function formatCompactAxis(
  value: number,
  format: "currency" | "number"
): string {
  if (format === "currency") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: CURRENCY,
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  }
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}
