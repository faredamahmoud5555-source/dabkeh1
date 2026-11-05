"use client";

import { useLanguage } from "@/context/LanguageContext";
import styles from "./CategoryFilter.module.css";

/**
 * Category buttons. `counts` is an object like { mezze: 8 }. Categories with no
 * dishes are hidden. Controlled: the parent owns the selected category.
 */
export default function CategoryFilter({ categories, selected, counts, totalCount, onSelect }) {
  const { t, pick } = useLanguage();
  const options = [
    { id: "all", label: t("menu.all"), count: totalCount },
    ...categories
      .map((c) => ({ id: c.id, label: pick(c.label), count: counts[c.id] ?? 0 }))
      .filter((c) => c.count > 0),
  ];

  return (
    <div className={styles.scroller}>
      <div role="group" aria-label={t("menu.filterBy")} className={styles.group}>
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            className={styles.chip}
            aria-pressed={selected === option.id}
            onClick={() => onSelect(option.id)}
          >
            {option.label}
            <span className={styles.count}>{option.count}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
