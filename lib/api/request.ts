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
 * On the server, optional Next cache `tags` are attached so duplicate RSC
 * fetches collapse and a future mutation could `revalidateTag`. The browser
 * ignores `next`.
 *
 * @param path - Absolute-from-root path (`/api/analytics`).
 * @param schema - Success-body schema.
 * @param options - Query string and RSC cache tags.
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
  const init: CachedRequestInit = {
    method: "GET",
    headers: { Accept: "application/json" },
  };

  if (typeof window === "undefined" && options.tags?.length) {
    init.next = { tags: options.tags };
    init.cache = "force-cache";
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
