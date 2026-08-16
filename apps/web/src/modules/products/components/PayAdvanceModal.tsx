"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import type { Product } from "@/types/product";
import {
  initiateAdvancePayment,
  type AdvancePaymentResponse,
} from "@/lib/api/payments";
import {
  COLOR_ASPHALT,
  COLOR_PAPER,
  COLOR_VOLT,
  COLOR_AMBER,
  COLOR_STEEL,
  COLOR_HAIRLINE,
} from "@/lib/design-tokens";

// ── Types ──────────────────────────────────────────────────────────────────────
type ModalState = "idle" | "loading" | "success" | "error";

interface FormValues {
  name: string;
  phone: string;
  color: string;
  city: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  color?: string;
  city?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmt(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

function validate(v: FormValues, colors: string[]): FormErrors {
  const e: FormErrors = {};
  if (!v.name.trim()) e.name = "Full name is required";
  if (!/^[6-9]\d{9}$/.test(v.phone.trim()))
    e.phone = "Enter a valid 10-digit Indian mobile number";
  if (!v.color || !colors.includes(v.color)) e.color = "Select a colour";
  if (!v.city.trim()) e.city = "Delivery city is required";
  return e;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label
        htmlFor={id}
        style={{
          display: "block",
          fontSize: 12,
          fontWeight: 500,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: COLOR_STEEL,
          marginBottom: 6,
          fontFamily: "var(--font-inter), sans-serif",
        }}
      >
        {label}
      </label>
      {children}
      {error && (
        <p
          role="alert"
          style={{
            fontSize: 12,
            color: COLOR_AMBER,
            marginTop: 4,
            fontFamily: "var(--font-inter), sans-serif",
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  fontSize: 15,
  fontFamily: "var(--font-inter), sans-serif",
  color: COLOR_ASPHALT,
  backgroundColor: COLOR_PAPER,
  border: `1px solid ${COLOR_HAIRLINE}`,
  borderRadius: 2,
  outline: "none",
  appearance: "none",
};

// ── Spinner ───────────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      style={{ animation: "spin 0.8s linear infinite", display: "inline-block" }}
      aria-hidden="true"
    >
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}

// ── Main Modal ────────────────────────────────────────────────────────────────
export default function PayAdvanceModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const [form, setForm] = useState<FormValues>({
    name: "",
    phone: "",
    color: product.colors[0] ?? "",
    city: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [state, setState] = useState<ModalState>("idle");
  const [result, setResult] = useState<AdvancePaymentResponse | null>(null);

  const overlayRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  const balanceDue = product.price - product.advanceAmount;

  // Focus first input on open
  useEffect(() => {
    firstInputRef.current?.focus();
  }, []);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && state !== "loading") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, state]);

  // Lock body scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === overlayRef.current && state !== "loading") onClose();
  }

  function set(field: keyof FormValues, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validate(form, product.colors);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setState("loading");
    try {
      const res = await initiateAdvancePayment({
        productId: product.id,
        productName: product.name,
        customerName: form.name.trim(),
        phone: form.phone.trim(),
        color: form.color,
        city: form.city.trim(),
        advanceAmount: product.advanceAmount,
      });
      setResult(res);
      setState(res.success ? "success" : "error");
    } catch {
      setResult({ success: false, error: "Network error — please try again." });
      setState("error");
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Keyframe for spinner */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Backdrop */}
      <div
        ref={overlayRef}
        onClick={handleOverlayClick}
        role="dialog"
        aria-modal="true"
        aria-label={`Pay advance for ${product.name}`}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 200,
          backgroundColor: "rgba(28,31,34,0.72)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          backdropFilter: "blur(2px)",
        }}
      >
        {/* Panel */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            width: "100%",
            maxWidth: 480,
            maxHeight: "90vh",
            overflowY: "auto",
            borderRadius: 2,
            border: `1px solid ${COLOR_HAIRLINE}`,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* ── Header ────────────────────────────────────────────────── */}
          <div
            style={{
              backgroundColor: COLOR_ASPHALT,
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {/* Thumbnail */}
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  border: `1px solid rgba(255,255,255,0.12)`,
                  backgroundColor: "rgba(255,255,255,0.06)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  overflow: "hidden",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  width={48}
                  height={48}
                  style={{ objectFit: "cover", borderRadius: 2 }}
                  onError={(e) => {
                    // fallback: show volt square if image missing
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-space-grotesk), sans-serif",
                    fontSize: 16,
                    fontWeight: 700,
                    color: COLOR_PAPER,
                    margin: 0,
                  }}
                >
                  {product.name}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: 12,
                    color: COLOR_VOLT,
                    margin: 0,
                    marginTop: 2,
                  }}
                >
                  Book with {fmt(product.advanceAmount)} advance
                </p>
              </div>
            </div>

            {/* Close × */}
            <button
              onClick={() => state !== "loading" && onClose()}
              aria-label="Close modal"
              style={{
                background: "none",
                border: "none",
                color: "rgba(246,244,239,0.5)",
                fontSize: 22,
                cursor: state === "loading" ? "not-allowed" : "pointer",
                padding: 4,
                lineHeight: 1,
              }}
            >
              ×
            </button>
          </div>

