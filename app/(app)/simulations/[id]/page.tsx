import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { getSimulation } from "@/lib/db/simulations";
import { listScenarios } from "@/lib/db/scenarios";
import { SimulationWorkspace } from "@/components/simulation/SimulationWorkspace";

export default async function SimulationPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ scenario?: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;
  const { scenario } = await searchParams;

  const [simulation, scenarios] = await Promise.all([
    getSimulation(user.id, id),
    listScenarios(user.id, id),
  ]);

  if (!simulation) notFound();

  const baseline = scenarios.find((item) => item.name === "Baseline") ?? scenarios[0];
  const requested = scenario ? scenarios.find((item) => item.id === scenario) : undefined;
  const initialAssumptions =
    (requested ?? baseline)?.assumptions ?? {
      averageTransactionValue: 0,
      variableCostPerTransaction: 0,
      fixedCost: 0,
      transactionVolume: 0,
    };

  return (
    <SimulationWorkspace
      simulation={{
        id: simulation.id,
        name: simulation.name,
        businessName: simulation.business_name,
        businessType: simulation.business_type,
        period: simulation.period,
      }}
      scenarios={scenarios}
      initialAssumptions={initialAssumptions}
      initialScenarioId={requested?.id}
    />
  );
}
