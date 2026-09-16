import { afterEach, describe, expect, it, vi } from "vitest";
import { getAnalytics } from "@/lib/api/analytics";
import { getActivities } from "@/lib/api/activities";
import { getOrder, getOrders } from "@/lib/api/orders";
import { getApiBaseUrl } from "@/lib/api/base-url";
import {
  InternalError,
  NotFoundError,
  ValidationError,
} from "@/lib/errors";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("getApiBaseUrl", () => {
  it("defaults to local development", () => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "");
    vi.stubEnv("VERCEL_URL", "");
    expect(getApiBaseUrl()).toBe("http://localhost:3000");
  });

  it("prefers NEXT_PUBLIC_APP_URL", () => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://example.test/");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "prod.example.test");
    vi.stubEnv("VERCEL_URL", "ignored.vercel.app");
    expect(getApiBaseUrl()).toBe("https://example.test");
  });

  it("prefers the Vercel production host over VERCEL_URL", () => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "dash.example.test");
    vi.stubEnv("VERCEL_URL", "ignored.vercel.app");
    expect(getApiBaseUrl()).toBe("https://dash.example.test");
  });

  it("uses https://$VERCEL_URL when no public or production URL is set", () => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "");
    vi.stubEnv("VERCEL_URL", "app.vercel.app");
    expect(getApiBaseUrl()).toBe("https://app.vercel.app");
  });
});

describe("lib/api client errors", () => {
  it("throws NotFoundError on a 404 envelope", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        jsonResponse(
          {
            error: {
              code: "NOT_FOUND",
              message: "Order ord_x was not found.",
            },
          },
          404
        )
      )
    );

    await expect(getOrder("ord_x")).rejects.toBeInstanceOf(NotFoundError);
  });

  it("throws ValidationError on a 400 envelope", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        jsonResponse(
          {
            error: {
              code: "VALIDATION_ERROR",
              message: "Invalid status filter.",
              details: [{ field: "status", issue: "Invalid option" }],
            },
          },
          400
        )
      )
    );

    await expect(getOrders({ status: "pending" })).rejects.toBeInstanceOf(
      ValidationError
    );
  });

  it("throws InternalError when the success body fails Zod", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse({ nope: true })));
    await expect(getAnalytics()).rejects.toBeInstanceOf(InternalError);
  });

  it("unwraps activities data", async () => {
    const row = {
      id: "act_1",
      type: "order.created",
      message: "Order created.",
      createdAt: "2026-09-16T12:00:00.000Z",
    };
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse({ data: [row] })));
    await expect(getActivities(1)).resolves.toEqual([row]);
  });
});
