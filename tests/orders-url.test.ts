import { describe, expect, it } from "vitest";
import {
  hasOrdersFilters,
  readOrdersUrl,
  writeOrdersSearch,
} from "@/lib/orders-url";

describe("writeOrdersSearch", () => {
  it("omits defaults so the workspace URL stays bare", () => {
    expect(writeOrdersSearch({ q: "  ", page: 1 })).toBe("");
  });

  it("writes trimmed search, filters, and page > 1", () => {
    expect(
      writeOrdersSearch({
        q: " acme ",
        status: "pending",
        from: "2026-09-01",
        to: "2026-09-16",
        page: 2,
      })
    ).toBe("q=acme&status=pending&from=2026-09-01&to=2026-09-16&page=2");
  });
});

describe("readOrdersUrl", () => {
  it("reads a populated query string", () => {
    expect(
      readOrdersUrl(
        new URLSearchParams("q=acme&status=pending&page=2")
      )
    ).toEqual({
      q: "acme",
      status: "pending",
      page: 2,
    });
  });

  it("falls back when status is invalid", () => {
    expect(readOrdersUrl(new URLSearchParams("status=shipped"))).toEqual({
      q: "",
      page: 1,
    });
  });
});

describe("hasOrdersFilters", () => {
  it("is false when only q is blank", () => {
    expect(hasOrdersFilters({ q: "" })).toBe(false);
    expect(hasOrdersFilters({ q: "acme" })).toBe(true);
  });
});
