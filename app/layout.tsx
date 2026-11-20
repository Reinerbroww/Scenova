import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display } from "next/font/google";
import { LanguageProvider } from "@/components/i18n/LanguageProvider";
import { getLanguage, getTranslator } from "@/lib/i18n/server";
import "./globals.css";

const serif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-dm-serif",
  display: "swap",
});

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslator();
  const tagline = `${t("Explore scenarios.")} ${t("Make better decisions.")}`;
  return {
    title: `Scenova — ${tagline}`,
    description: t(
      "See how changes in price, costs, and transaction volume affect your estimated business performance — before you make a move. Built for product and service businesses alike.",
    ),
    openGraph: {
      title: "Scenova",
      description: tagline,
      type: "website",
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const language = await getLanguage();
  return (
    <html lang={language} className={`${serif.variable} ${sans.variable}`}>
      <body className="min-h-screen bg-cream text-ink antialiased">
        <LanguageProvider initialLanguage={language}>{children}</LanguageProvider>
      </body>
    </html>
  );
}
