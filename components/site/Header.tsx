"use client";

import { ButtonLink } from "@/components/ui/Button";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { Logo } from "./Logo";

export function SiteHeader({ authenticated }: { authenticated: boolean }) {
  const { t } = useI18n();

  return (
    <header className="sticky top-0 z-40 border-b border-forest/10 bg-cream/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <Logo />
        <nav className="hidden items-center gap-8 text-sm text-forest md:flex" aria-label={t("Main navigation")}>
          <a href="#how-it-works" className="transition-colors hover:text-coral-deep">
            {t("How it works")}
          </a>
          <a href="#features" className="transition-colors hover:text-coral-deep">
            {t("Features")}
          </a>
          <LanguageSwitcher />
          <ButtonLink href={authenticated ? "/dashboard" : "/login"} variant="ghost" size="sm">
            {t("Sign in")}
          </ButtonLink>
          <ButtonLink href={authenticated ? "/dashboard" : "/register"} size="sm">
            {t("Start Simulation")}
          </ButtonLink>
        </nav>
        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher />
          <ButtonLink href={authenticated ? "/dashboard" : "/register"} size="sm">
            {t("Start")}
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}
