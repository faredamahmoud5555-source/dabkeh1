"use client";

import Link from "next/link";
import restaurant from "@/config/restaurant";
import { useLanguage } from "@/context/LanguageContext";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { buildWhatsAppUrl, chatGreeting, getWhatsAppNumbers } from "@/lib/whatsapp";
import styles from "./OrderCta.module.css";

const steps = ["s1", "s2", "s3"];

export default function OrderCta() {
  const { lang, t, pick } = useLanguage();
  const { delivery, contact } = restaurant;
  const chat = getWhatsAppNumbers()[0];
  const phone = contact?.phones?.[0];
  const lead = [pick(delivery?.area), pick(delivery?.estimate), pick(delivery?.hours)].filter(Boolean).join(". ");

  return (
    <section id="delivery" className={`${styles.section} on-dark`} aria-labelledby="delivery-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          <h2 id="delivery-title" className={styles.title}>
            {t("how.title")}
          </h2>
          {lead && <p className={styles.lead}>{lead}.</p>}
          <div className={styles.actions}>
            <Link href="/menu" className={`btn ${styles.order}`}>
              <WhatsAppIcon size={20} />
              {t("home.orderNow")}
            </Link>
            {chat && (
              <a
                href={buildWhatsAppUrl(chat.number, chatGreeting(lang))}
                target="_blank"
                rel="noopener noreferrer"
                className="text-link"
              >
                {t("how.chat")}
                <span className="sr-only"> ({t("footer.newTab")})</span>
              </a>
            )}
            {phone && (
              <p className={styles.call}>
                {t("how.call")}{" "}
                <a href={`tel:${phone}`} className="text-link" dir="ltr">
                  {phone}
                </a>
              </p>
            )}
          </div>
          {delivery?.feeNote && <p className={styles.note}>{pick(delivery.feeNote)}</p>}
        </div>

        {/* A real sequence, so the numbers carry meaning. */}
        <ol className={`${styles.steps} reveal`}>
          {steps.map((step, index) => (
            <li key={step} className={styles.step}>
              <span className={styles.number} aria-hidden="true">
                {index + 1}
              </span>
              <div>
                <h3 className={styles.stepTitle}>
                  <span className="sr-only">{t("how.step", { n: index + 1 })}</span>
                  {t(`how.${step}.t`)}
                </h3>
                <p>{t(`how.${step}.d`)}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
