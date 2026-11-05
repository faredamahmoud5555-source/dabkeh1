import location from "@/config/location";

/**
 * Google Maps URLs built from config/location.js: exact coordinates when
 * configured, otherwise a search for `mapQuery`. Nothing is invented.
 */

export function hasCoordinates() {
  const { lat, lng } = location.coordinates ?? {};
  return Number.isFinite(lat) && Number.isFinite(lng);
}

/** True when there is something real to show: coordinates or a written address to search for. */
export function isMapConfigured() {
  return hasCoordinates() || Boolean(location.mapQuery?.trim());
}

/** What Google Maps should look for: "lat,lng" when known, else the address text. */
export function mapTarget() {
  return hasCoordinates() ? `${location.coordinates.lat},${location.coordinates.lng}` : location.mapQuery;
}

/** Embeddable (iframe) interactive map with a marker. */
export function getEmbedUrl(lang = "en") {
  const hl = lang === "ar" ? "ar" : "en";
  return `https://maps.google.com/maps?q=${encodeURIComponent(mapTarget())}&hl=${hl}&z=17&output=embed`;
}

/** Opens Google Maps with the place. A saved share link wins over a search. */
export function getOpenMapsUrl() {
  return location.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapTarget())}`;
}

/** Google Maps turn-by-turn directions to the restaurant. */
export function getDirectionsUrl() {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapTarget())}`;
}
