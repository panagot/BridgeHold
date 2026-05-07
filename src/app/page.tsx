import { HomeGrowthLoop } from "@/components/bridge/HomeGrowthLoop";
import { HomeHero } from "@/components/bridge/HomeHero";
import { HomeNavCards } from "@/components/bridge/HomeNavCards";
import { HomeStrategicPillars } from "@/components/bridge/HomeStrategicPillars";
import { TorqueBuilderCallout } from "@/components/bridge/TorqueBuilderCallout";
import { TorqueCredibilityStrip } from "@/components/bridge/TorqueCredibilityStrip";
import { TorqueIntegrationShowcase } from "@/components/bridge/TorqueIntegrationShowcase";

export default function Home() {
  return (
    <>
      <HomeHero />
      <HomeStrategicPillars />
      <TorqueIntegrationShowcase />
      <TorqueCredibilityStrip />
      <HomeGrowthLoop />
      <TorqueBuilderCallout />
      <HomeNavCards />
    </>
  );
}
