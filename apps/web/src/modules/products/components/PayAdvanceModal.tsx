"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/types/product";
import { createOrder, submitPaymentProof, type OcrCheck } from "@/lib/api/payments";
import { useBodyScrollLock } from "@/modules/shared/hooks/useBodyScrollLock";
import {
  COLOR_AMBER,
  COLOR_ASPHALT,
  COLOR_HAIRLINE,
  COLOR_PAPER,
  COLOR_STEEL,
  COLOR_VOLT,
} from "@/lib/design-tokens";

// ── Constants ─────────────────────────────────────────────────────────────────
const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab",
  "Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh",
  "Uttarakhand","West Bengal","Andaman & Nicobar Islands","Chandigarh",
  "Dadra & Nagar Haveli and Daman & Diu","Delhi","Jammu & Kashmir","Ladakh",
  "Lakshadweep","Puducherry",
];

// ── Types ──────────────────────────────────────────────────────────────────────
type Step = "details" | "payment" | "upload" | "done";

interface FormValues {
  name: string;
  email: string;
  phone: string;
  color: string;
  city: string;
  // Billing address (for tax invoice)
  address: string;
  district: string;
  pin: string;
  state: string;
  gstin: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  color?: string;
  city?: string;
  address?: string;
  district?: string;
  pin?: string;
  state?: string;
  gstin?: string;
}

interface OrderInfo {
  orderId: string;
  orderNumber: string;
}

interface BillingPayload {
  orderId: string;
  name: string;
  address: string;
  district: string;
  pin: string;
  state: string;
  gstin: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmt(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

function validate(v: FormValues, colors: string[]): FormErrors {
  const e: FormErrors = {};
  if (!v.name.trim()) e.name = "Full name is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = "Enter a valid email";
  if (!/^[6-9]\d{9}$/.test(v.phone.trim()))
    e.phone = "Enter a valid 10-digit Indian mobile number";
  if (!v.color || !colors.includes(v.color)) e.color = "Select a colour";
  if (!v.city.trim()) e.city = "Delivery city is required";
  if (!v.address.trim()) e.address = "Billing address is required";
  if (!v.district.trim()) e.district = "District is required";
  if (!/^\d{6}$/.test(v.pin.trim())) e.pin = "Enter a valid 6-digit PIN code";
  if (!v.state) e.state = "Select a state";
  if (v.gstin && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(v.gstin))
    e.gstin = "Invalid GSTIN format";
  return e;
}

function colorName(hex: string): string {
  const map: Record<string, string> = {
    "#FFFFFF": "Pearl White",
    "#3B82F6": "Ocean Blue",
    "#EAB308": "Solar Yellow",
    "#374151": "Charcoal Grey",
  };
  return map[hex.toUpperCase()] ?? map[hex] ?? hex;
}

// ── Sub-components ────────────────────────────────────────────────────────────
function Field({
  id, label, error, children,
}: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label htmlFor={id} style={{
        display: "block", fontSize: 12, fontWeight: 500,
        letterSpacing: "0.08em", textTransform: "uppercase",
        color: COLOR_STEEL, marginBottom: 6, fontFamily: "var(--font-inter), sans-serif",
      }}>
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" style={{ fontSize: 12, color: COLOR_AMBER, marginTop: 4, fontFamily: "var(--font-inter), sans-serif" }}>
          {error}
        </p>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 12px", fontSize: 15,
  fontFamily: "var(--font-inter), sans-serif", color: COLOR_ASPHALT,
  backgroundColor: COLOR_PAPER, border: `1px solid ${COLOR_HAIRLINE}`,
  borderRadius: 2, outline: "none", appearance: "none", boxSizing: "border-box",
};

function Spinner() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round"
      style={{ animation: "spin 0.8s linear infinite", display: "inline-block" }}
      aria-hidden="true">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}

function StepIndicator({ current }: { current: Step }) {
  const steps: { key: Step; label: string }[] = [
    { key: "details", label: "Details" },
    { key: "payment", label: "Pay" },
    { key: "upload", label: "Proof" },
    { key: "done", label: "Done" },
  ];
  const idx = steps.findIndex((s) => s.key === current);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 24 }}>
      {steps.map((s, i) => (
        <div key={s.key} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : "none" }}>
          <div style={{
            width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 700,
            backgroundColor: i <= idx ? COLOR_ASPHALT : COLOR_HAIRLINE,
            color: i <= idx ? COLOR_VOLT : COLOR_STEEL,
            fontFamily: "var(--font-space-grotesk), sans-serif",
          }}>
            {i < idx ? "✓" : i + 1}
          </div>
          <span style={{
            fontSize: 11, marginLeft: 4, color: i === idx ? COLOR_ASPHALT : COLOR_STEEL,
            fontWeight: i === idx ? 600 : 400,
            fontFamily: "var(--font-inter), sans-serif",
            whiteSpace: "nowrap",
          }}>
            {s.label}
          </span>
          {i < steps.length - 1 && (
            <div style={{
              flex: 1, height: 1, marginInline: 8,
              backgroundColor: i < idx ? COLOR_ASPHALT : COLOR_HAIRLINE,
            }} />
          )}
        </div>
      ))}
    </div>
  );
}

