"use client";

import Link from "next/link";
import { featuredItems, getCategoryLabel } from "@/data/menu";
import { formatPrice } from "@/lib/currency";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./FeaturedMenu.module.css";

/** Text-only preview of dishes flagged `featured: true` in data/menu.js. */
export default function FeaturedMenu() {
  const { t, pick } = useLanguage();
  if (featuredItems.length === 0) return null;

  return (
    <section className={styles.section} aria-labelledby="featured-title">
      <div className="container">
        <div className={styles.header}>
          <h2 id="featured-title" className={styles.title}>
            {t("featured.title")}
          </h2>
          <Link href="/menu" className="text-link">
            {t("featured.seeAll")}
          </Link>
        </div>

        <ul className={styles.list}>
          {featuredItems.map((item) => (
            <li key={item.id} className={`${styles.item} reveal`}>
              <div className={styles.head}>
                <h3 className={styles.name}>{pick(item.name)}</h3>
                <span className={styles.leader} aria-hidden="true" />
                <span className={styles.price}>{formatPrice(item.price)}</span>
              </div>
              {pick(item.description) && <p className={styles.description}>{pick(item.description)}</p>}
              <p className={styles.meta}>
                <span className={styles.category}>
                  <span className="sr-only">{t("item.category")}</span>
                  {pick(getCategoryLabel(item.category))}
                </span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
