import { NextResponse } from "next/server";

const API_URL =
  process.env.API_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:8000";

export async function GET() {
  const res = await fetch(`${API_URL}/orders/config`, { next: { revalidate: 300 } });
  if (!res.ok) {
    return NextResponse.json(
      { error: "Could not fetch payment config" },
      { status: res.status }
    );
  }
  return NextResponse.json(await res.json());
}