          {/* ── Body ──────────────────────────────────────────────────── */}
          <div style={{ padding: "24px 20px" }}>

            {/* ── Price breakdown (ticket style) ────────────────────── */}
            <div
              style={{
                border: `1px solid ${COLOR_HAIRLINE}`,
                borderRadius: 2,
                marginBottom: 24,
                overflow: "hidden",
              }}
            >
              <PriceRow
                label="On-road price"
                value={fmt(product.price)}
                note={product.priceNote}
                bold
              />
              {/* Dashed tear-line divider — per design spec */}
              <div
                style={{
                  borderTop: `1px dashed ${COLOR_HAIRLINE}`,
                  margin: "0 12px",
                }}
              />
              <PriceRow label="Advance now" value={fmt(product.advanceAmount)} accent />
              <div
                style={{
                  borderTop: `1px dashed ${COLOR_HAIRLINE}`,
                  margin: "0 12px",
                }}
              />
              <PriceRow
                label="Balance on delivery"
                value={fmt(balanceDue)}
                muted
              />
            </div>

            {/* ── Success state ─────────────────────────────────────── */}
            {state === "success" && result && (
              <SuccessState
                transactionId={result.transactionId!}
                onClose={onClose}
              />
            )}

            {/* ── Error banner ──────────────────────────────────────── */}
            {state === "error" && result && (
              <div
                role="alert"
                style={{
                  padding: "12px 14px",
                  backgroundColor: "#FEF2F2",
                  border: "1px solid #FECACA",
                  borderRadius: 2,
                  marginBottom: 20,
                  fontSize: 14,
                  color: "#DC2626",
                  fontFamily: "var(--font-inter), sans-serif",
                }}
              >
                {result.error ?? "Something went wrong. Please try again."}
              </div>
            )}

            {/* ── Form (hidden on success) ──────────────────────────── */}
            {state !== "success" && (
              <form onSubmit={handleSubmit} noValidate>
                <Field id="modal-name" label="Full Name" error={errors.name}>
                  <input
                    id="modal-name"
                    ref={firstInputRef}
                    type="text"
                    autoComplete="name"
                    placeholder="e.g. Ajay Raju"
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    style={{
                      ...inputStyle,
                      borderColor: errors.name ? COLOR_AMBER : COLOR_HAIRLINE,
                    }}
                    disabled={state === "loading"}
                    required
                  />
                </Field>

                <Field
                  id="modal-phone"
                  label="Phone Number"
                  error={errors.phone}
                >
                  <input
                    id="modal-phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    inputMode="numeric"
                    pattern="[6-9][0-9]{9}"
                    value={form.phone}
                    onChange={(e) =>
                      set("phone", e.target.value.replace(/\D/g, "").slice(0, 10))
                    }
                    style={{
                      ...inputStyle,
                      borderColor: errors.phone ? COLOR_AMBER : COLOR_HAIRLINE,
                    }}
                    disabled={state === "loading"}
                    required
                  />
                </Field>

                <Field
                  id="modal-color"
                  label="Preferred Color"
                  error={errors.color}
                >
                  <div style={{ position: "relative" }}>
                    <select
                      id="modal-color"
                      value={form.color}
                      onChange={(e) => set("color", e.target.value)}
                      style={{
                        ...inputStyle,
                        borderColor: errors.color ? COLOR_AMBER : COLOR_HAIRLINE,
                        paddingRight: 36,
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%235B6470' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 12px center",
                        cursor: "pointer",
                      }}
                      disabled={state === "loading"}
                      required
                    >
                      <option value="" disabled>
                        Select a colour
                      </option>
                      {product.colors.map((hex) => (
                        <option key={hex} value={hex}>
                          {colorName(hex)}
                        </option>
                      ))}
                    </select>
                    {/* Colour swatch preview */}
                    {form.color && (
                      <span
                        aria-hidden="true"
                        style={{
                          position: "absolute",
                          right: 36,
                          top: "50%",
                          transform: "translateY(-50%)",
                          width: 14,
                          height: 14,
                          borderRadius: 2,
                          backgroundColor: form.color,
                          border: `1px solid ${COLOR_HAIRLINE}`,
                          pointerEvents: "none",
                        }}
                      />
                    )}
                  </div>
                </Field>

                <Field
                  id="modal-city"
                  label="Delivery City"
                  error={errors.city}
                >
                  <input
                    id="modal-city"
                    type="text"
                    autoComplete="address-level2"
                    placeholder="e.g. Chennai"
                    value={form.city}
                    onChange={(e) => set("city", e.target.value)}
                    style={{
                      ...inputStyle,
                      borderColor: errors.city ? COLOR_AMBER : COLOR_HAIRLINE,
                    }}
                    disabled={state === "loading"}
                    required
                  />
                </Field>

                {/* ── CTA ─────────────────────────────────────────── */}
                <button
                  id="modal-submit"
                  type="submit"
                  disabled={state === "loading"}
                  style={{
                    width: "100%",
                    padding: "13px 20px",
                    backgroundColor: state === "loading" ? "#a8cf2a" : COLOR_VOLT,
                    color: COLOR_ASPHALT,
                    fontFamily: "var(--font-space-grotesk), sans-serif",
                    fontSize: 15,
                    fontWeight: 700,
                    border: "none",
                    borderRadius: 2,
                    cursor: state === "loading" ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    marginTop: 8,
                    transition: "background-color 150ms ease",
                  }}
                >
                  {state === "loading" ? (
                    <>
                      <Spinner />
                      Processing…
                    </>
                  ) : (
                    <>Confirm Advance Payment — {fmt(product.advanceAmount)}</>
                  )}
                </button>

                {/* Cancel */}
                <button
                  type="button"
                  onClick={() => state !== "loading" && onClose()}
                  disabled={state === "loading"}
                  style={{
                    width: "100%",
                    marginTop: 10,
                    padding: "11px 20px",
                    backgroundColor: "transparent",
                    color: COLOR_STEEL,
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: 14,
                    fontWeight: 500,
                    border: `1px solid ${COLOR_HAIRLINE}`,
                    borderRadius: 2,
                    cursor: state === "loading" ? "not-allowed" : "pointer",
                  }}
                >
                  Cancel
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ── Price row sub-component ────────────────────────────────────────────────────
function PriceRow({
  label,
  value,
  note,
  bold,
  accent,
  muted,
}: {
  label: string;
  value: string;
  note?: string;
  bold?: boolean;
  accent?: boolean;
  muted?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 14px",
        backgroundColor: accent ? "rgba(200,241,53,0.08)" : "transparent",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-inter), sans-serif",
          fontSize: 13,
          color: muted ? COLOR_STEEL : COLOR_ASPHALT,
          fontWeight: bold ? 600 : 400,
        }}
      >
        {label}
        {note && (
          <span
            style={{ fontSize: 11, color: COLOR_STEEL, marginLeft: 4 }}
          >
            ({note})
          </span>
        )}
      </span>
      <span
        style={{
          fontFamily: "var(--font-space-grotesk), sans-serif",
          fontSize: bold ? 16 : 14,
          fontWeight: bold ? 700 : accent ? 700 : 500,
          color: accent ? "#5a8a00" : muted ? COLOR_STEEL : COLOR_ASPHALT,
        }}
      >
        {value}
      </span>
    </div>
  );
}

