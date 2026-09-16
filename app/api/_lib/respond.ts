import { toErrorResponse } from "@/lib/errors";

/**
 * JSON error `Response` using the API envelope.
 */
export function jsonError(error: unknown): Response {
  const { status, body } = toErrorResponse(error);
  return Response.json(body, { status });
}

/**
 * Run a GET handler and map thrown `AppError`s (or anything else) to JSON.
 *
 * @param run - Domain call that returns the success body.
 */
export async function handleGet(
  run: () => unknown | Promise<unknown>
): Promise<Response> {
  try {
    return Response.json(await run());
  } catch (error) {
    return jsonError(error);
  }
}
