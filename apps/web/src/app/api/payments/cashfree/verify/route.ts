/**
 * GET /api/payments/cashfree/verify?order_id=... — Verify Cashfree payment status (STUB)
 *
 * TODO(backend): Replace this stub with a real Cashfree verification:
 *
 *  1. FETCH order status from Cashfree:
 *       import { Cashfree } from "cashfree-pg";
 *       const response = await Cashfree.PGOrderFetchPayments("2023-08-01", orderId);
 *
 *  2. CHECK payment status:
 *       const payments = response.data;
 *       const successfulPayment = payments.find(p => p.payment_status === "SUCCESS");
 *
 *  3. UPDATE order in your database:
 *       - Mark order as "paid" / "confirmed"
 *       - Store cf_payment_id, payment_method, etc.
 *
 *  4. RETURN verification result:
 *       return NextResponse.json({
 *         verified: !!successfulPayment,
 *         status: successfulPayment ? "SUCCESS" : "PENDING",
 *         transactionId: successfulPayment?.cf_payment_id,
 *         paymentMethod: successfulPayment?.payment_method,
 *       });
 *
 *  5. On the frontend, redirect user based on verification result:
 *       - SUCCESS → order confirmation page
 *       - FAILED  → retry payment page
 */

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const orderId = req.nextUrl.searchParams.get("order_id");

  if (!orderId) {
    return NextResponse.json(
      { verified: false, error: "Missing order_id parameter" },
      { status: 400 }
    );
  }

  console.log("[cashfree/verify] Verifying order:", orderId);

  // ── STUB: simulate verification ────────────────────────────────────────
  // TODO(backend): replace with real Cashfree PGOrderFetchPayments call
  await new Promise((resolve) => setTimeout(resolve, 500));

  const transactionId = "CF-TXN-" + Math.floor(100000 + Math.random() * 900000);

  return NextResponse.json({
    verified: true,
    status: "SUCCESS",
    orderId,
    transactionId,
    paymentMethod: "UPI", // stub
    amount: 0, // TODO: return actual amount
  });
}
