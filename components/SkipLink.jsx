"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function SkipLink() {
  const { t } = useLanguage();
  return (
    <a className="skip-link" href="#main">
      {t("skip")}
    </a>
  );
}
