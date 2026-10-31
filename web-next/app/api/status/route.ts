import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function GET() {
  return NextResponse.json({ mode: "fictional-demo", productionIntake: false, senderVerified: false, deliveryEnabled: false, cases: 10 }, { headers: { "Cache-Control": "no-store" } });
}
