"use client";

import restaurant from "@/config/restaurant";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./MenuHeader.module.css";

export default function MenuHeader() {
  const { t, pick } = useLanguage();
  const area = pick(restaurant.delivery?.area);
  const showNotice = restaurant.menu?.showDescriptions && restaurant.menu?.descriptionNotice;

  return (
    <header className={styles.header}>
      <div className={`container ${styles.headerInner}`}>
        <h1 className={styles.title}>{t("menu.title")}</h1>
        <div className={styles.intro}>
          <p>{t("menu.intro")}</p>
          {area && <p className={styles.meta}>{area}</p>}
          {showNotice && <p className={styles.notice}>{t("menu.notice")}</p>}
        </div>
      </div>
    </header>
  );
}
