import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import StrategicCodingSection from "@/components/StrategicCodingSection";
import GrimoireSection from "@/components/GrimoireSection";
import CardsSection from "@/components/CardsSection";
import ForgeSection from "@/components/ForgeSection";
import SocialProofSection from "@/components/SocialProofSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <HeroSection />
        <StrategicCodingSection />
        <GrimoireSection />
        <CardsSection />
        <SocialProofSection />
        <ForgeSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
