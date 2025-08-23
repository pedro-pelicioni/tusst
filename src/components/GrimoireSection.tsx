import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const GrimoireSection = () => {
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  const cards = [
    {
      name: "Deploy Contract",
      type: "Soroban Function",
      code: `#[contractimpl]\nfn deploy() -> Result<(), Error> {\n    // Deploy smart contract\n    Ok(())\n}`,
      description: "Summon a new contract to the blockchain realm"
    },
    {
      name: "Invoke Method",
      type: "Rust Primitive",
      code: `pub fn invoke(&self) -> u64 {\n    self.balance.saturating_add(amount)\n}`,
      description: "Channel energy through contract methods"
    },
    {
      name: "Store Data",
      type: "Storage Spell",
      code: `env.storage().instance()\n    .set(&key, &value);`,
      description: "Preserve knowledge in the eternal ledger"
    }
  ];

  const handleCardFlip = (direction: 'next' | 'prev') => {
    if (isFlipping) return;
    
    setIsFlipping(true);
    setTimeout(() => {
      if (direction === 'next') {
        setCurrentCard((prev) => (prev + 1) % cards.length);
      } else {
        setCurrentCard((prev) => (prev - 1 + cards.length) % cards.length);
      }
      setIsFlipping(false);
    }, 300);
  };

  return (
    <section id="grimoire" className="min-h-screen bg-gradient-to-b from-card to-secondary py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-fantasy font-bold text-primary mystical-glow mb-6">
            THE <span className="text-magic-blue">GRIMOIRE</span>
          </h2>
          <p className="text-xl text-muted-foreground font-body max-w-2xl mx-auto">
            Ancient spells of code waiting to be mastered. Each card represents 
            a fundamental concept in the arcane arts of Rust and Soroban development.
          </p>
        </div>

        {/* Card Display */}
        <div className="flex justify-center mb-12">
          <div className="relative w-80 h-96">
            {/* Background Cards */}
            <div className="absolute inset-0 bg-card border-2 border-border rounded-xl transform rotate-3 opacity-30" />
            <div className="absolute inset-0 bg-card border-2 border-border rounded-xl transform -rotate-2 opacity-50" />
            
            {/* Main Card */}
            <div 
              className={`relative w-full h-full bg-gradient-to-br from-card to-secondary border-2 border-rune-glow rounded-xl overflow-hidden shadow-2xl shadow-rune-glow/20 transition-transform duration-300 ${
                isFlipping ? 'animate-card-flip' : ''
              }`}
            >
              {/* Card Back Design */}
              {isFlipping && (
                <div className="absolute inset-0 bg-gradient-to-br from-secondary to-card border-2 border-magic-blue/50 rounded-xl flex items-center justify-center">
                  <div className="text-6xl text-magic-blue opacity-60">✦</div>
                </div>
              )}
              
              {/* Card Face */}
              {!isFlipping && (
                <div className="h-full flex flex-col p-6">
                  {/* Card Header */}
                  <div className="mb-4">
                    <h3 className="text-xl font-fantasy font-bold text-primary mystical-glow mb-1">
                      {cards[currentCard].name}
                    </h3>
                    <span className="text-sm font-body text-accent bg-accent/10 px-2 py-1 rounded">
                      {cards[currentCard].type}
                    </span>
                  </div>

                  {/* Code Display */}
                  <div className="flex-1 bg-background/50 rounded-lg p-4 mb-4 border border-border">
                    <pre className="text-sm text-foreground font-mono leading-relaxed overflow-x-auto">
                      {cards[currentCard].code}
                    </pre>
                  </div>

                  {/* Card Description */}
                  <p className="text-sm text-muted-foreground font-body italic">
                    {cards[currentCard].description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-center space-x-8">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleCardFlip('prev')}
            disabled={isFlipping}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            PREVIOUS
          </Button>

          {/* Pagination Dots */}
          <div className="flex space-x-2">
            {cards.map((_, index) => (
              <button
                key={index}
                onClick={() => !isFlipping && setCurrentCard(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                  index === currentCard 
                    ? 'bg-rune-glow shadow-lg shadow-rune-glow/40' 
                    : 'bg-muted hover:bg-accent'
                }`}
              />
            ))}
          </div>

          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleCardFlip('next')}
            disabled={isFlipping}
            className="gap-2"
          >
            NEXT
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default GrimoireSection;