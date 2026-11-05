/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
  partialPrefetching: true,

  /**
   * DEV ONLY. Next.js 16 blocks the dev server's JavaScript when the page is
   * opened from any host other than "localhost" (a phone on your Wi-Fi, a LAN IP,
   * a tunnel). The page still renders, but React never hydrates, so every button
   * (Add to Cart, Cart...) does nothing. List the hosts you test from here.
   * Not used by `next build` / `next start`.
   */
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "172.*.*.*", "*.local"],
};

export default nextConfig;
