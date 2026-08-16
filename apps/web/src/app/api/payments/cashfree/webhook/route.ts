/**
 * POST /api/payments/cashfree/webhook — Cashfree webhook handler (STUB)
 *
 * Cashfree sends POST requests to this endpoint when payment events occur.
 * The webhook payload contains order details and payment status.
 *
 * TODO(backend): Implement the real webhook handler:
 *
 *  1. VERIFY the webhook signature:
 *       import { Cashfree } from "cashfree-pg";
 *       const timestamp = req.headers.get("x-webhook-timestamp");
 *       const signature = req.headers.get("x-webhook-signature");
 *       const rawBody   = await req.text();
 *       const isValid   = Cashfree.PGVerifyWebhookSignature(
 *         signature!, rawBody, timestamp!
 *       );
 *       if (!isValid) return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
 *
 *  2. PARSE the webhook payload:
 *       const data = JSON.parse(rawBody);
 *       const eventType    = data.type;           // "PAYMENT_SUCCESS_WEBHOOK", etc.
 *       const orderId      = data.data.order.order_id;
 *       const paymentId    = data.data.payment.cf_payment_id;
 *       const paymentState = data.data.payment.payment_status; // "SUCCESS", "FAILED", etc.
 *
 *  3. UPDATE your database based on payment status:
 *       - "SUCCESS" → Mark order as confirmed, trigger invoice generation
 *       - "FAILED"  → Mark order as failed
 *       - "USER_DROPPED" → Mark as abandoned
 *
 *  4. TRIGGER downstream actions:
 *       - Send confirmation SMS/email to customer
 *       - Generate tax invoice (call /api/invoices/tax-invoice)
 *       - Update inventory / stock counts
 *       - Notify sales team
 *
 *  5. RETURN 200 OK to acknowledge receipt:
 *       return NextResponse.json({ received: true });
 *
 *  IMPORTANT: Always return 200 even if processing fails — otherwise Cashfree
 *  will retry the webhook, potentially causing duplicate processing.
 *  Use idempotency keys (order_id + payment_id) to prevent duplicates.
 */

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const payload = await req.json();

  console.log("[cashfree/webhook] Received webhook event:", {
    type: payload.type ?? "unknown",
    orderId: payload.data?.order?.order_id ?? "unknown",
    timestamp: new Date().toISOString(),
  });

  // ── STUB: acknowledge webhook ──────────────────────────────────────────
  // TODO(backend): implement signature verification and order status updates
  // See the TODO comments above for the full implementation guide.

  return NextResponse.json({
    received: true,
    message: "Webhook acknowledged (stub — no processing performed)",
  });
}
