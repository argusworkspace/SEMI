/**
 * cashfree.ts — Client-side Cashfree payment API wrapper
 *
 * TODO(backend): Once Cashfree is integrated, install the frontend SDK:
 *   npm install @cashfreepayments/cashfree-js
 *
 * Then use it to open the payment widget:
 *   import { load } from "@cashfreepayments/cashfree-js";
 *   const cashfree = await load({ mode: "production" }); // or "sandbox"
 *   cashfree.checkout({ paymentSessionId });
 */

// ── Types ──────────────────────────────────────────────────────────────────────

export interface CashfreeOrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  color: string;
}

export interface CreateOrderPayload {
  items: CashfreeOrderItem[];
  customerName: string;
  email: string;
  phone: string;
  city: string;
  totalAmount: number;
}

export interface CreateOrderResponse {
  success: boolean;
  orderId?: string;
  cfOrderId?: string;
  paymentSessionId?: string;
  error?: string;
}

export interface VerifyPaymentResponse {
  verified: boolean;
  status: string;
  orderId?: string;
  transactionId?: string;
  paymentMethod?: string;
  amount?: number;
  error?: string;
}

// ── API calls ──────────────────────────────────────────────────────────────────

/**
 * Create a Cashfree payment order.
 *
 * After receiving the `paymentSessionId`, use the Cashfree JS SDK
 * to open the payment widget on the frontend.
 */
export async function createCashfreeOrder(
  payload: CreateOrderPayload
): Promise<CreateOrderResponse> {
  const res = await fetch("/api/payments/cashfree/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    return {
      success: false,
      error: `Server error ${res.status}: ${res.statusText}`,
    };
  }

  return res.json() as Promise<CreateOrderResponse>;
}

/**
 * Verify a Cashfree payment after the user returns from payment.
 */
export async function verifyCashfreePayment(
  orderId: string
): Promise<VerifyPaymentResponse> {
  const res = await fetch(
    `/api/payments/cashfree/verify?order_id=${encodeURIComponent(orderId)}`
  );

  if (!res.ok) {
    return {
      verified: false,
      status: "ERROR",
      error: `Server error ${res.status}: ${res.statusText}`,
    };
  }

  return res.json() as Promise<VerifyPaymentResponse>;
}
