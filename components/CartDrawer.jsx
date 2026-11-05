"use client";

import { useEffect, useRef } from "react";
import { useCart, useCartActions } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import OrderFlow from "./OrderFlow";
import styles from "./CartDrawer.module.css";

/**
 * Quick-access cart: a native <dialog> (focus trap, Escape to close, inert page
 * behind it) that slides in from the side. It shows the same cart state as the
 * /cart page and links there for checkout.
 */
export default function CartDrawer() {
  const { isOpen } = useCart();
  const { closeCart } = useCartActions();
  const { t } = useLanguage();
  const dialogRef = useRef(null);

  // Keep the <dialog> in sync with the `isOpen` state.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  // Clicks on the backdrop target the <dialog> element itself.
  function handleBackdropClick(event) {
    if (event.target === dialogRef.current) dialogRef.current.close();
  }

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-label={t("cart.title")}
      onClose={closeCart} // Escape, close button and programmatic close() all end up here
      onClick={handleBackdropClick}
    >
      <div className={styles.panel}><OrderFlow variant="drawer" onClose={() => dialogRef.current?.close()} /></div>
    </dialog>
  );
}
