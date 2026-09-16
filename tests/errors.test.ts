import { describe, expect, it } from "vitest";
import {
  InternalError,
  NotFoundError,
  ValidationError,
  toErrorResponse,
} from "@/lib/errors";

describe("toErrorResponse", () => {
  it("maps ValidationError to 400 with details", () => {
    const mapped = toErrorResponse(
      new ValidationError("Invalid status filter.", [
        { field: "status", issue: "Invalid option" },
      ])
    );
    expect(mapped.status).toBe(400);
    expect(mapped.body).toEqual({
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid status filter.",
        details: [{ field: "status", issue: "Invalid option" }],
      },
    });
  });

  it("maps NotFoundError to 404 without details", () => {
    const mapped = toErrorResponse(
      new NotFoundError("Order ord_x was not found.")
    );
    expect(mapped.status).toBe(404);
    expect(mapped.body).toEqual({
      error: {
        code: "NOT_FOUND",
        message: "Order ord_x was not found.",
      },
    });
  });

  it("maps unknown throws to a generic 500", () => {
    const mapped = toErrorResponse(new Error("secret stack"));
    expect(mapped.status).toBe(500);
    expect(mapped.body).toEqual({
      error: {
        code: "INTERNAL_ERROR",
        message: "Unexpected error.",
      },
    });
  });

  it("maps InternalError to 500 with the domain message", () => {
    const mapped = toErrorResponse(new InternalError("Corrupt orders dataset."));
    expect(mapped.status).toBe(500);
    expect(mapped.body.error.message).toBe("Corrupt orders dataset.");
  });
});
