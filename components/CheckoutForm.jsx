"use client";

import { useMemo, useRef, useState } from "react";
import { ChevronLeft } from "lucide-react";
import restaurant from "@/config/restaurant";
import { useCartActions } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { formatPrice } from "@/lib/currency";
import { generateOrderReference } from "@/lib/order";
import { readJSON, writeJSON } from "@/lib/storage";
import { FIELD_ORDER, validateCheckout } from "@/lib/validation";
import { buildOrderMessage, buildWhatsAppUrl, getWhatsAppNumbers, openWhatsApp } from "@/lib/whatsapp";
import FormField from "./FormField";
import WhatsAppIcon from "./WhatsAppIcon";
import WhatsAppNumberSelector from "./WhatsAppNumberSelector";
import flow from "./OrderFlow.module.css";
import styles from "./CheckoutForm.module.css";

const CUSTOMER_KEY = "customer";

/**
 * Delivery checkout. Validates, builds the WhatsApp message from the real cart
 * and form data, records a "pending order" and opens wa.me with the chosen number.
 * It NEVER navigates inside the site and does NOT clear the cart: that only
 * happens after the customer confirms they sent the message.
 *
 * This component only mounts after "PROCEED TO ORDER", so reading localStorage in
 * the initial state is safe (it is never part of the server render).
 */
export default function CheckoutForm({ lines, totalItems, total, onBack }) {
  const { startPendingOrder } = useCartActions();
  const { lang, t, tn, pick } = useLanguage();
  const formRef = useRef(null);

  const numbers = useMemo(() => getWhatsAppNumbers(), []);
  const validIds = useMemo(() => numbers.map((n) => n.id), [numbers]);

  const [values, setValues] = useState(() => {
    const saved = readJSON(CUSTOMER_KEY, {}) ?? {};
    return {
      name: typeof saved.name === "string" ? saved.name : "",
      phone: typeof saved.phone === "string" ? saved.phone : "",
      address: typeof saved.address === "string" ? saved.address : "",
      notes: "",
      whatsappId: validIds.includes(saved.whatsappId) ? saved.whatsappId : (validIds[0] ?? ""),
    };
  });
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [formError, setFormError] = useState("");

  const errors = useMemo(() => validateCheckout(values, { validWhatsAppIds: validIds }), [values, validIds]);
  // Errors are { key, vars }; translate them at render time so they follow the language switch.
  const visibleError = (field) => {
    const error = submitAttempted || touched[field] ? errors[field] : undefined;
    return error ? t(error.key, error.vars) : undefined;
  };

  function update(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
    setFormError("");
  }

  const fieldProps = (field) => ({
    name: field,
    value: values[field],
    onChange: (event) => update(field, event.target.value),
    onBlur: () => setTouched((current) => ({ ...current, [field]: true })),
  });

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitAttempted(true);

    if (lines.length === 0) {
      setFormError(t("checkout.emptyError"));
      return;
    }

    const firstInvalid = FIELD_ORDER.find((field) => errors[field]);
    if (firstInvalid) {
      formRef.current?.querySelector(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    const destination = numbers.find((n) => n.id === values.whatsappId);
    if (!destination) {
      setFormError(t("checkout.waUnavailable"));
      return;
    }

    const reference = generateOrderReference();
    const message = buildOrderMessage({ lang, reference, customer: values, lines, total });
    const whatsappUrl = buildWhatsAppUrl(destination.number, message);

    // Remember contact details (not notes) for next time on this device.
    writeJSON(CUSTOMER_KEY, {
      name: values.name.trim(),
      phone: values.phone.trim(),
      address: values.address.trim(),
      whatsappId: values.whatsappId,
    });

    // Persist first (the page may be left right away on mobile), then open WhatsApp.
    startPendingOrder({
      reference,
      message,
      whatsappUrl,
      numberLabel: pick(destination.label),
      numberDisplay: destination.display,
      totalItems,
      total,
      createdAt: Date.now(),
    });
    openWhatsApp(whatsappUrl);
  }

  return (
    <form ref={formRef} className={flow.formShell} onSubmit={handleSubmit} noValidate>
      <div className={flow.body}>
        <button type="button" className={styles.back} onClick={onBack}>
          <ChevronLeft size={16} strokeWidth={1.75} aria-hidden="true" className={styles.backIcon} />
          {t("checkout.back")}
        </button>

        <p className={styles.required}>{t("checkout.required")}</p>

        <div className={styles.fields}>
          <FormField id="checkout-name" label={t("checkout.name")} required error={visibleError("name")}>
            {(aria) => <input {...aria} {...fieldProps("name")} type="text" autoComplete="name" maxLength={120} />}
          </FormField>

          <FormField
            id="checkout-phone"
            label={t("checkout.phone")}
            required
            error={visibleError("phone")}
            hint={t("checkout.phoneHint")}
          >
            {(aria) => (
              <input {...aria} {...fieldProps("phone")} type="tel" inputMode="tel" autoComplete="tel" maxLength={30} dir="ltr" />
            )}
          </FormField>

          <FormField
            id="checkout-address"
            label={t("checkout.address")}
            required
            error={visibleError("address")}
            hint={t("checkout.addressHint")}
          >
            {(aria) => (
              <textarea {...aria} {...fieldProps("address")} rows={3} autoComplete="street-address" maxLength={400} />
            )}
          </FormField>

          <FormField id="checkout-notes" label={t("checkout.notes")} error={visibleError("notes")}>
            {(aria) => <textarea {...aria} {...fieldProps("notes")} rows={2} maxLength={400} />}
          </FormField>

          <WhatsAppNumberSelector
            numbers={numbers}
            value={values.whatsappId}
            onChange={(id) => update("whatsappId", id)}
            error={visibleError("whatsappId")}
          />
        </div>

      </div>

      <div className={flow.footer}>
        <section className={styles.summary} aria-labelledby="order-summary-title">
          <h3 id="order-summary-title" className={styles.summaryTitle}>
            {t("checkout.summary")}
          </h3>
          <ul className={styles.summaryList}>
            {lines.map(({ item, quantity, subtotal }) => (
              <li key={item.id}>
                <span>
                  {quantity} &times; {pick(item.name)}
                </span>
                <span className={styles.amount}>{formatPrice(subtotal)}</span>
              </li>
            ))}
          </ul>
          <p className={styles.totalRow}>
            <span>{t("checkout.totalLine", { items: tn("plural.items", totalItems) })}</span>
            <strong className={styles.amount}>{formatPrice(total)}</strong>
          </p>
          {restaurant.delivery?.feeNote && <p className={styles.feeNote}>{pick(restaurant.delivery.feeNote)}</p>}
        </section>
        {formError && (
          <p className={styles.formError} role="alert">
            {formError}
          </p>
        )}
        <button type="submit" className={`btn ${flow.sendButton}`} disabled={lines.length === 0 || numbers.length === 0}>
          <WhatsAppIcon size={22} />
          {t("checkout.send")}
        </button>
        <p className={flow.fineprint}>{t("checkout.fine")}</p>
      </div>
    </form>
  );
}