function PriceRow({ label, value, note, bold, accent, muted }: {
  label: string; value: string; note?: string; bold?: boolean; accent?: boolean; muted?: boolean;
}) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "10px 14px", backgroundColor: accent ? "rgba(200,241,53,0.08)" : "transparent",
    }}>
      <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 13, color: muted ? COLOR_STEEL : COLOR_ASPHALT, fontWeight: bold ? 600 : 400 }}>
        {label}
        {note && <span style={{ fontSize: 11, color: COLOR_STEEL, marginLeft: 4 }}>({note})</span>}
      </span>
      <span style={{
        fontFamily: "var(--font-space-grotesk), sans-serif",
        fontSize: bold ? 16 : 14, fontWeight: bold ? 700 : accent ? 700 : 500,
        color: accent ? "#5a8a00" : muted ? COLOR_STEEL : COLOR_ASPHALT,
      }}>
        {value}
      </span>
    </div>
  );
}

// ── Step 2: Payment Instructions ──────────────────────────────────────────────
// A upi://pay deep link, opened from a website, has been confirmed to be
// actively REFUSED by GPay, PhonePe, and Paytm (not just extra friction —
// tested and failed on all three), while a plain "send to UPI ID" inside the
// app itself goes through fine. Those apps' fraud models specifically target
// externally-injected payment intents (that's also the shape of QR/link
// payment scams); typing/pasting the UPI ID yourself is a different, trusted
// code path. So the manual flow is the primary — and only — path here.
const TRUST_LOGOS = [
  { id: "gpay", name: "GPay", src: "/images/upi/gpay.svg" },
  { id: "phonepe", name: "PhonePe", src: "/images/upi/phonepe.svg" },
  { id: "paytm", name: "Paytm", src: "/images/upi/paytm.svg" },
];

