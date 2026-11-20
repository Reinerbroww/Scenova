"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { Alert } from "@/components/ui/Alert";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { setupSchema } from "@/lib/simulation/validate";

const initial = {
  simulationName: "",
  businessName: "",
  businessType: "service" as "product" | "service" | "other",
  period: "monthly" as "weekly" | "monthly" | "yearly",
  averageTransactionValue: "",
  variableCostPerTransaction: "",
  fixedCost: "",
  transactionVolume: "",
};

export function BusinessSetupForm() {
  const router = useRouter();
  const { t } = useI18n();
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function update<K extends keyof typeof initial>(field: K, value: (typeof initial)[K]) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const parsed = setupSchema.safeParse(values);
    if (!parsed.success) {
      const nextErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const field = String(issue.path[0] ?? "form");
        nextErrors[field] ??= t(issue.message);
      }
      setErrors(nextErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/simulations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const payload = (await response.json()) as {
        data?: { id: string };
        error?: string;
        details?: { path: string; message: string }[];
      };

      if (!response.ok || !payload.data) {
        if (payload.details?.length) {
          const nextErrors: Record<string, string> = {};
          for (const detail of payload.details) {
            nextErrors[detail.path] ??= t(detail.message);
          }
          setErrors(nextErrors);
        }
        setFormError(t(payload.error ?? "Unable to save your simulation. Please review your inputs."));
        return;
      }

      router.push(`/simulations/${payload.data.id}`);
      router.refresh();
    } catch {
      setFormError(t("Network error. Your inputs have been kept — please try again."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-8">
      <Card className="p-6 sm:p-8">
        <div className="flex items-center justify-between border-b border-forest/10 pb-5">
          <div>
            <h2 className="font-serif text-2xl text-forest">{t("The basics")}</h2>
            <p className="mt-1 text-sm text-ink/60">{t("Give your simulation a clear starting point.")}</p>
          </div>
          <span className="text-xs tracking-widest text-forest/50 uppercase">{t("Step 1 of 2")}</span>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <Input
            label={t("Simulation name")}
            name="simulationName"
            placeholder={t("Coffee Shop Scenario")}
            value={values.simulationName}
            onChange={(event) => update("simulationName", event.target.value)}
            error={errors.simulationName}
            disabled={loading}
          />
          <Input
            label={t("Business name")}
            name="businessName"
            placeholder={t("Andi Coffee")}
            value={values.businessName}
            onChange={(event) => update("businessName", event.target.value)}
            error={errors.businessName}
            helper={t("A label for your own reference.")}
            disabled={loading}
          />
          <Select
            label={t("Business type")}
            name="businessType"
            value={values.businessType}
            onChange={(event) => update("businessType", event.target.value as typeof values.businessType)}
            options={[
              { value: "product", label: t("Product") },
              { value: "service", label: t("Service") },
              { value: "other", label: t("Other") },
            ]}
            helper={t("Context only — the same model is used for every type.")}
            disabled={loading}
          />
          <Select
            label={t("Calculation period")}
            name="period"
            value={values.period}
            onChange={(event) => update("period", event.target.value as typeof values.period)}
            options={[
              { value: "weekly", label: t("Weekly") },
              { value: "monthly", label: t("Monthly") },
              { value: "yearly", label: t("Yearly") },
            ]}
            helper={t("Use one consistent period for all assumptions.")}
            disabled={loading}
          />
        </div>
      </Card>

      <Card className="p-6 sm:p-8">
        <h2 className="font-serif text-2xl text-forest">{t("Baseline assumptions")}</h2>
        <p className="mt-1 text-sm text-ink/60">
          {t("Enter average values per transaction and totals for your chosen period.")}
        </p>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <Input
            label={t("Average transaction value")}
            name="averageTransactionValue"
            inputMode="decimal"
            prefix="Rp"
            placeholder="15000"
            value={values.averageTransactionValue}
            onChange={(event) => update("averageTransactionValue", event.target.value)}
            error={errors.averageTransactionValue}
            helper={t("Revenue earned per transaction on average.")}
            disabled={loading}
          />
          <Input
            label={t("Variable cost per transaction")}
            name="variableCostPerTransaction"
            inputMode="decimal"
            prefix="Rp"
            placeholder="6000"
            value={values.variableCostPerTransaction}
            onChange={(event) => update("variableCostPerTransaction", event.target.value)}
            error={errors.variableCostPerTransaction}
            helper={t("Cost that changes with each transaction.")}
            disabled={loading}
          />
          <Input
            label={t("Fixed cost per period")}
            name="fixedCost"
            inputMode="decimal"
            prefix="Rp"
            placeholder="5000000"
            value={values.fixedCost}
            onChange={(event) => update("fixedCost", event.target.value)}
            error={errors.fixedCost}
            helper={t("Costs that do not change with volume.")}
            disabled={loading}
          />
          <Input
            label={t("Transaction volume per period")}
            name="transactionVolume"
            inputMode="numeric"
            suffix="trx"
            placeholder="1000"
            value={values.transactionVolume}
            onChange={(event) => update("transactionVolume", event.target.value)}
            error={errors.transactionVolume}
            helper={t("Whole number of transactions in the period.")}
            disabled={loading}
          />
        </div>
      </Card>

      {formError && <Alert variant="error">{formError}</Alert>}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <ButtonLink href="/dashboard" variant="ghost">
          {t("Back to dashboard")}
        </ButtonLink>
        <Button type="submit" size="lg" disabled={loading}>
          {t(loading ? "Saving…" : "Save & Continue")}
        </Button>
      </div>
    </form>
  );
}
