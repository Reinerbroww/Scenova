import { Logo } from "./Logo";
import { getTranslator } from "@/lib/i18n/server";

export async function SiteFooter() {
  const { t } = await getTranslator();

  return (
    <footer className="border-t border-forest/10 bg-cream">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink/65">
            {t("Explore scenarios. Make better decisions. Scenova turns your assumptions into clear, comparable business estimates.")}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-widest text-forest/70 uppercase">{t("Explore")}</p>
          <ul className="mt-3 space-y-2 text-sm text-ink/70">
            <li><a href="#how-it-works" className="hover:text-coral-deep">{t("How it works")}</a></li>
            <li><a href="#features" className="hover:text-coral-deep">{t("Features")}</a></li>
            <li><a href="/login" className="hover:text-coral-deep">{t("Sign in")}</a></li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-widest text-forest/70 uppercase">{t("Good to know")}</p>
          <p className="mt-3 text-sm leading-relaxed text-ink/70">
            {t("Results are mathematical estimates based on your inputs — not forecasts, guarantees, or professional financial advice. Taxes, financing, and demand changes are not modelled.")}
          </p>
        </div>
      </div>
      <div className="border-t border-forest/10 py-5 text-center text-xs text-ink/50">
        {t("© {year} Scenova. All results are estimates based on user-provided assumptions.", {
          year: new Date().getFullYear(),
        })}
      </div>
    </footer>
  );
}
