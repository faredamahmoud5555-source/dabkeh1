import restaurant from "@/config/restaurant";

// No look-alike characters (0/O, 1/I) so references are easy to read aloud.
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function randomChars(length) {
  const bytes = new Uint8Array(length);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < length; i += 1) bytes[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
}

/**
 * Client-side order reference, e.g. "BL-250131-K7Q2".
 * It is only a convenience label shared in the WhatsApp message. It is NOT
 * stored on a server, so it does not prove an order exists. Call it in event
 * handlers only (not during render).
 */
export function generateOrderReference(now = new Date()) {
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const prefix = restaurant.orderReferencePrefix || "ORD";
  return `${prefix}-${yy}${mm}${dd}-${randomChars(4)}`;
}