function PaymentStep({
  order, advanceAmount, onNext,
}: { order: OrderInfo; advanceAmount: number; onNext: () => void }) {
  const [upiId, setUpiId] = useState("semy@indianbnk");
  const [upiName, setUpiName] = useState("M S SEMY");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/payments/config")
      .then((r) => r.ok ? r.json() : null)
      .then((cfg) => {
        if (cfg?.upi_id) setUpiId(cfg.upi_id);
        if (cfg?.upi_name) setUpiName(cfg.upi_name);
      })
      .catch(() => {});
  }, []);

  function copyUpi() {
    navigator.clipboard.writeText(upiId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div>
      <p style={{ fontSize: 14, color: COLOR_STEEL, marginBottom: 16, fontFamily: "var(--font-inter), sans-serif", lineHeight: "20px" }}>
        Pay exactly <strong style={{ color: COLOR_ASPHALT }}>{fmt(advanceAmount)}</strong> to
        the UPI ID below from any UPI app. After paying, take a screenshot and upload it in the next step.
      </p>

      {/* Recognition strip: small app marks, not links */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 18 }}>
        <span style={{ fontSize: 11, color: COLOR_STEEL, fontFamily: "var(--font-inter), sans-serif" }}>Works with</span>
        {TRUST_LOGOS.map((logo) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={logo.id} src={logo.src} alt={logo.name} width={20} height={20}
            style={{ borderRadius: "50%", boxShadow: "0 0 0 1px rgba(0,0,0,0.06)" }} />
        ))}
      </div>

      {/* UPI ID — primary payment path */}
      <div style={{ border: `1.5px solid ${COLOR_ASPHALT}`, borderRadius: 2, padding: "14px", marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "rgba(200,241,53,0.08)" }}>
        <div>
          <span style={{ fontSize: 11, color: COLOR_STEEL, display: "block", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2, fontFamily: "var(--font-inter), sans-serif" }}>Pay to UPI ID</span>
          <span style={{ fontSize: 17, fontWeight: 700, color: COLOR_ASPHALT, fontFamily: "var(--font-space-grotesk), sans-serif" }}>{upiId}</span>
        </div>
        <button onClick={copyUpi} style={{
          padding: "8px 16px", fontSize: 12, fontWeight: 600,
          backgroundColor: copied ? "#dcfce7" : COLOR_ASPHALT,
          color: copied ? "#16a34a" : COLOR_PAPER,
          border: "none", borderRadius: 2, cursor: "pointer",
          fontFamily: "var(--font-inter), sans-serif", flexShrink: 0,
        }}>
          {copied ? "Copied!" : "Copy ID"}
        </button>
      </div>

      {/* How-to steps */}
      <ol style={{ margin: "0 0 16px", paddingLeft: 20, fontSize: 13, color: COLOR_STEEL, lineHeight: "22px", fontFamily: "var(--font-inter), sans-serif" }}>
        <li>Open your UPI app (GPay, PhonePe, Paytm, Navi, BHIM…)</li>
        <li>Tap <strong style={{ color: COLOR_ASPHALT }}>Pay</strong> / <strong style={{ color: COLOR_ASPHALT }}>Send</strong> → <strong style={{ color: COLOR_ASPHALT }}>To UPI ID / Bank Transfer</strong></li>
        <li>Paste the UPI ID above and enter <strong style={{ color: COLOR_ASPHALT }}>{fmt(advanceAmount)}</strong></li>
      </ol>

      {/* Order ref */}
      <div style={{ padding: "8px 14px", backgroundColor: COLOR_PAPER, border: `1px solid ${COLOR_HAIRLINE}`, borderRadius: 2, marginBottom: 20 }}>
        <span style={{ fontSize: 11, color: COLOR_STEEL, fontFamily: "var(--font-inter), sans-serif" }}>
          Reference: <strong style={{ color: COLOR_ASPHALT }}>{order.orderNumber}</strong>
          <span style={{ opacity: 0.6, marginLeft: 4 }}>(add in payment note)</span>
        </span>
      </div>

      <button onClick={onNext} style={{
        width: "100%", padding: "13px 20px", backgroundColor: COLOR_VOLT,
        color: COLOR_ASPHALT, fontFamily: "var(--font-space-grotesk), sans-serif",
        fontSize: 15, fontWeight: 700, border: "none", borderRadius: 2, cursor: "pointer",
      }}>
        I&apos;ve Paid — Upload Screenshot →
      </button>
    </div>
  );
}

