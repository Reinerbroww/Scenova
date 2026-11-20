import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { deleteSession, getSessionUser, type PublicUser } from "@/lib/db/users";

export const SESSION_COOKIE = "scenova_session";
const MAX_AGE = 7 * 24 * 60 * 60;

export async function setSessionCookie(token: string): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;

  if (token) {
    await deleteSession(token);
  }

  store.delete(SESSION_COOKIE);
}

export async function getCurrentUser(): Promise<PublicUser | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;

  if (!token) return null;

  return getSessionUser(token);
}

export async function requireUser(): Promise<PublicUser> {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}
