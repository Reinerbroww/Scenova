"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AiInsightCard } from "@/components/ai/AiInsightCard";
import { FinancialOverviewChart } from "@/components/charts/FinancialOverviewChart";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { Alert } from "@/components/ui/Alert";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { AssumptionControl } from "@/components/simulation/AssumptionControl";
import { MetricCard } from "@/components/simulation/MetricCard";
import { SaveScenarioDialog } from "@/components/simulation/SaveScenarioDialog";
import type { ScenarioView } from "@/lib/db/models";
import { calculate } from "@/lib/simulation/calculate";
import { formatCount, formatIDR, formatPercent } from "@/lib/simulation/format";
import type { Assumptions } from "@/lib/simulation/types";

const periodLabels: Record<string, string> = {
  weekly: "per week",
  monthly: "per month",
  yearly: "per year",
};

export function SimulationWorkspace({
  simulation,
  scenarios,
  initialAssumptions,
  initialScenarioId,
}: {
  simulation: { id: string; name: string; businessName: string; businessType: string; period: string };
  scenarios: ScenarioView[];
  initialAssumptions: Assumptions;
  initialScenarioId?: string;
}) {
  const { t } = useI18n();
  const baseline = scenarios.find((scenario) => scenario.name === "Baseline") ?? scenarios[0];
  const selectedInitial = initialScenarioId
    ? scenarios.find((scenario) => scenario.id === initialScenarioId)
    : undefined;

  const [assumptions, setAssumptions] = useState<Assumptions>(
    selectedInitial?.assumptions ?? initialAssumptions,
  );
  const [selectedScenario, setSelectedScenario] = useState(
    selectedInitial?.id ?? baseline?.id ?? "custom",
  );
  const [saveOpen, setSaveOpen] = useState(false);
  const [savedName, setSavedName] = useState<string | null>(null);

  const result = useMemo(() => calculate(assumptions), [assumptions]);
  const activeScenario = scenarios.find((scenario) => scenario.id === selectedScenario);

  function change<K extends keyof Assumptions>(field: K, value: Assumptions[K]) {
    setAssumptions((current) => ({ ...current, [field]: value }));
    setSelectedScenario("custom");
    setSavedName(null);
  }

  function loadScenario(id: string) {
    if (id === "custom") {
      setSelectedScenario("custom");
      return;
    }

    const scenario = scenarios.find((item) => item.id === id);
    if (!scenario) return;

    setAssumptions(scenario.assumptions);
    setSelectedScenario(id);
    setSavedName(null);

    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `?scenario=${id}`);
    }
  }

  function resetToBaseline() {
    if (!baseline) return;
    setAssumptions(baseline.assumptions);
    setSelectedScenario(baseline.id);
    setSavedName(null);
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.25em] text-coral-deep uppercase">{t("Simulation workspace")}</p>
          <h1 className="mt-2 font-serif text-4xl text-forest sm:text-5xl">{simulation.name}</h1>
          <p className="mt-1.5 text-sm text-ink/60">
            {simulation.businessName} · <span className="capitalize">{t(simulation.businessType === "product" ? "Product" : simulation.businessType === "service" ? "Service" : "Other")}</span> ·{" "}
            {t(periodLabels[simulation.period] ?? simulation.period)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ButtonLink href={`/simulations/${simulation.id}/results`} variant="secondary" size="sm">
            {t("View results")}
          </ButtonLink>
          <ButtonLink href={`/simulations/${simulation.id}/compare`} variant="secondary" size="sm">
            {t("Compare scenarios")}
          </ButtonLink>
        </div>
      </div>

      {savedName && (
        <Alert variant="success" className="mt-5">
          {t("“{name}” was saved. You can compare it with other scenarios at any time.", { name: savedName })}
        </Alert>
      )}

      <div className="mt-6 grid items-start gap-5 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
        <Card className="p-4 sm:p-5 lg:sticky lg:top-6">
          <div className="flex items-center justify-between border-b border-forest/10 pb-3">
            <h2 className="font-serif text-xl text-forest">{t("Assumptions")}</h2>
            <span className="text-[10px] tracking-widest text-forest/50 uppercase">{t("Editable")}</span>
          </div>

          <div className="mt-4">
            <label htmlFor="scenario-loader" className="text-[11px] font-medium text-forest/70 uppercase">
              {t("Load saved scenario")}
            </label>
            <select
              id="scenario-loader"
              value={selectedScenario}
              onChange={(event) => loadScenario(event.target.value)}
              className="mt-1.5 w-full rounded-lg border border-forest/20 bg-cream px-3 py-2 text-sm text-ink focus:border-forest focus:outline-none"
            >
              <option value="custom">{t("Current values")}</option>
              {scenarios.map((scenario) => (
                <option key={scenario.id} value={scenario.id}>
                  {scenario.name}
                </option>
              ))}
            </select>
            <p className="mt-1.5 text-[11px] text-ink/45">
              {activeScenario
                ? t("Using “{name}”", { name: activeScenario.name })
                : t("Custom values — not saved yet")}
            </p>
          </div>

          <div className="mt-4 space-y-2">
            <AssumptionControl
              label={t("Average transaction value")}
              name="averageTransactionValue"
              prefix="Rp"
              value={assumptions.averageTransactionValue}
              max={Math.max(100000, assumptions.averageTransactionValue * 2)}
              helper={t("Price per transaction")}
              onChange={(value) => change("averageTransactionValue", value)}
            />
            <AssumptionControl
              label={t("Variable cost per transaction")}
              name="variableCostPerTransaction"
              prefix="Rp"
              value={assumptions.variableCostPerTransaction}
              max={Math.max(100000, assumptions.averageTransactionValue * 2)}
              helper={t("Cost per transaction")}
              onChange={(value) => change("variableCostPerTransaction", value)}
            />
            <AssumptionControl
              label={t("Fixed cost")}
              name="fixedCost"
              prefix="Rp"
              value={assumptions.fixedCost}
              max={Math.max(1000000, assumptions.fixedCost * 3)}
              helper={t("Total for the period")}
              onChange={(value) => change("fixedCost", value)}
            />
            <AssumptionControl
              label={t("Transaction volume")}
              name="transactionVolume"
              suffix={t(periodLabels[simulation.period] ?? "Per period")}
              inputStep="1"
              step={10}
              value={assumptions.transactionVolume}
              max={Math.max(100, assumptions.transactionVolume * 2)}
              helper={t("Whole transactions")}
              onChange={(value) => change("transactionVolume", Math.round(value))}
            />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button type="button" variant="secondary" size="sm" onClick={resetToBaseline} disabled={!baseline}>
              {t("Reset")}
            </Button>
            <Button type="button" size="sm" onClick={() => setSaveOpen(true)}>
              {t("Save scenario")}
            </Button>
          </div>
        </Card>

        <div className="min-w-0 space-y-5">
          <section>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-serif text-2xl text-forest">{t("Live results")}</h2>
              <span className="rounded-full border border-forest/15 bg-cream-light px-2.5 py-1 text-[11px] text-ink/55">
                {activeScenario
                  ? t("Loaded: {name}", { name: activeScenario.name })
                  : t("Unsaved changes")}
              </span>
            </div>

            <div className="mt-3 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard
                label={t("Estimated operating profit")}
                value={formatIDR(result.operatingProfit)}
                helper={t("Revenue − total cost")}
                accent
                compact
              />
              <MetricCard
                label={t("Revenue")}
                value={formatIDR(result.revenue)}
                helper={t("Transaction value × volume")}
                compact
              />
              <MetricCard
                label={t("Operating margin")}
                value={formatPercent(result.operatingMargin)}
                helper={t("Profit share of revenue")}
                compact
              />
              <MetricCard
                label={t("Break-even volume")}
                value={result.breakEvenReachable ? `${formatCount(result.breakEvenVolume)} trx` : t("Not reachable")}
                helper={
                  result.breakEvenReachable
                    ? t("Transactions to cover fixed cost")
                    : t("Variable cost is at or above value")
                }
                compact
              />
            </div>

            <div className="mt-2.5 grid gap-2.5 sm:grid-cols-3">
              <MetricCard
                label={t("Total variable cost")}
                value={formatIDR(result.totalVariableCost)}
                helper={t("Variable cost × volume")}
                compact
              />
              <MetricCard label={t("Fixed cost")} value={formatIDR(result.fixedCost)} helper={t("Per period")} compact />
              <MetricCard label={t("Total cost")} value={formatIDR(result.totalCost)} helper={t("Variable + fixed")} compact />
            </div>
          </section>

          <Card className="p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-serif text-xl text-forest">{t("Financial overview")}</h2>
              <span className="text-[11px] text-ink/50">
                IDR · {t(periodLabels[simulation.period] ?? simulation.period)}
              </span>
            </div>
            <div className="mt-2">
              <FinancialOverviewChart result={result} />
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-ink/50">
              {t("Estimates only — taxes, financing, demand changes, and other factors are not included.")}
            </p>
          </Card>

          <AiInsightCard
            key={JSON.stringify(assumptions)}
            simulationId={simulation.id}
            assumptions={assumptions}
          />
        </div>
      </div>

      <p className="mt-6 text-sm text-ink/55">
        <Link href="/dashboard" className="underline underline-offset-4 hover:text-coral-deep">
          {t("← Back to dashboard")}
        </Link>
      </p>

      <SaveScenarioDialog
        open={saveOpen}
        onClose={() => setSaveOpen(false)}
        simulationId={simulation.id}
        assumptions={assumptions}
        onSaved={(name) => setSavedName(name)}
      />
    </div>
  );
}
