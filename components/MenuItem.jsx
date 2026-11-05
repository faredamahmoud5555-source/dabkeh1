"use client";

import { memo, useEffect, useRef } from "react";
import { Check, Plus } from "lucide-react";
import { formatPrice } from "@/lib/currency";
import { useCartActions } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import QuantityStepper from "./QuantityStepper";
import styles from "./MenuItem.module.css";

/**
 * One dish row, shown in the current language only (name, description, category).
 * memo(): it re-renders only when its own `item` or `quantity` changes (the cart
 * actions have a stable identity).
 */
function MenuItem({ item, quantity }) {
  const { addItem, decrementItem } = useCartActions();
  const { t, pick } = useLanguage();
  const inCart = quantity > 0;
  const name = pick(item.name);
  const description = pick(item.description);
  const hasDescription = Boolean(description);

  // Keyboard users: the Add button is replaced by the stepper (and back), so
  // move focus to the control that takes its place instead of losing it.
  const addRef = useRef(null);
  const plusRef = useRef(null);
  const nextFocus = useRef(null); // "stepper" | "add" | null

  useEffect(() => {
    if (inCart && nextFocus.current === "stepper") plusRef.current?.focus();
    if (!inCart && nextFocus.current === "add") addRef.current?.focus();
    nextFocus.current = null;
  }, [inCart]);

  function handleAdd() {
    nextFocus.current = "stepper";
    addItem(item.id);
  }

  function handleDecrement() {
    if (quantity === 1) nextFocus.current = "add";
    decrementItem(item.id);
  }

  return (
    <li className={styles.row} data-in-cart={inCart} data-desc={hasDescription}>
      <div className={styles.head}>
        <h3 className={styles.name}>{name}</h3>
        <span className={styles.leader} aria-hidden="true" />
        <span className={styles.price}>{formatPrice(item.price)}</span>
      </div>

      {hasDescription && <p className={styles.description}>{description}</p>}

      <div className={styles.action}>
        {inCart ? (
          <div className={styles.added}>
            <QuantityStepper
              name={name}
              quantity={quantity}
              onIncrement={() => addItem(item.id)}
              onDecrement={handleDecrement}
              incrementRef={plusRef}
            />
            <span className={styles.addedLabel}>
              <Check size={14} strokeWidth={2} aria-hidden="true" />
              <span className={styles.addedText}>{t("item.inOrder")}</span>
            </span>
          </div>
        ) : (
          <button
            type="button"
            ref={addRef}
            className={`btn btn-outline ${styles.addButton}`}
            onClick={handleAdd}
            aria-label={t("item.addAria", { name })}
          >
            <Plus size={18} strokeWidth={1.75} aria-hidden="true" />
            <span className={styles.addText}>{t("item.add")}</span>
          </button>
        )}
      </div>

      {/* Announces changes to screen readers without moving focus. */}
      <span className="sr-only" role="status">
        {inCart ? t("item.inOrderStatus", { name, n: quantity }) : ""}
      </span>
    </li>
  );
}

export default memo(MenuItem);
