"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import type { Language } from "@/lib/i18n/dictionaries";
import { useI18n } from "@/components/i18n/LanguageProvider";

export function LanguageSwitcher({
  tone = "dark",
  className = "",
}: {
  tone?: "dark" | "light";
  className?: string;
}) {
  const { language, setLanguage, t } = useI18n();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function choose(next: Language) {
    if (next === language) return;
    setLanguage(next);
    startTransition(() => router.refresh());
  }

  const container =
    tone === "light" ? "border-cream/25 bg-cream/5" : "border-forest/15 bg-forest/[0.03]";
  const active =
    tone === "light" ? "bg-cream text-forest" : "bg-forest text-cream";
  const idle =
    tone === "light" ? "text-cream/65 hover:text-cream" : "text-forest/55 hover:text-forest";

  return (
    <div
      role="group"
      aria-label={t("Language")}
      className={`inline-flex shrink-0 rounded-full border p-0.5 ${container} ${className}`}
    >
      {(["en", "id"] as const).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => choose(code)}
          disabled={pending}
          aria-pressed={language === code}
          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase transition-colors disabled:opacity-60 ${
            language === code ? active : idle
          }`}
        >
          {code}
        </button>
      ))}
    </div>
  );
}
