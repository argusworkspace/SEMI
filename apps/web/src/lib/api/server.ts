// Server-only helper for calling the FastAPI backend from Next.js route
// handlers / server components. Centralized so the Vercel deployment
// protection logic (see below) only needs to live in one place.

export const API_URL =
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:8000";

const bypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;

// On Vercel, vercel.json rewrites /orders, /invoices, etc. to the Python
// function — but only when the request comes in on a host that isn't
// behind Deployment Protection. VERCEL_URL points at the deployment-specific
// URL, which Standard Protection blocks (401, or an SSO redirect loop for a
// plain fetch that can't hold a browser session). The host our own request
// just arrived on has, by definition, already cleared protection — so reuse
// it for the internal call instead of VERCEL_URL. Pass it as `requestOrigin`
// (e.g. `req.nextUrl.origin`, or `` `${proto}://${host}` `` built from
// `headers()` in a Server Component). Falls back to API_URL for local dev
// where there's no Vercel host in play.
export function internalFetch(
  path: string,
  init: RequestInit = {},
  requestOrigin?: string
) {
  const base = process.env.VERCEL_URL && requestOrigin ? requestOrigin : API_URL;
  const headers = new Headers(init.headers);
  if (bypassSecret) {
    headers.set("x-vercel-protection-bypass", bypassSecret);
    headers.set("x-vercel-set-bypass-cookie", "true");
  }
  return fetch(`${base}${path}`, { ...init, headers });
}
