"use client";

import { MessageCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./WhatsAppNumberSelector.module.css";

/**
 * Radio group to pick which WhatsApp number receives the order.
 * `numbers` comes from getWhatsAppNumbers() (already validated).
 * `error` is a translated string.
 */
export default function WhatsAppNumberSelector({ numbers, value, onChange, error }) {
  const { t, pick } = useLanguage();

  if (numbers.length === 0) {
    return (
      <p className={styles.unavailable} role="alert">
        {t("checkout.waNone")}
      </p>
    );
  }

  const errorId = error ? "whatsapp-error" : undefined;

  return (
    <fieldset className={styles.fieldset} aria-describedby={errorId}>
      <legend className={styles.legend}>
        {t("checkout.sendTo")} <span aria-hidden="true">*</span>
      </legend>
      <div className={styles.options}>
        {numbers.map((entry) => (
          <label key={entry.id} className={styles.option}>
            <input
              type="radio"
              name="whatsappId"
              value={entry.id}
              checked={value === entry.id}
              onChange={() => onChange(entry.id)}
              className={styles.radio}
            />
            <span className={styles.indicator} aria-hidden="true" />
            <span className={styles.text}>
              <span className={styles.optionLabel}>{pick(entry.label)}</span>
              <span className={styles.number} dir="ltr">
                {entry.display}
              </span>
            </span>
            <MessageCircle size={18} strokeWidth={1.5} className={styles.icon} aria-hidden="true" />
          </label>
        ))}
      </div>
      {error && (
        <p id={errorId} className={styles.error}>
          {t("checkout.errorPrefix")}
          {error}
        </p>
      )}
    </fieldset>
  );
}
