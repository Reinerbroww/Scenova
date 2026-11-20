import { notFound } from "next/navigation";
import { ComparisonView } from "@/components/compare/ComparisonView";
import { requireUser } from "@/lib/auth/session";
import { listScenarios } from "@/lib/db/scenarios";
import { getSimulation } from "@/lib/db/simulations";

export default async function ComparePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;

  const [simulation, scenarios] = await Promise.all([
    getSimulation(user.id, id),
    listScenarios(user.id, id),
  ]);

  if (!simulation) notFound();

  return (
    <ComparisonView
      simulation={{ id: simulation.id, name: simulation.name, period: simulation.period }}
      scenarios={scenarios}
    />
  );
}
