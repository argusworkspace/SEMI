/**
 * POST /api/invoices/tax-invoice — Generate a GST Tax Invoice (STUB)
 *
 * TODO(backend): Replace this stub with real invoice generation:
 *
 *  1. VALIDATE the request:
 *       - orderId must correspond to a confirmed/paid order
 *       - Prevent duplicate invoice generation (check if invoice already exists)
 *
 *  2. FETCH order details from your database:
 *       - Customer name, address, phone, email
 *       - Product details, quantities, unit prices
 *       - Payment method, transaction ID
 *
 *  3. CALCULATE GST:
 *       - HSN Code for electric bikes/cycles: 8711 (electric motorcycles) or 8712 (electric bicycles)
 *       - GST Rate: 5% for e-cycles under ₹25,000; 12% for e-bikes; 18% for accessories
 *       - If INTRA-STATE (seller & buyer in same state):
 *           CGST = totalAmount × (rate / 2)
 *           SGST = totalAmount × (rate / 2)
 *       - If INTER-STATE (different states):
 *           IGST = totalAmount × rate
 *       - Seller GSTIN: your company's GSTIN (e.g., "33XXXXX1234X1Z5")
 *       - Seller PAN: your company's PAN
 *
 *  4. GENERATE invoice number:
 *       - Format: SEMY/INV/2026-27/00001 (financial year + sequential)
 *       - Must be unique and sequential per GST rules
 *
 *  5. GENERATE the invoice document:
 *       - Use a PDF library like `@react-pdf/renderer` or `pdfkit`
 *       - Include: seller details, buyer details, HSN codes, tax breakdown,
 *         item details, total, payment status, terms & conditions
 *       - Save to cloud storage (S3/GCS) and generate a download URL
 *
 *  6. STORE invoice metadata in your database:
 *       { invoiceId, orderId, invoiceNumber, invoiceDate, invoiceUrl,
 *         taxableAmount, cgst, sgst, igst, totalAmount }
 *
 *  7. RETURN the invoice data:
 *       return NextResponse.json({
 *         invoiceId, invoiceNumber, invoiceUrl, invoiceData: { ... }
 *       });
 */

import { NextRequest, NextResponse } from "next/server";

interface TaxInvoicePayload {
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress?: string;
  customerState?: string;  // For IGST vs CGST+SGST determination
  items: Array<{
    productId: string;
    productName: string;
    hsnCode?: string;      // Will be assigned server-side if not provided
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
}

export async function POST(req: NextRequest) {
  const payload: TaxInvoicePayload = await req.json();

  console.log("[tax-invoice] Received invoice request:", {
    orderId: payload.orderId,
    customerName: payload.customerName,
    itemCount: payload.items?.length ?? 0,
  });

  // ── STUB: simulate invoice generation ──────────────────────────────────
  // TODO(backend): replace with real invoice generation logic
  await new Promise((resolve) => setTimeout(resolve, 600));

  const invoiceNumber =
    `SEMY/INV/2026-27/${String(Math.floor(1 + Math.random() * 9999)).padStart(5, "0")}`;
  const invoiceId = "INV-" + Date.now();

  // Stub tax calculation (18% GST — adjust based on product category)
  const subtotal = payload.items?.reduce((sum, i) => sum + i.totalPrice, 0) ?? 0;
  const gstRate = 0.18;
  const cgstRate = gstRate / 2;
  const sgstRate = gstRate / 2;
  const cgst = Math.round(subtotal * cgstRate);
  const sgst = Math.round(subtotal * sgstRate);
  const totalAmount = subtotal + cgst + sgst;

  return NextResponse.json({
    success: true,
    invoiceId,
    invoiceNumber,
    invoiceDate: new Date().toISOString(),
    invoiceUrl: null, // TODO: generate PDF and return URL
    invoiceData: {
      // Seller details (TODO: replace with real company info)
      seller: {
        name: "SEMY Electric Vehicles Pvt. Ltd.",
        gstin: "33XXXXX1234X1Z5",    // TODO: replace with actual GSTIN
        pan: "XXXXX1234X",            // TODO: replace with actual PAN
        address: "Chennai, Tamil Nadu, India",
        stateCode: "33",              // Tamil Nadu
      },
      // Buyer details
      buyer: {
        name: payload.customerName,
        phone: payload.customerPhone,
        email: payload.customerEmail ?? null,
        address: payload.customerAddress ?? null,
        state: payload.customerState ?? null,
      },
      // Line items with HSN codes
      items: (payload.items ?? []).map((item) => ({
        description: item.productName,
        hsnCode: item.hsnCode ?? "8712",  // 8712 = electric bicycles
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        cgst: Math.round(item.totalPrice * cgstRate),
        sgst: Math.round(item.totalPrice * sgstRate),
        igst: 0, // TODO: use IGST for inter-state
      })),
      // Tax summary
      taxSummary: {
        subtotal,
        cgst,
        cgstRate: `${cgstRate * 100}%`,
        sgst,
        sgstRate: `${sgstRate * 100}%`,
        igst: 0,
        igstRate: "0%",
        totalTax: cgst + sgst,
        grandTotal: totalAmount,
      },
      // Order reference
      orderId: payload.orderId,
      paymentStatus: "PAID", // TODO: verify from payment records
    },
  });
}
