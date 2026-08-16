import { notFound } from "next/navigation";

interface TaxInvoice {
  id: string;
  invoice_number: string;
  created_at: string;
  status: string;
  buyer_name: string;
  buyer_address: string;
  buyer_district: string;
  buyer_pin: string;
  buyer_state: string;
  buyer_gstin: string | null;
  order_number: string;
  product_id: string;
  product_name: string;
  color: string | null;
  unit_price: string;
  advance_amount: string;
  balance_amount: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  upi_transaction_id: string | null;
  upi_to: string | null;
  upi_from: string | null;
  upi_amount: string | null;
  upi_date: string | null;
  upi_time: string | null;
  payment_status: string;
  seller_name: string;
  seller_upi_id: string | null;
}

async function fetchInvoice(id: string): Promise<TaxInvoice | null> {
  const base =
    process.env.API_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ??
    process.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:8000";

  const res = await fetch(`${base}/invoices/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

function fmt(n: string | number | null | undefined) {
  if (n == null) return "—";
  return "₹" + Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2 });
}

function Row({ label, value }: { label: string; value?: string | null }) {
  return (
    <tr>
      <td style={{ padding: "7px 12px", color: "#5B6470", fontSize: 13, width: "40%", borderBottom: "1px solid #F3F4F6" }}>{label}</td>
      <td style={{ padding: "7px 12px", color: "#1C1F22", fontSize: 13, fontWeight: 500, borderBottom: "1px solid #F3F4F6" }}>{value || "—"}</td>
    </tr>
  );
}

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const invoice = await fetchInvoice(id);
  if (!invoice) notFound();

  const invoiceDate = new Date(invoice.created_at).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB", padding: "32px 16px" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>

        {/* Status banner */}
        {invoice.status === "DRAFT" && (
          <div style={{ padding: "10px 16px", backgroundColor: "#FEF9C3", border: "1px solid #FDE047", borderRadius: 4, marginBottom: 20, fontSize: 13, color: "#854D0E" }}>
            Draft — invoice will be finalized after payment is verified by our team.
          </div>
        )}

        {/* Invoice card */}
        <div style={{ backgroundColor: "#fff", border: "1px solid #E5E7EB", borderRadius: 4, overflow: "hidden" }}>

          {/* Header */}
          <div style={{ backgroundColor: "#1C1F22", padding: "24px 28px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
            <div>
              <p style={{ color: "#C8F135", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 4px" }}>TAX INVOICE</p>
              <p style={{ color: "#F6F4EF", fontSize: 22, fontWeight: 700, margin: 0 }}>{invoice.seller_name}</p>
              {invoice.seller_upi_id && (
                <p style={{ color: "#9CA3AF", fontSize: 12, margin: "4px 0 0" }}>UPI: {invoice.seller_upi_id}</p>
              )}
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ color: "#9CA3AF", fontSize: 11, margin: "0 0 2px" }}>Invoice No.</p>
              <p style={{ color: "#C8F135", fontSize: 16, fontWeight: 700, margin: 0, fontFamily: "monospace" }}>{invoice.invoice_number}</p>
              <p style={{ color: "#9CA3AF", fontSize: 12, margin: "6px 0 0" }}>{invoiceDate}</p>
              <p style={{ color: "#9CA3AF", fontSize: 12, margin: "2px 0 0" }}>Order: {invoice.order_number}</p>
            </div>
          </div>

          <div style={{ padding: 28 }}>

            {/* Buyer + Seller grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 28 }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#5B6470", marginBottom: 8 }}>Bill To</p>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#1C1F22", margin: "0 0 4px" }}>{invoice.buyer_name}</p>
                <p style={{ fontSize: 13, color: "#374151", margin: "0 0 2px", lineHeight: "18px" }}>{invoice.buyer_address}</p>
                <p style={{ fontSize: 13, color: "#374151", margin: "0 0 2px" }}>{invoice.buyer_district}, {invoice.buyer_state} — {invoice.buyer_pin}</p>
                {invoice.buyer_gstin && (
                  <p style={{ fontSize: 12, color: "#5B6470", margin: "4px 0 0", fontFamily: "monospace" }}>GSTIN: {invoice.buyer_gstin}</p>
                )}
              </div>
              <div>
                <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#5B6470", marginBottom: 8 }}>Customer</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#1C1F22", margin: "0 0 4px" }}>{invoice.customer_name}</p>
                <p style={{ fontSize: 13, color: "#374151", margin: "0 0 2px" }}>{invoice.customer_phone}</p>
                <p style={{ fontSize: 13, color: "#374151", margin: 0 }}>{invoice.customer_email}</p>
              </div>
            </div>

            {/* Item table */}
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 20 }}>
              <thead>
                <tr style={{ backgroundColor: "#F3F4F6" }}>
                  <th style={{ padding: "10px 12px", textAlign: "left", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#5B6470" }}>Item</th>
                  <th style={{ padding: "10px 12px", textAlign: "right", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#5B6470" }}>On-road Price</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: "12px", borderBottom: "1px solid #F3F4F6" }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#1C1F22", margin: "0 0 2px" }}>{invoice.product_name}</p>
                    {invoice.color && <p style={{ fontSize: 12, color: "#5B6470", margin: 0 }}>Colour: {invoice.color}</p>}
                  </td>
                  <td style={{ padding: "12px", textAlign: "right", borderBottom: "1px solid #F3F4F6", fontSize: 14, fontWeight: 600, color: "#1C1F22" }}>
                    {fmt(invoice.unit_price)}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Totals */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 28 }}>
              <table style={{ minWidth: 260 }}>
                <tbody>
                  <tr>
                    <td style={{ padding: "6px 12px", fontSize: 13, color: "#5B6470" }}>On-road Price</td>
                    <td style={{ padding: "6px 12px", fontSize: 13, textAlign: "right", color: "#1C1F22" }}>{fmt(invoice.unit_price)}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "6px 12px", fontSize: 13, color: "#5B6470" }}>Advance Paid</td>
                    <td style={{ padding: "6px 12px", fontSize: 13, textAlign: "right", color: "#16A34A", fontWeight: 600 }}>− {fmt(invoice.advance_amount)}</td>
                  </tr>
                  <tr style={{ backgroundColor: "#F9FAFB" }}>
                    <td style={{ padding: "10px 12px", fontSize: 14, fontWeight: 700, color: "#1C1F22", borderTop: "2px solid #E5E7EB" }}>Balance on Delivery</td>
                    <td style={{ padding: "10px 12px", fontSize: 14, fontWeight: 700, textAlign: "right", color: "#1C1F22", borderTop: "2px solid #E5E7EB" }}>{fmt(invoice.balance_amount)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Payment details */}
            <div style={{ border: "1px solid #E5E7EB", borderRadius: 4, overflow: "hidden", marginBottom: 24 }}>
              <div style={{ backgroundColor: "#F3F4F6", padding: "8px 12px" }}>
                <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#5B6470", margin: 0 }}>Advance Payment Details</p>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  <Row label="Amount Paid" value={fmt(invoice.upi_amount ?? invoice.advance_amount)} />
                  <Row label="Transaction ID / UTR" value={invoice.upi_transaction_id} />
                  <Row label="Paid To" value={invoice.upi_to} />
                  <Row label="Paid By" value={invoice.upi_from} />
                  <Row label="Date" value={invoice.upi_date} />
                  <Row label="Time" value={invoice.upi_time} />
                  <Row label="Payment Status" value={invoice.payment_status} />
                </tbody>
              </table>
            </div>

            {/* Footer note */}
            <p style={{ fontSize: 12, color: "#9CA3AF", textAlign: "center", margin: 0 }}>
              This is a system-generated advance receipt. Final tax invoice will be issued at delivery.
            </p>
          </div>
        </div>

        {/* Print button */}
        <div style={{ marginTop: 16, textAlign: "center" }}>
          <button
            onClick={() => window.print()}
            style={{
              padding: "10px 24px", backgroundColor: "#1C1F22", color: "#C8F135",
              fontSize: 13, fontWeight: 600, border: "none", borderRadius: 4, cursor: "pointer",
            }}
          >
            Print / Save as PDF
          </button>
        </div>
      </div>
    </div>
  );
}
