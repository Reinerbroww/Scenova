import { NextResponse } from "next/server";
import { fail, handleError, ok } from "@/lib/api/respond";
import { setSessionCookie } from "@/lib/auth/session";
import { verifyPassword } from "@/lib/auth/password";
import { createSession, findUserByEmail } from "@/lib/db/users";
import { loginSchema } from "@/lib/simulation/validate";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = loginSchema.parse(body);
    const user = await findUserByEmail(input.email);

    if (!user || !(await verifyPassword(input.password, user.password_hash))) {
      return fail("Invalid email or password.", 401);
    }

    const token = await createSession(user.id);
    await setSessionCookie(token);

    return ok({ user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    return handleError(error);
  }
}

export function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
