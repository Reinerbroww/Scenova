"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import {
  translate,
  type Language,
  type TranslateParams,
  type Translator,
} from "@/lib/i18n/dictionaries";
import { LANGUAGE_COOKIE } from "@/lib/i18n/dictionaries";

type I18nContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: Translator;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function LanguageProvider({
  initialLanguage,
  children,
}: {
  initialLanguage: Language;
  children: ReactNode;
}) {
  const [language, setLanguageState] = useState<Language>(initialLanguage);

  const setLanguage = useCallback((next: Language) => {
    document.cookie = `${LANGUAGE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    setLanguageState(next);
  }, []);

  const t = useCallback(
    (key: string, params?: TranslateParams) => translate(language, key, params),
    [language],
  );

  const value = useMemo(() => ({ language, setLanguage, t }), [language, setLanguage, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used inside LanguageProvider");
  return context;
}
