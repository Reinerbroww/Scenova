"use client";

import { useState } from "react";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { AiInsight } from "@/lib/ai/types";
import type { Assumptions } from "@/lib/simulation/types";

export function AiInsightCard({
  simulationId,
  scenarioId,
  assumptions,
}: {
  simulationId: string;
  scenarioId?: string;
  assumptions?: Assumptions;
}) {
  const { t } = useI18n();
  const [insight, setInsight] = useState<AiInsight | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  async function generate() {
    setStatus("loading");

    try {
      const response = await fetch("/api/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ simulationId, scenarioId, assumptions }),
      });

      if (!response.ok) throw new Error("Insight request failed");

      const payload = (await response.json()) as { data: AiInsight };
      setInsight(payload.data);
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.2em] text-coral-deep uppercase">
            {t("Insight")}
          </p>
          <h2 className="mt-1 font-serif text-2xl text-forest">{t("Know your gaps, act with confidence")}</h2>
        </div>
        <Button type="button" size="sm" onClick={generate} disabled={status === "loading"}>
          {status === "loading"
            ? t("Analyzing your numbers…")
            : insight
              ? t("Regenerate insight")
              : t("Generate insight")}
        </Button>
      </div>

      {status === "error" && (
        <Alert variant="error" className="mt-4">
          {t("We couldn’t generate an insight right now. Please try again.")}
        </Alert>
      )}

      {status === "loading" && !insight && (
        <p className="mt-4 text-sm text-ink/60">{t("Reading your assumptions and calculating the gaps…")}</p>
      )}

      {insight && (
        <div className="mt-5 space-y-5 text-sm leading-relaxed text-ink/70">
          <p className="rounded-xl bg-cream px-4 py-3 text-ink/80">{insight.summary}</p>

          <div className="grid gap-5 sm:grid-cols-2">
            <section>
              <h3 className="text-xs font-semibold tracking-wider text-forest uppercase">
                {t("Strengths")}
              </h3>
              <ul className="mt-2 space-y-2">
                {insight.strengths.map((item, index) => (
                  <li key={`${item}-${index}`} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-forest" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="text-xs font-semibold tracking-wider text-coral-deep uppercase">
                {t("Weaknesses")}
              </h3>
              <ul className="mt-2 space-y-2">
                {insight.weaknesses.map((item, index) => (
                  <li key={`${item}-${index}`} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-coral" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <section>
            <h3 className="text-xs font-semibold tracking-wider text-forest uppercase">
              {t("Recommended actions")}
            </h3>
            <ol className="mt-2 space-y-2">
              {insight.actions.map((action, index) => (
                <li key={`${action.title}-${index}`} className="rounded-xl border border-forest/10 bg-cream px-4 py-3">
                  <p className="font-medium text-forest">
                    {index + 1}. {action.title}
                  </p>
                  <p className="mt-1 text-ink/70">{action.detail}</p>
                </li>
              ))}
            </ol>
          </section>

          <p className="border-t border-forest/10 pt-3 text-xs text-ink/50">
            {t("Suggestions are based only on the numbers in this scenario. Use your own judgement before making a business decision.")}
          </p>
        </div>
      )}
    </Card>
  );
}
