"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import type { Assumptions } from "@/lib/simulation/types";
import { scenarioSchema } from "@/lib/simulation/validate";

export function SaveScenarioDialog({
  open,
  onClose,
  simulationId,
  assumptions,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  simulationId: string;
  assumptions: Assumptions;
  onSaved?: (name: string) => void;
}) {
  const router = useRouter();
  const { t } = useI18n();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function close() {
    setError(null);
    setName("");
    onClose();
  }

  async function save() {
    setError(null);
    const parsed = scenarioSchema.safeParse({
      name,
      averageTransactionValue: assumptions.averageTransactionValue.toFixed(2),
      variableCostPerTransaction: assumptions.variableCostPerTransaction.toFixed(2),
      fixedCost: assumptions.fixedCost.toFixed(2),
      transactionVolume: Math.round(assumptions.transactionVolume),
    });

    if (!parsed.success) {
      setError(t(parsed.error.issues[0]?.message ?? "Please check the scenario name."));
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/simulations/${simulationId}/scenarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(t(payload.error ?? "Unable to save this scenario."));
        return;
      }

      onSaved?.(parsed.data.name);
      close();
      router.refresh();
    } catch {
      setError(t("Network error. Your assumptions have been kept — please try again."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={close}
      title={t("Save as scenario")}
      description={t("Keep these assumptions so you can compare them later. Use a name you will recognise.")}
      confirmLabel={t("Save scenario")}
      loading={loading}
      onConfirm={save}
    >
      <div className="space-y-3">
        <Input
          label={t("Scenario name")}
          name="scenarioName"
          placeholder={t("Optimistic")}
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            setError(null);
          }}
          error={error ?? undefined}
          disabled={loading}
        />
        <p className="text-xs text-ink/50">
          {t("Examples: Baseline, Optimistic, Conservative — any name is allowed.")}
        </p>
      </div>
    </Modal>
  );
}
