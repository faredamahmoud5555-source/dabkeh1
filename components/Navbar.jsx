"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingBag, X } from "lucide-react";
import restaurant from "@/config/restaurant";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";
import WhatsAppIcon from "./WhatsAppIcon";
import styles from "./Navbar.module.css";

const links = [
  { href: "/", key: "nav.home" },
  { href: "/menu", key: "nav.menu" },
  { href: "/location", key: "nav.location" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { hydrated, totalItems } = useCart();
  const { t, tn } = useLanguage();
  const toggleRef = useRef(null);

  // The mobile menu remembers the page it was opened on, so it closes by itself
  // when the route changes (links, back button) without needing an effect.
  const [openPath, setOpenPath] = useState(null);
  const menuOpen = openPath === pathname;

  useEffect(() => {
    if (!menuOpen) return;
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setOpenPath(null);
        toggleRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  // Only show the count after hydration so server and client HTML match.
  const count = hydrated ? totalItems : 0;
  const isActive = (href) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const cartLabel = count > 0 ? t("nav.cartAriaCount", { items: tn("plural.items", count) }) : t("nav.cartAria");

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.brand} data-latin aria-label={t("nav.homeAria", { name: restaurant.name })}>
          <span>{restaurant.name}</span>
          <span className={styles.divider} aria-hidden="true" />
          <span className={styles.arabic} lang="ar">
            {restaurant.nameArabic}
          </span>
        </Link>

        <nav aria-label={t("nav.main")} className={styles.nav}>
          <ul className={styles.links}>
            {links.map(({ href, key }) => (
              <li key={href}>
                <Link href={href} className={styles.link} aria-current={isActive(href) ? "page" : undefined}>
                  {t(key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <LanguageSwitcher className={styles.lang} />

          {/* A real link: it works even before JavaScript has loaded. */}
          <Link
            href="/cart"
            className={styles.cartButton}
            aria-label={cartLabel}
            aria-current={pathname === "/cart" ? "page" : undefined}
            onClick={() => setOpenPath(null)}
          >
            <ShoppingBag size={20} strokeWidth={1.5} aria-hidden="true" />
            <span className={styles.cartLabel}>{t("nav.cart")}</span>
            <span className={styles.count} data-empty={count === 0} aria-hidden="true">
              {count}
            </span>
          </Link>

          <button
            type="button"
            ref={toggleRef}
            className={styles.toggle}
            onClick={() => setOpenPath(menuOpen ? null : pathname)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? t("nav.closeMenu") : t("nav.openMenu")}
          >
            {menuOpen ? <X size={22} strokeWidth={1.5} aria-hidden="true" /> : <Menu size={22} strokeWidth={1.5} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile menu: always in the DOM so it can animate; visibility hides it from keyboards and screen readers. */}
      <div id="mobile-nav" className={styles.panel} data-open={menuOpen}>
        <nav aria-label={t("nav.mobile")}>
          <ul className={styles.panelLinks}>
            {links.map(({ href, key }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={styles.panelLink}
                  aria-current={isActive(href) ? "page" : undefined}
                  onClick={() => setOpenPath(null)}
                >
                  {t(key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <LanguageSwitcher className={styles.panelLang} />
        <Link href="/menu" className={`btn ${styles.panelCta}`} onClick={() => setOpenPath(null)}>
          <WhatsAppIcon size={18} />
          {t("nav.orderNow")}
        </Link>
      </div>
    </header>
  );
}
