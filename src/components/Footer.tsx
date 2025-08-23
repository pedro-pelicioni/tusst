import { Link } from "react-router-dom";
import { MessageSquare, Twitter, Scroll, Sparkles } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "The Quest", href: "#quest" },
    { name: "The Grimoire", href: "#grimoire" },
    { name: "Card System", href: "#cards" },
    { name: "Tutorials", href: "#tutorials" }
  ];

  const socialLinks = [
    { 
      name: "Discord", 
      href: "https://discord.gg/QpadZuKAhj", 
      icon: MessageSquare,
      description: "Join our guild"
    },
    { 
      name: "Twitter", 
      href: "https://x.com/StellarTUSST", 
      icon: Twitter,
      description: "Follow our journey"
    }
  ];

  return (
    <footer className="bg-gradient-to-t from-shadow-depth to-background border-t border-border/20">
      <div className="container mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-4">
              <img 
                src="/lovable-uploads/0dab1952-e071-4e0c-a4c2-db5b1ce1fc25.png" 
                alt="T.U.S.S.T."
                className="h-16 w-auto object-contain"
              />
            </div>
            <p className="text-muted-foreground font-body text-lg leading-relaxed max-w-md">
              Master the arcane arts of Rust and smart contract development in an epic fantasy 
              coding adventure powered by Stellar and Soroban.
            </p>
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors duration-300 group"
                  >
                    <div className="w-10 h-10 bg-card border border-border rounded-lg flex items-center justify-center group-hover:border-primary group-hover:bg-primary/10 transition-all duration-300">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="hidden sm:block">
                      <p className="font-body font-medium">{social.name}</p>
                      <p className="text-sm text-muted-foreground">{social.description}</p>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-fantasy font-bold text-primary mystical-glow flex items-center gap-2">
              <Scroll className="w-5 h-5" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-300 font-body"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Join Guild */}
          <div className="space-y-6">
            <h3 className="text-xl font-fantasy font-bold text-primary mystical-glow flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Join the Adventure
            </h3>
            <div className="space-y-4">
              <p className="text-muted-foreground font-body">
                Ready to begin your coding quest? Join our guild and be the first to know when the portals open.
              </p>
              <Link 
                to="/waitlist"
                className="inline-block bg-gradient-mystical text-foreground font-fantasy font-semibold px-6 py-3 rounded-lg border border-rune-glow/30 hover:border-rune-glow hover:shadow-lg hover:shadow-rune-glow/25 transition-all duration-300"
              >
                Join Waitlist
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/20">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-muted-foreground font-body">
                © {currentYear} T.U.S.S.T. - The Ultimate Stellar Supreme Tutorial
              </p>
              <p className="text-sm text-muted-foreground font-body">
                Powered by Stellar Network / Kickstart Cohort #7 Winner
              </p>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-muted-foreground font-body">
              <span>Made with ✨ for the coding wizards</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Magical Elements */}
      <div className="absolute bottom-20 left-20 text-magic-blue text-xl animate-float-gentle opacity-30">
        ✧
      </div>
      <div className="absolute bottom-32 right-32 text-rune-glow text-2xl animate-float-gentle opacity-40" style={{ animationDelay: '1s' }}>
        ❋
      </div>
    </footer>
  );
};

export default Footer;