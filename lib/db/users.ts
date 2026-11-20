import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { query } from "@/lib/db/client";

export interface UserRecord {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
}

export interface PublicUser {
  id: string;
  email: string;
  name: string;
}

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  const result = await query<UserRecord>(
    "SELECT * FROM app_users WHERE email = lower($1) LIMIT 1",
    [email.trim().toLowerCase()],
  );
  return result.rows[0] ?? null;
}

export async function createUser(input: {
  name: string;
  email: string;
  passwordHash: string;
}): Promise<PublicUser | null> {
  const result = await query<PublicUser>(
    `INSERT INTO app_users (name, email, password_hash)
     VALUES ($1, lower($2), $3)
     ON CONFLICT (email) DO NOTHING
     RETURNING id, email, name`,
    [input.name, input.email.trim().toLowerCase(), input.passwordHash],
  );
  return result.rows[0] ?? null;
}

export async function createSession(userId: string): Promise<string> {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await query(
    "INSERT INTO sessions (user_id, token_hash, expires_at) VALUES ($1, $2, $3)",
    [userId, hashToken(token), expiresAt],
  );

  return token;
}

export async function getSessionUser(token: string): Promise<PublicUser | null> {
  const result = await query<PublicUser>(
    `SELECT u.id, u.email, u.name
     FROM sessions s
     JOIN app_users u ON u.id = s.user_id
     WHERE s.token_hash = $1 AND s.expires_at > now()
     LIMIT 1`,
    [hashToken(token)],
  );
  return result.rows[0] ?? null;
}

export async function deleteSession(token: string): Promise<void> {
  await query("DELETE FROM sessions WHERE token_hash = $1", [hashToken(token)]);
}

export async function deleteExpiredSessions(): Promise<void> {
  await query("DELETE FROM sessions WHERE expires_at <= now()");
}
