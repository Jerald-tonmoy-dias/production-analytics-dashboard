const LOCAL_DEV_ORIGIN = "http://localhost:3000";

function stripTrailingSlash(value: string): string {
  return value.replace(/\/$/, "");
}

/**
 * Turn a host or origin env value into an origin without a trailing slash.
 *
 * `VERCEL_URL` and `VERCEL_PROJECT_PRODUCTION_URL` are hostnames. An explicit
 * `NEXT_PUBLIC_APP_URL` may already include the protocol.
 *
 * @param value - Host (`example.vercel.app`) or origin (`https://example.test`).
 */
function originFromHost(value: string): string {
  const trimmed = stripTrailingSlash(value.trim());
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

/**
 * Origin prefix for `fetch` to this app's Route Handlers.
 *
 * Browser callers use a same-origin relative URL (`""`) so Client Components
 * (Orders + TanStack Query) can import `lib/api` without `next/headers`.
 * Server callers need an absolute URL: `NEXT_PUBLIC_APP_URL`, then the
 * Vercel production host, then `https://$VERCEL_URL`, then local dev.
 * Prefer `VERCEL_PROJECT_PRODUCTION_URL` over `VERCEL_URL` because the
 * latter is the per-deployment host and is often Deployment Protected.
 * Do not hardcode a production host.
 *
 * @returns Origin without a trailing slash, or `""` in the browser.
 */
export function getApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    return "";
  }

  const explicit = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (explicit) {
    return originFromHost(explicit);
  }

  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (production) {
    return originFromHost(production);
  }

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    return originFromHost(vercel);
  }

  return LOCAL_DEV_ORIGIN;
}
