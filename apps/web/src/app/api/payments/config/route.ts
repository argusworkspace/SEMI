import { NextRequest, NextResponse } from "next/server";
import { internalFetch } from "@/lib/api/server";

export async function GET(req: NextRequest) {
  const res = await internalFetch(
    `/orders/config`,
    { next: { revalidate: 300 } },
    req.nextUrl.origin
  );
  if (!res.ok) {
    return NextResponse.json(
      { error: "Could not fetch payment config" },
      { status: res.status }
    );
  }
  return NextResponse.json(await res.json());
}
