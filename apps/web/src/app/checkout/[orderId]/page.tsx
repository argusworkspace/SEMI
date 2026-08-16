"use client";

import { FormEvent, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab",
  "Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh",
  "Uttarakhand","West Bengal","Andaman & Nicobar Islands","Chandigarh",
  "Dadra & Nagar Haveli and Daman & Diu","Delhi","Jammu & Kashmir","Ladakh",
  "Lakshadweep","Puducherry",
];

interface FormValues {
  name: string;
  address: string;
  district: string;
  pin: string;
  state: string;
  gstin: string;
}

interface FormErrors {
  name?: string;
  address?: string;
  district?: string;
  pin?: string;
  state?: string;
  gstin?: string;
}

function validate(v: FormValues): FormErrors {
  const e: FormErrors = {};
  if (!v.name.trim()) e.name = "Full name is required";
  if (!v.address.trim()) e.address = "Address is required";
  if (!v.district.trim()) e.district = "District is required";
  if (!/^\d{6}$/.test(v.pin.trim())) e.pin = "Enter a valid 6-digit PIN code";
  if (!v.state) e.state = "Select a state";
  if (v.gstin && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(v.gstin))
    e.gstin = "Invalid GSTIN format";
  return e;
}

export default function BuyerDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;

  const [form, setForm] = useState<FormValues>({
    name: "", address: "", district: "", pin: "", state: "", gstin: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function set(field: keyof FormValues, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSubmitting(true);
    setSubmitError(null);

    const res = await fetch("/api/invoice/buyer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, ...form }),
    });

    setSubmitting(false);

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Failed" }));
      setSubmitError(err.error ?? "Something went wrong. Please try again.");
      return;
    }

    const data = await res.json();
    router.push(`/invoice/${data.invoiceId}`);
  }

  const inputCls: React.CSSProperties = {
    width: "100%", padding: "10px 12px", fontSize: 15, borderRadius: 4,
    border: "1px solid #d1d5db", outline: "none", fontFamily: "inherit",
    backgroundColor: "#fff", boxSizing: "border-box",
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb", padding: "40px 16px" }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 32, textAlign: "center" }}>
          <p style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6b7280", marginBottom: 6 }}>
            Tax Invoice Details
          </p>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111827", margin: 0 }}>
            Billing Information
          </h1>
          <p style={{ fontSize: 14, color: "#6b7280", marginTop: 8 }}>
            These details will appear on your advance payment tax invoice.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{
          backgroundColor: "#fff", borderRadius: 8,
          border: "1px solid #e5e7eb", padding: "28px 24px",
        }}>
          {/* Full Name */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
              Full Name (as per GST / invoice) *
            </label>
            <input
              type="text" value={form.name} onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Riyaz A" style={{ ...inputCls, borderColor: errors.name ? "#ef4444" : "#d1d5db" }}
              disabled={submitting} required
            />
            {errors.name && <p style={{ fontSize: 12, color: "#ef4444", marginTop: 4 }}>{errors.name}</p>}
          </div>

          {/* Address */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
              Address *
            </label>
            <textarea
              value={form.address} onChange={(e) => set("address", e.target.value)}
              placeholder="Door no., Street, Area"
              rows={3}
              style={{ ...inputCls, borderColor: errors.address ? "#ef4444" : "#d1d5db", resize: "vertical" }}
              disabled={submitting} required
            />
            {errors.address && <p style={{ fontSize: 12, color: "#ef4444", marginTop: 4 }}>{errors.address}</p>}
          </div>

          {/* District + PIN */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                District *
              </label>
              <input
                type="text" value={form.district} onChange={(e) => set("district", e.target.value)}
                placeholder="e.g. Chennai" style={{ ...inputCls, borderColor: errors.district ? "#ef4444" : "#d1d5db" }}
                disabled={submitting} required
              />
              {errors.district && <p style={{ fontSize: 12, color: "#ef4444", marginTop: 4 }}>{errors.district}</p>}
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                PIN Code *
              </label>
              <input
                type="text" value={form.pin} onChange={(e) => set("pin", e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="6-digit PIN" inputMode="numeric" maxLength={6}
                style={{ ...inputCls, borderColor: errors.pin ? "#ef4444" : "#d1d5db" }}
                disabled={submitting} required
              />
              {errors.pin && <p style={{ fontSize: 12, color: "#ef4444", marginTop: 4 }}>{errors.pin}</p>}
            </div>
          </div>

          {/* State */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
              State *
            </label>
            <select
              value={form.state} onChange={(e) => set("state", e.target.value)}
              style={{ ...inputCls, borderColor: errors.state ? "#ef4444" : "#d1d5db", cursor: "pointer" }}
              disabled={submitting} required
            >
              <option value="">Select state</option>
              {INDIAN_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {errors.state && <p style={{ fontSize: 12, color: "#ef4444", marginTop: 4 }}>{errors.state}</p>}
          </div>

          {/* GSTIN (optional) */}
          <div style={{ marginBottom: 28 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 4 }}>
              GSTIN <span style={{ fontWeight: 400, color: "#9ca3af" }}>(optional)</span>
            </label>
            <input
              type="text" value={form.gstin}
              onChange={(e) => set("gstin", e.target.value.toUpperCase().slice(0, 15))}
              placeholder="15-character GSTIN"
              style={{ ...inputCls, borderColor: errors.gstin ? "#ef4444" : "#d1d5db" }}
              disabled={submitting}
            />
            {errors.gstin && <p style={{ fontSize: 12, color: "#ef4444", marginTop: 4 }}>{errors.gstin}</p>}
          </div>

          {submitError && (
            <div style={{ padding: "10px 14px", backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: 4, marginBottom: 20, fontSize: 13, color: "#dc2626" }}>
              {submitError}
            </div>
          )}

          <button
            type="submit" disabled={submitting}
            style={{
              width: "100%", padding: "13px 20px",
              backgroundColor: submitting ? "#d1d5db" : "#1c1f22",
              color: "#fff", fontSize: 15, fontWeight: 700,
              border: "none", borderRadius: 4, cursor: submitting ? "not-allowed" : "pointer",
            }}
          >
            {submitting ? "Generating Invoice…" : "Generate Tax Invoice →"}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: 12, color: "#9ca3af", marginTop: 16 }}>
          Your invoice will be generated immediately and can be downloaded.
        </p>
      </div>
    </div>
  );
}
