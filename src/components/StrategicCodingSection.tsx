import sorcererArchitect from "@/assets/sorcerer-spell.png";

const StrategicCodingSection = () => {
  return (
    <section className="min-h-screen bg-gradient-to-b from-background to-card py-20">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in-up">
            {/* Main heading */}
            <h2 className="text-5xl md:text-6xl font-fantasy font-bold text-rune-glow mystical-glow tracking-wider">
              THE IDEA FORGE
            </h2>
            
            {/* Description with highlighted names */}
            <div className="text-lg text-foreground/90 font-serif leading-relaxed space-y-4">
              <p>
                TUSST was born where code meets imagination. Created by{" "}
                <span className="text-rune-glow font-semibold">Pedro Pelicioni</span>{" "}
                (Web3 dev) and{" "}
                <span className="text-rune-glow font-semibold">André Novaes</span>{" "}
                (educational producer & narrator), the project won Stellar's KickStart with a simple mission: 
                make technical learning light, visual, and human.
              </p>
            </div>

            {/* Quote */}
            <blockquote className="border-l-4 border-rune-glow pl-6 py-2">
              <p className="text-xl italic text-rune-glow/90 font-serif">
                "The first line of code is also an act of creation."
              </p>
            </blockquote>
          </div>

          {/* Right Side - Image and Creator Cards */}
          <div className="space-y-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            {/* Mystical Circle Image */}
            <div className="relative rounded-2xl overflow-hidden border-2 border-rune-glow/30 shadow-2xl shadow-rune-glow/20">
              <img 
                src={sorcererArchitect} 
                alt="The Architect - A powerful sorcerer manipulating code constructs"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
            </div>

            {/* Creator Cards */}
            <div className="grid grid-cols-2 gap-4">
              {/* Pedro Card */}
              <div className="bg-card/50 backdrop-blur-sm border border-rune-glow/20 rounded-xl p-6 hover:border-rune-glow/40 transition-all duration-300">
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-20 h-20 rounded-full bg-muted/30 border-2 border-rune-glow/30 flex items-center justify-center">
                    <span className="text-3xl font-fantasy text-rune-glow">P</span>
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-fantasy text-rune-glow font-semibold">
                      Pedro Pelicioni
                    </h3>
                    <p className="text-sm text-muted-foreground font-serif">
                      Web3 Developer
                    </p>
                  </div>
                </div>
              </div>

              {/* André Card */}
              <div className="bg-card/50 backdrop-blur-sm border border-rune-glow/20 rounded-xl p-6 hover:border-rune-glow/40 transition-all duration-300">
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-20 h-20 rounded-full bg-muted/30 border-2 border-rune-glow/30 flex items-center justify-center">
                    <span className="text-3xl font-fantasy text-rune-glow">A</span>
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-fantasy text-rune-glow font-semibold">
                      André Novaes
                    </h3>
                    <p className="text-sm text-muted-foreground font-serif">
                      Producer & Narrator
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StrategicCodingSection;
