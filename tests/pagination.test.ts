import { describe, expect, it } from "vitest";
import { buildPageItems } from "@/lib/pagination";

describe("buildPageItems", () => {
  it("returns an empty list when there are no pages", () => {
    expect(buildPageItems(1, 0)).toEqual([]);
  });

  it("lists every page when the total is small", () => {
    expect(buildPageItems(2, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it("keeps a window around the current page with ellipses", () => {
    expect(buildPageItems(6, 12)).toEqual([
      1,
      "ellipsis",
      5,
      6,
      7,
      "ellipsis",
      12,
    ]);
  });

  it("omits the leading ellipsis near the start", () => {
    expect(buildPageItems(1, 12)).toEqual([1, 2, "ellipsis", 12]);
  });

  it("omits the trailing ellipsis near the end", () => {
    expect(buildPageItems(12, 12)).toEqual([1, "ellipsis", 11, 12]);
  });
});
