import { NextRequest, NextResponse } from "next/server";
import { internalFetch } from "@/lib/api/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const res = await internalFetch(
    `/invoices`,
    {
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
    },
    req.nextUrl.origin
  );

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
