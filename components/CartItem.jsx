"use client";

import { memo } from "react";
import { Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/currency";
import { useLanguage } from "@/context/LanguageContext";
import QuantityStepper from "./QuantityStepper";
import styles from "./CartItem.module.css";

/** One line in the cart: name (current language), unit price, quantity, subtotal, remove. */
function CartItem({ item, quantity, subtotal, onIncrement, onDecrement, onRemove }) {
  const { t, pick } = useLanguage();
  const name = pick(item.name);

  return (
    <li className={styles.item}>
      <div className={styles.info}>
        <p className={styles.name}>{name}</p>
        <p className={styles.unit}>{t("cart.each", { price: formatPrice(item.price) })}</p>
      </div>

      <p className={styles.subtotal}>
        <span className="sr-only">{t("cart.subtotal")}</span>
        {formatPrice(subtotal)}
      </p>

      <div className={styles.stepper}>
        <QuantityStepper
          compact
          name={name}
          quantity={quantity}
          onIncrement={() => onIncrement(item.id)}
          onDecrement={() => onDecrement(item.id)}
        />
      </div>

      <button type="button" className={styles.remove} onClick={() => onRemove(item.id)} aria-label={t("item.remove", { name })}>
        <Trash2 size={16} strokeWidth={1.5} aria-hidden="true" />
        <span>{t("cart.remove")}</span>
      </button>
    </li>
  );
}

export default memo(CartItem);
