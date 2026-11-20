import { DashboardClient, type DashboardSimulation } from "@/components/dashboard/DashboardClient";
import { requireUser } from "@/lib/auth/session";
import { listSimulations } from "@/lib/db/simulations";

export default async function DashboardPage() {
  const user = await requireUser();
  const rows = await listSimulations(user.id);

  const simulations: DashboardSimulation[] = rows.map((row) => ({
    id: row.id,
    name: row.name,
    businessName: row.business_name,
    businessType: row.business_type,
    period: row.period,
    scenarioCount: row.scenario_count,
    updatedAt: row.updated_at.toISOString(),
  }));

  return <DashboardClient userName={user.name} simulations={simulations} />;
}
