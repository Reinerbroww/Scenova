import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { getTranslator } from "@/lib/i18n/server";

export default async function AppNotFound() {
  const { t } = await getTranslator();

  return (
    <div className="mx-auto max-w-2xl">
      <Card className="p-10 text-center">
        <p className="text-xs font-semibold tracking-[0.25em] text-coral-deep uppercase">404</p>
        <h1 className="mt-3 font-serif text-3xl text-forest">{t("We couldn’t find that page")}</h1>
        <p className="mt-3 text-sm text-ink/65">
          {t("It may have been deleted, or it might belong to another account.")}
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-cream hover:bg-forest-deep"
        >
          {t("Back to dashboard")}
        </Link>
      </Card>
    </div>
  );
}
