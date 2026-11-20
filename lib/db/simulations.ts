import "server-only";

import type {
  BusinessRow,
  SimulationDetail,
  SimulationRow,
  SimulationSummary,
} from "@/lib/db/models";
import { withUser } from "@/lib/db/client";
import type { SetupInput } from "@/lib/simulation/validate";

export async function createSimulation(
  userId: string,
  input: SetupInput,
): Promise<{ id: string }> {
  return withUser(userId, async (client) => {
    const business = await client.query<BusinessRow>(
      `INSERT INTO businesses (user_id, name, business_type)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [userId, input.businessName, input.businessType],
    );

    const simulation = await client.query<SimulationRow>(
      `INSERT INTO simulations (business_id, user_id, name, period)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [business.rows[0].id, userId, input.simulationName, input.period],
    );

    await client.query(
      `INSERT INTO scenarios
         (simulation_id, user_id, name, average_transaction_value,
          variable_cost_per_transaction, fixed_cost, transaction_volume)
       VALUES ($1, $2, 'Baseline', $3, $4, $5, $6)`,
      [
        simulation.rows[0].id,
        userId,
        input.averageTransactionValue,
        input.variableCostPerTransaction,
        input.fixedCost,
        input.transactionVolume,
      ],
    );

    return { id: simulation.rows[0].id };
  });
}

export async function listSimulations(userId: string): Promise<SimulationSummary[]> {
  return withUser(userId, async (client) => {
    const result = await client.query<SimulationSummary>(
      `SELECT s.id, s.business_id, s.user_id, s.name, s.period,
              s.created_at, s.updated_at, b.name AS business_name,
              b.business_type, COUNT(sc.id)::int AS scenario_count
       FROM simulations s
       JOIN businesses b ON b.id = s.business_id
       LEFT JOIN scenarios sc ON sc.simulation_id = s.id
       WHERE s.user_id = $1
       GROUP BY s.id, b.id
       ORDER BY s.updated_at DESC`,
      [userId],
    );
    return result.rows;
  });
}

export async function getSimulation(
  userId: string,
  id: string,
): Promise<SimulationDetail | null> {
  return withUser(userId, async (client) => {
    const result = await client.query<SimulationDetail>(
      `SELECT s.id, s.business_id, s.user_id, s.name, s.period,
              s.created_at, s.updated_at, b.name AS business_name,
              b.business_type
       FROM simulations s
       JOIN businesses b ON b.id = s.business_id
       WHERE s.id = $1 AND s.user_id = $2
       LIMIT 1`,
      [id, userId],
    );
    return result.rows[0] ?? null;
  });
}

export async function renameSimulation(
  userId: string,
  id: string,
  name: string,
): Promise<boolean> {
  return withUser(userId, async (client) => {
    const result = await client.query(
      "UPDATE simulations SET name = $1 WHERE id = $2 AND user_id = $3",
      [name, id, userId],
    );
    return (result.rowCount ?? 0) > 0;
  });
}

export async function deleteSimulation(userId: string, id: string): Promise<boolean> {
  return withUser(userId, async (client) => {
    const existing = await client.query<SimulationRow>(
      "SELECT business_id FROM simulations WHERE id = $1 AND user_id = $2",
      [id, userId],
    );

    if (existing.rowCount === 0) return false;

    const businessId = existing.rows[0].business_id;
    await client.query("DELETE FROM simulations WHERE id = $1 AND user_id = $2", [id, userId]);

    const remaining = await client.query(
      "SELECT 1 FROM simulations WHERE business_id = $1 LIMIT 1",
      [businessId],
    );

    if (remaining.rowCount === 0) {
      await client.query("DELETE FROM businesses WHERE id = $1 AND user_id = $2", [
        businessId,
        userId,
      ]);
    }

    return true;
  });
}

export async function touchSimulation(userId: string, id: string): Promise<void> {
  await withUser(userId, async (client) => {
    await client.query("UPDATE simulations SET name = name WHERE id = $1 AND user_id = $2", [
      id,
      userId,
    ]);
  });
}
