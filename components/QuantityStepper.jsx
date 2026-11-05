"use client";

import { Minus, Plus } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./QuantityStepper.module.css";

/**
 * Shared minus / quantity / plus control. `name` must already be in the current
 * language. `incrementRef` lets a parent move keyboard focus to the "+" button.
 */
export default function QuantityStepper({ name, quantity, onIncrement, onDecrement, incrementRef, compact = false }) {
  const { t } = useLanguage();
  return (
    <div className={`${styles.stepper} ${compact ? styles.compact : ""}`} role="group" aria-label={t("item.qtyOf", { name })}>
      <button type="button" className={styles.button} onClick={onDecrement} aria-label={t("item.dec", { name })}>
        <Minus size={16} strokeWidth={1.75} aria-hidden="true" />
      </button>
      <span key={quantity} className={styles.value}>
        {quantity}
      </span>
      <button
        type="button"
        className={styles.button}
        onClick={onIncrement}
        ref={incrementRef}
        aria-label={t("item.inc", { name })}
      >
        <Plus size={16} strokeWidth={1.75} aria-hidden="true" />
      </button>
    </div>
  );
}
