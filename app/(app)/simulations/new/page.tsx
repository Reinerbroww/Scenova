import { BusinessSetupForm } from "@/components/setup/BusinessSetupForm";
import { getTranslator } from "@/lib/i18n/server";

export default async function BusinessSetupPage() {
  const { t } = await getTranslator();

  return (
    <div className="mx-auto max-w-4xl">
      <p className="text-xs font-semibold tracking-[0.25em] text-coral-deep uppercase">{t("New simulation")}</p>
      <h1 className="mt-3 font-serif text-4xl text-forest sm:text-5xl">{t("Set up your business")}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/65">
        {t("Use one period consistently. All values are estimates in Indonesian Rupiah (IDR) and can be adjusted later in the simulation workspace.")}
      </p>
      <div className="mt-9">
        <BusinessSetupForm />
      </div>
    </div>
  );
}
