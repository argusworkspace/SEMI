import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { internalFetch } from "@/lib/api/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const {
    idempotencyKey,
    productId,
    productName,
    color,
    unitPrice,
    customerName,
    email,
    phone,
    city,
  } = body;

  const res = await internalFetch(`/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      idempotency_key: idempotencyKey ?? randomUUID(),
      product_id: productId,
      product_name: productName,
      color: color ?? null,
      unit_price: unitPrice,
      customer_name: customerName,
      customer_email: email ?? `${phone}@semy.in`,
      customer_phone: phone,
      delivery_pincode: null,
      notes: city ? `City: ${city}` : null,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Gateway error" }));
    return NextResponse.json(
      { success: false, error: err.detail ?? "Failed to create order" },
      { status: res.status }
    );
  }

  const order = await res.json();
  return NextResponse.json({
    success: true,
    orderId: order.id,
    orderNumber: order.order_number,
  });
}
