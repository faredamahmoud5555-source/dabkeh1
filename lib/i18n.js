/** Small i18n helpers (no library needed for two languages). */

/** Replace {name} placeholders: interpolate("Hi {x}", { x: "A" }) -> "Hi A" */
export function interpolate(text, vars = {}) {
  return String(text).replace(/\{(\w+)\}/g, (match, key) => (key in vars ? String(vars[key]) : match));
}

/** Arabic plural category for n (zero is treated as "other"). */
function arabicCategory(n) {
  if (n === 1) return "one";
  if (n === 2) return "two";
  const mod100 = n % 100;
  if (mod100 >= 3 && mod100 <= 10) return "few";
  if (mod100 >= 11 && mod100 <= 99) return "many";
  return "other";
}

/** Pick the right plural form from { one, two?, few?, many?, other }. */
export function pluralForm(lang, forms, n) {
  const category = lang === "ar" ? arabicCategory(n) : n === 1 ? "one" : "other";
  return forms[category] ?? forms.other;
}
