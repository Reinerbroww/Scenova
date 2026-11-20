"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ComparisonChart } from "@/components/charts/ComparisonChart";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { Alert } from "@/components/ui/Alert";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import type { ScenarioView } from "@/lib/db/models";
import { calculate } from "@/lib/simulation/calculate";
import { formatCount, formatIDR, formatPercent } from "@/lib/simulation/format";

const periodLabels: Record<string, string> = {
  weekly: "per week",
  monthly: "per month",
  yearly: "per year",
};

export function ComparisonView({
  simulation,
  scenarios,
}: {
  simulation: { id: string; name: string; period: string };
  scenarios: ScenarioView[];
}) {
  const router = useRouter();
  const { t } = useI18n();
  const [hiddenIds, setHiddenIds] = useState<string[]>([]);
  const [deleting, setDeleting] = useState<ScenarioView | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletedName, setDeletedName] = useState<string | null>(null);

  const selectedScenarios = scenarios
    .filter((scenario) => !hiddenIds.includes(scenario.id))
    .slice(0, 5);
  const canCompare = selectedScenarios.length >= 2;

  function toggle(id: string) {
    setError(null);
    setDeletedName(null);
    setHiddenIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  async function confirmDelete() {
    if (!deleting) return;
    setBusy(true);
    setError(null);

    try {
      const response = await fetch(`/api/scenarios/${deleting.id}`, { method: "DELETE" });
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(t(payload.error ?? "Unable to delete this scenario."));
        return;
      }

      setDeletedName(deleting.name);
      setDeleting(null);
      router.refresh();
    } catch {
      setError(t("Network error. The scenario was not deleted."));
    } finally {
      setBusy(false);
    }
  }

  if (scenarios.length < 2) {
    return (
      <div className="mx-auto max-w-3xl">
        <h1 className="font-serif text-4xl text-forest sm:text-5xl">{t("Compare scenarios")}</h1>
        <Alert variant="info" className="mt-8">
          {t("Save at least two scenarios to compare them. Your baseline is already saved — adjust the assumptions in the workspace and save a second scenario.")}
        </Alert>
        <div className="mt-6 flex flex-wrap gap-2">
          <ButtonLink href={`/simulations/${simulation.id}`}>{t("Open workspace")}</ButtonLink>
          <ButtonLink href="/dashboard" variant="secondary">{t("Back to dashboard")}</ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      <p className="text-xs font-semibold tracking-[0.25em] text-coral-deep uppercase">{t("Scenario comparison")}</p>
      <h1 className="mt-3 font-serif text-4xl text-forest sm:text-5xl">{simulation.name}</h1>
      <p className="mt-2 text-sm text-ink/60">
        {t("Select up to five saved scenarios · values are {period}", {
          period: t(periodLabels[simulation.period] ?? simulation.period),
        })}
      </p>

      {error && <Alert variant="error" className="mt-6">{error}</Alert>}
      {deletedName && (
        <Alert variant="success" className="mt-6">
          {t("“{name}” was deleted.", { name: deletedName })}
        </Alert>
      )}

      <Card className="mt-8 p-5 sm:p-6">
        <div className="flex flex-wrap gap-2">
          {scenarios.map((scenario) => {
            const active = selectedScenarios.some((item) => item.id === scenario.id);
            return (
              <label
                key={scenario.id}
                className={`flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors ${
                  active
                    ? "border-forest bg-forest text-cream"
                    : "border-forest/20 bg-cream-light text-ink/70 hover:border-forest/50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={active}
                  onChange={() => toggle(scenario.id)}
                  className="h-3.5 w-3.5 accent-coral"
                />
                <span>{scenario.name}</span>
              </label>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-ink/45">{t("Choose at least two scenarios to see the comparison.")}</p>
      </Card>

      {!canCompare && (
        <Alert variant="error" className="mt-6">
          {t("Select at least two scenarios to compare.")}
        </Alert>
      )}

      {canCompare && (
        <>
          <Card className="mt-6 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-forest/10">
                    <th className="sticky left-0 z-10 bg-cream-light px-5 py-4 text-left text-xs font-medium tracking-wider text-forest/60 uppercase">
                      {t("Metric")}
                    </th>
                    {selectedScenarios.map((scenario) => (
                      <th key={scenario.id} className="min-w-[190px] px-5 py-4 text-left">
                        <span className="block font-serif text-lg text-forest">{scenario.name}</span>
                        <span className="mt-1 flex gap-3 text-xs font-normal">
                          <Link
                            href={`/simulations/${simulation.id}?scenario=${scenario.id}`}
                            className="text-coral-deep underline underline-offset-4"
                          >
                            {t("Reopen")}
                          </Link>
                          <button
                            type="button"
                            onClick={() => {
                              setError(null);
                              setDeletedName(null);
                              setDeleting(scenario);
                            }}
                            className="text-ink/45 underline underline-offset-4 hover:text-coral-deep"
                          >
                            {t("Delete")}
                          </button>
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: "Average transaction value", values: selectedScenarios.map((s) => formatIDR(s.assumptions.averageTransactionValue)) },
                    { label: "Variable cost per transaction", values: selectedScenarios.map((s) => formatIDR(s.assumptions.variableCostPerTransaction)) },
                    { label: "Fixed cost", values: selectedScenarios.map((s) => formatIDR(s.assumptions.fixedCost)) },
                    { label: "Transaction volume", values: selectedScenarios.map((s) => `${formatCount(s.assumptions.transactionVolume)} trx`) },
                    { label: "Revenue", values: selectedScenarios.map((s) => formatIDR(calculate(s.assumptions).revenue)) },
                    { label: "Total cost", values: selectedScenarios.map((s) => formatIDR(calculate(s.assumptions).totalCost)) },
                    { label: "Operating profit", values: selectedScenarios.map((s) => formatIDR(calculate(s.assumptions).operatingProfit)), accent: true },
                    { label: "Operating margin", values: selectedScenarios.map((s) => formatPercent(calculate(s.assumptions).operatingMargin)) },
                    {
                      label: "Break-even volume",
                      values: selectedScenarios.map((s) => {
                        const result = calculate(s.assumptions);
                         return result.breakEvenReachable ? `${formatCount(result.breakEvenVolume)} trx` : t("Not reachable");
                      }),
                    },
                  ].map((row) => (
                    <tr key={row.label} className="border-b border-forest/10 last:border-0">
                      <th className="sticky left-0 z-10 bg-cream-light px-5 py-3.5 text-left text-xs font-medium text-forest/60 uppercase">
                        {t(row.label)}
                      </th>
                      {row.values.map((value, index) => (
                        <td
                          key={`${row.label}-${selectedScenarios[index].id}`}
                          className={`tabular px-5 py-3.5 ${row.accent ? "font-medium text-coral-deep" : "text-ink"}`}
                        >
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="mt-6 p-5 sm:p-6">
            <h2 className="font-serif text-2xl text-forest">{t("Side-by-side overview")}</h2>
            <div className="mt-4">
              <ComparisonChart scenarios={selectedScenarios} />
            </div>
          </Card>

          <Alert variant="info" className="mt-6">
            {t("Comparisons reflect only the saved assumptions. To try an update, reopen a scenario, edit its inputs, then save it with a new name.")}
          </Alert>
        </>
      )}

      <div className="mt-6 flex flex-wrap gap-2">
        <ButtonLink href={`/simulations/${simulation.id}`} variant="secondary">{t("Back to workspace")}</ButtonLink>
        <ButtonLink href={`/simulations/${simulation.id}/results`} variant="secondary">{t("View results")}</ButtonLink>
      </div>

      <p className="mt-8 text-sm text-ink/55">
        <Link href="/dashboard" className="underline underline-offset-4 hover:text-coral-deep">
          {t("← Back to dashboard")}
        </Link>
      </p>

      <Modal
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        title={t("Delete this scenario?")}
        description={t("“{name}” will be permanently removed from this simulation.", {
          name: deleting?.name ?? "",
        })}
        confirmLabel={t("Delete scenario")}
        danger
        loading={busy}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
