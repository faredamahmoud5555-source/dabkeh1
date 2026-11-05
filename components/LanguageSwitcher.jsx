"use client";

import { Languages } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./LanguageSwitcher.module.css";

/**
 * Switches Arabic <-> English. The label shows the language you will switch TO,
 * written in that language (so it is readable by people who cannot read the current one).
 */
export default function LanguageSwitcher({ className = "" }) {
  const { lang, t, toggleLang } = useLanguage();
  return (
    <button
      type="button"
      className={`${styles.switcher} ${className}`}
      onClick={toggleLang}
      aria-label={t("lang.switchAria")}
      lang={lang === "ar" ? "en" : "ar"}
    >
      <Languages size={18} strokeWidth={1.5} aria-hidden="true" />
      <span>{t("lang.switchLabel")}</span>
    </button>
  );
}
