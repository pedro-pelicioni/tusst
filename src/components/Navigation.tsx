import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
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
      <nav className="container mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/0dab1952-e071-4e0c-a4c2-db5b1ce1fc25.png" 
            alt="T.U.S.S.T. - The Ultimate Stellar Supreme Tutorial"
            className="h-12 w-auto object-contain"
          />
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

        {/* Join Waitlist Button */}
        <Link to="/waitlist">
          <Button variant="portal" size="sm" className="gap-2">
            <MessageSquare className="w-4 h-4" />
            Join Guild
          </Button>
        </Link>
      </nav>
    </header>
  );
};

export default Navigation;