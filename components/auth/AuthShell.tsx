import type { ReactNode } from "react";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { BotanicalArt } from "@/components/site/BotanicalArt";
import { Logo } from "@/components/site/Logo";
import { getTranslator } from "@/lib/i18n/server";

export async function AuthShell({ children }: { children: ReactNode }) {
  const { t } = await getTranslator();
  return (
    <main className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
      <div className="hidden flex-col justify-between bg-forest px-12 py-10 text-cream lg:flex">
        <Logo />
        <div className="mx-auto w-full max-w-md">
          <BotanicalArt className="w-full opacity-95" />
          <p className="mt-6 font-serif text-3xl leading-snug italic">
            {t("Small changes in assumptions. A clearer picture of what comes next.")}
          </p>
        </div>
        <p className="text-xs text-cream/60">
          {t("Estimates based on your inputs — not forecasts or financial advice.")}
        </p>
      </div>

      <div className="flex flex-col px-5 py-8 sm:px-10 lg:px-16 lg:py-12">
        <div className="flex items-center justify-between lg:hidden">
          <Logo />
          <LanguageSwitcher />
        </div>
        <div className="hidden justify-end lg:flex">
          <LanguageSwitcher />
        </div>
        <div className="flex flex-1 items-center justify-center py-10">
          {children}
        </div>
        <p className="text-center text-xs text-ink/50">
          {t("Scenova · Explore scenarios. Make better decisions.")}
        </p>
      </div>
    </main>
  );
}
