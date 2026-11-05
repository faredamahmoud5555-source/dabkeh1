import restaurant from "@/config/restaurant";
import MenuHeader from "@/components/MenuHeader";
import MenuBrowser from "@/components/MenuBrowser";

export const metadata = {
  title: "Menu | القائمة",
  description: `${restaurant.name}: Lebanese mezze, fatteh, manakish, breakfast and drinks in Alexandria, delivered to your door.`,
};

export default function MenuPage() {
  return (
    <>
      <MenuHeader />
      <MenuBrowser />
    </>
  );
}
