import "server-only";

import { withUser } from "@/lib/db/client";
import { ConflictError } from "@/lib/errors";
import type { ScenarioRow, ScenarioView } from "@/lib/db/models";
import type { ScenarioInput } from "@/lib/simulation/validate";

export function toScenarioView(row: ScenarioRow): ScenarioView {
  return {
    id: row.id,
    name: row.name,
    assumptions: {
      averageTransactionValue: Number(row.average_transaction_value),
      variableCostPerTransaction: Number(row.variable_cost_per_transaction),
      fixedCost: Number(row.fixed_cost),
      transactionVolume: row.transaction_volume,
    },
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

export async function listScenarios(
  userId: string,
  simulationId: string,
): Promise<ScenarioView[]> {
  return withUser(userId, async (client) => {
    const result = await client.query<ScenarioRow>(
      `SELECT * FROM scenarios
       WHERE simulation_id = $1 AND user_id = $2
       ORDER BY created_at ASC`,
      [simulationId, userId],
    );
    return result.rows.map(toScenarioView);
  });
}

export async function getScenario(
  userId: string,
  id: string,
): Promise<ScenarioView | null> {
  return withUser(userId, async (client) => {
    const result = await client.query<ScenarioRow>(
      "SELECT * FROM scenarios WHERE id = $1 AND user_id = $2",
      [id, userId],
    );
    return result.rows[0] ? toScenarioView(result.rows[0]) : null;
  });
}

export async function createScenario(
  userId: string,
  simulationId: string,
  input: ScenarioInput,
): Promise<ScenarioView | null> {
  return withUser(userId, async (client) => {
    const simulation = await client.query(
      "SELECT 1 FROM simulations WHERE id = $1 AND user_id = $2",
      [simulationId, userId],
    );

    if (simulation.rowCount === 0) return null;

    try {
      const result = await client.query<ScenarioRow>(
        `INSERT INTO scenarios
           (simulation_id, user_id, name, average_transaction_value,
            variable_cost_per_transaction, fixed_cost, transaction_volume)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [
          simulationId,
          userId,
          input.name,
          input.averageTransactionValue,
          input.variableCostPerTransaction,
          input.fixedCost,
          input.transactionVolume,
        ],
      );
      await client.query(
        "UPDATE simulations SET name = name WHERE id = $1 AND user_id = $2",
        [simulationId, userId],
      );
      return toScenarioView(result.rows[0]);
    } catch (error) {
      if ((error as { code?: string }).code === "23505") {
        throw new ConflictError("A scenario with this name already exists in this simulation.");
      }
      throw error;
    }
  });
}

export async function updateScenario(
  userId: string,
  id: string,
  input: ScenarioInput,
): Promise<ScenarioView | null> {
  return withUser(userId, async (client) => {
    try {
      const result = await client.query<ScenarioRow>(
        `UPDATE scenarios
         SET name = $1,
             average_transaction_value = $2,
             variable_cost_per_transaction = $3,
             fixed_cost = $4,
             transaction_volume = $5,
             updated_at = now()
         WHERE id = $6 AND user_id = $7
         RETURNING *`,
        [
          input.name,
          input.averageTransactionValue,
          input.variableCostPerTransaction,
          input.fixedCost,
          input.transactionVolume,
          id,
          userId,
        ],
      );
      return result.rows[0] ? toScenarioView(result.rows[0]) : null;
    } catch (error) {
      if ((error as { code?: string }).code === "23505") {
        throw new ConflictError("A scenario with this name already exists in this simulation.");
      }
      throw error;
    }
  });
}

export async function deleteScenario(userId: string, id: string): Promise<boolean> {
  return withUser(userId, async (client) => {
    const result = await client.query(
      "DELETE FROM scenarios WHERE id = $1 AND user_id = $2",
      [id, userId],
    );
    return (result.rowCount ?? 0) > 0;
  });
}
