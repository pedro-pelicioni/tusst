import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

const Navigation = () => {
  const navLinks = [
    { name: "The Quest", href: "#quest" },
    { name: "The Grimoire", href: "#grimoire" },
    { name: "The Guild", href: "#guild" },
    { name: "Tutorials", href: "#tutorials" },
    { name: "Dev Forums", href: "#forums" }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/20">
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <h1 className="text-2xl font-fantasy font-bold mystical-glow text-primary">
            T.U.S.S.T.
          </h1>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-muted-foreground hover:text-primary transition-colors duration-300 font-body font-medium"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Discord Button */}
        <Button variant="portal" size="sm" className="gap-2">
          <MessageSquare className="w-4 h-4" />
          Discord
        </Button>
      </nav>
    </header>
  );
};

export default Navigation;