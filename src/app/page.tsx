import { HomeHero } from "@/components/bridge/HomeHero";
import { HomeNavCards } from "@/components/bridge/HomeNavCards";
import { JudgeStrip } from "@/components/bridge/JudgeStrip";

export default function Home() {
  return (
    <>
      <HomeHero />
      <JudgeStrip />
      <HomeNavCards />
    </>
  );
}
