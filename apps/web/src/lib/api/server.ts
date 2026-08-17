// Server-only helper for calling the FastAPI backend from Next.js route
// handlers / server components. Centralized so the Vercel deployment
// protection bypass header (see below) only needs to be set in one place.

export const API_URL =
  process.env.API_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:8000";

// When API_URL falls back to VERCEL_URL, this server-to-server fetch goes
// back out through Vercel's edge (so the /orders, /invoices, etc. rewrites
// in vercel.json can route it to the Python function). If "Vercel
// Authentication" / Deployment Protection is enabled on the project, the
// edge intercepts that request and returns 401 before it ever reaches
// FastAPI — even though FastAPI itself has no auth on these routes.
//
// Enabling "Protection Bypass for Automation" in Vercel project settings
// (Settings → Deployment Protection) injects VERCEL_AUTOMATION_BYPASS_SECRET
// as an env var; forwarding it as this header lets our own server bypass
// the protection. It's a no-op if protection is off or the var isn't set.
const bypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;

export function internalFetch(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  if (bypassSecret) {
    headers.set("x-vercel-protection-bypass", bypassSecret);
    headers.set("x-vercel-set-bypass-cookie", "true");
  }
  return fetch(`${API_URL}${path}`, { ...init, headers });
}
