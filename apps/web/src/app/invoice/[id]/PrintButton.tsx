"use client";

export function PrintButton() {
  return (
    <div className="no-print" style={{ maxWidth: 800, margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, padding: "12px 16px", backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 6 }}>
      <div>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#166534" }}>Your invoice is ready!</p>
        <p style={{ margin: "2px 0 0", fontSize: 12, color: "#16a34a" }}>
          Click &quot;Print / Save as PDF&quot; → In the print dialog, set <strong>Destination → Save as PDF</strong>
        </p>
      </div>
      <button
        onClick={() => window.print()}
        style={{ padding: "10px 22px", backgroundColor: "#1c1f22", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 14, fontWeight: 700, flexShrink: 0, letterSpacing: "0.01em" }}
      >
        Print / Save as PDF
      </button>
    </div>
  );
}
