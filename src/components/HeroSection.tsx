import { Button } from "@/components/ui/button";
import heroPortalBg from "@/assets/hero-portal-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroPortalBg})` }}
      >
        <div className="absolute inset-0 bg-background/40" />
      </div>

      {/* Animated Portal Effect */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-96 h-96 rounded-full bg-gradient-portal opacity-20 animate-pulse portal-spin" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        {/* Main Logo */}
        <div className="animate-fade-in-up">
          <h1 className="text-8xl md:text-9xl font-fantasy font-bold mystical-glow text-primary mb-4 rune-pulse">
            T.U.S.S.T.
          </h1>
        </div>

        {/* Subtitle */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <p className="text-2xl md:text-3xl font-fantasy font-medium text-accent mb-8 magic-glow">
            The Ultimate Stellar Supreme Tutorial
          </p>
        </div>

        {/* CTA Button */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <Button variant="rune" size="hero" className="float-gentle">
            ANSWER THE CALL
          </Button>
        </div>

        {/* Floating Runes */}
        <div className="absolute top-20 left-20 text-rune-glow text-4xl animate-float-gentle opacity-60">
          ◊
        </div>
        <div className="absolute top-40 right-32 text-magic-blue text-3xl animate-float-gentle opacity-60" style={{ animationDelay: '1s' }}>
          ✦
        </div>
        <div className="absolute bottom-32 left-16 text-forge-orange text-5xl animate-float-gentle opacity-60" style={{ animationDelay: '2s' }}>
          ⬟
        </div>
        <div className="absolute bottom-20 right-20 text-portal-purple text-4xl animate-float-gentle opacity-60" style={{ animationDelay: '1.5s' }}>
          ◈
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;