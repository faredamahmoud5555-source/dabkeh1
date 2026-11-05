import restaurant from "@/config/restaurant";
import { formatPrice } from "@/lib/currency";
import { digitsOnly } from "@/lib/validation";

/**
 * WhatsApp helpers: number checks, message building and opening wa.me.
 * All WhatsApp logic lives here so it can be reused and tested in one place.
 *
 * IMPORTANT: a wa.me link only opens a chat with a pre-filled message. The
 * website cannot know whether the customer actually pressed "Send".
 */

/** Returns digits only if it looks like an international number, else null. */
export function normalizeWhatsAppNumber(raw) {
  const digits = digitsOnly(raw);
  if (digits.length < 8 || digits.length > 15) return null;
  if (digits.startsWith("0")) return null; // must include the country code
  return digits;
}

/**
 * The configured numbers that are usable. `label` is a bilingual { en, ar } object.
 * Invalid or empty entries are skipped so a typo in config never breaks checkout.
 */
export function getWhatsAppNumbers() {
  const list = Array.isArray(restaurant.whatsappNumbers) ? restaurant.whatsappNumbers : [];
  return list
    .map((entry, index) => {
      const number = normalizeWhatsAppNumber(entry?.number);
      if (!number) return null;
      const fallback = { en: `Number ${index + 1}`, ar: `الرقم ${index + 1}` };
      return {
        id: String(entry.id ?? `number-${index + 1}`),
        label: entry.label && typeof entry.label === "object" ? entry.label : { en: entry.label || fallback.en, ar: entry.label || fallback.ar },
        number,
        display: entry.display || `+${number}`,
      };
    })
    .filter(Boolean);
}

export function buildWhatsAppUrl(number, message) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/** Friendly opener for the "chat with us" buttons (NOT an order). */
export function chatGreeting(lang) {
  return lang === "ar" ? "مرحباً دبكة! لدي استفسار." : "Hello DABKEH! I have a question.";
}

/** Plain text price for the message (no invisible bidi marks). */
function plainPrice(amount) {
  return formatPrice(amount, { plain: true });
}

/* Message wording, per language. Item names follow the same language. */
const WORDS = {
  en: {
    intro: "Hello! I would like to place a new order.",
    reference: "Order Reference",
    customer: "CUSTOMER DETAILS:",
    name: "Name",
    phone: "Phone",
    address: "Delivery Address",
    notes: "Delivery Notes",
    order: "MY ORDER:",
    quantity: "Quantity",
    unit: "Unit Price",
    subtotal: "Subtotal",
    total: "TOTAL",
    closing: "Please confirm my order and estimated delivery time.",
    thanks: "Thank you!",
  },
  ar: {
    intro: "مرحباً! أود تقديم طلب جديد.",
    reference: "رقم الطلب",
    customer: "بيانات العميل:",
    name: "الاسم",
    phone: "الهاتف",
    address: "عنوان التوصيل",
    notes: "ملاحظات التوصيل",
    order: "طلبي:",
    quantity: "الكمية",
    unit: "سعر الوحدة",
    subtotal: "الإجمالي الفرعي",
    total: "الإجمالي",
    closing: "يرجى تأكيد طلبي ووقت التوصيل المتوقع.",
    thanks: "شكراً لكم!",
  },
};

/**
 * Builds the complete order message from the real cart + form data.
 *
 * @param {object} args
 * @param {"en"|"ar"} args.lang  language of the message (the customer's UI language)
 * @param {string} args.reference
 * @param {{name: string, phone: string, address: string, notes?: string}} args.customer
 * @param {{item: {name: {en: string, ar: string}, price: number}, quantity: number, subtotal: number}[]} args.lines
 * @param {number} args.total
 */
export function buildOrderMessage({ lang = "en", reference, customer, lines, total }) {
  const w = WORDS[lang] ?? WORDS.en;
  const notes = customer.notes?.trim();
  const itemName = (item) => item.name?.[lang] ?? item.name?.en ?? "";

  const items = lines.flatMap(({ item, quantity, subtotal }, index) => [
    `${index + 1}. ${itemName(item)}`,
    `${w.quantity}: ${quantity}`,
    `${w.unit}: ${plainPrice(item.price)}`,
    `${w.subtotal}: ${plainPrice(subtotal)}`,
    ``,
  ]);

  return [
    restaurant.messageTitle?.[lang] ?? restaurant.name,
    ``,
    w.intro,
    ``,
    `${w.reference}: ${reference}`,
    ``,
    w.customer,
    `${w.name}: ${customer.name.trim()}`,
    `${w.phone}: ${customer.phone.trim()}`,
    `${w.address}: ${customer.address.trim()}`,
    ...(notes ? [`${w.notes}: ${notes}`] : []),
    ``,
    w.order,
    ``,
    ...items,
    `----------------------`,
    ``,
    `${w.total}: ${plainPrice(total)}`,
    ``,
    w.closing,
    ``,
    w.thanks,
  ].join("\n");
}

/**
 * Open WhatsApp from inside a click/submit handler (needed so browsers do not
 * treat it as a blocked pop-up). It never navigates inside this site: if the new
 * tab is blocked it falls back to opening wa.me in the same tab. Returns true if
 * a new tab/window was opened.
 */
export function openWhatsApp(url) {
  const opened = window.open(url, "_blank");
  if (opened) {
    try {
      opened.opener = null;
    } catch {
      // ignore
    }
    return true;
  }
  window.location.assign(url);
  return false;
}
