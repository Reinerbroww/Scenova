import { handleError, ok, fail } from "@/lib/api/respond";
import { getCurrentUser } from "@/lib/auth/session";
import { createScenario } from "@/lib/db/scenarios";
import { scenarioSchema } from "@/lib/simulation/validate";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser();

    if (!user) return fail("Please sign in.", 401);

    const { id } = await params;
    const input = scenarioSchema.parse(await request.json());
    const scenario = await createScenario(user.id, id, input);

    if (!scenario) return fail("Simulation not found.", 404);

    return ok(scenario, 201);
  } catch (error) {
    return handleError(error);
  }
}
