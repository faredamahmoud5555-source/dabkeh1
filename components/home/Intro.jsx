"use client";

import Image from "next/image";
import restaurant from "@/config/restaurant";
import { useLanguage } from "@/context/LanguageContext";
import chalkboard from "@/public/images/dabke-chalkboard.jpg";
import styles from "./Intro.module.css";

export default function Intro() {
  const { t } = useLanguage();

  return (
    <section className={styles.section} aria-labelledby="intro-title">
      <div className={`container ${styles.grid}`}>
        {/* Supplied photo: chalkboard sign at the entrance, shown at its natural proportions. */}
        <figure className={`${styles.figure} reveal`}>
          <Image
            src={chalkboard}
            alt={t("intro.photoAlt")}
            className={styles.photo}
            sizes="(min-width: 60rem) 30rem, 90vw"
          />
        </figure>

        <div className={styles.copy}>
          <h2 id="intro-title" className={`${styles.title} reveal`}>
            {t("intro.title")}
          </h2>
          <div className={`${styles.text} reveal`}>
            <p>{t("intro.p1")}</p>
            <p>{t("intro.p2", { name: restaurant.name })}</p>
            <p>{t("intro.p3")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
