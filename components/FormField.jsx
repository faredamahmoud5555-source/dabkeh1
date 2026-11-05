"use client";

import { useLanguage } from "@/context/LanguageContext";
import styles from "./FormField.module.css";

/**
 * Label + control + hint + error message, wired together for accessibility.
 * `children` is a function so the control receives the right aria props:
 *
 *   <FormField id="name" label="Full name" error={errors.name}>
 *     {(aria) => <input {...aria} name="name" />}
 *   </FormField>
 *
 * `label`, `hint` and `error` must already be translated strings.
 */
export default function FormField({ id, label, hint, error, required = false, children }) {
  const { t } = useLanguage();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {required ? (
          <span className={styles.required} aria-hidden="true">
            {" "}
            *
          </span>
        ) : (
          <span className={styles.optional}> {t("checkout.optional")}</span>
        )}
      </label>
      {children({
        id,
        "aria-invalid": error ? "true" : undefined,
        "aria-describedby": describedBy,
        "aria-required": required || undefined,
        className: styles.control,
      })}
      {hint && !error && (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className={styles.error}>
          {t("checkout.errorPrefix")}
          {error}
        </p>
      )}
    </div>
  );
}
