"use client";

import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import restaurant from "@/config/restaurant";
import location from "@/config/location";
import { useLanguage } from "@/context/LanguageContext";
import { buildWhatsAppUrl, chatGreeting, getWhatsAppNumbers } from "@/lib/whatsapp";
import WhatsAppIcon from "./WhatsAppIcon";
import styles from "./Footer.module.css";

const exploreLinks = [
  { href: "/", key: "nav.home" },
  { href: "/menu", key: "nav.menu" },
  { href: "/location", key: "nav.location" },
  { href: "/cart", key: "nav.cart" },
];

export default function Footer({ year }) {
  const { lang, t, pick } = useLanguage();
  const numbers = getWhatsAppNumbers();
  const { contact, delivery } = restaurant;
  const phones = contact?.phones ?? [];
  const socials = (restaurant.social ?? []).filter((s) => s?.url);
  const hours = pick(delivery?.hours);
  const greeting = chatGreeting(lang);

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div>
          <p className={styles.wordmark} data-latin>
            {restaurant.name}
          </p>
          <p className={styles.arabic} lang="ar">
            {restaurant.nameArabic}
          </p>
          <p className={styles.description}>{pick(restaurant.description)}</p>
        </div>

        <div>
          <h2 className={styles.heading}>{t("footer.contact")}</h2>
          <ul className={styles.list}>
            {phones.map((phone) => (
              <li key={phone}>
                <Phone size={16} strokeWidth={1.5} aria-hidden="true" />
                <a href={`tel:${phone}`} className={styles.link} dir="ltr">
                  {phone}
                </a>
              </li>
            ))}
            {contact?.email && (
              <li>
                <Mail size={16} strokeWidth={1.5} aria-hidden="true" />
                <a href={`mailto:${contact.email}`} className={styles.link}>
                  {contact.email}
                </a>
              </li>
            )}
            <li>
              <MapPin size={16} strokeWidth={1.5} aria-hidden="true" />
              <Link href="/location" className={styles.link}>
                {pick(location.address)}
              </Link>
            </li>
          </ul>
          {hours && <p className={styles.hours}>{hours}</p>}
        </div>

        <div>
          <h2 className={styles.heading}>{t("footer.whatsapp")}</h2>
          <p className={styles.ctaText}>{t("footer.ctaText")}</p>
          {numbers.length > 0 ? (
            <>
              <a
                href={buildWhatsAppUrl(numbers[0].number, greeting)}
                target="_blank"
                rel="noopener noreferrer"
                className={`btn ${styles.cta}`}
              >
                <WhatsAppIcon size={20} />
                {t("footer.chatBtn")}
                <span className="sr-only"> ({t("footer.newTab")})</span>
              </a>
              <ul className={`${styles.list} ${styles.chat}`}>
                {numbers.map((entry) => (
                  <li key={entry.id}>
                    <WhatsAppIcon size={16} />
                    <a
                      href={buildWhatsAppUrl(entry.number, greeting)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.link}
                      aria-label={t("footer.opensWa", { label: pick(entry.label) })}
                    >
                      <span dir="ltr">{entry.display}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className={styles.muted}>{t("footer.unconfigured")}</p>
          )}

          {socials.length > 0 && (
            <ul className={styles.socials} aria-label={t("footer.social")}>
              {socials.map((s) => (
                <li key={s.label}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className={styles.link}>
                    {s.label}
                    <span className="sr-only"> ({t("footer.newTab")})</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <nav aria-label={t("footer.explore")}>
          <h2 className={styles.heading}>{t("footer.explore")}</h2>
          <ul className={styles.list}>
            {exploreLinks.map(({ href, key }) => (
              <li key={href}>
                <Link href={href} className={styles.link}>
                  {t(key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="container">
        <div className={styles.bottom}>
          <p>
            &copy; {year} {restaurant.name} | {restaurant.nameArabic}. {t("footer.rights")}
          </p>
          <p>{pick(restaurant.subtitle)}</p>
        </div>
      </div>
    </footer>
  );
}
