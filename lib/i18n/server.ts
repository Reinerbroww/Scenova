import { cookies } from "next/headers";
import {
  LANGUAGE_COOKIE,
  translate,
  type Language,
  type TranslateParams,
  type Translator,
} from "@/lib/i18n/dictionaries";

export async function getLanguage(): Promise<Language> {
  const value = (await cookies()).get(LANGUAGE_COOKIE)?.value;
  return value === "id" ? "id" : "en";
}

export async function getTranslator(): Promise<{ language: Language; t: Translator }> {
  const language = await getLanguage();
  return {
    language,
    t: (key: string, params?: TranslateParams) => translate(language, key, params),
  };
}
