import { NextRequest, NextResponse } from "next/server";
import { internalFetch } from "@/lib/api/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const res = await internalFetch(
    `/invoices/${id}`,
    { cache: "no-store" },
    req.nextUrl.origin
  );

  if (!res.ok) {
    return NextResponse.json({ error: "Invoice not found" }, { status: res.status });
  }

  return NextResponse.json(await res.json());
}
