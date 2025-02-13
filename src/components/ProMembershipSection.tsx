import { Button } from "./ui/button";
import { Heart, Coffee, Star, Sparkles } from "lucide-react";

const SupportSection = () => {
  const features = [
    "Help maintain the platform",
    "Support new features",
    "Keep resources up to date",
    "Enable future improvements",
  ];

  return (
    <div className="bg-[#0B1121] py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 px-4 py-1.5 rounded-full mb-8">
          <Heart className="h-4 w-4" />
          <span className="text-sm font-medium">Support Open Source</span>
        </div>

        <h1 className="text-5xl font-bold text-white mb-4">
          Help Us Keep DevHub Free
        </h1>
        <p className="text-xl text-gray-400 mb-16">
          Your support helps us maintain and improve the platform for everyone
        </p>

        <div className="bg-[#0F172A] border border-gray-800 rounded-2xl p-12 max-w-lg mx-auto">
          <div className="flex flex-col items-center gap-6 mb-8">
            <Coffee className="h-16 w-16 text-blue-400" />
            <p className="text-lg text-gray-300">
              If you find DevHub useful, consider buying us a coffee!
            </p>
          </div>

          <ul className="space-y-4 text-left mb-8">
            {features.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-3 text-gray-300"
              >
                <Star className="h-5 w-5 text-blue-400" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <Button
            onClick={() =>
              window.open("https://paypal.me/ErnestoFerrando", "_blank")
            }
            size="lg"
            className="w-full h-14 text-lg font-medium bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white gap-2 shadow-lg shadow-blue-500/20 transition-all duration-300 hover:shadow-blue-500/40"
          >
            <Sparkles className="h-5 w-5" />
            Support DevHub
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SupportSection;