// ── Step 3: Upload screenshot ─────────────────────────────────────────────────
function UploadStep({
  order,
  billing,
  onDone,
}: {
  order: OrderInfo;
  billing: BillingPayload;
  onDone: (ocr: OcrCheck, invoiceId: string | null) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(f: File) {
    setFile(f);
    setError(null);
    const url = URL.createObjectURL(f);
    setPreview(url);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith("image/")) handleFile(f);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!file) { setError("Please select a screenshot"); return; }
    setUploading(true);
    setError(null);

    const result = await submitPaymentProof(order.orderId, file);

    if (!result.success || !result.ocr) {
      setUploading(false);
      setError(result.error ?? "Upload failed. Please try again.");
      return;
    }

    // Auto-create invoice using billing data collected at Step 1
    let invoiceId: string | null = null;
    try {
      const invRes = await fetch("/api/invoice/buyer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(billing),
      });
      if (invRes.ok) {
        const invData = await invRes.json();
        invoiceId = invData.invoiceId ?? null;
      }
    } catch {
      // Invoice creation failed — user will see fallback link to fill form
    }

    setUploading(false);
    onDone(result.ocr, invoiceId);
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Screenshot instructions */}
      <div style={{ backgroundColor: "#fffbeb", border: "1px solid #fde68a", borderRadius: 4, padding: "12px 14px", marginBottom: 16 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#92400e", margin: "0 0 8px", fontFamily: "var(--font-inter), sans-serif" }}>
          How to take a valid payment screenshot:
        </p>
        <ol style={{ margin: 0, paddingLeft: 16, fontSize: 12, color: "#78350f", lineHeight: "20px", fontFamily: "var(--font-inter), sans-serif" }}>
          <li>Open GPay / PhonePe / Paytm after payment</li>
          <li>Go to <strong>Transaction History</strong> and tap the payment</li>
          <li>Screenshot the page showing: <strong>amount paid</strong>, <strong>UPI reference / UTR number</strong>, date, time and recipient name</li>
          <li>Upload that screenshot below</li>
        </ol>
        <p style={{ margin: "8px 0 0", fontSize: 11, color: "#92400e", fontFamily: "var(--font-inter), sans-serif" }}>
          ⚠️ Screenshots missing the UTR/transaction ID may need manual verification.
        </p>
      </div>

      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        style={{
          border: `2px dashed ${preview ? "#22c55e" : COLOR_HAIRLINE}`,
          borderRadius: 2, padding: "24px 16px", textAlign: "center",
          cursor: "pointer", marginBottom: 16,
          backgroundColor: preview ? "rgba(34,197,94,0.04)" : COLOR_PAPER,
          transition: "border-color 150ms ease",
        }}
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Payment screenshot preview"
            style={{ maxHeight: 200, maxWidth: "100%", objectFit: "contain", borderRadius: 2 }} />
        ) : (
          <>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📸</div>
            <p style={{ fontSize: 14, fontWeight: 600, color: COLOR_ASPHALT, margin: "0 0 4px", fontFamily: "var(--font-inter), sans-serif" }}>
              Tap to upload your payment screenshot
            </p>
            <p style={{ fontSize: 12, color: COLOR_STEEL, margin: "0 0 4px", fontFamily: "var(--font-inter), sans-serif" }}>
              or drag and drop here
            </p>
            <p style={{ fontSize: 11, color: COLOR_STEEL, margin: 0, opacity: 0.7, fontFamily: "var(--font-inter), sans-serif" }}>
              JPG, PNG or WebP · max 10 MB
            </p>
          </>
        )}
      </div>

      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" style={{ display: "none" }}
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />

      {preview && (
        <button type="button" onClick={() => { setFile(null); setPreview(null); }}
          style={{ fontSize: 12, color: COLOR_STEEL, background: "none", border: "none", cursor: "pointer", marginBottom: 12, fontFamily: "var(--font-inter), sans-serif" }}>
          ✕ Remove and choose a different screenshot
        </button>
      )}

      {error && (
        <p role="alert" style={{ fontSize: 13, color: "#dc2626", marginBottom: 12, fontFamily: "var(--font-inter), sans-serif" }}>
          {error}
        </p>
      )}

      <button type="submit" disabled={uploading || !file} style={{
        width: "100%", padding: "13px 20px",
        backgroundColor: uploading || !file ? "#d4f078" : COLOR_VOLT,
        color: COLOR_ASPHALT, fontFamily: "var(--font-space-grotesk), sans-serif",
        fontSize: 15, fontWeight: 700, border: "none", borderRadius: 2,
        cursor: uploading || !file ? "not-allowed" : "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
      }}>
        {uploading ? <><Spinner /> Verifying screenshot &amp; generating invoice…</> : "Submit Payment Proof"}
      </button>
      {!file && (
        <p style={{ textAlign: "center", fontSize: 12, color: COLOR_STEEL, marginTop: 8, fontFamily: "var(--font-inter), sans-serif" }}>
          Upload a screenshot first to continue
        </p>
      )}
    </form>
  );
}

