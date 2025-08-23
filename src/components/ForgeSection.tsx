import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import mysticalForge from "@/assets/mystical-forge.jpg";

const ForgeSection = () => {
  return (
    <section id="tutorials" className="min-h-screen bg-gradient-to-b from-secondary to-background py-20">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Image */}
          <div className="relative animate-fade-in-up">
            <div className="relative rounded-2xl overflow-hidden border-2 border-forge-orange/30 shadow-2xl shadow-forge-orange/20">
              <img 
                src={mysticalForge} 
                alt="The Mystical Forge - A developer blacksmith forging smart contracts"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-transparent" />
              
              {/* Floating Binary Elements */}
              <div className="absolute top-8 left-8 text-forge-orange font-mono text-sm opacity-80 animate-float-gentle">
                01001000
              </div>
              <div className="absolute top-20 right-12 text-rune-glow font-mono text-sm opacity-80 animate-float-gentle" style={{ animationDelay: '1s' }}>
                11010100
              </div>
              <div className="absolute bottom-16 left-16 text-magic-blue font-mono text-sm opacity-80 animate-float-gentle" style={{ animationDelay: '2s' }}>
                10110011
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="space-y-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="space-y-4">
              {/* Small subtitle */}
              <p className="text-forge-orange font-fantasy text-lg mystical-glow">
                Master the Code, Own the Creation
              </p>
              
              {/* Main heading */}
              <h2 className="text-5xl md:text-6xl font-fantasy font-bold text-primary mystical-glow">
                SUMMON
                <br />
                <span className="text-forge-orange">CODING CONSTRUCTS</span>
              </h2>
              
              {/* Description */}
              <p className="text-lg text-muted-foreground font-body leading-relaxed">
                With a full curriculum of challenges based on Rust and Soroban, your quest 
                is to master them all. Each 'spell' you learn is a real-world skill, and 
                each 'construct' you build is a smart contract secured on the Stellar network. 
                When a quest is complete, you've truly mastered a new development concept.
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-forge-orange/20 border border-forge-orange rounded flex items-center justify-center">
                  <div className="w-2 h-2 bg-forge-orange rounded-full animate-pulse" />
                </div>
                <span className="text-foreground font-body">
                  Interactive Rust tutorials with real-time feedback
                </span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-rune-glow/20 border border-rune-glow rounded flex items-center justify-center">
                  <div className="w-2 h-2 bg-rune-glow rounded-full animate-pulse" />
                </div>
                <span className="text-foreground font-body">
                  Deploy contracts to live Stellar testnet
                </span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-magic-blue/20 border border-magic-blue rounded flex items-center justify-center">
                  <div className="w-2 h-2 bg-magic-blue rounded-full animate-pulse" />
                </div>
                <span className="text-foreground font-body">
                  Progressive skill tree with unlockable abilities
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <Link to="/waitlist">
                <Button variant="forge" size="hero" className="float-gentle">
                  BEGIN YOUR JOURNEY
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgeSection;