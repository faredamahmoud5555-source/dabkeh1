import { Suspense } from "react";
import OrderFlow from "@/components/OrderFlow";
import styles from "./cart.module.css";

export const metadata = {
  title: "Cart | السلة",
  description: "Review your order and send it to DABKEH on WhatsApp.",
};

/** Reads ?step=checkout (set by the drawer's PROCEED TO ORDER link). */
async function Flow({ searchParams }) {
  const { step } = await searchParams;
  return <OrderFlow variant="page" initialStep={step === "checkout" ? "checkout" : "cart"} />;
}

export default function CartPage({ searchParams }) {
  return (
    <section className={`container ${styles.page}`}>
      <Suspense fallback={<div className={styles.placeholder} aria-hidden="true" />}>
        <Flow searchParams={searchParams} />
      </Suspense>
    </section>
  );
}
