import { Button } from "@/components/ui/button";
import sorcererArchitect from "@/assets/sorcerer-architect.jpg";
import { Monitor, Smartphone, Tablet } from "lucide-react";

const StrategicCodingSection = () => {
  const platforms = [
    { name: "macOS", icon: Monitor },
    { name: "Windows", icon: Monitor },
    { name: "Linux", icon: Monitor },
    { name: "iPhone", icon: Smartphone },
    { name: "Android", icon: Smartphone },
    { name: "iPad Pro", icon: Tablet }
  ];

  return (
    <section id="quest" className="min-h-screen bg-gradient-to-b from-background to-card py-20">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in-up">
            <div className="space-y-4">
              {/* Small subtitle */}
              <p className="text-accent font-fantasy text-lg mystical-glow">
                Powered by Stellar & Soroban
              </p>
              
              {/* Main heading */}
              <h2 className="text-5xl md:text-6xl font-fantasy font-bold text-primary mystical-glow">
                FORGE YOUR
                <br />
                <span className="text-rune-glow">LEGACY IN CODE</span>
              </h2>
              
              {/* Description */}
              <p className="text-lg text-muted-foreground font-body leading-relaxed">
                Proudly powered by Soroban, enter the immersive world of T.U.S.S.T., 
                a multi-platform gaming experience designed to teach the arcane arts of 
                Rust and smart contract development. Master the elements of code, drawing 
                thematic influence from high-fantasy worlds, to create powerful 
                decentralized applications like no other.
              </p>
            </div>

            {/* Platform Icons */}
            <div className="space-y-4">
              <p className="text-sm font-fantasy text-accent font-semibold">
                Available Across All Realms
              </p>
              <div className="flex flex-wrap gap-6">
                {platforms.map((platform, index) => (
                  <div 
                    key={platform.name}
                    className="flex flex-col items-center space-y-2 group cursor-pointer animate-fade-in-up"
                    style={{ animationDelay: `${0.1 * index}s` }}
                  >
                    <div className="w-12 h-12 bg-card border border-border rounded-lg flex items-center justify-center group-hover:border-primary group-hover:bg-primary/10 transition-all duration-300">
                      <platform.icon className="w-6 h-6 text-muted-foreground group-hover:text-primary" />
                    </div>
                    <span className="text-xs text-muted-foreground font-body">
                      {platform.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="relative rounded-2xl overflow-hidden border-2 border-rune-glow/30 shadow-2xl shadow-rune-glow/20">
              <img 
                src={sorcererArchitect} 
                alt="The Architect - A powerful sorcerer manipulating code constructs"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
              
              {/* Floating Code Elements */}
              <div className="absolute top-6 right-6 bg-card/80 backdrop-blur-sm border border-rune-glow/30 rounded-lg p-3">
                <code className="text-xs text-rune-glow font-mono">
                  fn invoke() → Result
                </code>
              </div>
              
              <div className="absolute bottom-6 left-6 bg-card/80 backdrop-blur-sm border border-magic-blue/30 rounded-lg p-3">
                <code className="text-xs text-magic-blue font-mono">
                  contract.deploy()
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StrategicCodingSection;