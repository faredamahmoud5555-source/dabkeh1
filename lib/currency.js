import restaurant from "@/config/restaurant";

/**
 * Money helpers.
 *
 * Prices are always plain numbers. Only format them at the moment you render
 * them or build a message.
 *
 * We format the number with Intl and prepend the currency label ourselves
 * (instead of using `style: "currency"`) so the server and the browser always
 * produce exactly the same string, which avoids hydration mismatches.
 */

const FALLBACK_LOCALE = "en-US";

function createNumberFormat(fractionDigits) {
  const options = { minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits };
  try {
    return new Intl.NumberFormat(restaurant.locale, options);
  } catch {
    // Invalid locale in config: fall back instead of crashing the page.
    return new Intl.NumberFormat(FALLBACK_LOCALE, options);
  }
}

const wholeFormat = createNumberFormat(0); // 228 -> "228"
const fractionFormat = createNumberFormat(2); // 136.8 -> "136.80"
const currencyLabel = restaurant.currency?.display || restaurant.currency?.code || "";

/** Coerce anything to a finite number (invalid values become 0). */
export function toNumber(value) {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : 0;
}

/** Round to 2 decimals to avoid floating point drift (e.g. 0.1 + 0.2). */
export function roundMoney(value) {
  return Math.round((toNumber(value) + Number.EPSILON) * 100) / 100;
}

/**
 * 1250 -> "1,250 EGP" (or "EGP 1,250" when currency.position is "before").
 * Same text in Arabic and English. In the UI the value is wrapped in invisible
 * left-to-right isolate marks so "120 EGP" never flips to "EGP 120" inside an
 * Arabic (right-to-left) sentence. Pass { plain: true } for messages and logs.
 */
export function formatPrice(amount, { plain = false } = {}) {
  const rounded = roundMoney(amount);
  const formatted = (Number.isInteger(rounded) ? wholeFormat : fractionFormat).format(rounded);
  let text = formatted;
  if (currencyLabel) {
    text = restaurant.currency?.position === "before" ? `${currencyLabel} ${formatted}` : `${formatted} ${currencyLabel}`;
  }
  return plain ? text : `\u2066${text}\u2069`;
}
