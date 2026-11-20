import { handleError, ok, fail } from "@/lib/api/respond";
import { getCurrentUser } from "@/lib/auth/session";
import { deleteSimulation } from "@/lib/db/simulations";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser();

    if (!user) return fail("Please sign in.", 401);

    const { id } = await params;
    const deleted = await deleteSimulation(user.id, id);

    if (!deleted) return fail("Simulation not found.", 404);

    return ok({ deleted: true });
  } catch (error) {
    return handleError(error);
  }
}
