import { z } from "zod";
import { getApiBaseUrl } from "@/lib/api/base-url";
import {
  InternalError,
  NotFoundError,
  ValidationError,
} from "@/lib/errors";
import { errorEnvelopeSchema } from "@/lib/schemas/error";

type CachedRequestInit = RequestInit & {
  next?: { tags: string[] };
};

export type ApiGetOptions = {
  searchParams?: URLSearchParams;
  tags?: string[];
};

function resolveUrl(path: string, searchParams?: URLSearchParams): string {
  const query = searchParams?.toString();
  const suffix = query ? `${path}?${query}` : path;
  const base = getApiBaseUrl();
  return base ? `${base}${suffix}` : suffix;
}

async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    throw new InternalError("API returned a non-JSON response.");
  }
}

/**
 * Map an error envelope (or a malformed body) to a typed `AppError`.
 *
 * @throws {ValidationError} When `code` is `VALIDATION_ERROR`.
 * @throws {NotFoundError} When `code` is `NOT_FOUND`.
 * @throws {InternalError} When `code` is `INTERNAL_ERROR` or the body is unexpected.
 */
function throwApiError(payload: unknown): never {
  const parsed = errorEnvelopeSchema.safeParse(payload);
  if (!parsed.success) {
    throw new InternalError("API returned an unexpected error payload.");
  }

  const { code, message, details } = parsed.data.error;
  if (code === "VALIDATION_ERROR") {
    throw new ValidationError(message, details);
  }
  if (code === "NOT_FOUND") {
    throw new NotFoundError(message);
  }
  throw new InternalError(message);
}

/**
 * GET JSON from a Route Handler and parse it with Zod.
 *
 * On the server, fetches are `cache: "no-store"` so a protected-URL or
 * build-time miss cannot stick in the Data Cache. Dashboard and order
 * details skip HTTP (`lib/api/rsc`). The browser ignores `next`.
 *
 * @param path - Absolute-from-root path (`/api/analytics`).
 * @param schema - Success-body schema.
 * @param options - Query string. `tags` is accepted for call-site compatibility
 *   and ignored (server fetches are `no-store`).
 * @returns Parsed success body.
 * @throws {ValidationError} On `400 VALIDATION_ERROR`.
 * @throws {NotFoundError} On `404 NOT_FOUND`.
 * @throws {InternalError} On network failure, non-JSON, envelope `500`, or a body that fails `schema`.
 */
export async function apiGet<T>(
  path: string,
  schema: z.ZodType<T>,
  options: ApiGetOptions = {}
): Promise<T> {
  const url = resolveUrl(path, options.searchParams);
  const headers: Record<string, string> = { Accept: "application/json" };
  const bypass = process.env.VERCEL_AUTOMATION_BYPASS_SECRET?.trim();
  if (typeof window === "undefined" && bypass) {
    headers["x-vercel-protection-bypass"] = bypass;
  }

  const init: CachedRequestInit = {
    method: "GET",
    headers,
  };

  if (typeof window === "undefined") {
    // Do not `force-cache` self-fetches: a build-time or protected-URL miss
    // would stick. Dashboard/details use `lib/api/rsc` and skip HTTP entirely.
    // `cache: "no-store"` must not be paired with `next.tags` (Next ignores both).
    init.cache = "no-store";
  }

  let response: Response;
  try {
    response = await fetch(url, init);
  } catch {
    throw new InternalError("Failed to reach the API.");
  }

  const payload = await readJson(response);
  if (!response.ok) {
    throwApiError(payload);
  }

  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    throw new InternalError("API returned an unexpected payload.");
  }

  return parsed.data;
}
