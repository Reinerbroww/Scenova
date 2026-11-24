import { z } from "zod";
import { fail, handleError, ok } from "@/lib/api/respond";
import { AiServiceError, generateInsight } from "@/lib/ai/insights";
import { getCurrentUser } from "@/lib/auth/session";
import { listScenarios } from "@/lib/db/scenarios";
import { getSimulation } from "@/lib/db/simulations";
import { getLanguage } from "@/lib/i18n/server";
import { assumptionsSchema } from "@/lib/simulation/validate";
import type { Assumptions } from "@/lib/simulation/types";

const insightRequestSchema = z.object({
  simulationId: z.string().min(1),
  scenarioId: z.string().min(1).optional(),
  assumptions: assumptionsSchema.optional(),
});

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) return fail("Please sign in.", 401);

    const input = insightRequestSchema.parse(await request.json());
    const simulation = await getSimulation(user.id, input.simulationId);

    if (!simulation) return fail("Simulation not found.", 404);

    const language = await getLanguage();

    let scenarioName = language === "id" ? "Nilai saat ini" : "Current values";
    let assumptions: Assumptions;

    if (input.assumptions) {
      assumptions = {
        averageTransactionValue: Number(input.assumptions.averageTransactionValue),
        variableCostPerTransaction: Number(input.assumptions.variableCostPerTransaction),
        fixedCost: Number(input.assumptions.fixedCost),
        transactionVolume: input.assumptions.transactionVolume,
      };
    } else {
      if (!input.scenarioId) return fail("Scenario not found.", 404);

      const scenarios = await listScenarios(user.id, simulation.id);
      const scenario = scenarios.find((item) => item.id === input.scenarioId);

      if (!scenario) return fail("Scenario not found.", 404);

      scenarioName = scenario.name;
      assumptions = scenario.assumptions;
    }

    const insight = await generateInsight({
      simulationName: simulation.name,
      businessName: simulation.business_name,
      businessType: simulation.business_type,
      period: simulation.period,
      scenarioName,
      assumptions,
      language,
    });

    return ok(insight);
  } catch (error) {
    if (error instanceof AiServiceError) {
      return fail(error.message, error.status);
    }

    if (error instanceof Error && error.message.includes("GEMINI_API_KEY")) {
      return fail("AI insight is not configured yet. Please try again later.", 503);
    }

    return handleError(error);
  }
}
