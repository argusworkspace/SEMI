import { NextRequest, NextResponse } from "next/server";

const API_URL =
  process.env.API_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:8000";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const res = await fetch(`${API_URL}/invoices/${id}`, { cache: "no-store" });

  if (!res.ok) {
    return NextResponse.json({ error: "Invoice not found" }, { status: res.status });
  }

  return NextResponse.json(await res.json());
}
