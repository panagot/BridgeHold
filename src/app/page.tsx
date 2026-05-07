import { HomeHero } from "@/components/bridge/HomeHero";
import { HomeNavCards } from "@/components/bridge/HomeNavCards";
import { ProductHighlights } from "@/components/bridge/ProductHighlights";

export default function Home() {
  return (
    <>
      <HomeHero />
      <ProductHighlights />
      <HomeNavCards />
    </>
  );
}
