// Importing card images directly from public folder
const card1 = "/lovable-uploads/2666c266-0d2b-4586-8e4b-04a8a8a90601.png";
const card2 = "/lovable-uploads/931df4f6-8cb6-4328-ba1a-9d4d10341c21.png";

const CardsSection = () => {
  const cardEvolution = {
    base: {
      image: card1,
      name: "Stroowarrior",
      type: "Warrior",
      power: 4,
      description: "Um guerreiro iniciante com coragem e determinação"
    },
    evolved: {
      image: card2,
      name: "Stroowarrior Elite",
      type: "Warrior", 
      power: 5,
      description: "Evoluído através dos tutoriais, agora com armadura aprimorada"
    }
  };

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="fantasy-heading text-4xl md:text-5xl lg:text-6xl mb-6">
            Sistema de Cartas
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Desbloqueie cartas épicas completando tutoriais e desafios. Cada carta pode evoluir 
            conforme você domina novas habilidades de programação.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Card Evolution Demo */}
          <div className="flex justify-center">
            <div className="game-card-evolution">
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
              <h3 className="text-2xl font-bold text-primary">Como Funciona?</h3>
              <div className="space-y-3 text-muted-foreground">
                <p className="flex items-start gap-3">
                  <span className="text-accent font-bold text-lg">1.</span>
                  <span>Complete tutoriais e desafios para desbloquear novas cartas</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-accent font-bold text-lg">2.</span>
                  <span>Pratique suas habilidades de programação para evoluir suas cartas</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-accent font-bold text-lg">3.</span>
                  <span>Cartas evoluídas possuem maior poder e habilidades especiais</span>
                </p>
              </div>
            </div>

            <div className="bg-card/50 rounded-lg p-6 border border-border/50">
              <h4 className="text-xl font-semibold mb-4 text-primary">Exemplo de Evolução</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold text-foreground">Carta Base</p>
                  <p className="text-muted-foreground">{cardEvolution.base.name}</p>
                  <p className="text-muted-foreground">Poder: {cardEvolution.base.power}</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Carta Evoluída</p>
                  <p className="text-muted-foreground">{cardEvolution.evolved.name}</p>
                  <p className="text-muted-foreground">Poder: {cardEvolution.evolved.power}</p>
                </div>
              </div>
              <div className="mt-4 p-3 bg-accent/10 rounded border-l-4 border-accent">
                <p className="text-sm text-muted-foreground">
                  💡 <strong>Dica:</strong> Passe o mouse sobre a carta para ver a evolução em ação!
                </p>
              </div>
            </div>

            <div className="bg-gradient-mystical/20 rounded-lg p-6 border border-primary/20">
              <h4 className="text-xl font-semibold mb-3 text-primary">Recompensas por Aprendizado</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-accent rounded-full"></span>
                  Tutoriais básicos desbloqueiam cartas comuns
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-accent rounded-full"></span>
                  Desafios avançados concedem cartas raras
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-accent rounded-full"></span>
                  Projetos completos evoluem suas cartas favoritas
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