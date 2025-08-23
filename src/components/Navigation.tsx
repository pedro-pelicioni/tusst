import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MessageSquare, Twitter, Menu, X } from "lucide-react";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: "The Quest", href: "#quest" },
    { name: "The Grimoire", href: "#grimoire" },
    { name: "Card System", href: "#cards" },
    { name: "Tutorials", href: "#tutorials" }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/20">
      <nav className="container mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <a href="#" className="cursor-pointer">
            <img 
              src="/lovable-uploads/0dab1952-e071-4e0c-a4c2-db5b1ce1fc25.png" 
              alt="T.U.S.S.T. - The Ultimate Stellar Supreme Tutorial"
              className="h-12 w-auto object-contain"
            />
          </a>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-muted-foreground hover:text-primary transition-colors duration-300 font-body font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Desktop Social Links */}
        <div className="hidden md:flex items-center gap-3">
          <a href="https://discord.gg/QpadZuKAhj" target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="sm" className="gap-2">
              <MessageSquare className="w-4 h-4" />
              Discord
            </Button>
          </a>
          
          <a href="https://x.com/StellarTUSST" target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="sm" className="gap-2">
              <Twitter className="w-4 h-4" />
              Twitter
            </Button>
          </a>
          
          <Link to="/waitlist">
            <Button variant="portal" size="sm" className="gap-2">
              Join Guild
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md border-b border-border/20">
          <div className="container mx-auto px-6 py-4 space-y-4">
            {/* Mobile Navigation Links */}
            <div className="space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block text-muted-foreground hover:text-primary transition-colors duration-300 font-body font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* Mobile Social Links */}
            <div className="pt-4 border-t border-border/20 space-y-3">
              <a href="https://discord.gg/QpadZuKAhj" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="sm" className="gap-2 w-full justify-start">
                  <MessageSquare className="w-4 h-4" />
                  Discord
                </Button>
              </a>
              
              <a href="https://x.com/StellarTUSST" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="sm" className="gap-2 w-full justify-start">
                  <Twitter className="w-4 h-4" />
                  Twitter
                </Button>
              </a>
              
              <Link to="/waitlist" onClick={() => setIsMenuOpen(false)}>
                <Button variant="portal" size="sm" className="gap-2 w-full">
                  Join Guild
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navigation;