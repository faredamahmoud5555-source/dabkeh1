import restaurant from "@/config/restaurant";

/**
 * Tiny external store for the selected language, used with useSyncExternalStore.
 * The server (and the first client render) always use "en", so HTML matches and
 * hydration is safe. The real choice is applied right after hydration.
 *
 * Priority: saved choice -> browser language (Arabic browsers start in Arabic) -> English.
 * NOTE: the same logic is inlined in app/layout.js (LANG_SCRIPT) to set <html lang dir>
 * before the first paint. Keep both in sync.
 */

export const LANGS = ["en", "ar"];
const KEY = `${restaurant.storageNamespace}:lang`;
const listeners = new Set();

export function readStoredLang() {
  try {
    const saved = window.localStorage.getItem(KEY);
    if (saved === "ar" || saved === "en") return saved;
  } catch {
    // storage blocked: fall through to browser language
  }
  return (navigator.language || "").toLowerCase().startsWith("ar") ? "ar" : "en";
}

export function getLangSnapshot() {
  return readStoredLang();
}

export function getServerLangSnapshot() {
  return "en";
}

function notify() {
  listeners.forEach((listener) => listener());
}

export function subscribeLang(listener) {
  listeners.add(listener);
  const onStorage = (event) => {
    if (event.key === KEY || event.key === null) notify();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function setStoredLang(lang) {
  try {
    window.localStorage.setItem(KEY, lang);
  } catch {
    // ignore: the language still changes for this session via notify() below
  }
  notify();
}
