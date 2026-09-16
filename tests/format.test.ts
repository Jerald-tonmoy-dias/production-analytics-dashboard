import { describe, expect, it } from "vitest";
import {
  formatChartDay,
  formatDateTime,
  formatInteger,
  formatPercent,
  formatUsd,
} from "@/lib/format";

describe("formatUsd", () => {
  it("formats major units with cents", () => {
    expect(formatUsd(1490)).toBe("$1,490.00");
  });

  it("formats zero", () => {
    expect(formatUsd(0)).toBe("$0.00");
  });
});

describe("formatInteger", () => {
  it("groups thousands", () => {
    expect(formatInteger(120)).toBe("120");
    expect(formatInteger(128450)).toBe("128,450");
  });
});

describe("formatPercent", () => {
  it("treats the value as a 0–1 ratio", () => {
    expect(formatPercent(0.8)).toBe("80%");
    expect(formatPercent(0)).toBe("0%");
  });
});

describe("formatChartDay", () => {
  it("labels a UTC calendar date without shifting the day", () => {
    expect(formatChartDay("2026-08-18")).toBe("Aug 18");
  });
});

describe("formatDateTime", () => {
  it("formats an instant in UTC", () => {
    expect(formatDateTime("2026-09-16T12:00:00.000Z")).toBe(
      "Sep 16, 2026, 12:00 PM UTC"
    );
  });
});
