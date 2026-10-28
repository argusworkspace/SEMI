/**
 * app/api/payments/advance/route.ts — Next.js Route Handler (stub)
 *
 * TODO(backend): A real implementation of this route must:
 *
 *  1. VALIDATE payload server-side (zod or manual checks):
 *       - productId exists in the catalog
 *       - phone is a 10-digit Indian mobile number
 *       - advanceAmount matches the catalog value (never trust the client)
 *
 *  2. CREATE a Razorpay order:
 *       const razorpay = new Razorpay({ key_id, key_secret });
 *       const order = await razorpay.orders.create({
 *         amount: advanceAmount * 100,   // Razorpay uses paise
 *         currency: "INR",
 *         receipt: `SEMY-ADV-${Date.now()}`,
 *         notes: { productId, customerName, phone, city },
 *       });
 *
 *  3. PERSIST the booking in Supabase (or your DB of choice):
 *       await supabase.from("bookings").insert({
 *         product_id, customer_name, phone, color, city,
 *         advance_amount, razorpay_order_id: order.id,
 *         status: "pending",
 *       });
 *
 *  4. RETURN a real payment link for Razorpay Hosted Checkout:
 *       return NextResponse.json({
 *         success: true,
 *         transactionId: order.id,
 *         paymentUrl: `https://rzp.io/l/${order.id}`,
 *       });
 *
 *  5. HANDLE the Razorpay webhook at /api/payments/webhook to mark
 *     bookings as "confirmed" after successful payment capture.
 */

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const payload = await req.json();

  // Log the incoming booking so you can see it in the dev-server terminal
  console.log("[advance/route] Received booking payload:", payload);

  // Artificial 1-second delay to simulate network + gateway latency
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Mock success — generate a fake transaction ID
  const transactionId =
    "SEMY-ADV-" + Math.floor(100000 + Math.random() * 900000).toString();

  return NextResponse.json({
    success: true,
    transactionId,
    // paymentUrl would be a real Razorpay Hosted Checkout URL in production
    paymentUrl: null,
  });
}
