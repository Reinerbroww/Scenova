"use client";

import { useI18n } from "@/components/i18n/LanguageProvider";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function SimulationError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useI18n();
  return (
    <div className="mx-auto max-w-2xl">
      <Card className="p-10 text-center">
        <h1 className="font-serif text-3xl text-forest">{t("We couldn’t load this simulation")}</h1>
        <p className="mt-3 text-sm text-ink/65">
          {error.message || t("Please try again in a moment.")}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={reset}
            className="inline-flex rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-cream hover:bg-forest-deep"
          >
            {t("Try again")}
          </button>
          <ButtonLink href="/dashboard" variant="secondary">
            {t("Back to dashboard")}
          </ButtonLink>
        </div>
      </Card>
    </div>
  );
}
