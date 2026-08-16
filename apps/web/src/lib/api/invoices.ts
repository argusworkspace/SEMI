/**
 * invoices.ts — Client-side Tax Invoice API wrapper
 *
 * TODO(backend): Once invoice generation is implemented server-side,
 * the response will include an `invoiceUrl` for PDF download.
 */

// ── Types ──────────────────────────────────────────────────────────────────────

export interface InvoiceItem {
  productId: string;
  productName: string;
  hsnCode?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface TaxInvoicePayload {
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress?: string;
  customerState?: string;
  items: InvoiceItem[];
}

export interface TaxInvoiceResponse {
  success: boolean;
  invoiceId?: string;
  invoiceNumber?: string;
  invoiceDate?: string;
  invoiceUrl?: string | null;
  invoiceData?: {
    seller: {
      name: string;
      gstin: string;
      pan: string;
      address: string;
      stateCode: string;
    };
    buyer: {
      name: string;
      phone: string;
      email: string | null;
      address: string | null;
      state: string | null;
    };
    items: Array<{
      description: string;
      hsnCode: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
      cgst: number;
      sgst: number;
      igst: number;
    }>;
    taxSummary: {
      subtotal: number;
      cgst: number;
      cgstRate: string;
      sgst: number;
      sgstRate: string;
      igst: number;
      igstRate: string;
      totalTax: number;
      grandTotal: number;
    };
    orderId: string;
    paymentStatus: string;
  };
  error?: string;
}

// ── API call ───────────────────────────────────────────────────────────────────

/**
 * Request a GST Tax Invoice for a completed order.
 *
 * The response includes full invoice data (seller, buyer, line items with HSN codes,
 * CGST/SGST/IGST breakdown) and optionally a `invoiceUrl` for PDF download.
 */
export async function generateTaxInvoice(
  payload: TaxInvoicePayload
): Promise<TaxInvoiceResponse> {
  const res = await fetch("/api/invoices/tax-invoice", {
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

  return res.json() as Promise<TaxInvoiceResponse>;
}
