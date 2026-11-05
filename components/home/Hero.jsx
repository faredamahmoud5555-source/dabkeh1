"use client";

import Image from "next/image";
import Link from "next/link";
import restaurant from "@/config/restaurant";
import location from "@/config/location";
import { useLanguage } from "@/context/LanguageContext";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import entrance from "@/public/images/dabke-entrance.jpg";
import styles from "./Hero.module.css";

export default function Hero() {
  const { t, pick } = useLanguage();
  const phone = restaurant.contact?.phones?.[0];

  // "LEBANESE RESTAURANT · ALEXANDRIA" -> two nowrap parts, so a wrapped line never starts with the dot.
  const subtitleParts = pick(restaurant.subtitle).split("·").map((part) => part.trim()).filter(Boolean);

  const facts = [
    { label: t("location.address"), value: pick(location.address) },
    { label: t("home.area"), value: pick(restaurant.delivery?.area) },
    { label: t("home.hours"), value: pick(restaurant.delivery?.hours) },
    { label: t("home.time"), value: pick(restaurant.delivery?.estimate) },
  ]
    .filter((fact) => fact.value)
    .slice(0, 3);

  return (
    <section className={`${styles.hero} on-dark`} aria-labelledby="hero-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          {/* The brand wordmark: always laid out left-to-right (Latin | Arabic), in both languages. */}
          <p className={styles.wordmark} dir="ltr" data-latin>
            <span className={styles.latin}>{restaurant.name}</span>
            <span className={styles.rule} aria-hidden="true" />
            <span className={styles.ar} lang="ar">
              {restaurant.nameArabic}
            </span>
          </p>

          <p className={styles.subtitle}>
            {subtitleParts.map((part, index) => (
              <span key={part} className={styles.subtitlePart}>
                {part}
                {index < subtitleParts.length - 1 && <span aria-hidden="true"> ·</span>}
              </span>
            ))}
          </p>

          <h1 id="hero-title" className={styles.headline}>
            {pick(restaurant.tagline)}
          </h1>
          <p className={styles.lead}>{pick(restaurant.heroText)}</p>

          <div className={styles.actions}>
            <Link href="/menu" className={`btn ${styles.order}`}>
              <WhatsAppIcon size={22} />
              {t("home.orderNow")}
            </Link>
            <Link href="/menu" className={`btn btn-outline ${styles.explore}`}>
              {t("home.exploreMenu")}
            </Link>
          </div>
        </div>

        {/* The supplied photo of the entrance, shown whole (no cropping, no distortion). */}
        <figure className={styles.figure}>
          <div className={styles.frameWrap}>
            <div className={styles.frame}>
              <Image
                src={entrance}
                alt={t("home.photoAlt")}
                className={styles.photo}
                priority
                sizes="(min-width: 60rem) 28rem, 90vw"
              />
            </div>
          </div>
          <figcaption className={styles.caption}>{pick(location.address)}</figcaption>
        </figure>
      </div>

      {facts.length > 0 && (
        <div className="container">
          <dl className={styles.facts}>
            {facts.map((fact) => (
              <div key={fact.label} className={styles.fact}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
            {phone && facts.length < 3 && (
              <div className={styles.fact}>
                <dt>{t("home.call")}</dt>
                <dd dir="ltr">
                  <a href={`tel:${phone}`} className="text-link">
                    {phone}
                  </a>
                </dd>
              </div>
            )}
          </dl>
        </div>
      )}
    </section>
  );
}
