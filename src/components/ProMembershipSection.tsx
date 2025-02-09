import { Button } from "./ui/button";
import { Crown, Check } from "lucide-react";

const ProMembershipSection = () => {
  const handlePurchase = () => {
    window.open("https://www.paypal.com/paypalme/yourpaypallink/5", "_blank");
  };

  const features = [
    "Access all premium resources",
    "Lifetime updates",
    "No recurring fees",
    "Premium support",
  ];

  return (
    <div className="bg-[#0B1121] py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-yellow-100/10 text-yellow-300 px-4 py-1.5 rounded-full mb-8">
          <Crown className="h-4 w-4" />
          <span className="text-sm font-medium">
            Special Offer - Ends February 25th
          </span>
        </div>

        <h1 className="text-5xl font-bold text-white mb-4">
          Unlock All Premium Resources
        </h1>
        <p className="text-xl text-gray-400 mb-16">
          One-time payment, lifetime access to all premium content
        </p>

        <div className="bg-[#0F172A] border border-gray-800 rounded-2xl p-12 max-w-lg mx-auto">
          <div className="flex flex-col items-center gap-2 mb-8">
            <div className="flex items-center gap-2">
              <span className="text-2xl text-gray-500 line-through">$12</span>
              <span className="text-6xl font-bold text-white">$5</span>
              <span className="text-gray-400 text-xl self-end">/lifetime</span>
            </div>
            <div className="bg-green-500/10 text-green-400 text-sm font-medium px-3 py-1 rounded-full">
              Save 58% today
            </div>
          </div>

          <ul className="space-y-4 text-left mb-8">
            {features.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-3 text-gray-300"
              >
                <Check className="h-5 w-5 text-green-400" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <Button
            onClick={handlePurchase}
            size="lg"
            className="w-full h-14 text-lg font-medium bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white gap-2 shadow-lg shadow-violet-500/20 transition-all duration-300 hover:shadow-violet-500/40"
          >
            <Crown className="h-5 w-5" />
            Get Pro Lifetime Access
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProMembershipSection;
