import { BotanicalArt } from "@/components/site/BotanicalArt";
import { SiteFooter } from "@/components/site/Footer";
import { SiteHeader } from "@/components/site/Header";
import { ButtonLink } from "@/components/ui/Button";
import { getCurrentUser } from "@/lib/auth/session";
import { getTranslator } from "@/lib/i18n/server";

const steps = [
  {
    number: "01",
    title: "Set up your business",
    text: "Name your simulation, choose a period, and enter your baseline transaction value, costs, and volume.",
  },
  {
    number: "02",
    title: "Adjust assumptions",
    text: "Move a price, cost, or volume and watch revenue, profit, margin, and break-even recalculate instantly.",
  },
  {
    number: "03",
    title: "Compare scenarios",
    text: "Save a Baseline, an Optimistic case, and a Conservative case. Compare them side by side in one view.",
  },
];

const features = [
  {
    title: "One clear model",
    text: "A transaction-based calculation engine that works for both product and service businesses.",
    path: "M4 18h16M6 14l4-5 4 3 4-7",
  },
  {
    title: "Interactive workspace",
    text: "Precise numeric inputs with optional sliders, reset to baseline, and live results as you explore.",
    path: "M4 7h16M4 17h16M9 4v6M15 14v6",
  },
  {
    title: "Scenario library",
    text: "Save named scenarios, reopen them, edit assumptions, and keep every version for comparison.",
    path: "M5 4h9l5 5v11H5zM14 4v5h5M8 13h8M8 17h6",
  },
  {
    title: "Private by design",
    text: "Your simulations and scenarios belong to your account and are protected at the database layer.",
    path: "M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6z",
  },
];

export default async function LandingPage() {
  const [user, { t }] = await Promise.all([getCurrentUser(), getTranslator()]);
  const destination = user ? "/dashboard" : "/register";

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader authenticated={Boolean(user)} />

      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-coral/10 blur-3xl" />
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 pt-16 pb-20 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:pt-24 lg:pb-28">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-forest/20 px-3 py-1 text-xs font-medium tracking-widest text-forest uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-coral" />
                {t("Business simulation, made human")}
              </div>
              <h1 className="mt-7 font-serif text-5xl leading-[1.05] tracking-tight text-forest sm:text-6xl lg:text-7xl">
                {t("Explore scenarios.")}
                <br />
                <span className="italic text-coral-deep">{t("Make better decisions.")}</span>
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink/70">
                {t(
                  "See how changes in price, costs, and transaction volume affect your estimated business performance — before you make a move. Built for product and service businesses alike.",
                )}
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <ButtonLink href={destination} size="lg">
                  {t("Start Simulation")}
                </ButtonLink>
                <ButtonLink href="#how-it-works" variant="secondary" size="lg">
                  {t("Learn More")}
                </ButtonLink>
              </div>
              <p className="mt-5 text-xs text-ink/50">
                {t("No spreadsheets required. Results are clear estimates based on your assumptions.")}
              </p>
            </div>

            <div className="relative mx-auto w-full max-w-lg">
              <div className="absolute inset-6 rounded-[2.5rem] bg-forest/5" />
              <BotanicalArt className="relative w-full drop-shadow-sm" />
              <div className="absolute right-0 bottom-4 rounded-xl border border-forest/15 bg-cream-light/95 px-4 py-3 shadow-sm backdrop-blur">
                <p className="text-[11px] tracking-widest text-forest/60 uppercase">{t("Operating margin")}</p>
                <p className="font-serif text-2xl text-forest">26.7%</p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-forest/10 bg-cream-light/60">
          <div className="mx-auto grid max-w-7xl gap-6 px-5 py-8 text-sm text-forest sm:px-8 md:grid-cols-3">
            <p><span className="font-semibold">{t("One model.")}</span> {t("No industry-specific formulas to learn.")}</p>
            <p><span className="font-semibold">{t("Live results.")}</span> {t("Every assumption change recalculates instantly.")}</p>
            <p><span className="font-semibold">{t("Your data.")}</span> {t("Scenarios stay private to your account.")}</p>
          </div>
        </section>

        <section id="how-it-works" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[0.25em] text-coral-deep uppercase">{t("How it works")}</p>
              <h2 className="mt-3 font-serif text-4xl text-forest sm:text-5xl">
                {t("From assumption to ")}<span className="italic">{t("insight")}</span>.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-ink/65">
              {t(
                "Three deliberate steps keep the focus on the decisions that matter, not on building complicated spreadsheets.",
              )}
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="border-t border-forest/20 pt-6">
                <p className="font-serif text-4xl text-coral-deep">{step.number}</p>
                <h3 className="mt-4 font-serif text-2xl text-forest">{t(step.title)}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/65">{t(step.text)}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="features" className="bg-forest py-20 text-cream lg:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold tracking-[0.25em] text-coral uppercase">{t("Inside the workspace")}</p>
              <h2 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">
                {t("Clarity for the numbers that move your business.")}
              </h2>
            </div>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <div key={feature.title} className="rounded-2xl border border-cream/15 bg-cream/5 p-6">
                  <svg viewBox="0 0 24 24" className="h-8 w-8 text-coral" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d={feature.path} />
                  </svg>
                  <h3 className="mt-5 font-serif text-xl text-cream">{t(feature.title)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-cream/70">{t(feature.text)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
          <div className="flex flex-col items-start justify-between gap-8 rounded-3xl border border-forest/15 bg-cream-light px-8 py-10 md:flex-row md:items-center">
            <div>
              <h2 className="font-serif text-3xl text-forest sm:text-4xl">
                {t("Your next decision starts with a scenario.")}
              </h2>
              <p className="mt-3 max-w-xl text-sm text-ink/65">
                {t("Create your first simulation and explore the numbers in minutes.")}
              </p>
            </div>
            <ButtonLink href={destination} variant="accent" size="lg">
              Start Simulation
            </ButtonLink>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
