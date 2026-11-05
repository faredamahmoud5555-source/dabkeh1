import localFont from "next/font/local";
import restaurant from "@/config/restaurant";
import { LanguageProvider } from "@/context/LanguageContext";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import FloatingActions from "@/components/FloatingActions";
import SkipLink from "@/components/SkipLink";
import { getCurrentYear } from "@/lib/year";
import "./globals.css";

/**
 * Fonts are self-hosted from app/fonts (no network needed at build time).
 * Instrument Serif + Hanken Grotesk: English. Amiri + Noto Sans Arabic: Arabic.
 */
const display = localFont({
  src: [
    { path: "./fonts/instrument-serif-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/instrument-serif-latin-400-italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-instrument",
  display: "swap",
});

const body = localFont({
  src: "./fonts/hanken-grotesk-latin-wght-normal.woff2",
  weight: "100 900",
  variable: "--font-hanken",
  display: "swap",
});

const arabicDisplay = localFont({
  src: "./fonts/amiri-arabic-400-normal.woff2",
  weight: "400",
  variable: "--font-amiri",
  display: "swap",
});

const arabicBody = localFont({
  src: "./fonts/noto-sans-arabic-arabic-wght-normal.woff2",
  weight: "100 900",
  variable: "--font-noto-arabic",
  display: "swap",
});

export const metadata = {
  title: {
    default: `${restaurant.name} | ${restaurant.nameArabic} | Lebanese restaurant in Alexandria`,
    template: `%s | ${restaurant.name}`,
  },
  description: restaurant.description.en,
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#111111",
};

/**
 * Runs before the first paint: applies the saved (or browser) language to
 * <html lang dir> so Arabic users get a right-to-left layout immediately.
 * Keep in sync with lib/langStore.js.
 */
const LANG_SCRIPT = `try{var l=localStorage.getItem(${JSON.stringify(`${restaurant.storageNamespace}:lang`)});if(l!=="ar"&&l!=="en"){l=(navigator.language||"").toLowerCase().indexOf("ar")===0?"ar":"en"}var d=document.documentElement;d.lang=l;d.dir=l==="ar"?"rtl":"ltr"}catch(e){}`;

export default async function RootLayout({ children }) {
  const year = await getCurrentYear();
  return (
    <html
      lang="en"
      dir="ltr"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${display.variable} ${body.variable} ${arabicDisplay.variable} ${arabicBody.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: LANG_SCRIPT }} />
      </head>
      <body>
        <LanguageProvider>
          <CartProvider>
            <SkipLink />
            <Navbar />
            <main id="main">{children}</main>
            <Footer year={year} />
            <FloatingActions />
            <CartDrawer />
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
