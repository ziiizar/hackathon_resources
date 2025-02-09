import { Card, CardContent } from "./ui/card";
import { Code, Database, Server, Wrench } from "lucide-react";

const features = [
  {
    icon: Code,
    title: "Frontend Development",
    description: "Master modern web frameworks and UI/UX principles",
  },
  {
    icon: Database,
    title: "Backend Development",
    description: "Build robust and scalable server-side applications",
  },
  {
    icon: Server,
    title: "DevOps & Cloud",
    description: "Learn deployment, CI/CD, and cloud infrastructure",
  },
  {
    icon: Wrench,
    title: "Developer Tools",
    description: "Essential tools and utilities for efficient development",
  },
];

const FeaturesSection = () => {
  return (
    <div className="bg-muted/50 py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">What We Offer</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="bg-background">
                <CardContent className="pt-6">
                  <div className="rounded-lg p-3 bg-primary/10 w-fit mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
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
