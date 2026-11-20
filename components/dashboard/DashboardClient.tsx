"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { Alert } from "@/components/ui/Alert";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { formatDate } from "@/lib/simulation/format";

export interface DashboardSimulation {
  id: string;
  name: string;
  businessName: string;
  businessType: string;
  period: string;
  scenarioCount: number;
  updatedAt: string;
}

export function DashboardClient({
  userName,
  simulations,
}: {
  userName: string;
  simulations: DashboardSimulation[];
}) {
  const router = useRouter();
  const { t } = useI18n();
  const [deleting, setDeleting] = useState<DashboardSimulation | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalScenarios = simulations.reduce((sum, item) => sum + item.scenarioCount, 0);
  const lastUpdated = simulations[0]?.updatedAt ?? null;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  async function confirmDelete() {
    if (!deleting) return;
    setBusy(true);
    setError(null);

    try {
      const response = await fetch(`/api/simulations/${deleting.id}`, { method: "DELETE" });
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(t(payload.error ?? "Unable to delete this simulation."));
        return;
      }

      setDeleting(null);
      router.refresh();
    } catch {
      setError(t("Network error. The simulation was not deleted."));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.25em] text-coral-deep uppercase">{t("Dashboard")}</p>
          <h1 className="mt-3 font-serif text-4xl text-forest sm:text-5xl">{t(greeting)}, {userName.split(" ")[0]}.</h1>
          <p className="mt-3 text-sm text-ink/65">{t("Explore your business possibilities.")}</p>
        </div>
        <ButtonLink href="/simulations/new" size="lg">{t("+ New Simulation")}</ButtonLink>
      </div>

      {error && <Alert variant="error" className="mt-6">{error}</Alert>}

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-xs tracking-widest text-forest/60 uppercase">{t("Total simulations")}</p>
          <p className="tabular mt-2 font-serif text-4xl text-forest">
            {simulations.length.toString().padStart(2, "0")}
          </p>
        </Card>
        <Card className="p-5">
          <p className="text-xs tracking-widest text-forest/60 uppercase">{t("Saved scenarios")}</p>
          <p className="tabular mt-2 font-serif text-4xl text-forest">
            {totalScenarios.toString().padStart(2, "0")}
          </p>
        </Card>
        <Card className="p-5">
          <p className="text-xs tracking-widest text-forest/60 uppercase">{t("Last updated")}</p>
          <p className="mt-2 font-serif text-2xl text-forest">
            {lastUpdated ? formatDate(lastUpdated) : "—"}
          </p>
        </Card>
      </div>

      <section className="mt-12">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl text-forest">{t("Your simulations")}</h2>
          <span className="text-xs text-ink/50">{t("Private to your account")}</span>
        </div>

        {simulations.length === 0 ? (
          <Card className="mt-5 flex flex-col items-center px-6 py-14 text-center">
            <svg viewBox="0 0 64 64" className="h-16 w-16 text-forest/40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M32 54c-12 0-20-9-20-22 0-10 8-18 20-20 12 2 20 10 20 20 0 13-8 22-20 22Z" />
              <path d="M32 50V18M32 34c-6-2-10-6-10-12 6 0 10 4 10 12Zm0 8c6-2 10-6 10-12-6 0-10 4-10 12Z" />
            </svg>
            <h3 className="mt-5 font-serif text-2xl text-forest">{t("Create your first simulation")}</h3>
            <p className="mt-2 max-w-md text-sm text-ink/60">
              {t("Set up a baseline business model, then explore how changes affect your estimated profit.")}
            </p>
            <ButtonLink href="/simulations/new" className="mt-6">{t("New Simulation")}</ButtonLink>
          </Card>
        ) : (
          <div className="mt-5 space-y-3">
            {simulations.map((simulation) => (
              <Card key={simulation.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="truncate font-serif text-xl text-forest">{simulation.name}</p>
                  <p className="mt-1 text-sm text-ink/60">
                    {simulation.businessName} · <span className="capitalize">{t(simulation.businessType === "product" ? "Product" : simulation.businessType === "service" ? "Service" : "Other")}</span> ·{" "}
                    {t(simulation.period === "weekly" ? "Weekly" : simulation.period === "monthly" ? "Monthly" : simulation.period === "yearly" ? "Yearly" : simulation.period)}
                  </p>
                  <p className="mt-1 text-xs text-ink/45">
                    {t(
                      simulation.scenarioCount === 1
                        ? "{count} saved scenario"
                        : "{count} saved scenarios",
                      { count: simulation.scenarioCount },
                    )}{" "}
                    · {t("Updated {date}", { date: formatDate(simulation.updatedAt) })}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <ButtonLink href={`/simulations/${simulation.id}`} variant="secondary" size="sm">
                    {t("Open")}
                  </ButtonLink>
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      setError(null);
                      setDeleting(simulation);
                    }}
                  >
                    {t("Delete")}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <p className="mt-10 text-xs text-ink/45">
        <Link href="/" className="underline underline-offset-4">{t("Back to Scenova home")}</Link>
      </p>

      <Modal
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        title={t("Delete this simulation?")}
        description={t("“{name}” and all of its saved scenarios will be permanently removed. This cannot be undone.", {
          name: deleting?.name ?? "",
        })}
        confirmLabel={t("Delete simulation")}
        danger
        loading={busy}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
