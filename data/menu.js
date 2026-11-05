/**
 * Menu data: exactly the printed DABKEH menu (English + Arabic names).
 * ---------------------------------------------------------------------------
 * Everything in `printedItems` was transcribed from photos of the printed menu:
 * 52 dishes in 5 sections (Appetizers, Fatteh, Manakish, Breakfast, Beverages).
 * Nothing else is on the menu: no sample dishes, no extra categories.
 *
 * Fields
 *   id        unique and stable (the cart stores ids)
 *   category  one of the category ids below
 *   name      { en, ar }  as printed on the menu
 *   price     the price PRINTED on the menu, as a number (never "120 EGP")
 *   featured  true -> shown on the homepage
 *
 * PRICES: the price customers see is `price x menu.priceMultiplier`
 * (config/restaurant.js; currently 1.14 = printed price + 14%), rounded to 2 decimals.
 * The printed price stays available as `printedPrice`.
 *
 * DESCRIPTIONS: the printed menu has none, so none are shown. Optional drafts live in
 * data/menuDescriptions.js and only appear if `menu.showDescriptions` is true.
 */

import restaurant from "@/config/restaurant";
import { descriptions } from "@/data/menuDescriptions";

export const categories = [
  { id: "mezze", label: { en: "Lebanese Mezze", ar: "المقبلات اللبنانية" } },
  { id: "fatteh", label: { en: "Fatteh", ar: "الفتات" } },
  { id: "manakish", label: { en: "Manakish", ar: "المناقيش" } },
  { id: "breakfast", label: { en: "Breakfast", ar: "الترويقة" } },
  { id: "drinks", label: { en: "Drinks", ar: "المشروبات" } },
];

