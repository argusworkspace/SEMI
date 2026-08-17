import { NextResponse } from "next/server";
import { internalFetch } from "@/lib/api/server";

export async function GET() {
  const res = await internalFetch(`/orders/config`, { next: { revalidate: 300 } });
  if (!res.ok) {
    return NextResponse.json(
      { error: "Could not fetch payment config" },
      { status: res.status }
    );
  }
  return NextResponse.json(await res.json());
}
