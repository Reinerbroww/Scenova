import Link from "next/link";
import { notFound } from "next/navigation";
import { FinancialOverviewChart } from "@/components/charts/FinancialOverviewChart";
import { MetricCard } from "@/components/simulation/MetricCard";
import { Alert } from "@/components/ui/Alert";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { requireUser } from "@/lib/auth/session";
import { listScenarios } from "@/lib/db/scenarios";
import { getSimulation } from "@/lib/db/simulations";
import { getTranslator } from "@/lib/i18n/server";
import { calculate } from "@/lib/simulation/calculate";
import { formatCount, formatIDR, formatPercent } from "@/lib/simulation/format";

const periodLabels: Record<string, string> = {
  weekly: "per week",
  monthly: "per month",
  yearly: "per year",
};

export default async function ResultsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ scenario?: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;
  const { scenario } = await searchParams;

  const [{ t }, simulation, scenarios] = await Promise.all([
    getTranslator(),
    getSimulation(user.id, id),
    listScenarios(user.id, id),
  ]);

  if (!simulation) notFound();

  const selected =
    (scenario ? scenarios.find((item) => item.id === scenario) : undefined) ??
    scenarios.find((item) => item.name === "Baseline") ??
    scenarios[0];

  if (!selected) {
    return (
      <div className="mx-auto max-w-3xl">
        <Alert variant="info">
          {t("This simulation has no saved scenarios yet. Open the workspace to adjust the assumptions and save a scenario first.")}
        </Alert>
        <div className="mt-6">
          <ButtonLink href={`/simulations/${id}`}>{t("Open workspace")}</ButtonLink>
        </div>
      </div>
    );
  }

  const result = calculate(selected.assumptions);
  const marginLabel = formatPercent(result.operatingMargin);
  const profitLabel = formatIDR(result.operatingProfit);
  const profitable = result.operatingProfit > 0;
  const breakEvenText = result.breakEvenReachable
    ? `${formatCount(result.breakEvenVolume)} ${t("transactions")}`
    : t("not reachable with these assumptions");

  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-xs font-semibold tracking-[0.25em] text-coral-deep uppercase">{t("Results & insights")}</p>
      <h1 className="mt-3 font-serif text-4xl text-forest sm:text-5xl">{simulation.name}</h1>
      <p className="mt-2 text-sm text-ink/60">
        {t("Showing")} <strong className="font-medium text-forest">{selected.name}</strong> ·{" "}
        {t(periodLabels[simulation.period] ?? simulation.period)}
      </p>

      {scenarios.length > 1 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {scenarios.map((item) => (
            <ButtonLink
              key={item.id}
              href={`/simulations/${id}/results?scenario=${item.id}`}
              variant={item.id === selected.id ? "primary" : "secondary"}
              size="sm"
            >
              {item.name}
            </ButtonLink>
          ))}
        </div>
      )}

      <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard label={t("Revenue")} value={formatIDR(result.revenue)} />
        <MetricCard label={t("Total variable cost")} value={formatIDR(result.totalVariableCost)} />
        <MetricCard label={t("Fixed cost")} value={formatIDR(result.fixedCost)} />
        <MetricCard label={t("Total cost")} value={formatIDR(result.totalCost)} />
        <MetricCard label={t("Estimated operating profit")} value={profitLabel} accent />
        <MetricCard label={t("Operating margin")} value={marginLabel} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <Card className="p-5 sm:p-6">
          <h2 className="font-serif text-2xl text-forest">{t("Financial overview")}</h2>
          <div className="mt-4">
            <FinancialOverviewChart result={result} />
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <h2 className="font-serif text-2xl text-forest">{t("What the model says")}</h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-ink/70">
            <p>
              {t(
                "At the current assumptions, the model estimates operating profit of {profit}, a margin of {margin}.",
                { profit: profitLabel, margin: marginLabel },
              )}
            </p>
            <p>
              {t(
                profitable
                  ? "Revenue covers total costs, leaving a positive operating result."
                  : result.operatingProfit === 0
                    ? "Revenue exactly covers total costs. There is no operating profit."
                    : "Revenue does not cover total costs at this volume. The result is an operating loss.",
              )}
            </p>
            <p>
              {t("Contribution per transaction is {value}.", {
                value: formatIDR(result.contributionPerTransaction),
              })}
            </p>
            <p>{t("Break-even volume is {value}.", { value: breakEvenText })}</p>
          </div>
        </Card>
      </div>

      <Card className="mt-8 p-5 sm:p-6">
        <h2 className="font-serif text-2xl text-forest">{t("Assumptions used")}</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          {[
            ["Average transaction value", formatIDR(selected.assumptions.averageTransactionValue)],
            ["Variable cost per transaction", formatIDR(selected.assumptions.variableCostPerTransaction)],
            ["Fixed cost per period", formatIDR(selected.assumptions.fixedCost)],
            ["Transaction volume", `${formatCount(selected.assumptions.transactionVolume)} trx`],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl border border-forest/10 bg-cream-light px-4 py-3">
              <dt className="text-xs tracking-wider text-forest/60 uppercase">{t(label)}</dt>
              <dd className="tabular mt-1 text-lg text-forest">{value}</dd>
            </div>
          ))}
        </dl>
      </Card>

      <Alert variant="info" className="mt-8">
        {t("These are mathematical estimates based only on the assumptions above. Taxes, financing, demand changes, and other factors are not included.")}
      </Alert>

      <div className="mt-6 flex flex-wrap gap-2">
        <ButtonLink href={`/simulations/${id}`} variant="secondary">{t("Edit assumptions")}</ButtonLink>
        <ButtonLink href={`/simulations/${id}/compare`} variant="secondary">{t("Compare scenarios")}</ButtonLink>
      </div>

      <p className="mt-8 text-sm text-ink/55">
        <Link href="/dashboard" className="underline underline-offset-4 hover:text-coral-deep">
          {t("← Back to dashboard")}
        </Link>
      </p>
    </div>
  );
}
