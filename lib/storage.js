import restaurant from "@/config/restaurant";

/**
 * Tiny safe wrappers around localStorage.
 * localStorage can throw (private mode, blocked storage, quota) or contain
 * corrupted JSON, so every call is guarded. Only call these in the browser
 * (inside effects or event handlers).
 */

export function storageKey(name) {
  return `${restaurant.storageNamespace}:${name}`;
}

export function readJSON(name, fallback = null) {
  try {
    const raw = window.localStorage.getItem(storageKey(name));
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJSON(name, value) {
  try {
    window.localStorage.setItem(storageKey(name), JSON.stringify(value));
  } catch {
    // Storage unavailable: the app keeps working, it just will not persist.
  }
}

export function removeKey(name) {
  try {
    window.localStorage.removeItem(storageKey(name));
  } catch {
    // ignore
  }
}
