import { NextRequest, NextResponse } from "next/server";

const API_URL =
  process.env.API_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:8000";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const res = await fetch(`${API_URL}/invoices`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      order_id: body.orderId,
      name: body.name,
      address: body.address,
      district: body.district,
      pin: body.pin,
      state: body.state,
      gstin: body.gstin || null,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Failed to create invoice" }));
    return NextResponse.json(
      { success: false, error: err.detail ?? "Failed to create invoice" },
      { status: res.status }
    );
  }

  const invoice = await res.json();
  return NextResponse.json({ success: true, invoiceId: invoice.id, invoiceNumber: invoice.invoice_number });
}
