import { ok, handleError, fail } from "@/lib/api/respond";
import { getCurrentUser } from "@/lib/auth/session";
import { createSimulation } from "@/lib/db/simulations";
import { setupSchema } from "@/lib/simulation/validate";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return fail("Please sign in to create a simulation.", 401);
    }

    const input = setupSchema.parse(await request.json());
    const simulation = await createSimulation(user.id, input);

    return ok(simulation, 201);
  } catch (error) {
    return handleError(error);
  }
}
