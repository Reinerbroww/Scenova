import { NextResponse } from "next/server";
import { handleError, ok } from "@/lib/api/respond";
import { clearSessionCookie } from "@/lib/auth/session";

export async function POST() {
  try {
    await clearSessionCookie();
    return ok({ signedOut: true });
  } catch (error) {
    return handleError(error);
  }
}

export function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
