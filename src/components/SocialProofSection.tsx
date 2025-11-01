import { Star, Users, BookOpen, Trophy } from "lucide-react";

const SocialProofSection = () => {
  const stats = [
    {
      icon: Users,
      value: "5,000+",
      label: "Guild Members",
      description: "Sorcerers mastering the craft"
    },
    {
      icon: BookOpen,
      value: "100+",
      label: "Mystical Lessons",
      description: "Ancient knowledge scrolls"
    },
    {
      icon: Trophy,
      value: "50+",
      label: "Forged Projects",
      description: "Legendary creations built"
    },
    {
      icon: Star,
      value: "4.9/5",
      label: "Guild Rating",
      description: "From fellow sorcerers"
    }
  ];

  const testimonials = [
    {
      name: "Aldric the Wise",
      role: "Master Enchanter",
      quote: "T.U.S.S.T. transformed me from a mere apprentice into a confident blockchain sorcerer. The mystical approach to teaching Rust made complex concepts feel like second nature.",
      avatar: "🧙‍♂️"
    },
    {
      name: "Lyra Starweaver",
      role: "Smart Contract Architect",
      quote: "The guild's approach to teaching smart contracts is unlike anything I've experienced. Every lesson feels like an epic quest, and the community support is legendary.",
      avatar: "🌟"
    },
    {
      name: "Thorne Ironcode",
      role: "DeFi Warrior",
      quote: "From zero to building production-ready dApps in months. The progressive card system and hands-on forging sessions accelerated my journey beyond imagination.",
      avatar: "⚔️"
    }
  ];

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-background via-background to-secondary/10">
      <div className="container mx-auto max-w-6xl">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-card/50 backdrop-blur-sm border border-primary/20 rounded-lg p-6 text-center hover:border-primary/40 transition-all duration-300 hover:scale-105"
              >
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div className="text-3xl font-fantasy text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm font-semibold text-foreground mb-1">
                  {stat.label}
                </div>
                <div className="text-xs text-muted-foreground">
                  {stat.description}
                </div>
              </div>
            );
          })}
        </div>

        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-fantasy text-primary mb-4 mystical-glow">
            Tales from the Guild
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hear the legends of those who answered the call and mastered the arcane arts of blockchain sorcery
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card/30 backdrop-blur-sm border border-primary/20 rounded-lg p-6 hover:border-primary/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,219,84,0.3)] relative"
            >
              {/* Quote decoration */}
              <div className="absolute top-4 right-4 text-6xl text-primary/10 font-fantasy">
                "
              </div>
              
              {/* Avatar */}
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-2xl mr-4 border-2 border-primary/30">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-fantasy text-foreground font-semibold">
                    {testimonial.name}
                  </div>
                  <div className="text-xs text-primary">
                    {testimonial.role}
                  </div>
                </div>
              </div>

              {/* Quote */}
              <p className="text-muted-foreground text-sm leading-relaxed italic">
                "{testimonial.quote}"
              </p>

              {/* Stars */}
              <div className="flex gap-1 mt-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badge */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 bg-card/50 backdrop-blur-sm border border-primary/30 rounded-full px-8 py-4">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">
              <span className="text-primary font-semibold">Verified Guild</span> • Trusted by thousands of aspiring blockchain sorcerers worldwide
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;
