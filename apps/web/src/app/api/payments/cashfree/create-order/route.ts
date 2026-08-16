/**
 * POST /api/payments/cashfree/create-order — Create a Cashfree payment order (STUB)
 *
 * TODO(backend): Replace this stub with a real Cashfree integration:
 *
 *  1. INSTALL the Cashfree SDK:
 *       npm install cashfree-pg
 *
 *  2. INITIALISE the SDK:
 *       import { Cashfree } from "cashfree-pg";
 *       Cashfree.XClientId     = process.env.CASHFREE_APP_ID!;
 *       Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY!;
 *       Cashfree.XEnvironment  = Cashfree.Environment.PRODUCTION; // or SANDBOX
 *
 *  3. CREATE an order:
 *       const orderRequest = {
 *         order_id:       `SEMY-${Date.now()}`,
 *         order_amount:   totalAmount,
 *         order_currency: "INR",
 *         customer_details: {
 *           customer_id:    `CUST-${phone}`,
 *           customer_name:  customerName,
 *           customer_email: email,
 *           customer_phone: phone,
 *         },
 *         order_meta: {
 *           return_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/cashfree/verify?order_id={order_id}`,
 *           notify_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/cashfree/webhook`,
 *         },
 *       };
 *       const response = await Cashfree.PGCreateOrder("2023-08-01", orderRequest);
 *
 *  4. RETURN the payment_session_id to the frontend:
 *       return NextResponse.json({
 *         orderId:          response.data.order_id,
 *         paymentSessionId: response.data.payment_session_id,
 *         cfOrderId:        response.data.cf_order_id,
 *       });
 *
 *  5. ON THE FRONTEND — use Cashfree JS SDK to open the payment widget:
 *       const cashfree = await load({ mode: "production" }); // from @cashfreepayments/cashfree-js
 *       cashfree.checkout({ paymentSessionId });
 */

import { NextRequest, NextResponse } from "next/server";

interface CreateOrderPayload {
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    color: string;
  }>;
  customerName: string;
  email: string;
  phone: string;
  city: string;
  totalAmount: number;
}

export async function POST(req: NextRequest) {
  const payload: CreateOrderPayload = await req.json();

  console.log("[cashfree/create-order] Received order payload:", payload);

  // ── STUB: simulate order creation ──────────────────────────────────────
  // TODO(backend): replace with real Cashfree PGCreateOrder call
  await new Promise((resolve) => setTimeout(resolve, 800));

  const orderId = "SEMY-" + Date.now();
  const cfOrderId = "CF-" + Math.floor(100000 + Math.random() * 900000);
  const paymentSessionId = "session_" + Math.random().toString(36).slice(2, 15);

  return NextResponse.json({
    success: true,
    orderId,
    cfOrderId,
    paymentSessionId,
    // TODO(backend): the frontend will use paymentSessionId with Cashfree JS SDK
    // to open the payment widget
  });
}
