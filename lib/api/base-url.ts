const LOCAL_DEV_ORIGIN = "http://localhost:3000";

function stripTrailingSlash(value: string): string {
  return value.replace(/\/$/, "");
}

/**
 * Origin prefix for `fetch` to this app's Route Handlers.
 *
 * Browser callers use a same-origin relative URL (`""`) so Client Components
 * (Orders + TanStack Query) can import `lib/api` without `next/headers`.
 * Server callers need an absolute URL: `NEXT_PUBLIC_APP_URL`, then
 * `https://$VERCEL_URL`, then local dev. Do not hardcode a production host.
 *
 * @returns Origin without a trailing slash, or `""` in the browser.
 */
export function getApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    return "";
  }

  const explicit = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (explicit) {
    return stripTrailingSlash(explicit);
  }

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    if (vercel.startsWith("http://") || vercel.startsWith("https://")) {
      return stripTrailingSlash(vercel);
    }
    return `https://${vercel}`;
  }

  return LOCAL_DEV_ORIGIN;
}