// ── Step 4: Done ──────────────────────────────────────────────────────────────
function DoneStep({ order, ocr, invoiceId, onClose }: {
  order: OrderInfo;
  ocr: OcrCheck;
  invoiceId: string | null;
  onClose: () => void;
}) {
  return (
    <div style={{ textAlign: "center", padding: "8px 0 16px" }}>
      <div style={{
        width: 56, height: 56, borderRadius: "50%",
        backgroundColor: ocr.validated ? "#dcfce7" : "#fef9c3",
        border: `2px solid ${ocr.validated ? "#86efac" : "#fde047"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 16px",
      }}>
        <span style={{ fontSize: 26 }}>{ocr.validated ? "✓" : "⏳"}</span>
      </div>

      <p style={{ fontFamily: "var(--font-space-grotesk), sans-serif", fontSize: 17, fontWeight: 700, color: COLOR_ASPHALT, margin: "0 0 8px" }}>
        {ocr.validated ? "Payment confirmed!" : "Screenshot received!"}
      </p>
      <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 14, color: COLOR_STEEL, margin: "0 0 16px", lineHeight: "20px" }}>
        {ocr.message}
      </p>

      <div style={{ display: "inline-block", padding: "6px 14px", backgroundColor: COLOR_PAPER, border: `1px solid ${COLOR_HAIRLINE}`, borderRadius: 2, marginBottom: 8 }}>
        <span style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: COLOR_STEEL, fontFamily: "var(--font-inter), sans-serif" }}>Order&nbsp;</span>
        <span style={{ fontFamily: "var(--font-space-grotesk), sans-serif", fontSize: 13, fontWeight: 600, color: COLOR_ASPHALT }}>{order.orderNumber}</span>
      </div>

      {ocr.upi_ref && (
        <div style={{ display: "block", padding: "6px 14px", backgroundColor: COLOR_PAPER, border: `1px solid ${COLOR_HAIRLINE}`, borderRadius: 2, marginBottom: 16 }}>
          <span style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: COLOR_STEEL, fontFamily: "var(--font-inter), sans-serif" }}>UTR&nbsp;</span>
          <span style={{ fontFamily: "var(--font-space-grotesk), sans-serif", fontSize: 13, fontWeight: 600, color: COLOR_ASPHALT }}>{ocr.upi_ref}</span>
        </div>
      )}

      <br />

      {invoiceId ? (
        <>
          <div style={{ backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 4, padding: "10px 14px", marginBottom: 14, textAlign: "left" }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#166534", margin: "0 0 4px", fontFamily: "var(--font-inter), sans-serif" }}>
              Your tax invoice is ready!
            </p>
            <p style={{ fontSize: 12, color: "#16a34a", margin: 0, fontFamily: "var(--font-inter), sans-serif" }}>
              Click below to view and download it as a PDF. Keep it for your records.
            </p>
          </div>
          <a
            href={`/invoice/${invoiceId}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block", width: "100%", textAlign: "center",
              padding: "13px 20px", backgroundColor: COLOR_VOLT, color: COLOR_ASPHALT,
              fontFamily: "var(--font-space-grotesk), sans-serif", fontSize: 15, fontWeight: 700,
              border: "none", borderRadius: 2, cursor: "pointer", textDecoration: "none",
              marginBottom: 10, boxSizing: "border-box",
            }}
          >
            View &amp; Download Tax Invoice →
          </a>
        </>
      ) : (
        <a
          href={`/checkout/${order.orderId}`}
          style={{
            display: "block", width: "100%", textAlign: "center",
            padding: "13px 20px", backgroundColor: COLOR_VOLT, color: COLOR_ASPHALT,
            fontFamily: "var(--font-space-grotesk), sans-serif", fontSize: 15, fontWeight: 700,
            border: "none", borderRadius: 2, cursor: "pointer", textDecoration: "none",
            marginBottom: 10, boxSizing: "border-box",
          }}
        >
          Fill Invoice Details →
        </a>
      )}

      <button onClick={onClose} style={{
        width: "100%", padding: "11px 20px", backgroundColor: "transparent",
        color: COLOR_ASPHALT, fontFamily: "var(--font-inter), sans-serif",
        fontSize: 14, fontWeight: 500, border: `1px solid #E5E7EB`,
        borderRadius: 2, cursor: "pointer",
      }}>
        Close
      </button>
    </div>
  );
}

