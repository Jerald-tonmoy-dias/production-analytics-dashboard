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
 * Operator-facing UTC calendar date (`YYYY-MM-DD`).
 *
 * @param isoDate - `YYYY-MM-DD`.
 * @returns e.g. `Sep 16, 2026`.
 */
export function formatIsoDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

/**
 * Convert a `YYYY-MM-DD` calendar day to a local `Date` for date pickers.
 *
 * Uses local Y-M-D so the selected day does not shift across time zones.
 *
 * @param isoDate - `YYYY-MM-DD`.
 */
export function isoDateToLocalDate(isoDate: string): Date {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Convert a local picker `Date` back to `YYYY-MM-DD`.
 *
 * @param date - Local calendar date from the picker.
 */
export function localDateToIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Format an ISO-8601 timestamp for operator tables and feeds (UTC).
 *
 * @param iso - Instant such as `2026-09-16T12:00:00.000Z`.
 */
export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
  }).format(new Date(iso));
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

/**
 * One or two initials from a customer display name (presentation only).
 *
 * @param name - Customer name from the list DTO.
 * @returns Uppercase initials, or `?` when the name has no letters.
 */
export function customerInitials(name: string): string {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.replace(/[^A-Za-z0-9]/g, ""))
    .filter(Boolean);

  if (parts.length === 0) {
    return "?";
  }
  if (parts.length === 1) {
    return parts[0]!.slice(0, 2).toUpperCase();
  }
  return `${parts[0]![0]}${parts[parts.length - 1]![0]}`.toUpperCase();
}
