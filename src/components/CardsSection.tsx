// Importing card images directly from public folder
const card1 = "/lovable-uploads/2666c266-0d2b-4586-8e4b-04a8a8a90601.png";
const card2 = "/lovable-uploads/931df4f6-8cb6-4328-ba1a-9d4d10341c21.png";

const CardsSection = () => {
  const cards = [
    {
      id: 1,
      image: card1,
      name: "Stroowarrior",
      type: "Warrior",
      power: 4
    },
    {
      id: 2,
      image: card2,
      name: "Stroowarrior",
      type: "Warrior", 
      power: 5
    }
  ];

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="fantasy-heading text-4xl md:text-5xl lg:text-6xl mb-6">
            Cartas do Jogo
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Descubra as cartas épicas e suas habilidades únicas. Passe o mouse sobre elas para ver o efeito mágico.
          </p>
        </div>
        
        <div className="flex justify-center items-center gap-16 flex-wrap">
          {cards.map((card) => (
            <div key={card.id} className="game-card">
              <div className="card-wrapper">
                <img 
                  src={card.image} 
                  alt={`${card.name} - ${card.type} ${card.power}`}
                  className="card-image"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CardsSection;