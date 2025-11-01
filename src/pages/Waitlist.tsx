import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, Sparkles, Scroll, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import heroPortalBg from "@/assets/hero-portal-bg.jpg";

const Waitlist = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [level, setLevel] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name || !level) {
      toast({
        title: "Incomplete Quest Form",
        description: "Please provide your name, email, and mastery level to join the guild.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitted(true);
    setIsLoading(false);
    
    toast({
      title: "Welcome to the Guild!",
      description: "Your name has been inscribed in the ancient tome. We shall summon you when the time comes.",
    });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
          backgroundImage: `url(${heroPortalBg})`
        }}>
          <div className="absolute inset-0 bg-background/60" />
        </div>

        {/* Success Content */}
        <div className="relative z-10 text-center max-w-2xl mx-auto px-6">
          <div className="animate-fade-in-up">
            <div className="mb-8">
              <Sparkles className="w-20 h-20 text-rune-glow mx-auto mb-6 animate-float-gentle" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-fantasy font-bold text-primary mystical-glow mb-6">
              THE RITUAL IS <span className="text-rune-glow">COMPLETE</span>
            </h1>
            
            <div className="bg-card/80 backdrop-blur-sm border border-rune-glow/30 rounded-xl p-8 mb-8">
              <Scroll className="w-12 h-12 text-magic-blue mx-auto mb-4" />
              <p className="text-lg text-muted-foreground font-body leading-relaxed mb-4">
                Your name has been inscribed in the <strong className="text-primary">Ancient Guild Registry</strong>. 
                The mystical energies are now aligned, and you shall be among the first to receive word 
                when the portals open.
              </p>
              <p className="text-sm text-accent font-body">
                Watch your crystal ball (email) for updates from the realm...
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/">
                <Button variant="rune" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Return to the Realm
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Magical Elements */}
        <div className="absolute top-20 left-20 text-magic-blue text-2xl animate-float-gentle opacity-60">
          ✧
        </div>
        <div className="absolute top-40 right-32 text-rune-glow text-3xl animate-float-gentle opacity-70" style={{ animationDelay: '1s' }}>
          ❋
        </div>
        <div className="absolute bottom-40 left-32 text-forge-orange text-2xl animate-float-gentle opacity-50" style={{ animationDelay: '2s' }}>
          ✦
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
        backgroundImage: `url(${heroPortalBg})`
      }}>
        <div className="absolute inset-0 bg-background/70" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-2xl mx-auto px-6">
        <div className="animate-fade-in-up">
          {/* Header */}
          <div className="mb-8">
            <Mail className="w-16 h-16 text-rune-glow mx-auto mb-6 animate-rune-pulse" />
            <h1 className="text-4xl md:text-6xl font-fantasy font-bold text-primary mystical-glow mb-4">
              JOIN THE <span className="text-magic-blue">GUILD</span>
            </h1>
            <p className="text-xl text-muted-foreground font-body leading-relaxed">
              Inscribe your name in the ancient tome and be among the first to receive 
              word when the mystical portals to T.U.S.S.T. open. The arcane arts await...
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-card/80 backdrop-blur-sm border border-rune-glow/30 rounded-xl p-8 mb-8">
            <div className="space-y-6">
              <div className="text-left">
                <Label htmlFor="name" className="text-primary font-fantasy font-semibold mb-2 block">
                  Your Noble Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name, brave adventurer..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-background/50 border-border focus:border-rune-glow font-body"
                  required
                />
              </div>

              <div className="text-left">
                <Label htmlFor="email" className="text-primary font-fantasy font-semibold mb-2 block">
                  Crystal Ball Contact (Email)
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@realm.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background/50 border-border focus:border-rune-glow font-body"
                  required
                />
              </div>

              <div className="text-left">
                <Label className="text-primary font-fantasy font-semibold mb-3 block">
                  Your Mastery Level in the Arcane Arts (Programming & Web3/Blockchain)
                </Label>
                <RadioGroup value={level} onValueChange={setLevel} className="space-y-3">
                  <div className="flex items-center space-x-3 bg-background/50 border border-border rounded-lg p-3 hover:border-rune-glow/50 transition-colors">
                    <RadioGroupItem value="apprentice" id="apprentice" className="border-primary" />
                    <Label htmlFor="apprentice" className="flex-1 cursor-pointer font-body text-foreground">
                      <span className="font-fantasy font-semibold text-magic-blue">⚔️ Apprentice</span>
                      <span className="text-xs text-muted-foreground block">Just beginning my journey in the mystical realms</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 bg-background/50 border border-border rounded-lg p-3 hover:border-rune-glow/50 transition-colors">
                    <RadioGroupItem value="scholar" id="scholar" className="border-primary" />
                    <Label htmlFor="scholar" className="flex-1 cursor-pointer font-body text-foreground">
                      <span className="font-fantasy font-semibold text-portal-purple">📜 Scholar</span>
                      <span className="text-xs text-muted-foreground block">Learning the ancient scrolls and casting basic spells</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 bg-background/50 border border-border rounded-lg p-3 hover:border-rune-glow/50 transition-colors">
                    <RadioGroupItem value="mage" id="mage" className="border-primary" />
                    <Label htmlFor="mage" className="flex-1 cursor-pointer font-body text-foreground">
                      <span className="font-fantasy font-semibold text-rune-glow">🔮 Mage</span>
                      <span className="text-xs text-muted-foreground block">Wielding powerful enchantments and forging artifacts</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 bg-background/50 border border-border rounded-lg p-3 hover:border-rune-glow/50 transition-colors">
                    <RadioGroupItem value="archmage" id="archmage" className="border-primary" />
                    <Label htmlFor="archmage" className="flex-1 cursor-pointer font-body text-foreground">
                      <span className="font-fantasy font-semibold text-forge-orange">✨ Archmage</span>
                      <span className="text-xs text-muted-foreground block">Master of the mystic arts and blockchain sorcery</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Button
                type="submit" 
                variant="rune" 
                size="hero" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                    Casting Inscription Spell...
                  </>
                ) : (
                  <>
                    <Scroll className="w-5 h-5 mr-2" />
                    Inscribe My Name
                  </>
                )}
              </Button>
            </div>

            <div className="mt-6 p-4 bg-accent/10 rounded-lg border-l-4 border-accent">
              <p className="text-sm text-muted-foreground font-body">
                <strong>Guild Oath:</strong> Your information is protected by ancient magic. 
                We shall only use it to notify you of important realm updates and never share it with dark forces.
              </p>
            </div>
          </form>

          {/* Back Link */}
          <Link to="/">
            <Button variant="ghost" className="gap-2 font-body">
              <ArrowLeft className="w-4 h-4" />
              Return to the Main Realm
            </Button>
          </Link>
        </div>
      </div>

      {/* Floating Magical Elements */}
      <div className="absolute top-20 left-20 text-magic-blue text-2xl animate-float-gentle opacity-60">
        ✧
      </div>
      <div className="absolute top-40 right-32 text-rune-glow text-3xl animate-float-gentle opacity-70" style={{ animationDelay: '1s' }}>
        ❋
      </div>
      <div className="absolute bottom-40 left-32 text-forge-orange text-2xl animate-float-gentle opacity-50" style={{ animationDelay: '2s' }}>
        ✦
      </div>
      <div className="absolute bottom-20 right-20 text-portal-purple text-2xl animate-float-gentle opacity-60" style={{ animationDelay: '3s' }}>
        ✦
      </div>
    </div>
  );
};

export default Waitlist;