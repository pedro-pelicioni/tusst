import { useRef } from "react";

// Importing card images directly from public folder
const card1 = "/lovable-uploads/2666c266-0d2b-4586-8e4b-04a8a8a90601.png";
const card2 = "/lovable-uploads/931df4f6-8cb6-4328-ba1a-9d4d10341c21.png";

const CardsSection = () => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    const rotateX = (mouseY / (rect.height / 2)) * -15;
    const rotateY = (mouseX / (rect.width / 2)) * 15;
    
    const cardWrapper = card.querySelector('.card-wrapper') as HTMLElement;
    if (cardWrapper) {
      cardWrapper.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
    }
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    
    const cardWrapper = cardRef.current.querySelector('.card-wrapper') as HTMLElement;
    if (cardWrapper) {
      cardWrapper.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    }
  };
  const cardEvolution = {
    base: {
      image: card1,
      name: "Stroowarrior",
      type: "Warrior",
      power: 4,
      description: "A beginner warrior with courage and determination"
    },
    evolved: {
      image: card2,
      name: "Stroowarrior Elite",
      type: "Warrior", 
      power: 5,
      description: "Evolved through tutorials, now with enhanced armor"
    }
  };

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="fantasy-heading text-4xl md:text-5xl lg:text-6xl mb-6">
            Card System
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Unlock epic cards by completing tutorials and challenges. Each card can evolve 
            as you master new programming skills.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Card Evolution Demo */}
          <div className="flex justify-center">
            <div 
              ref={cardRef}
              className="game-card-evolution"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <div className="card-wrapper">
                <img 
                  src={cardEvolution.base.image} 
                  alt={`${cardEvolution.base.name} - ${cardEvolution.base.type} ${cardEvolution.base.power}`}
                  className="card-image base-card"
                />
                <img 
                  src={cardEvolution.evolved.image} 
                  alt={`${cardEvolution.evolved.name} - ${cardEvolution.evolved.type} ${cardEvolution.evolved.power}`}
                  className="card-image evolved-card"
                />
              </div>
            </div>
          </div>

          {/* Explanation Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-primary">How It Works?</h3>
              <div className="space-y-3 text-muted-foreground">
                <p className="flex items-start gap-3">
                  <span className="text-accent font-bold text-lg">1.</span>
                  <span>Complete tutorials and challenges to unlock new cards</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-accent font-bold text-lg">2.</span>
                  <span>Practice your programming skills to evolve your cards</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-accent font-bold text-lg">3.</span>
                  <span>Evolved cards have greater power and special abilities</span>
                </p>
              </div>
            </div>

            <div className="bg-card/50 rounded-lg p-6 border border-border/50">
              <h4 className="text-xl font-semibold mb-4 text-primary">Evolution Example</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold text-foreground">Base Card</p>
                  <p className="text-muted-foreground">{cardEvolution.base.name}</p>
                  <p className="text-muted-foreground">Power: {cardEvolution.base.power}</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Evolved Card</p>
                  <p className="text-muted-foreground">{cardEvolution.evolved.name}</p>
                  <p className="text-muted-foreground">Power: {cardEvolution.evolved.power}</p>
                </div>
              </div>
              <div className="mt-4 p-3 bg-accent/10 rounded border-l-4 border-accent">
                <p className="text-sm text-muted-foreground">
                  💡 <strong>Tip:</strong> Hover over the card to see the evolution in action!
                </p>
              </div>
            </div>

            <div className="bg-gradient-mystical/20 rounded-lg p-6 border border-primary/20">
              <h4 className="text-xl font-semibold mb-3 text-primary">Learning Rewards</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-accent rounded-full"></span>
                  Basic tutorials unlock common cards
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-accent rounded-full"></span>
                  Advanced challenges grant rare cards
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-accent rounded-full"></span>
                  Complete projects evolve your favorite cards
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CardsSection;