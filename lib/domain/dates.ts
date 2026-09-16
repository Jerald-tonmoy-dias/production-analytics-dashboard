export function utcDateKey(isoOrDate: string | Date): string {
  const date = typeof isoOrDate === "string" ? new Date(isoOrDate) : isoOrDate;
  return date.toISOString().slice(0, 10);
}

export function utcDayStart(yyyyMmDd: string): Date {
  return new Date(`${yyyyMmDd}T00:00:00.000Z`);
}

export function utcDayEnd(yyyyMmDd: string): Date {
  return new Date(`${yyyyMmDd}T23:59:59.999Z`);
}

/** Inclusive UTC calendar days ending on `now`'s UTC date. */
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
