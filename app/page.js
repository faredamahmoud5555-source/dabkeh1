import Hero from "@/components/home/Hero";
import Intro from "@/components/home/Intro";
import FeaturedMenu from "@/components/home/FeaturedMenu";
import FindUs from "@/components/home/FindUs";
import OrderCta from "@/components/home/OrderCta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Intro />
      <FeaturedMenu />
      <FindUs />
      <OrderCta />
    </>
  );
}
