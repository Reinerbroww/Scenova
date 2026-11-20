"use client";

import { useI18n } from "@/components/i18n/LanguageProvider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function DashboardError({
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
        <h1 className="font-serif text-3xl text-forest">{t("We couldn’t load your dashboard")}</h1>
        <p className="mt-3 text-sm text-ink/65">
          {error.message || t("Please try again in a moment.")}
        </p>
        <Button type="button" className="mt-6" onClick={reset}>
          {t("Try again")}
        </Button>
      </Card>
    </div>
  );
}
