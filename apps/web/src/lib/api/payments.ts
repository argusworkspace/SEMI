// ── Types ──────────────────────────────────────────────────────────────────────

export interface CreateOrderPayload {
  idempotencyKey: string;
  productId: string;
  productName: string;
  color: string | null;
  unitPrice: number;
  customerName: string;
  email: string;
  phone: string;
  city: string;
}

export interface CreateOrderResponse {
  success: boolean;
  orderId?: string;
  orderNumber?: string;
  error?: string;
}

export interface OcrCheck {
  amount_found: boolean;
  success_keyword_found: boolean;
  upi_ref: string | null;
  validated: boolean;
  ocr_available: boolean;
  message: string;
}

export interface ProofResponse {
  success: boolean;
  order_id?: string;
  order_number?: string;
  payment_id?: string;
  ocr?: OcrCheck;
  error?: string;
}

// ── API calls ─────────────────────────────────────────────────────────────────

export async function createOrder(
  payload: CreateOrderPayload
): Promise<CreateOrderResponse> {
  const res = await fetch("/api/payments/advance", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    return { success: false, error: `Server error ${res.status}` };
  }
  return res.json();
}

export async function submitPaymentProof(
  orderId: string,
  file: File
): Promise<ProofResponse> {
  const form = new FormData();
  form.append("orderId", orderId);
  form.append("file", file);

  const res = await fetch("/api/payments/proof", {
    method: "POST",
    body: form,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: `Error ${res.status}` }));
    return { success: false, error: err.error ?? "Upload failed" };
  }
  return res.json();
}

