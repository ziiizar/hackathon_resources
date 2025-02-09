import { Card, CardContent } from "./ui/card";
import { Code, Database, Server, Wrench } from "lucide-react";

const features = [
  {
    icon: Code,
    title: "Curated Excellence",
    description:
      "Hand-picked resources vetted for quality and relevance in today's tech landscape",
  },
  {
    icon: Database,
    title: "Always Current",
    description:
      "Stay ahead with continuously updated tools and resources for modern development",
  },
  {
    icon: Server,
    title: "Discover & Learn",
    description:
      "Explore emerging technologies and best practices from industry experts",
  },
  {
    icon: Wrench,
    title: "All in One Place",
    description:
      "Everything you need for your development journey, carefully organized and accessible",
  },
];

const FeaturesSection = () => {
  return (
    <div className="bg-[#0B1121] py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4 text-white">
          What We Offer
        </h2>
        <p className="text-xl text-gray-400 text-center max-w-2xl mx-auto mb-12">
          Your gateway to quality development resources, constantly evolving
          with the latest in tech
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className="bg-[#0F172A]/50 backdrop-blur-sm border border-gray-800 hover:border-violet-500/30 transition-all duration-300 group hover:bg-[#0F172A]/80"
              >
                <CardContent className="pt-6">
                  <div className="rounded-lg p-3 bg-violet-500/10 w-fit mb-4 group-hover:bg-violet-500/20 transition-colors duration-300">
                    <Icon className="w-6 h-6 text-violet-400" />
                  </div>
                  <h3 className="font-semibold mb-2 text-white group-hover:text-violet-300 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
