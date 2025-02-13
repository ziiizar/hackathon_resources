import { Button } from "./ui/button";
import { ArrowRight, Crown } from "lucide-react";
import { Link } from "react-router-dom";

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
          <Link to="/resources">
            <Button size="lg" className="gap-2">
              Explore Resources <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <a
            href="mailto:ziizar2001@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              size="lg"
              variant="outline"
              className="gap-2 border-violet-500/50 text-violet-400 hover:text-violet-300"
            >
              Become Affiliate <Crown className="w-4 h-4" />
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
