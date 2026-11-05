"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, X } from "lucide-react";
import { useCart, useCartActions } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { formatPrice } from "@/lib/currency";
import { buildWhatsAppUrl, chatGreeting, getWhatsAppNumbers } from "@/lib/whatsapp";
import WhatsAppIcon from "./WhatsAppIcon";
import styles from "./FloatingActions.module.css";

/**
 * Fixed buttons shown on every page except /cart:
 *  - On /menu, with items in the order: a "View order" bar (count + total) that
 *    opens the quick cart drawer.
 *  - A WhatsApp button that always does something useful and never sends the
 *    customer to a different page than expected:
 *      order waiting for confirmation -> /cart (confirm step)
 *      items in the cart             -> /cart (review, then send via WhatsApp)
 *      empty cart                    -> opens WhatsApp chat options (a greeting, NOT an order)
 * Both live in one flex row, so they can never overlap each other.
 */
export default function FloatingActions() {
  const pathname = usePathname();
  const { hydrated, totalItems, total, pendingOrder } = useCart();
  const { openCart } = useCartActions();
  const { lang, t, tn, pick } = useLanguage();
  const [chatOpen, setChatOpen] = useState(false);
  const chatRef = useRef(null);

  const numbers = getWhatsAppNumbers();
  const hasItems = hydrated && totalItems > 0;
  const showCartBar = hasItems && pathname.startsWith("/menu");

  // Close the chat chooser with Escape or a click outside it.
  useEffect(() => {
    if (!chatOpen) return;
    function onKey(event) {
      if (event.key === "Escape") setChatOpen(false);
    }
    function onPointer(event) {
      if (chatRef.current && !chatRef.current.contains(event.target)) setChatOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [chatOpen]);

  // The cart page already has its own WhatsApp send button; keep it uncluttered.
  if (pathname.startsWith("/cart")) return null;

  const toCart = Boolean(pendingOrder) || hasItems;
  const label = pendingOrder ? t("float.confirmOrder") : hasItems ? t("float.reviewOrder") : t("float.chat");
  const text = pendingOrder || hasItems ? t("nav.cart") : t("float.chatShort");

  const circle = (
    <>
      <WhatsAppIcon size={26} />
      <span className={styles.tip} aria-hidden="true">
        {text}
      </span>
    </>
  );

  return (
    <div className={`${styles.wrap} on-dark`}>
      {showCartBar && (
        <button type="button" className={styles.cartBar} onClick={openCart}>
          <ShoppingBag size={20} strokeWidth={1.5} aria-hidden="true" />
          <span className={styles.cartText}>
            {t("cart.viewOrder")}
            <span className={styles.cartMeta}>
              {t("cart.bar", { items: tn("plural.items", totalItems), price: formatPrice(total) })}
            </span>
          </span>
        </button>
      )}

      {toCart ? (
        <Link href="/cart" className={styles.whatsapp} aria-label={label}>
          {circle}
        </Link>
      ) : numbers.length === 1 ? (
        <a
          href={buildWhatsAppUrl(numbers[0].number, chatGreeting(lang))}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.whatsapp}
          aria-label={label}
        >
          {circle}
        </a>
      ) : numbers.length > 1 ? (
        <div className={styles.chatWrap} ref={chatRef}>
          {chatOpen && (
            <div className={styles.popover} role="group" aria-label={t("float.chatOpen")}>
              <p className={styles.popTitle}>{t("float.chatOpen")}</p>
              {numbers.map((entry) => (
                <a
                  key={entry.id}
                  href={buildWhatsAppUrl(entry.number, chatGreeting(lang))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.popLink}
                  onClick={() => setChatOpen(false)}
                >
                  <WhatsAppIcon size={18} />
                  <span>
                    {pick(entry.label)}
                    <span className={styles.popNumber} dir="ltr">
                      {entry.display}
                    </span>
                  </span>
                </a>
              ))}
            </div>
          )}
          <button
            type="button"
            className={styles.whatsapp}
            onClick={() => setChatOpen((open) => !open)}
            aria-expanded={chatOpen}
            aria-label={chatOpen ? t("float.closeChat") : label}
          >
            {chatOpen ? <X size={24} strokeWidth={1.75} aria-hidden="true" /> : circle}
          </button>
        </div>
      ) : null}
    </div>
  );
}
