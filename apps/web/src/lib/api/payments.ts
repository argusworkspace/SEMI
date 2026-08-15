/**
 * payments.ts — client-side payment API wrapper
 *
 * TODO(backend): wire to real payment gateway (Razorpay recommended for India/UPI support)
 *
 * Expected real endpoint : POST /api/payments/advance
 * Request body           : { productId, productName, customerName, phone, color, city, advanceAmount }
 * Expected response      : { success: boolean, transactionId?: string, paymentUrl?: string, error?: string }
 */

export interface AdvancePaymentPayload {
  productId: string;
  productName: string;
  customerName: string;
  phone: string;
  color: string;
  city: string;
  advanceAmount: number;
}

export interface AdvancePaymentResponse {
  success: boolean;
  transactionId?: string;
  paymentUrl?: string;
  error?: string;
}

export async function initiateAdvancePayment(
  payload: AdvancePaymentPayload
): Promise<AdvancePaymentResponse> {
  const res = await fetch("/api/payments/advance", {
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

  return res.json() as Promise<AdvancePaymentResponse>;
}
