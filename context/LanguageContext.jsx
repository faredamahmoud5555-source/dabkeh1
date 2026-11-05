"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore } from "react";
import { translations } from "@/data/translations";
import { interpolate, pluralForm } from "@/lib/i18n";
import { getLangSnapshot, getServerLangSnapshot, setStoredLang, subscribeLang } from "@/lib/langStore";

/**
 * Language state for the whole site.
 *   const { lang, dir, t, tn, pick, setLang, toggleLang } = useLanguage();
 *
 *   t("cart.title")                      -> UI string
 *   t("cart.each", { price: "120 EGP" }) -> with {placeholders}
 *   tn("plural.dishes", 5)               -> "5 dishes" / "٥ أطباق"-style plural
 *   pick(item.name)                      -> item.name[lang] for { en, ar } objects
 *
 * The cart context is separate and never touched by language changes, so the
 * cart is preserved when switching language.
 */

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const lang = useSyncExternalStore(subscribeLang, getLangSnapshot, getServerLangSnapshot);
  const dir = lang === "ar" ? "rtl" : "ltr";

  // Keep <html lang dir> in sync (this is a DOM update, not React state).
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  const t = useCallback(
    (key, vars) => interpolate(translations[lang][key] ?? translations.en[key] ?? key, vars),
    [lang],
  );

  const tn = useCallback(
    (key, n, vars) => {
      const forms = translations[lang][key] ?? translations.en[key];
      if (!forms || typeof forms !== "object") return key;
      return interpolate(pluralForm(lang, forms, n), { n, ...vars });
    },
    [lang],
  );

  const pick = useCallback((value) => (value && typeof value === "object" ? (value[lang] ?? value.en ?? "") : (value ?? "")), [lang]);

  const value = useMemo(
    () => ({
      lang,
      dir,
      t,
      tn,
      pick,
      setLang: setStoredLang,
      toggleLang: () => setStoredLang(lang === "ar" ? "en" : "ar"),
    }),
    [lang, dir, t, tn, pick],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value) throw new Error("useLanguage must be used inside <LanguageProvider>.");
  return value;
}
