/**
 * Central site configuration.
 * ---------------------------------------------------------------------------
 * Branding, contact details, currency and the two WhatsApp numbers live here.
 * Text that customers read is bilingual: { en: "...", ar: "..." }.
 * The map and address are in config/location.js.
 */

const restaurant = {
  /* ---------------------------- Branding ---------------------------------- */
  name: "DABKEH",
  nameArabic: "دبكة",
  /** First line of every WhatsApp order message. */
  messageTitle: { en: "DABKEH – Lebanese Restaurant", ar: "دبكة – مطعم لبناني" },
  subtitle: { en: "LEBANESE RESTAURANT · ALEXANDRIA", ar: "مطعم لبناني · الإسكندرية" },
  tagline: { en: "A TASTE OF LEBANON.", ar: "طعم لبنان." },
  heroText: {
    en: "Discover authentic Lebanese flavors at DABKEH.",
    ar: "اكتشفوا النكهات اللبنانية الأصيلة في دبكة.",
  },
  description: {
    en: "Authentic Lebanese mezze, fatteh, manakish and breakfast in Alexandria, made to be shared and delivered to your door.",
    ar: "مقبلات وفتّة ومناقيش وفطور لبناني أصيل في الإسكندرية، لنتشاركها ونوصّلها إلى بابكم.",
  },
  /** Short prefix for order references, e.g. DBK-250131-K7Q2 */
  orderReferencePrefix: "DBK",
  /** Used to namespace localStorage keys. Change it if you run several sites on one domain. */
  storageNamespace: "dabkeh",

  /* ---------------------------- Money ------------------------------------- */
  currency: {
    /** ISO 4217 code. */
    code: "EGP",
    /** What customers see next to a price (same in Arabic and English). */
    display: "EGP",
    /** "after" -> "150 EGP", "before" -> "EGP 150" */
    position: "after",
  },
  /** Locale used for number formatting. Western digits are used in both languages. */
  locale: "en-EG",

  /* ---------------------------- WhatsApp ---------------------------------- */
  /**
   * The two numbers customers can send their order to (supplied by the owner).
   * `number`  = full international number, digits only (no "+", spaces or leading 0).
   *             Egypt: drop the leading 0 and add 20, e.g. 01098911548 -> 201098911548.
   * `display` = how the number is shown to customers.
   */
  whatsappNumbers: [
    { id: "one", label: { en: "WhatsApp Number 1", ar: "رقم واتساب 1" }, number: "201098911548", display: "01098911548" },
    { id: "two", label: { en: "WhatsApp Number 2", ar: "رقم واتساب 2" }, number: "201515495886", display: "01515495886" },
  ],

  /* ---------------------------- Contact ----------------------------------- */
  contact: {
    /** Shown in the footer and on the location page (tap to call). */
    phones: ["01098911548", "01515495886"],
    /** "" = hidden. Add one when you have a real address. */
    email: "",
  },

  /** Add real profile links. An empty url hides the link. */
  social: [
    { label: "Instagram", url: "" },
    { label: "Facebook", url: "" },
  ],

  /* ---------------------------- Delivery (placeholders) ------------------- */
  delivery: {
    /** Not provided yet: leave empty to hide. */
    hours: { en: "", ar: "" },
    area: { en: "Delivery only, across Alexandria", ar: "توصيل فقط، في أنحاء الإسكندرية" },
    estimate: { en: "", ar: "" },
    /** Shown in the cart and at checkout. */
    feeNote: {
      en: "Delivery fee is not included in the total. We confirm it on WhatsApp.",
      ar: "رسوم التوصيل غير مشمولة في الإجمالي، وسنؤكدها لكم عبر واتساب.",
    },
  },

  /* ---------------------------- Menu -------------------------------------- */
  menu: {
    /**
     * Customers pay the PRINTED price x this number (rounded to 2 decimals).
     * 1.14 = printed price + 14%. Use 1 for the printed prices as they are.
     */
    priceMultiplier: 1.14,
    /**
     * The printed menu has no descriptions, so none are shown. Draft descriptions
     * exist in data/menuDescriptions.js (not from the restaurant, unchecked): set to
     * true only after you have corrected them.
     */
    showDescriptions: false,
    /** When descriptions are shown, also show a small "descriptions are general" note. */
    descriptionNotice: true,
  },
};

export default restaurant;
