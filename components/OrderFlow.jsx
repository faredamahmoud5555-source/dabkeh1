"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ExternalLink, ShoppingBag, X } from "lucide-react";
import restaurant from "@/config/restaurant";
import { useCart, useCartActions } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { formatPrice } from "@/lib/currency";
import CartItem from "./CartItem";
import CheckoutForm from "./CheckoutForm";
import styles from "./OrderFlow.module.css";

/**
 * The whole ordering flow, in one component used in two places:
 *   variant="page"   -> the /cart page (full flow)
 *   variant="drawer" -> the quick cart drawer (review + jump to /cart)
 * Both read the SAME cart state from CartContext.
 *
 * Views: cart -> checkout -> confirm (after WhatsApp opens) -> done
 */
export default function OrderFlow({ variant = "page", initialStep = "cart", onClose }) {
  const { hydrated, lines, totalItems, total, pendingOrder } = useCart();
  const { addItem, decrementItem, removeItem, clearCart, cancelPendingOrder, confirmOrderSent } = useCartActions();
  const { t, tn, pick } = useLanguage();

  const isPage = variant === "page";
  const [step, setStep] = useState(initialStep); // "cart" | "checkout"
  const [completedOrder, setCompletedOrder] = useState(null);

  const view = completedOrder
    ? "done"
    : pendingOrder
      ? isPage
        ? "confirm"
        : "pending"
      : isPage && step === "checkout" && lines.length > 0
        ? "checkout"
        : "cart";

  const titles = { cart: t("cart.title"), checkout: t("checkout.title"), confirm: t("confirm.title"), done: t("done.title"), pending: t("confirm.title") };
  const Title = isPage ? "h1" : "h2";
  // Progress for the page variant: 1 cart, 2 delivery details, 3 send on WhatsApp.
  const currentStep = view === "checkout" ? 2 : view === "confirm" || view === "done" ? 3 : 1;
  const stepLabels = [t("flow.step1"), t("flow.step2"), t("flow.step3")];
  const closeDrawer = () => onClose?.();

  function handleConfirmSent() {
    setCompletedOrder({ reference: pendingOrder.reference });
    setStep("cart");
    confirmOrderSent(); // clears the cart: only after the customer confirmed
  }

  function handleGoBackToOrder() {
    cancelPendingOrder();
    setStep("cart");
  }

  return (
    <div className={styles.flow} data-variant={variant}>
      <header className={styles.header}>
        <Title className={styles.title}>
          {titles[view]}
        </Title>
        {!isPage && (
          <button type="button" className={styles.close} onClick={closeDrawer} aria-label={t("cart.close")}>
            <X size={22} strokeWidth={1.5} aria-hidden="true" />
          </button>
        )}
        {isPage && (
          <ol className={styles.steps} aria-label={t("flow.stepsAria")}>
            {stepLabels.map((label, index) => (
              <li
                key={label}
                className={styles.step}
                aria-current={currentStep === index + 1 ? "step" : undefined}
                data-done={currentStep > index + 1}
              >
                <span className={styles.stepNum} aria-hidden="true">
                  {index + 1}
                </span>
                <span className={styles.stepLabel}>{label}</span>
              </li>
            ))}
          </ol>
        )}
      </header>

      {/* Each view is keyed, so switching views plays a short fade. */}
      <div key={view} className={styles.view}>
        {/* ----------------------------- Cart ------------------------------ */}
        {view === "cart" && (
          <>
            <div className={styles.body}>
              {isPage && (
                <Link href="/menu" className={styles.continue}>
                  <ChevronLeft size={16} strokeWidth={1.75} aria-hidden="true" />
                  {t("cart.continue")}
                </Link>
              )}

              {!hydrated ? (
                <p className={styles.state} role="status">
                  {t("cart.loading")}
                </p>
              ) : lines.length === 0 ? (
                <div className={styles.empty}>
                  <ShoppingBag size={32} strokeWidth={1} aria-hidden="true" />
                  <p className={styles.emptyTitle}>{t("cart.empty")}</p>
                  <p>{t("cart.emptyText")}</p>
                  <Link href="/menu" className="btn btn-outline" onClick={closeDrawer}>
                    {t("cart.browse")}
                  </Link>
                </div>
              ) : (
                <ul>
                  {lines.map(({ item, quantity, subtotal }) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      quantity={quantity}
                      subtotal={subtotal}
                      onIncrement={addItem}
                      onDecrement={decrementItem}
                      onRemove={removeItem}
                    />
                  ))}
                </ul>
              )}
            </div>

            <div className={styles.footer}>
              <dl className={styles.totals}>
                <div>
                  <dt>{t("cart.items")}</dt>
                  <dd>{hydrated ? totalItems : "-"}</dd>
                </div>
                <div className={styles.grand}>
                  <dt>{t("cart.total")}</dt>
                  <dd>{hydrated ? formatPrice(total) : "-"}</dd>
                </div>
              </dl>
              <p className={styles.fineprint}>
                {[pick(restaurant.delivery?.area), pick(restaurant.delivery?.feeNote)].filter(Boolean).join(". ")}
              </p>

              {isPage ? (
                <button
                  type="button"
                  className="btn"
                  onClick={() => lines.length > 0 && setStep("checkout")}
                  disabled={!hydrated || lines.length === 0}
                >
                  {t("cart.proceed")}
                </button>
              ) : lines.length > 0 ? (
                <>
                  {/* Real links: they navigate to the cart page, where the order is sent. */}
                  <Link href="/cart?step=checkout" className="btn" onClick={closeDrawer}>
                    {t("cart.proceed")}
                  </Link>
                  <Link href="/cart" className="btn btn-outline" onClick={closeDrawer}>
                    {t("cart.viewFull")}
                  </Link>
                </>
              ) : (
                <button type="button" className="btn" disabled>
                  {t("cart.proceed")}
                </button>
              )}

              {hydrated && lines.length > 0 && (
                <button type="button" className={styles.linkButton} onClick={clearCart}>
                  {t("cart.clear")}
                </button>
              )}
            </div>
          </>
        )}

        {/* --------------------------- Checkout ---------------------------- */}
        {view === "checkout" && (
          <CheckoutForm lines={lines} totalItems={totalItems} total={total} onBack={() => setStep("cart")} />
        )}

        {/* --------- Drawer only: a pending order is confirmed on /cart ------ */}
        {view === "pending" && pendingOrder && (
          <>
            <div className={styles.body}>
              <p className={styles.lead}>{t("confirm.note")}</p>
            </div>
            <div className={styles.footer}>
              <Link href="/cart" className="btn" onClick={closeDrawer}>
                {t("float.confirmOrder")}
              </Link>
            </div>
          </>
        )}

        {/* ------------------- Confirm (after WhatsApp opens) -------------- */}
        {view === "confirm" && pendingOrder && (
          <>
            <div className={styles.body}>
              <p className={styles.lead}>
                {t("confirm.lead", { label: pendingOrder.numberLabel, number: pendingOrder.numberDisplay })}
              </p>
              <p className={styles.note}>{t("confirm.note")}</p>

              <dl className={styles.facts}>
                <div>
                  <dt>{t("confirm.ref")}</dt>
                  <dd dir="ltr">{pendingOrder.reference}</dd>
                </div>
                <div>
                  <dt>{t("confirm.total")}</dt>
                  <dd>{formatPrice(pendingOrder.total)}</dd>
                </div>
              </dl>
              <p className={styles.fineprint}>{t("confirm.refNote")}</p>

              <a href={pendingOrder.whatsappUrl} target="_blank" rel="noopener noreferrer" className={styles.reopen}>
                {t("confirm.reopen")}
                <ExternalLink size={14} strokeWidth={1.75} aria-hidden="true" />
                <span className="sr-only">({t("footer.newTab")})</span>
              </a>

              <details className={styles.preview}>
                <summary>{t("confirm.showMessage")}</summary>
                <pre dir="auto">{pendingOrder.message}</pre>
              </details>
            </div>

            <div className={styles.footer}>
              <button type="button" className="btn" onClick={handleConfirmSent}>
                {t("confirm.yes")}
              </button>
              <button type="button" className="btn btn-outline" onClick={handleGoBackToOrder}>
                {t("confirm.no")}
              </button>
            </div>
          </>
        )}

        {/* ----------------------------- Done ------------------------------ */}
        {view === "done" && completedOrder && (
          <>
            <div className={styles.body}>
              <p className={styles.lead}>{t("done.lead")}</p>
              <p className={styles.note}>{t("done.note")}</p>
              <dl className={styles.facts}>
                <div>
                  <dt>{t("confirm.ref")}</dt>
                  <dd dir="ltr">{completedOrder.reference}</dd>
                </div>
              </dl>
              <p className={styles.fineprint}>{t("done.refNote")}</p>
            </div>
            <div className={styles.footer}>
              {isPage ? (
                <Link href="/menu" className="btn">
                  {t("cart.continue")}
                </Link>
              ) : (
                <button type="button" className="btn" onClick={closeDrawer}>
                  {t("cart.close")}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
