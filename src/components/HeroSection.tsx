import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroPortalBg from "@/assets/mystical-hall-bg.png";
import tusstLogo from "@/assets/tusst-logo.png";
import FireSparks from "@/components/FireSparks";
const HeroSection = () => {
  return <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
      backgroundImage: `url(${heroPortalBg})`
    }}>
        <div className="absolute inset-0 bg-background/40" />
      </div>

      {/* Fire Sparks Effect */}
      <FireSparks />

      {/* Hero Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        {/* Main Logo */}
        <div className="animate-fade-in-up">
          <img src={tusstLogo} alt="T.U.S.S.T. - The Ultimate Stellar Supreme Tutorial" className="w-full max-w-[28.8rem] mx-auto h-auto object-contain mb-8 rune-pulse" />
        </div>

        {/* Tagline */}
        <div className="animate-fade-in-up mb-4" style={{
        animationDelay: '0.3s'
      }}>
          <p className="text-foreground/90 text-lg md:text-xl font-fantasy max-w-2xl mx-auto leading-relaxed">
            TUSST turns technical learning into an epic journey of creation. Let your code tell the story.
          </p>
        </div>

        {/* CTA Button */}
        <div className="animate-fade-in-up" style={{
        animationDelay: '0.6s'
      }}>
          <Link to="/waitlist">
            <Button variant="rune" size="hero" className="float-gentle">
              ANSWER THE CALL
            </Button>
          </Link>
        </div>

        {/* Floating Runes */}
        
        <div className="absolute top-40 right-32 text-magic-blue text-3xl animate-float-gentle opacity-60" style={{
        animationDelay: '1s'
      }}>
          ✦
        </div>
        
        
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-bounce" />
        </div>
      </div>
    </section>;
};
export default HeroSection;