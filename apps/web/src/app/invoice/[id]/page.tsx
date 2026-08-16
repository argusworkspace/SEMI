import { notFound } from "next/navigation";
import { PrintButton } from "./PrintButton";

const API_URL =
  process.env.API_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:8000";

async function getInvoice(id: string) {
  const res = await fetch(`${API_URL}/invoices/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

function fmt(n: string | number | null | undefined): string {
  if (n == null) return "—";
  return "₹" + Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2 });
}

function fmtNum(n: string | number | null | undefined): string {
  if (n == null) return "—";
  return Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2 });
}

function amountInWords(amount: number): string {
  const ones = ["", "One","Two","Three","Four","Five","Six","Seven","Eight","Nine",
    "Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];
  const tens = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];
  function toWords(n: number): string {
    if (n === 0) return "";
    if (n < 20) return ones[n] + " ";
    if (n < 100) return tens[Math.floor(n / 10)] + " " + ones[n % 10] + " ";
    if (n < 1000) return ones[Math.floor(n / 100)] + " Hundred " + toWords(n % 100);
    if (n < 100000) return toWords(Math.floor(n / 1000)) + "Thousand " + toWords(n % 1000);
    if (n < 10000000) return toWords(Math.floor(n / 100000)) + "Lakh " + toWords(n % 100000);
    return toWords(Math.floor(n / 10000000)) + "Crore " + toWords(n % 10000000);
  }
  const rupees = Math.floor(amount);
  const paise = Math.round((amount - rupees) * 100);
  let words = "INR " + toWords(rupees).trim() + " Only";
  if (paise > 0) words = "INR " + toWords(rupees).trim() + "and " + toWords(paise).trim() + "Paise Only";
  return words.replace(/\s+/g, " ").trim();
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "2-digit" });
}

// Extract trailing digits from an order number like "ORD-0039" → "39"
function orderSeqNum(orderNumber: string): string {
  const match = orderNumber?.match(/(\d+)$/);
  return match ? String(parseInt(match[1], 10)) : (orderNumber ?? "—");
}

const td: React.CSSProperties = { border: "1px solid #000", padding: "4px 6px", fontSize: 11 };
const tdR: React.CSSProperties = { ...td, textAlign: "right" };
const tdC: React.CSSProperties = { ...td, textAlign: "center" };
const th: React.CSSProperties = { ...td, fontWeight: 700, backgroundColor: "#f5f5f5" };
const thR: React.CSSProperties = { ...th, textAlign: "right" };
const thC: React.CSSProperties = { ...th, textAlign: "center" };

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const inv = await getInvoice(id);
  if (!inv) notFound();

  const totalGross = Number(inv.advance_amount);
  const taxable = Number(inv.taxable_value ?? 0);
  const cgst = Number(inv.cgst_amount ?? 0);
  const sgst = Number(inv.sgst_amount ?? 0);
  const roundOff = Number(inv.round_off ?? 0);
  const cgstRate = Number(inv.cgst_rate ?? 0);
  const sgstRate = Number(inv.sgst_rate ?? 0);

  return (
    <div style={{ backgroundColor: "#fff", minHeight: "100vh", padding: "20px 16px" }}>
      <PrintButton />

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { margin: 0; }
        }
        @page { size: A4; margin: 12mm; }
      `}</style>

      {/* ── Invoice ── */}
      <div style={{ maxWidth: 800, margin: "0 auto", border: "2px solid #000", fontFamily: "Arial, sans-serif" }}>

        {/* Title */}
        <div style={{ textAlign: "center", borderBottom: "1px solid #000", padding: "6px 0" }}>
          <strong style={{ fontSize: 14, letterSpacing: "0.05em" }}>Tax Invoice</strong>
        </div>

        {/* Top two-column block */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid #000" }}>

          {/* Left — Seller */}
          <div style={{ borderRight: "1px solid #000", padding: "8px 10px" }}>
            <div style={{ fontWeight: 700, fontSize: 13 }}>{inv.seller_name}</div>
            {inv.seller_trade_name && inv.seller_trade_name !== inv.seller_name && (
              <div style={{ fontSize: 11, color: "#444" }}>{inv.seller_trade_name}</div>
            )}
            {inv.seller_address && (
              <div style={{ fontSize: 11, marginTop: 2, whiteSpace: "pre-line" }}>{inv.seller_address}</div>
            )}
            {inv.seller_gstin && (
              <div style={{ fontSize: 11, marginTop: 4 }}>
                <strong>GSTIN/UIN</strong> : {inv.seller_gstin}
              </div>
            )}
            <div style={{ fontSize: 11, marginTop: 2 }}>
              <strong>State Name</strong> : {inv.seller_state || "Tamil Nadu"}, Code : {inv.seller_state_code || "33"}
            </div>
            {inv.seller_email && (
              <div style={{ fontSize: 11, marginTop: 2 }}>
                <strong>E-Mail</strong> : {inv.seller_email}
              </div>
            )}

            {/* Buyer */}
            <div style={{ marginTop: 12, borderTop: "1px solid #ccc", paddingTop: 8 }}>
              <div style={{ fontSize: 11, color: "#666", marginBottom: 2 }}>Buyer (Bill to)</div>
              <div style={{ fontWeight: 700, fontSize: 12 }}>{inv.buyer_name}</div>
              <div style={{ fontSize: 11, whiteSpace: "pre-line" }}>{inv.buyer_address}</div>
              <div style={{ fontSize: 11 }}>{inv.buyer_district} — {inv.buyer_pin}</div>
              {inv.buyer_gstin && (
                <div style={{ fontSize: 11, marginTop: 2 }}>
                  <strong>GSTIN/UIN</strong> : {inv.buyer_gstin}
                </div>
              )}
              <div style={{ fontSize: 11, marginTop: 2 }}>
                <strong>State Name</strong> : {inv.buyer_state}
              </div>
            </div>
          </div>

          {/* Right — Invoice meta */}
          <div style={{ padding: "8px 10px", fontSize: 11 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                {[
                  ["Invoice No.", inv.invoice_number],
                  ["Dated", formatDate(inv.created_at)],
                  ["Delivery Note No.", orderSeqNum(inv.order_number)],
                  ["Mode/Terms of Payment", "UPI — Advance"],
                  ["Buyer's Order No.", orderSeqNum(inv.order_number)],
                ].map(([label, value]) => (
                  <tr key={label}>
                    <td style={{ padding: "3px 0", color: "#555", width: "50%" }}>{label}</td>
                    <td style={{ padding: "3px 0", fontWeight: label === "Invoice No." ? 700 : 400 }}>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Items table */}
        <table style={{ width: "100%", borderCollapse: "collapse", borderBottom: "1px solid #000" }}>
          <thead>
            <tr>
              <th style={{ ...th, width: 28 }}>Sl No.</th>
              <th style={th}>Description of Goods</th>
              <th style={{ ...thC, width: 60 }}>HSN/SAC</th>
              <th style={{ ...thC, width: 60 }}>Quantity</th>
              <th style={{ ...thR, width: 80 }}>Rate</th>
              <th style={{ ...thC, width: 36 }}>per</th>
              <th style={{ ...thR, width: 90 }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ ...tdC, verticalAlign: "top" }}>1</td>
              <td style={{ ...td }}>
                <div style={{ fontWeight: 600 }}>
                  {inv.product_name}{inv.color ? ` — ${inv.color}` : ""}
                </div>
                <div style={{ fontSize: 10, color: "#555", marginTop: 2 }}>
                  Advance against pre-order · Delivery Note No. {orderSeqNum(inv.order_number)}
                </div>
                {inv.upi_transaction_id && (
                  <div style={{ fontSize: 10, color: "#555" }}>
                    UPI Ref: {inv.upi_transaction_id}
                    {inv.upi_date ? ` · ${inv.upi_date}` : ""}
                    {inv.upi_time ? ` ${inv.upi_time}` : ""}
                  </div>
                )}
              </td>
              <td style={tdC}>{inv.hsn_code ?? "8712"}</td>
              <td style={tdC}>1 NOS</td>
              <td style={tdR}>{fmtNum(inv.taxable_value)}</td>
              <td style={tdC}>NOS</td>
              <td style={tdR}>{fmtNum(inv.taxable_value)}</td>
            </tr>
            {/* Padding rows */}
            {[...Array(4)].map((_, i) => (
              <tr key={i} style={{ height: 22 }}>
                <td style={td} />
                <td style={td} />
                <td style={td} />
                <td style={td} />
                <td style={td} />
                <td style={td} />
                <td style={td} />
              </tr>
            ))}
            {/* GST rows */}
            <tr>
              <td colSpan={5} style={{ ...td, textAlign: "right", fontWeight: 600 }}>Output CGST</td>
              <td style={td} />
              <td style={tdR}>{fmtNum(cgst)}</td>
            </tr>
            <tr>
              <td colSpan={5} style={{ ...td, textAlign: "right", fontWeight: 600 }}>Output SGST</td>
              <td style={td} />
              <td style={tdR}>{fmtNum(sgst)}</td>
            </tr>
            {roundOff !== 0 && (
              <tr>
                <td colSpan={5} style={{ ...td, textAlign: "right", fontWeight: 600 }}>Round Off</td>
                <td style={td} />
                <td style={tdR}>{fmtNum(roundOff)}</td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} style={{ ...th, textAlign: "right" }}>Total</td>
              <td style={{ ...thC }}>1 NOS</td>
              <td style={th} />
              <td style={th} />
              <td style={{ ...thR }}>{fmt(totalGross)}</td>
            </tr>
          </tfoot>
        </table>

        {/* Amount in words */}
        <div style={{ borderBottom: "1px solid #000", padding: "6px 10px", fontSize: 11 }}>
          <span style={{ color: "#555" }}>Amount Chargeable (in words)</span>
          <br />
          <strong>{amountInWords(totalGross)}</strong>
          <span style={{ float: "right", fontSize: 10 }}>E. &amp; O.E</span>
        </div>

        {/* Tax summary table */}
        <table style={{ width: "100%", borderCollapse: "collapse", borderBottom: "1px solid #000", fontSize: 11 }}>
          <thead>
            <tr>
              <th style={th} rowSpan={2}>HSN/SAC</th>
              <th style={th} rowSpan={2}>Taxable Value</th>
              <th colSpan={2} style={{ ...thC }}>CGST</th>
              <th colSpan={2} style={{ ...thC }}>SGST/UTGST</th>
              <th style={th} rowSpan={2}>Total Tax Amount</th>
            </tr>
            <tr>
              <th style={thC}>Rate</th>
              <th style={thR}>Amount</th>
              <th style={thC}>Rate</th>
              <th style={thR}>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={tdC}>{inv.hsn_code ?? "8712"}</td>
              <td style={tdR}>{fmtNum(taxable)}</td>
              <td style={tdC}>{cgstRate}%</td>
              <td style={tdR}>{fmtNum(cgst)}</td>
              <td style={tdC}>{sgstRate}%</td>
              <td style={tdR}>{fmtNum(sgst)}</td>
              <td style={tdR}>{fmtNum(cgst + sgst)}</td>
            </tr>
            <tr>
              <td style={{ ...th, textAlign: "right" }} colSpan={1}>Total</td>
              <td style={thR}>{fmtNum(taxable)}</td>
              <td style={th} />
              <td style={thR}>{fmtNum(cgst)}</td>
              <td style={th} />
              <td style={thR}>{fmtNum(sgst)}</td>
              <td style={thR}>{fmtNum(cgst + sgst)}</td>
            </tr>
          </tbody>
        </table>

        {/* Tax amount in words */}
        <div style={{ borderBottom: "1px solid #000", padding: "6px 10px", fontSize: 11 }}>
          <strong>Tax Amount (in words) : </strong>
          {amountInWords(cgst + sgst)}
        </div>

        {/* Footer: Bank details + Declaration + Signature */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", fontSize: 11 }}>
          <div style={{ borderRight: "1px solid #000", padding: "8px 10px" }}>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>Declaration</div>
            <div style={{ fontSize: 10, color: "#555", lineHeight: "16px" }}>
              We declare that this invoice shows the actual price of the goods described
              and that all particulars are true and correct.
            </div>
            <div style={{ marginTop: 20 }}>
              <div style={{ borderTop: "1px solid #999", display: "inline-block", width: 120, marginTop: 20 }} />
              <div style={{ fontSize: 10, color: "#777" }}>Customer&apos;s Seal and Signature</div>
            </div>
          </div>

          <div style={{ padding: "8px 10px" }}>
            {(inv.seller_bank_name || inv.seller_bank_account) && (
              <>
                <div style={{ fontWeight: 600, marginBottom: 6 }}>Company&apos;s Bank Details</div>
                <table style={{ fontSize: 11 }}>
                  <tbody>
                    {inv.seller_bank_name && (
                      <tr><td style={{ color: "#555", paddingRight: 8 }}>Bank Name</td><td>: {inv.seller_bank_name}</td></tr>
                    )}
                    {inv.seller_bank_account && (
                      <tr><td style={{ color: "#555", paddingRight: 8 }}>A/c No.</td><td>: {inv.seller_bank_account}</td></tr>
                    )}
                    {inv.seller_bank_ifsc && (
                      <tr><td style={{ color: "#555", paddingRight: 8 }}>IFSC Code</td><td>: {inv.seller_bank_ifsc}</td></tr>
                    )}
                    {inv.seller_upi_id && (
                      <tr><td style={{ color: "#555", paddingRight: 8 }}>UPI ID</td><td>: {inv.seller_upi_id}</td></tr>
                    )}
                  </tbody>
                </table>
              </>
            )}
            <div style={{ textAlign: "right", marginTop: 20 }}>
              <div style={{ fontWeight: 600, fontSize: 12 }}>for {inv.seller_name}</div>
              <div style={{ height: 40 }} />
              <div style={{ borderTop: "1px solid #999", display: "inline-block", width: 120 }} />
              <div style={{ fontSize: 10, color: "#777" }}>Authorised Signatory</div>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div style={{ borderTop: "1px solid #000", padding: "4px 10px", textAlign: "center", fontSize: 10, color: "#555" }}>
          This is a Computer Generated Invoice
        </div>
      </div>
    </div>
  );
}
