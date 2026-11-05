"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { categories, getCategoryLabel, menuItems } from "@/data/menu";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import CategoryFilter from "./CategoryFilter";
import MenuItem from "./MenuItem";
import styles from "./MenuBrowser.module.css";

// Counts per category never change at runtime, so compute them once.
const categoryCounts = menuItems.reduce((acc, item) => {
  acc[item.category] = (acc[item.category] ?? 0) + 1;
  return acc;
}, {});

/** Searchable text per dish: BOTH languages, so Arabic or English queries always work. */
const searchIndex = new Map(
  menuItems.map((item) => {
    const label = getCategoryLabel(item.category);
    const text = [item.name.en, item.name.ar, item.description.en, item.description.ar, label.en, label.ar]
      .join(" ")
      .toLowerCase();
    return [item.id, text];
  }),
);

function matchesQuery(item, query) {
  if (!query) return true;
  const haystack = searchIndex.get(item.id) ?? "";
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => haystack.includes(word));
}

export default function MenuBrowser() {
  const { quantities } = useCart();
  const { t, tn, pick } = useLanguage();
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");

  const visibleItems = useMemo(
    () =>
      menuItems.filter(
        (item) => (category === "all" || item.category === category) && matchesQuery(item, query.trim()),
      ),
    [category, query],
  );

  const hasFilters = category !== "all" || query.trim() !== "";

  function clearFilters() {
    setCategory("all");
    setQuery("");
  }

  // Group the visible dishes under their category, in the order of the category list.
  const groups = useMemo(
    () =>
      categories
        .map((cat) => ({ category: cat, items: visibleItems.filter((item) => item.category === cat.id) }))
        .filter((group) => group.items.length > 0),
    [visibleItems],
  );

  return (
    <div>
      <div className={`container ${styles.searchRow}`}>
        <div className={styles.search}>
          <label htmlFor="menu-search" className="sr-only">
            {t("menu.searchLabel")}
          </label>
          <Search size={18} strokeWidth={1.5} className={styles.searchIcon} aria-hidden="true" />
          <input
            id="menu-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("menu.searchPlaceholder")}
            autoComplete="off"
            className={styles.input}
          />
          {query && (
            <button type="button" className={styles.clearSearch} onClick={() => setQuery("")} aria-label={t("menu.clearSearch")}>
              <X size={16} strokeWidth={1.75} aria-hidden="true" />
            </button>
          )}
        </div>
        <p className={styles.status} role="status">
          {tn("plural.dishes", visibleItems.length)}
          {category !== "all" && t("menu.inCategory", { category: pick(getCategoryLabel(category)) })}
          {query.trim() && t("menu.matching", { query: query.trim() })}
        </p>
      </div>

      {/* Only the category chips stay pinned while scrolling (a compact bar). */}
      <div className={styles.chipsBar}>
        <div className="container">
          <CategoryFilter
            categories={categories}
            selected={category}
            counts={categoryCounts}
            totalCount={menuItems.length}
            onSelect={setCategory}
          />
        </div>
      </div>

      <div id="menu-results" className={`container ${styles.results}`}>
        {groups.length > 0 ? (
          <div key={category} className={styles.groups}>
            {groups.map(({ category: cat, items }) => (
              <section key={cat.id} className={styles.group} aria-labelledby={`cat-${cat.id}`}>
                <h2 id={`cat-${cat.id}`} className={styles.groupTitle}>
                  {pick(cat.label)}
                  <span className={styles.groupCount} aria-hidden="true">
                    {items.length}
                  </span>
                </h2>
                <ul className={styles.list}>
                  {items.map((item) => (
                    <MenuItem key={item.id} item={item} quantity={quantities[item.id] ?? 0} />
                  ))}
                </ul>
              </section>
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>{t("menu.emptyTitle")}</p>
            <p>{t("menu.emptyText")}</p>
            {hasFilters && (
              <button type="button" className="btn btn-outline" onClick={clearFilters}>
                {t("menu.showAll")}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
