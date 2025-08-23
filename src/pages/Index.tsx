import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import StrategicCodingSection from "@/components/StrategicCodingSection";
import GrimoireSection from "@/components/GrimoireSection";
import ForgeSection from "@/components/ForgeSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <HeroSection />
        <StrategicCodingSection />
        <GrimoireSection />
        <ForgeSection />
      </main>
    </div>
  );
};

export default Index;
