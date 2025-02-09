import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <div className="relative bg-background py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold tracking-tight mb-6">
          Your Gateway to Development Excellence
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Discover curated resources for developers at every level. From
          frontend to backend, DevOps to essential tools - everything you need
          to level up your skills.
        </p>
        <div className="flex gap-4 justify-center">
          <Button
            size="lg"
            className="gap-2"
            onClick={() => (window.location.href = "/resources")}
          >
            Explore Resources <ArrowRight className="w-4 h-4" />
          </Button>
          <Button size="lg" variant="outline">
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
