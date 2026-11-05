/**
 * Restaurant location (central config for the /location page, footer and map).
 * ---------------------------------------------------------------------------
 * The address and landmarks come from the owner's text message.
 * `coordinates` are the exact pin from the owner's Google Maps share link
 * (https://maps.app.goo.gl/Sm3i6Lw9ubRCgb8f8 resolves to 31.1967927, 29.9024443).
 * When coordinates are set they drive the embedded map, the marker and the
 * directions link. `mapQuery` is only a fallback if the coordinates are removed.
 */

const location = {
  name: { en: "DABKEH", ar: "دبكة" },

  address: {
    en: "2 El Bakht Street, off Fouad Street, Alexandria, Egypt",
    ar: "٢ شارع البخت، متفرع من شارع فؤاد، الإسكندرية، مصر",
  },

  landmarks: {
    en: "Near Dawawin Café, three streets before Sayed Darwish Theatre.",
    ar: "قرب كافيه دواوين، وقبل مسرح السيد درويش بثلاثة شوارع.",
  },

  /** Exact pin supplied by the owner (from the Google Maps share link below). */
  coordinates: { lat: 31.1967927, lng: 29.9024443 },

  /** Fallback only: text Google Maps searches for when there are no coordinates. */
  mapQuery: "2 شارع البخت، شارع فؤاد، الإسكندرية، مصر",

  /** The owner's Google Maps share link (used by the "Open in Google Maps" button). */
  googleMapsUrl: "https://maps.app.goo.gl/Sm3i6Lw9ubRCgb8f8",
};

export default location;
