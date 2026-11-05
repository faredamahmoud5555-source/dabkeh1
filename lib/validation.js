/**
 * Checkout validation. Pure functions, easy to unit test or extend.
 * Every validator returns an object of `{ field: { key, vars? } }` where `key`
 * is a translation key (see data/translations.js, "err.*"), so messages show in
 * the customer's language. An empty object means the data is valid.
 */

export const LIMITS = {
  nameMin: 2,
  nameMax: 80,
  addressMin: 10,
  addressMax: 300,
  notesMax: 300,
};

/** Keep only digits: "+20 (100) 000-0001" -> "201000000001" */
export function digitsOnly(value) {
  return String(value ?? "").replace(/\D/g, "");
}

export function validatePhone(value) {
  const text = String(value ?? "").trim();
  if (!text) return { key: "err.phone" };
  if (!/^\+?[0-9\s\-()]+$/.test(text)) return { key: "err.phoneChars" };
  const digits = digitsOnly(text);
  if (digits.length < 8 || digits.length > 15) return { key: "err.phoneLen" };
  return null;
}

/**
 * @param {{name: string, phone: string, address: string, notes?: string, whatsappId?: string}} values
 * @param {{ validWhatsAppIds?: string[] }} [options]
 */
export function validateCheckout(values, options = {}) {
  const errors = {};

  const name = String(values.name ?? "").trim();
  if (!name || name.length < LIMITS.nameMin) errors.name = { key: "err.name" };
  else if (name.length > LIMITS.nameMax) errors.name = { key: "err.nameLong", vars: { n: LIMITS.nameMax } };

  const phoneError = validatePhone(values.phone);
  if (phoneError) errors.phone = phoneError;

  const address = String(values.address ?? "").trim();
  if (!address) errors.address = { key: "err.address" };
  else if (address.length < LIMITS.addressMin) errors.address = { key: "err.addressShort" };
  else if (address.length > LIMITS.addressMax) errors.address = { key: "err.addressLong", vars: { n: LIMITS.addressMax } };

  if (String(values.notes ?? "").length > LIMITS.notesMax) {
    errors.notes = { key: "err.notesLong", vars: { n: LIMITS.notesMax } };
  }

  const validIds = options.validWhatsAppIds ?? [];
  if (!values.whatsappId || !validIds.includes(values.whatsappId)) {
    errors.whatsappId = { key: "err.wa" };
  }

  return errors;
}

/** Order of fields in the form, used to focus the first invalid one. */
export const FIELD_ORDER = ["name", "phone", "address", "notes", "whatsappId"];
