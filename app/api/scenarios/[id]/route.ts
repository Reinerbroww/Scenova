import { handleError, ok, fail } from "@/lib/api/respond";
import { getCurrentUser } from "@/lib/auth/session";
import { deleteScenario, updateScenario } from "@/lib/db/scenarios";
import { scenarioSchema } from "@/lib/simulation/validate";

interface Context {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: Context) {
  try {
    const user = await getCurrentUser();
    if (!user) return fail("Please sign in.", 401);

    const { id } = await params;
    const input = scenarioSchema.parse(await request.json());
    const scenario = await updateScenario(user.id, id, input);

    if (!scenario) return fail("Scenario not found.", 404);

    return ok(scenario);
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(_request: Request, { params }: Context) {
  try {
    const user = await getCurrentUser();
    if (!user) return fail("Please sign in.", 401);

    const { id } = await params;
    const deleted = await deleteScenario(user.id, id);

    if (!deleted) return fail("Scenario not found.", 404);

    return ok({ deleted: true });
  } catch (error) {
    return handleError(error);
  }
}
