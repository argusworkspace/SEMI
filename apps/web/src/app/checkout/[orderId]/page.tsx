"use client";

import { FormEvent, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
  "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
  "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram",
  "Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
  "Andaman and Nicobar Islands","Chandigarh","Dadra and Nagar Haveli and Daman and Diu",
  "Delhi","Jammu and Kashmir","Ladakh","Lakshadweep","Puducherry",
];

interface FormValues {
  name: string;
  address: string;
  district: string;
  pin: string;
  state: string;
  gstin: string;
}

export default function BuyerDetailsPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const router = useRouter();

  const [form, setForm] = useState<FormValues>({
    name: "", address: "", district: "", pin: "", state: "", gstin: "",
  });
  const [errors, setErrors] = useState<Partial<FormValues>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  function set(field: keyof FormValues, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function validate(): boolean {
    const e: Partial<FormValues> = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.address.trim() || form.address.trim().length < 5) e.address = "Enter full address";
    if (!form.district.trim()) e.district = "Required";
    if (!/^\d{6}$/.test(form.pin)) e.pin = "6-digit PIN required";
    if (!form.state) e.state = "Select a state";
    if (form.gstin && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(form.gstin)) {
      e.gstin = "Invalid GSTIN format";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setServerError(null);

    try {
      const res = await fetch("/api/invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          name: form.name.trim(),
          address: form.address.trim(),
          district: form.district.trim(),
          pin: form.pin.trim(),
          state: form.state,
          gstin: form.gstin.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setServerError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      router.push(`/invoice/${data.invoice.id}`);
    } catch {
      setServerError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: 12, fontWeight: 600,
    letterSpacing: "0.08em", textTransform: "uppercase",
    color: "#5B6470", marginBottom: 6,
  };
  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 12px", fontSize: 15,
    border: "1px solid #E5E7EB", borderRadius: 4,
    backgroundColor: "#FAFAF8", outline: "none", boxSizing: "border-box",
  };
  const errorStyle: React.CSSProperties = {
    fontSize: 12, color: "#DC2626", marginTop: 4,
  };

  return (
    <div style={{
      minHeight: "100vh", backgroundColor: "#F9FAFB",
      display: "flex", alignItems: "flex-start", justifyContent: "center",
      padding: "40px 16px",
    }}>
      <div style={{
        width: "100%", maxWidth: 520, backgroundColor: "#fff",
        border: "1px solid #E5E7EB", borderRadius: 4, overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{ backgroundColor: "#1C1F22", padding: "20px 24px" }}>
          <p style={{ color: "#C8F135", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 4px" }}>
            SEMY Mobility
          </p>
          <h1 style={{ color: "#F6F4EF", fontSize: 20, fontWeight: 700, margin: 0 }}>
            Billing Details
          </h1>
          <p style={{ color: "#9CA3AF", fontSize: 13, margin: "4px 0 0" }}>
            This information will appear on your tax invoice
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: 24 }} noValidate>
          {/* Name */}
          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>Full Name *</label>
            <input
              type="text" value={form.name} autoComplete="name"
              placeholder="As per government ID"
              onChange={(e) => set("name", e.target.value)}
              style={{ ...inputStyle, borderColor: errors.name ? "#DC2626" : "#E5E7EB" }}
              disabled={submitting}
            />
            {errors.name && <p style={errorStyle}>{errors.name}</p>}
          </div>

          {/* Address */}
          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>Address *</label>
            <textarea
              value={form.address} rows={3} placeholder="Door no, Street, Area"
              onChange={(e) => set("address", e.target.value)}
              style={{ ...inputStyle, borderColor: errors.address ? "#DC2626" : "#E5E7EB", resize: "vertical" }}
              disabled={submitting}
            />
            {errors.address && <p style={errorStyle}>{errors.address}</p>}
          </div>

          {/* District + PIN */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 18 }}>
            <div>
              <label style={labelStyle}>District *</label>
              <input
                type="text" value={form.district} placeholder="e.g. Chennai"
                onChange={(e) => set("district", e.target.value)}
                style={{ ...inputStyle, borderColor: errors.district ? "#DC2626" : "#E5E7EB" }}
                disabled={submitting}
              />
              {errors.district && <p style={errorStyle}>{errors.district}</p>}
            </div>
            <div>
              <label style={labelStyle}>PIN Code *</label>
              <input
                type="text" value={form.pin} placeholder="6 digits" maxLength={6}
                inputMode="numeric" pattern="\d{6}"
                onChange={(e) => set("pin", e.target.value.replace(/\D/g, "").slice(0, 6))}
                style={{ ...inputStyle, borderColor: errors.pin ? "#DC2626" : "#E5E7EB" }}
                disabled={submitting}
              />
              {errors.pin && <p style={errorStyle}>{errors.pin}</p>}
            </div>
          </div>

          {/* State */}
          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>State *</label>
            <select
              value={form.state}
              onChange={(e) => set("state", e.target.value)}
              style={{ ...inputStyle, borderColor: errors.state ? "#DC2626" : "#E5E7EB", cursor: "pointer" }}
              disabled={submitting}
            >
              <option value="">Select state</option>
              {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            {errors.state && <p style={errorStyle}>{errors.state}</p>}
          </div>

          {/* GSTIN (optional) */}
          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>GSTIN <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional)</span></label>
            <input
              type="text" value={form.gstin} placeholder="22AAAAA0000A1Z5"
              maxLength={15}
              onChange={(e) => set("gstin", e.target.value.toUpperCase())}
              style={{ ...inputStyle, borderColor: errors.gstin ? "#DC2626" : "#E5E7EB", fontFamily: "monospace" }}
              disabled={submitting}
            />
            {errors.gstin && <p style={errorStyle}>{errors.gstin}</p>}
          </div>

          {serverError && (
            <div style={{ padding: "10px 14px", backgroundColor: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 4, marginBottom: 16, fontSize: 13, color: "#DC2626" }}>
              {serverError}
            </div>
          )}

          <button
            type="submit" disabled={submitting}
            style={{
              width: "100%", padding: "14px 20px",
              backgroundColor: submitting ? "#B5DD3A" : "#C8F135",
              color: "#1C1F22", fontSize: 15, fontWeight: 700,
              border: "none", borderRadius: 4, cursor: submitting ? "not-allowed" : "pointer",
            }}
          >
            {submitting ? "Generating Invoice…" : "Generate Tax Invoice →"}
          </button>
        </form>
      </div>
    </div>
  );
}