// ── Success state ──────────────────────────────────────────────────────────────
function SuccessState({
  transactionId,
  onClose,
}: {
  transactionId: string;
  onClose: () => void;
}) {
  return (
    <div style={{ textAlign: "center", padding: "8px 0 16px" }}>
      {/* Green check circle */}
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          backgroundColor: "#DCFCE7",
          border: "2px solid #86EFAC",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 16px",
        }}
      >
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#16A34A"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <p
        style={{
          fontFamily: "var(--font-space-grotesk), sans-serif",
          fontSize: 17,
          fontWeight: 700,
          color: COLOR_ASPHALT,
          margin: "0 0 8px",
        }}
      >
        Advance received!
      </p>
      <p
        style={{
          fontFamily: "var(--font-inter), sans-serif",
          fontSize: 14,
          color: COLOR_STEEL,
          margin: "0 0 16px",
          lineHeight: "20px",
        }}
      >
        We&apos;ll call you shortly to confirm delivery details.
      </p>

      {/* Transaction ID chip */}
      <div
        style={{
          display: "inline-block",
          padding: "6px 14px",
          backgroundColor: COLOR_PAPER,
          border: `1px solid ${COLOR_HAIRLINE}`,
          borderRadius: 2,
          marginBottom: 20,
        }}
      >
        <span
          style={{
            fontSize: 11,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: COLOR_STEEL,
            fontFamily: "var(--font-inter), sans-serif",
          }}
        >
          Txn ID&nbsp;
        </span>
        <span
          style={{
            fontFamily: "var(--font-space-grotesk), sans-serif",
            fontSize: 13,
            fontWeight: 600,
            color: COLOR_ASPHALT,
          }}
        >
          {transactionId}
        </span>
      </div>

      <br />
      <button
        onClick={onClose}
        style={{
          padding: "11px 28px",
          backgroundColor: COLOR_VOLT,
          color: COLOR_ASPHALT,
          fontFamily: "var(--font-space-grotesk), sans-serif",
          fontSize: 14,
          fontWeight: 700,
          border: "none",
          borderRadius: 2,
          cursor: "pointer",
        }}
      >
        Done
      </button>
    </div>
  );
}

// ── Colour name lookup ─────────────────────────────────────────────────────────
function colorName(hex: string): string {
  const map: Record<string, string> = {
    "#FFFFFF": "Pearl White",
    "#3B82F6": "Ocean Blue",
    "#EAB308": "Solar Yellow",
    "#374151": "Charcoal Grey",
  };
  return map[hex.toUpperCase()] ?? map[hex] ?? hex;
}
