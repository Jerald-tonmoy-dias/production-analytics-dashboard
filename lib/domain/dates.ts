/**
 * UTC calendar day `YYYY-MM-DD` for an ISO timestamp or `Date`.
 *
 * @param isoOrDate - Instant to convert. Strings are parsed as ISO-8601.
 * @returns Calendar day in UTC.
 */
export function utcDateKey(isoOrDate: string | Date): string {
  const date = typeof isoOrDate === "string" ? new Date(isoOrDate) : isoOrDate;
  return date.toISOString().slice(0, 10);
}

/**
 * Inclusive lower bound of a UTC calendar day (`YYYY-MM-DD` → 00:00:00.000Z).
 *
 * @param yyyyMmDd - Date filter `from` / series bucket key.
 */
export function utcDayStart(yyyyMmDd: string): Date {
  return new Date(`${yyyyMmDd}T00:00:00.000Z`);
}

/**
 * Inclusive upper bound of a UTC calendar day (`YYYY-MM-DD` → 23:59:59.999Z).
 *
 * @param yyyyMmDd - Date filter `to` / series bucket key.
 */
export function utcDayEnd(yyyyMmDd: string): Date {
  return new Date(`${yyyyMmDd}T23:59:59.999Z`);
}

/**
 * Inclusive UTC calendar days ending on `now`'s UTC date.
 *
 * @param now - Clock used to pick the window end (inject in tests).
 * @param windowDays - Length of the window (dashboard charts use 30).
 * @returns Oldest day first, e.g. 30 days → `[now-29, …, now]`.
 */
export function utcWindowDays(now: Date, windowDays: number): string[] {
  const end = utcDayStart(utcDateKey(now));
  const days: string[] = [];

  for (let offset = windowDays - 1; offset >= 0; offset -= 1) {
    const day = new Date(end);
    day.setUTCDate(day.getUTCDate() - offset);
    days.push(utcDateKey(day));
  }

  return days;
}
