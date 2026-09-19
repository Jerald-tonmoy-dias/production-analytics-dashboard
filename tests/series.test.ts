import { describe, expect, it } from "vitest";
import {
  aggregateSeriesByWeek,
  utcWeekStart,
} from "@/lib/domain/series";

describe("utcWeekStart", () => {
  it("maps mid-week days to Monday", () => {
    expect(utcWeekStart("2026-09-16")).toBe("2026-09-14"); // Wed → Mon
    expect(utcWeekStart("2026-09-14")).toBe("2026-09-14"); // Mon
    expect(utcWeekStart("2026-09-20")).toBe("2026-09-14"); // Sun → Mon
  });
});

describe("aggregateSeriesByWeek", () => {
  it("sums daily values into UTC weeks", () => {
    const weekly = aggregateSeriesByWeek([
      { date: "2026-09-14", value: 10 },
      { date: "2026-09-15", value: 20 },
      { date: "2026-09-21", value: 5 },
      { date: "2026-09-22", value: 7 },
    ]);

    expect(weekly).toEqual([
      { date: "2026-09-14", value: 30 },
      { date: "2026-09-21", value: 12 },
    ]);
  });

  it("returns empty for empty input", () => {
    expect(aggregateSeriesByWeek([])).toEqual([]);
  });
});
