import { Button } from "./ui/button";
import { ArrowRight, Crown } from "lucide-react";

const HeroSection = () => {
  return (
    <div className="relative background-radial-gradient px-6 text-white min-h-screen flex items-center">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold tracking-tight mb-6 text-white">
          Your Gateway to Development Excellence
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Discover curated resources for developers. Everything you need to
          level up your workflows.
        </p>
        <div className="flex gap-4 justify-center">
          <Button
            size="lg"
            className="gap-2"
            onClick={() =>
              (window.location.href = import.meta.env.BASE_URL + "resources")
            }
          >
            Explore Resources <ArrowRight className="w-4 h-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="gap-2 border-violet-500/50 text-violet-400 hover:text-violet-300"
            onClick={() =>
              (window.location.href = "mailto:ziizar2001@gmail.com")
            }
          >
            Become Affiliate <Crown className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
