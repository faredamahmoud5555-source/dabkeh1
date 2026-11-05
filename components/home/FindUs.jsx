"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone } from "lucide-react";
import restaurant from "@/config/restaurant";
import location from "@/config/location";
import { useLanguage } from "@/context/LanguageContext";
import storefront from "@/public/images/dabke-storefront.jpg";
import styles from "./FindUs.module.css";

/** Short "find us" teaser on the homepage; the full map is on /location. */
export default function FindUs() {
  const { t, pick } = useLanguage();
  const phones = restaurant.contact?.phones ?? [];

  return (
    <section className={styles.section} aria-labelledby="find-title">
      <div className={`container ${styles.grid}`}>
        <div className={`${styles.copy} reveal`}>
          <h2 id="find-title" className={styles.title}>
            {t("home.findTitle")}
          </h2>
          <p className={styles.text}>{t("home.findText")}</p>
          <Link href="/location" className={`btn ${styles.cta}`}>
            <MapPin size={20} strokeWidth={1.5} aria-hidden="true" />
            {t("home.seeLocation")}
          </Link>
        </div>

        {/* Supplied photo of the storefront, shown whole at its own 9:16 proportions. */}
        <figure className={`${styles.figure} reveal`}>
          <Image
            src={storefront}
            alt={t("home.findPhotoAlt")}
            className={styles.photo}
            sizes="(min-width: 60rem) 22rem, 90vw"
          />
        </figure>

        <dl className={`${styles.card} reveal`}>
          <div>
            <dt>{t("location.address")}</dt>
            <dd>{pick(location.address)}</dd>
          </div>
          <div>
            <dt>{t("location.landmarks")}</dt>
            <dd>{pick(location.landmarks)}</dd>
          </div>
          {phones.length > 0 && (
            <div>
              <dt>{t("home.call")}</dt>
              <dd className={styles.phones}>
                {phones.map((phone) => (
                  <a key={phone} href={`tel:${phone}`} className="text-link" dir="ltr">
                    <Phone size={16} strokeWidth={1.5} aria-hidden="true" /> {phone}
                  </a>
                ))}
              </dd>
            </div>
          )}
        </dl>
      </div>
    </section>
  );
}
