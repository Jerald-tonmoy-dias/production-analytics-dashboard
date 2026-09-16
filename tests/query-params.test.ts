import { describe, expect, it } from "vitest";
import { ValidationError } from "@/lib/errors";
import {
  parseActivitiesQuery,
  parseOrdersQuery,
} from "@/lib/schemas/query";

describe("parseOrdersQuery", () => {
  it("applies defaults for an empty query string", () => {
    expect(parseOrdersQuery(new URLSearchParams())).toEqual({
      q: "",
      page: 1,
      pageSize: 10,
    });
  });

  it("coerces page and pageSize from integer strings", () => {
    const query = parseOrdersQuery(
      new URLSearchParams("page=2&pageSize=25&q=acme&status=pending")
    );
    expect(query).toEqual({
      q: "acme",
      status: "pending",
      page: 2,
      pageSize: 25,
    });
  });

  it("treats a blank status as omitted", () => {
    const query = parseOrdersQuery(new URLSearchParams("status="));
    expect(query.status).toBeUndefined();
  });

  it("rejects an invalid status", () => {
    try {
      parseOrdersQuery(new URLSearchParams("status=shipped"));
      expect.unreachable();
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      const validation = error as ValidationError;
      expect(validation.message).toBe("Invalid status filter.");
      expect(validation.details?.[0]?.field).toBe("status");
    }
  });

  it("rejects from after to", () => {
    try {
      parseOrdersQuery(new URLSearchParams("from=2026-09-10&to=2026-09-01"));
      expect.unreachable();
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect((error as ValidationError).message).toBe(
        "from must be on or before to"
      );
    }
  });

  it("rejects a non-integer page", () => {
    expect(() => parseOrdersQuery(new URLSearchParams("page=abc"))).toThrow(
      ValidationError
    );
  });
});

describe("parseActivitiesQuery", () => {
  it("defaults limit to 8", () => {
    expect(parseActivitiesQuery(new URLSearchParams())).toEqual({ limit: 8 });
  });

  it("rejects limit above 50", () => {
    expect(() =>
      parseActivitiesQuery(new URLSearchParams("limit=51"))
    ).toThrow(ValidationError);
  });
});
