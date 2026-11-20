import "server-only";

import { Pool, type PoolClient, type QueryResultRow } from "pg";
import { getDatabaseUrl } from "@/lib/env";

type QueryParam = string | number | null | boolean | Date;

const globalForPool = globalThis as unknown as { scenovaPool?: Pool };

export const pool =
  globalForPool.scenovaPool ??
  new Pool({
    connectionString: getDatabaseUrl(),
    max: 5,
    idleTimeoutMillis: 30_000,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPool.scenovaPool = pool;
}

export async function query<T extends QueryResultRow>(
  text: string,
  params: QueryParam[] = [],
) {
  return pool.query<T>(text, params);
}

/**
 * Runs owned queries inside a transaction with the RLS identity set to the
 * authenticated user. Every business table policy reads this setting.
 */
export async function withUser<T>(
  userId: string,
  fn: (client: PoolClient) => Promise<T>,
): Promise<T> {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await client.query("SELECT set_config('app.current_user_id', $1, true)", [userId]);
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
