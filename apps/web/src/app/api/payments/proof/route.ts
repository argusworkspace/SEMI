import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const orderId = formData.get("orderId") as string;
  const file = formData.get("file") as File | null;

  if (!orderId || !file) {
    return NextResponse.json(
      { success: false, error: "orderId and file are required" },
      { status: 400 }
    );
  }

  // Forward multipart to FastAPI
  const apiForm = new FormData();
  apiForm.append("file", file);

  const res = await fetch(`${API_URL}/orders/${orderId}/payment-proof`, {
    method: "POST",
    body: apiForm,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Upload failed" }));
    return NextResponse.json(
      { success: false, error: err.detail ?? "Upload failed" },
      { status: res.status }
    );
  }

  const result = await res.json();
  return NextResponse.json({ success: true, ...result });
}
