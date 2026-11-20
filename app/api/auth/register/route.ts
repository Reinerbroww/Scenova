import { NextResponse } from "next/server";
import { fail, handleError, ok } from "@/lib/api/respond";
import { setSessionCookie } from "@/lib/auth/session";
import { hashPassword } from "@/lib/auth/password";
import { createSession, createUser } from "@/lib/db/users";
import { registerSchema } from "@/lib/simulation/validate";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = registerSchema.parse(body);
    const user = await createUser({
      name: input.name,
      email: input.email,
      passwordHash: await hashPassword(input.password),
    });

    if (!user) {
      return fail("An account with this email already exists.", 409);
    }

    const token = await createSession(user.id);
    await setSessionCookie(token);

    return ok({ user });
  } catch (error) {
    return handleError(error);
  }
}

export function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
