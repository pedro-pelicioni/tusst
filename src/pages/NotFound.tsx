import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-fantasy font-bold text-primary mystical-glow">404</h1>
        <p className="text-xl text-muted-foreground font-body mb-4">
          The path you seek has been consumed by shadow...
        </p>
        <Button variant="mystical" size="lg" asChild>
          <a href="/">Return to the Realm</a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
