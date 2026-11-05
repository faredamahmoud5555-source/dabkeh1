"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, MapPin, Navigation, Phone } from "lucide-react";
import restaurant from "@/config/restaurant";
import location from "@/config/location";
import { useLanguage } from "@/context/LanguageContext";
import { getDirectionsUrl, getEmbedUrl, getOpenMapsUrl, hasCoordinates, isMapConfigured } from "@/lib/maps";
import WhatsAppIcon from "./WhatsAppIcon";
import storefront from "@/public/images/dabke-storefront.jpg";
import styles from "./LocationView.module.css";

/**
 * /location: one framed composition (map + details), then the entrance photo.
 * Everything comes from config/location.js. Nothing is invented: when neither
 * coordinates nor an address to search for are configured, a placeholder is shown
 * instead of a misleading map.
 */
export default function LocationView() {
  const { lang, t, pick } = useLanguage();
  const [loaded, setLoaded] = useState(false);
  const [active, setActive] = useState(false); // touch screens: map only reacts after a tap
  const [timedOut, setTimedOut] = useState(false);
  const configured = isMapConfigured();

  // If the map has not loaded after a while (blocked network, ad blocker...), say so honestly.
  useEffect(() => {
    if (!configured || loaded) return;
    const id = setTimeout(() => setTimedOut(true), 9000);
    return () => clearTimeout(id);
  }, [configured, loaded]);
  const phones = restaurant.contact?.phones ?? [];
  const hours = pick(restaurant.delivery?.hours);

  return (
    <>
      <header className={styles.header}>
        <div className={`container ${styles.headerInner}`}>
          <h1 className={styles.title}>{t("location.title")}</h1>
          <p className={styles.intro}>{t("location.intro")}</p>
        </div>
      </header>

      <section className={`container ${styles.stage}`} aria-label={t("location.title")}>
        <div className={styles.frame}>
          {/* ------------------------------ Map ------------------------------ */}
          <div className={styles.mapCell}>
            <div className={styles.mapBox} data-active={active}>
              {configured ? (
                <>
                  {/* Sits behind the iframe: visible while the map loads. */}
                  <div
                    className={styles.skeleton}
                    data-loaded={loaded}
                    aria-hidden={timedOut ? undefined : "true"}
                    role={timedOut ? "status" : undefined}
                  >
                    <MapPin size={28} strokeWidth={1.25} aria-hidden="true" />
                    <span>{timedOut ? t("location.unavailable") : t("location.loading")}</span>
                  </div>
                  <iframe
                    key={lang}
                    title={t("location.mapTitle")}
                    src={getEmbedUrl(lang)}
                    className={styles.map}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                    onLoad={() => {
                      setLoaded(true);
                      setTimedOut(false);
                    }}
                  />
                  {/* Touch screens only (see CSS): stops the map from trapping page scrolling. */}
                  {!active && (
                    <button type="button" className={styles.activate} onClick={() => setActive(true)}>
                      <span>{t("location.tapToUse")}</span>
                    </button>
                  )}
                </>
              ) : (
                <div className={styles.placeholder}>
                  <MapPin size={36} strokeWidth={1.25} aria-hidden="true" />
                  <p className={styles.placeholderTitle}>{t("location.notConfigured")}</p>
                  <p>{t("location.notConfiguredText")}</p>
                </div>
              )}
            </div>
            {configured && !hasCoordinates() && <p className={styles.mapNote}>{t("location.mapNote")}</p>}
          </div>

          {/* ---------------------------- Details ---------------------------- */}
          <div className={styles.panel}>
            <dl className={styles.details}>
              <div>
                <dt>
                  <MapPin size={15} strokeWidth={1.5} aria-hidden="true" /> {t("location.address")}
                </dt>
                <dd className={styles.address}>{pick(location.address)}</dd>
              </div>
            </dl>

            {configured && (
              <div className={styles.buttons}>
                <a href={getDirectionsUrl()} target="_blank" rel="noopener noreferrer" className={`btn ${styles.directions}`}>
                  <Navigation size={20} strokeWidth={1.5} aria-hidden="true" />
                  {t("location.directions")}
                  <span className="sr-only"> ({t("footer.newTab")})</span>
                </a>
                <a href={getOpenMapsUrl()} target="_blank" rel="noopener noreferrer" className={`btn btn-outline ${styles.open}`}>
                  <ExternalLink size={18} strokeWidth={1.5} aria-hidden="true" />
                  {t("location.openMaps")}
                  <span className="sr-only"> ({t("footer.newTab")})</span>
                </a>
              </div>
            )}

            <dl className={styles.details}>
              <div>
                <dt>{t("location.landmarks")}</dt>
                <dd>
                  {pick(location.landmarks)} {t("location.lookFor")}
                </dd>
              </div>
              {hours && (
                <div>
                  <dt>{t("location.hours")}</dt>
                  <dd>{hours}</dd>
                </div>
              )}
              {phones.length > 0 && (
                <div>
                  <dt>
                    <Phone size={15} strokeWidth={1.5} aria-hidden="true" /> {t("location.phone")}
                  </dt>
                  <dd className={styles.phones}>
                    {phones.map((phone) => (
                      <a key={phone} href={`tel:${phone}`} className="text-link" dir="ltr">
                        {phone}
                      </a>
                    ))}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </section>

      <section className={`container ${styles.photoSection}`}>
        <figure className={styles.figure}>
          <Image src={storefront} alt={t("location.photoAlt")} className={styles.photo} sizes="(min-width: 48rem) 22rem, 80vw" />
          <figcaption>{t("location.lookFor")}</figcaption>
        </figure>
        <div className={`${styles.orderBand} on-dark`}>
          <p className={styles.bandTitle}>{t("location.orderCta")}</p>
          <Link href="/menu" className={`btn ${styles.bandCta}`}>
            <WhatsAppIcon size={20} />
            {t("home.orderNow")}
          </Link>
        </div>
      </section>
    </>
  );
}
