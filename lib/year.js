import { cacheLife } from "next/cache";

/** Cache Components forbids reading the clock during prerender, so it is cached. */
export async function getCurrentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}
