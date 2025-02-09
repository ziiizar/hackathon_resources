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
    <div className="bg-gradient-to-b from-background to-muted py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-1 rounded-full mb-6">
          <Crown className="h-4 w-4" />
          <span className="text-sm font-medium">Special Offer</span>
        </div>

        <h2 className="text-4xl font-bold mb-4">
          Unlock All Premium Resources
        </h2>
        <p className="text-xl text-muted-foreground mb-8">
          One-time payment, lifetime access to all premium content
        </p>

        <div className="bg-card/50 backdrop-blur-sm border rounded-xl p-8 mb-8 max-w-md mx-auto hover:border-primary/50 transition-colors">
          <div className="flex items-baseline justify-center gap-2 mb-6">
            <span className="text-4xl font-bold">$5</span>
            <span className="text-muted-foreground">/lifetime</span>
          </div>

          <ul className="space-y-3 text-left mb-8">
            {features.map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <Button
            onClick={handlePurchase}
            size="lg"
            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 gap-2"
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