// ── Main Modal ────────────────────────────────────────────────────────────────
export default function PayAdvanceModal({
  product,
  onClose,
  onPaid,
}: {
  product: Product;
  onClose: () => void;
  onPaid?: () => void;
}) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("details");
  const [form, setForm] = useState<FormValues>({
    name: "", email: "", phone: "", color: product.colors[0] ?? "", city: "",
    address: "", district: "", pin: "", state: "", gstin: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [order, setOrder] = useState<OrderInfo | null>(null);
  const [ocr, setOcr] = useState<OcrCheck | null>(null);
  const [invoiceId, setInvoiceId] = useState<string | null>(null);

  const overlayRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const balanceDue = product.price - product.advanceAmount;

  useEffect(() => { firstInputRef.current?.focus(); }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && step !== "upload") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, step]);

  useBodyScrollLock(true);

  function set(field: keyof FormValues, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  async function handleDetailsSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validate(form, product.colors);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSubmitting(true);
    setSubmitError(null);

    const result = await createOrder({
      idempotencyKey: `${product.id}-${form.phone}-${form.email}`,
      productId: product.id,
      productName: product.name,
      color: form.color,
      unitPrice: product.price,
      customerName: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      city: form.city.trim(),
    });

    setSubmitting(false);

    if (!result.success || !result.orderId) {
      setSubmitError(result.error ?? "Could not create order. Please try again.");
      return;
    }

    setOrder({ orderId: result.orderId, orderNumber: result.orderNumber! });
    setStep("payment");
  }

  function handleUploadDone(ocrResult: OcrCheck, newInvoiceId: string | null) {
    onPaid?.();
    setOcr(ocrResult);
    setInvoiceId(newInvoiceId);
    if (newInvoiceId) {
      // Invoice created — redirect directly to invoice page
      router.push(`/invoice/${newInvoiceId}`);
      onClose();
    } else {
      setStep("done");
    }
  }

  const billing: BillingPayload | null = order ? {
    orderId: order.orderId,
    name: form.name.trim(),
    address: form.address.trim(),
    district: form.district.trim(),
    pin: form.pin.trim(),
    state: form.state,
    gstin: form.gstin.trim(),
  } : null;

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .modal-body { -webkit-overflow-scrolling: touch; }
        @media (max-width: 640px) {
          /* 100vh on mobile includes the space behind the browser's collapsible
             address bar — 100dvh is the actual visible viewport. Keep the vh
             line first as a fallback for browsers that don't support dvh. */
          .modal-panel { max-width:100%!important; max-height:100vh!important; height:100vh!important; max-height:100dvh!important; height:100dvh!important; border-radius:0!important; border:none!important; }
          .modal-overlay { padding:0!important; }
          .modal-form-actions { position:sticky; bottom:0; background:#fff; padding:16px 20px!important; padding-bottom:max(16px, env(safe-area-inset-bottom))!important; border-top:1px solid ${COLOR_HAIRLINE}; margin:0 -20px -24px -20px; }
        }
      `}</style>

      <div ref={overlayRef} onClick={(e) => { if (e.target === overlayRef.current && step !== "upload") onClose(); }}
        role="dialog" aria-modal="true" aria-label={`Pay advance for ${product.name}`}
        style={{ position: "fixed", inset: 0, zIndex: 200, backgroundColor: "rgba(28,31,34,0.72)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", backdropFilter: "blur(2px)" }}
        className="modal-overlay">

        <div className="modal-panel" style={{
          backgroundColor: "#FFFFFF", width: "100%", maxWidth: 480,
          maxHeight: "90vh", overflow: "hidden", borderRadius: 2,
          border: `1px solid ${COLOR_HAIRLINE}`, display: "flex", flexDirection: "column",
        }}>
          {/* Header — flexShrink:0 keeps this fixed; only .modal-body below scrolls,
              so the product name, advance amount, and close button never clip mid-scroll.
              paddingTop clears the notch/status bar on full-screen mobile. */}
          <div style={{ backgroundColor: COLOR_ASPHALT, padding: "16px 20px", paddingTop: "max(16px, env(safe-area-inset-top))", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 2, border: "1px solid rgba(255,255,255,0.12)", backgroundColor: "rgba(255,255,255,0.06)", overflow: "hidden", flexShrink: 0 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={product.imageUrl} alt={product.name} width={48} height={48} style={{ objectFit: "cover" }} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
              </div>
              <div>
                <p style={{ fontFamily: "var(--font-space-grotesk), sans-serif", fontSize: 16, fontWeight: 700, color: COLOR_PAPER, margin: 0 }}>{product.name}</p>
                <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 12, color: COLOR_VOLT, margin: "2px 0 0" }}>Book with {fmt(product.advanceAmount)} advance</p>
              </div>
            </div>
            <button onClick={() => step !== "upload" && onClose()} aria-label="Close"
              style={{ background: "none", border: "none", color: "rgba(246,244,239,0.5)", fontSize: 22, cursor: "pointer", padding: 4, lineHeight: 1 }}>
              ×
            </button>
          </div>

          {/* Body — the only scrollable region in the modal. paddingBottom clears
              the home-indicator area so the last button is never flush with the edge. */}
          <div className="modal-body" style={{ padding: "24px 20px", paddingBottom: "max(24px, env(safe-area-inset-bottom))", flex: 1, overflowY: "auto", overscrollBehavior: "contain" }}>
            <StepIndicator current={step} />

            {/* Price breakdown (always visible) */}
            {step !== "done" && (
              <div style={{ border: `1px solid ${COLOR_HAIRLINE}`, borderRadius: 2, marginBottom: 24, overflow: "hidden" }}>
                <PriceRow label="On-road price" value={fmt(product.price)} note={product.priceNote} bold />
                <div style={{ borderTop: `1px dashed ${COLOR_HAIRLINE}`, margin: "0 12px" }} />
                <PriceRow label="Advance now" value={fmt(product.advanceAmount)} accent />
                <div style={{ borderTop: `1px dashed ${COLOR_HAIRLINE}`, margin: "0 12px" }} />
                <PriceRow label="Balance on delivery" value={fmt(balanceDue)} muted />
              </div>
            )}

            {/* ── Step 1: Details form ── */}
            {step === "details" && (
              <form onSubmit={handleDetailsSubmit} noValidate>
                {/* Contact details */}
                <Field id="modal-name" label="Full Name" error={errors.name}>
                  <input id="modal-name" ref={firstInputRef} type="text" autoComplete="name"
                    placeholder="e.g. Ajay Raju" value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    style={{ ...inputStyle, borderColor: errors.name ? COLOR_AMBER : COLOR_HAIRLINE }}
                    disabled={submitting} required />
                </Field>

                <Field id="modal-email" label="Email" error={errors.email}>
                  <input id="modal-email" type="email" autoComplete="email"
                    placeholder="you@example.com" value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    style={{ ...inputStyle, borderColor: errors.email ? COLOR_AMBER : COLOR_HAIRLINE }}
                    disabled={submitting} required />
                </Field>

                <Field id="modal-phone" label="Phone Number" error={errors.phone}>
                  <input id="modal-phone" type="tel" autoComplete="tel" placeholder="10-digit mobile number"
                    maxLength={10} inputMode="numeric" pattern="[6-9][0-9]{9}" value={form.phone}
                    onChange={(e) => set("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                    style={{ ...inputStyle, borderColor: errors.phone ? COLOR_AMBER : COLOR_HAIRLINE }}
                    disabled={submitting} required />
                </Field>

                <Field id="modal-color" label="Preferred Color" error={errors.color}>
                  <div style={{ position: "relative" }}>
                    <select id="modal-color" value={form.color} onChange={(e) => set("color", e.target.value)}
                      style={{ ...inputStyle, borderColor: errors.color ? COLOR_AMBER : COLOR_HAIRLINE, paddingRight: 36,
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%235B6470' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                        backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", cursor: "pointer" }}
                      disabled={submitting} required>
                      <option value="" disabled>Select a colour</option>
                      {product.colors.map((hex) => (
                        <option key={hex} value={hex}>{colorName(hex)}</option>
                      ))}
                    </select>
                    {form.color && (
                      <span aria-hidden="true" style={{ position: "absolute", right: 36, top: "50%", transform: "translateY(-50%)", width: 14, height: 14, borderRadius: 2, backgroundColor: form.color, border: `1px solid ${COLOR_HAIRLINE}`, pointerEvents: "none" }} />
                    )}
                  </div>
                </Field>

                <Field id="modal-city" label="Delivery City" error={errors.city}>
                  <input id="modal-city" type="text" autoComplete="address-level2"
                    placeholder="e.g. Chennai" value={form.city}
                    onChange={(e) => set("city", e.target.value)}
                    style={{ ...inputStyle, borderColor: errors.city ? COLOR_AMBER : COLOR_HAIRLINE }}
                    disabled={submitting} required />
                </Field>

                {/* ── Billing address (for tax invoice) ── */}
                <div style={{ margin: "20px 0 16px", display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ flex: 1, height: 1, backgroundColor: COLOR_HAIRLINE }} />
                  <span style={{ fontSize: 11, color: COLOR_STEEL, fontFamily: "var(--font-inter), sans-serif", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>
                    Billing Address (for Tax Invoice)
                  </span>
                  <div style={{ flex: 1, height: 1, backgroundColor: COLOR_HAIRLINE }} />
                </div>

                <Field id="modal-address" label="Street / Area" error={errors.address}>
                  <textarea
                    id="modal-address" value={form.address}
                    onChange={(e) => set("address", e.target.value)}
                    placeholder="Door no., Street, Area"
                    rows={2}
                    style={{ ...inputStyle, borderColor: errors.address ? COLOR_AMBER : COLOR_HAIRLINE, resize: "vertical" }}
                    disabled={submitting} required
                  />
                </Field>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 0 }}>
                  <Field id="modal-district" label="District" error={errors.district}>
                    <input id="modal-district" type="text" value={form.district}
                      onChange={(e) => set("district", e.target.value)}
                      placeholder="e.g. Chennai"
                      style={{ ...inputStyle, borderColor: errors.district ? COLOR_AMBER : COLOR_HAIRLINE }}
                      disabled={submitting} required />
                  </Field>
                  <Field id="modal-pin" label="PIN Code" error={errors.pin}>
                    <input id="modal-pin" type="text" value={form.pin}
                      onChange={(e) => set("pin", e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="6 digits" inputMode="numeric" maxLength={6}
                      style={{ ...inputStyle, borderColor: errors.pin ? COLOR_AMBER : COLOR_HAIRLINE }}
                      disabled={submitting} required />
                  </Field>
                </div>

                <Field id="modal-state" label="State" error={errors.state}>
                  <select id="modal-state" value={form.state} onChange={(e) => set("state", e.target.value)}
                    style={{ ...inputStyle, borderColor: errors.state ? COLOR_AMBER : COLOR_HAIRLINE,
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%235B6470' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center",
                      paddingRight: 36, cursor: "pointer" }}
                    disabled={submitting} required>
                    <option value="">Select state</option>
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </Field>

                <Field id="modal-gstin" label="GSTIN (optional)" error={errors.gstin}>
                  <input id="modal-gstin" type="text" value={form.gstin}
                    onChange={(e) => set("gstin", e.target.value.toUpperCase().slice(0, 15))}
                    placeholder="15-character GSTIN (if applicable)"
                    style={{ ...inputStyle, borderColor: errors.gstin ? COLOR_AMBER : COLOR_HAIRLINE }}
                    disabled={submitting} />
                </Field>

                {submitError && (
                  <div role="alert" style={{ padding: "10px 12px", backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: 2, marginBottom: 16, fontSize: 13, color: "#dc2626", fontFamily: "var(--font-inter), sans-serif" }}>
                    {submitError}
                  </div>
                )}

                <div className="modal-form-actions">
                  <button type="submit" disabled={submitting} style={{
                    width: "100%", padding: "13px 20px",
                    backgroundColor: submitting ? "#a8cf2a" : COLOR_VOLT,
                    color: COLOR_ASPHALT, fontFamily: "var(--font-space-grotesk), sans-serif",
                    fontSize: 15, fontWeight: 700, border: "none", borderRadius: 2,
                    cursor: submitting ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginTop: 8,
                  }}>
                    {submitting ? <><Spinner /> Creating order…</> : <>Proceed to Payment — {fmt(product.advanceAmount)}</>}
                  </button>
                  <button type="button" onClick={() => !submitting && onClose()} disabled={submitting} style={{
                    width: "100%", marginTop: 10, padding: "11px 20px",
                    backgroundColor: "transparent", color: COLOR_STEEL,
                    fontFamily: "var(--font-inter), sans-serif", fontSize: 14, fontWeight: 500,
                    border: `1px solid ${COLOR_HAIRLINE}`, borderRadius: 2, cursor: submitting ? "not-allowed" : "pointer",
                  }}>
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* ── Step 2: Payment ── */}
            {step === "payment" && order && (
              <PaymentStep
                order={order}
                advanceAmount={product.advanceAmount}
                onNext={() => setStep("upload")}
              />
            )}

            {/* ── Step 3: Upload ── */}
            {step === "upload" && order && billing && (
              <UploadStep
                order={order}
                billing={billing}
                onDone={handleUploadDone}
              />
            )}

            {/* ── Step 4: Done (only shown when invoice creation failed) ── */}
            {step === "done" && order && ocr && (
              <DoneStep order={order} ocr={ocr} invoiceId={invoiceId} onClose={onClose} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