const printedItems = [
  /* ---- Lebanese Mezze ---- */
  { id: "fattoush", category: "mezze", name: { en: "Fattoush", ar: "فتوش" }, price: 120, featured: true },
  { id: "tabbouleh", category: "mezze", name: { en: "Tabbouleh", ar: "تبولة" }, price: 130 },
  { id: "lebanese-hummus", category: "mezze", name: { en: "Lebanese Hummus", ar: "حمص لبناني" }, price: 120, featured: true },
  { id: "hummus-with-meat", category: "mezze", name: { en: "Hummus with Meat", ar: "حمص باللحمة" }, price: 180 },
  { id: "mountain-hummus", category: "mezze", name: { en: "Mountain Hummus", ar: "حمص الجبل" }, price: 160 },
  { id: "al-raheb-mutabbal", category: "mezze", name: { en: "Al-Raheb Mutabbal", ar: "متبل الراهب" }, price: 170, featured: true },
  { id: "spicy-potatoes", category: "mezze", name: { en: "Spicy Potatoes", ar: "بطاطا حارة" }, price: 150 },
  { id: "sausages-pomegranate", category: "mezze", name: { en: "Sausages with Pomegranate Molasses", ar: "نقانق دبس الرمان" }, price: 200 },
  { id: "kibbeh", category: "mezze", name: { en: "Kibbeh", ar: "كبة" }, price: 200, featured: true },
  { id: "stuffed-vine-leaves", category: "mezze", name: { en: "Stuffed Vine Leaves", ar: "ورق عنب" }, price: 160 },
  { id: "eggplant-mutabbal", category: "mezze", name: { en: "Eggplant Mutabbal", ar: "متبل باذنجان" }, price: 150 },
  /* ---- Fatteh ---- */
  { id: "hummus-fatteh", category: "fatteh", name: { en: "Hummus Fatteh", ar: "فتة حمص" }, price: 170 },
  { id: "eggplant-fatteh", category: "fatteh", name: { en: "Eggplant Fatteh", ar: "فتة باذنجان" }, price: 190 },
  { id: "chicken-rice-fatteh", category: "fatteh", name: { en: "Chicken & Rice Fatteh", ar: "فتة دجاج بالرز" }, price: 230, featured: true },
  { id: "kibbeh-fatteh", category: "fatteh", name: { en: "Kibbeh Fatteh", ar: "فتة كبة" }, price: 280 },
  { id: "meat-fatteh", category: "fatteh", name: { en: "Meat Fatteh", ar: "فتة لحمة" }, price: 260 },
  { id: "vine-leaves-fatteh", category: "fatteh", name: { en: "Vine Leaves Fatteh", ar: "فتة ورق عنب" }, price: 250 },
  /* ---- Manakish ---- */
  { id: "dabke-zaatar", category: "manakish", name: { en: "Dabke Zaatar", ar: "زعتر دبكة" }, price: 200, featured: true },
  { id: "zaatar", category: "manakish", name: { en: "Zaatar", ar: "زعتر" }, price: 150 },
  { id: "zaatar-pomegranate", category: "manakish", name: { en: "Zaatar & Pomegranate", ar: "زعتر رمان" }, price: 180 },
  { id: "mountain-zaatar", category: "manakish", name: { en: "Mountain Zaatar", ar: "زعتر الجبل" }, price: 180 },
  { id: "zaatar-cheese", category: "manakish", name: { en: "Zaatar & Cheese", ar: "زعتر وجبنة" }, price: 200 },
  { id: "zaatar-labneh", category: "manakish", name: { en: "Zaatar & Labneh", ar: "زعتر لبنة" }, price: 180 },
  { id: "akkawi-cheese", category: "manakish", name: { en: "Akkawi Cheese", ar: "جبنة عكاوي" }, price: 250 },
  { id: "labneh-manakish", category: "manakish", name: { en: "Labneh", ar: "لبنة" }, price: 140 },
  { id: "tomato-onion-cheese", category: "manakish", name: { en: "Tomato & Onion with Cheese", ar: "بندورة وبصل بالجبنة" }, price: 200 },
  { id: "akkawi-kashkaval", category: "manakish", name: { en: "Akkawi & Kashkaval Cheese", ar: "قشقوان عكاوي" }, price: 260 },
  { id: "mortadella-cheese", category: "manakish", name: { en: "Mortadella & Cheese", ar: "مرتديلا جبنة" }, price: 250 },
  { id: "qawarma-manakish", category: "manakish", name: { en: "Qawarma", ar: "قاورما" }, price: 300 },
  { id: "spinach", category: "manakish", name: { en: "Spinach", ar: "سبانخ" }, price: 120 },
  { id: "spinach-cheese", category: "manakish", name: { en: "Spinach & Cheese", ar: "سبانخ جبنة" }, price: 160 },
  { id: "lahm-bi-ajeen", category: "manakish", name: { en: "Lahm Bi Ajeen", ar: "لحم بعجين" }, price: 250 },
  { id: "meat-cheese", category: "manakish", name: { en: "Meat & Cheese", ar: "لحمة وجبنة" }, price: 300 },
  { id: "kafta", category: "manakish", name: { en: "Kafta", ar: "كفتة" }, price: 300 },
  { id: "kafta-cheese", category: "manakish", name: { en: "Kafta & Cheese", ar: "كفتة جبنة" }, price: 350 },
  { id: "roast-beef", category: "manakish", name: { en: "Roast Beef", ar: "روستو" }, price: 350 },
  { id: "shish-tawook", category: "manakish", name: { en: "Shish Tawook", ar: "طاووق" }, price: 300 },
  { id: "eggs-cheese", category: "manakish", name: { en: "Eggs & Cheese", ar: "بيض بالجبنة" }, price: 170 },
  { id: "muhammara", category: "manakish", name: { en: "Muhammara", ar: "محمرة" }, price: 180 },
  { id: "halloumi-manakish", category: "manakish", name: { en: "Halloumi", ar: "حلوم" }, price: 200 },
  { id: "dazine-meat-sfiha", category: "manakish", name: { en: "Dazine Meat Sfiha", ar: "دزينة سفيحة لحمة" }, price: 250 },
  { id: "dazine-spinach", category: "manakish", name: { en: "Dazine Spinach", ar: "دزينة سبانخ" }, price: 200 },
  /* ---- Breakfast ---- */
  { id: "grilled-halloumi", category: "breakfast", name: { en: "Grilled Halloumi", ar: "حلوم مشوي" }, price: 150 },
  { id: "lebanese-foul", category: "breakfast", name: { en: "Lebanese Foul", ar: "فول لبناني" }, price: 100 },
  { id: "mishawsha", category: "breakfast", name: { en: "Mishawsha", ar: "مشوشة" }, price: 200 },
  { id: "cheese-omelette", category: "breakfast", name: { en: "Cheese Omelette", ar: "أومليت بالجبنة" }, price: 130 },
  { id: "qawarma-eggs", category: "breakfast", name: { en: "Qawarma & Eggs", ar: "قاورما وبيض" }, price: 200 },
  { id: "labneh-plate", category: "breakfast", name: { en: "Labneh Plate", ar: "صحن لبنة" }, price: 80 },
  { id: "zaatar-olive-oil-plate", category: "breakfast", name: { en: "Zaatar & Olive Oil Plate", ar: "صحن زعتر وزيت زيتون" }, price: 100 },
  /* ---- Drinks ---- */
  { id: "ayran", category: "drinks", name: { en: "Ayran", ar: "لبن عيران" }, price: 80 },
  { id: "soft-drinks", category: "drinks", name: { en: "Soft Drinks", ar: "مشروبات غازية" }, price: 50 },
  { id: "water", category: "drinks", name: { en: "Water", ar: "مياه" }, price: 20 },
];

/* ------------------------- Price rule + descriptions ------------------------ */

const rawMultiplier = restaurant.menu?.priceMultiplier;
const multiplier = Number.isFinite(rawMultiplier) && rawMultiplier > 0 ? rawMultiplier : 1;
const showDescriptions = Boolean(restaurant.menu?.showDescriptions);
const NO_DESCRIPTION = { en: "", ar: "" };

/** Printed price -> price charged, rounded to 2 decimals (120 x 1.14 = 136.8). */
function priceFor(printedPrice) {
  return Math.round(printedPrice * multiplier * 100) / 100;
}

export const menuItems = printedItems.map((item) => ({
  ...item,
  printedPrice: item.price,
  price: priceFor(item.price),
  description: showDescriptions ? (descriptions[item.id] ?? NO_DESCRIPTION) : NO_DESCRIPTION,
}));

/* ------------------------------ Helpers ------------------------------------ */

/** Fast id lookup used by the cart. */
export const menuById = new Map(menuItems.map((item) => [item.id, item]));

const categoryById = new Map(categories.map((category) => [category.id, category]));

/** Bilingual label object { en, ar } for a category id. */
export function getCategoryLabel(categoryId) {
  return categoryById.get(categoryId)?.label ?? { en: "Other", ar: "أخرى" };
}

export const featuredItems = menuItems.filter((item) => item.featured);
