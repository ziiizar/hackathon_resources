import { Button } from "./ui/button";
import { Megaphone, Mail, ArrowRight, Star } from "lucide-react";

const AffiliateSection = () => {
  const benefits = [
    "Featured placement in resource listings",
    "Direct promotion to our developer community",
    "Detailed analytics on resource engagement",
    "Priority support and updates",
  ];

  return (
    <div className="bg-[#0F172A] py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-violet-500/10 text-violet-400 px-4 py-1.5 rounded-full mb-8">
          <Megaphone className="h-4 w-4" />
          <span className="text-sm font-medium">Promote Your Resource</span>
        </div>

        <h1 className="text-5xl font-bold text-white mb-4">
          Get Your Resource Featured
        </h1>
        <p className="text-xl text-gray-400 mb-16">
          Have a great development resource? Let's help you reach more
          developers
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-[#1E293B] border border-gray-800 rounded-2xl p-8 h-[320px] flex flex-col">
            <h3 className="text-2xl font-semibold text-white mb-6">Benefits</h3>
            <ul className="space-y-4 flex-grow">
              {benefits.map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-center gap-3 text-gray-300"
                >
                  <Star className="h-5 w-5 text-violet-400 flex-shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#1E293B] border border-gray-800 rounded-2xl p-8 h-[320px] flex flex-col">
            <Mail className="h-12 w-12 text-violet-400 mb-6 mx-auto" />
            <h3 className="text-2xl font-semibold text-white mb-4 text-center">
              Contact Us Today
            </h3>
            <p className="text-gray-400 mb-8 text-center flex-grow">
              Reach out to discuss featuring your resource on our platform
            </p>
            <Button
              onClick={() =>
                (window.location.href = "mailto:ziizar2001@gmail.com")
              }
              size="lg"
              className="w-full h-14 text-lg font-medium bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white gap-2 shadow-lg shadow-violet-500/20 transition-all duration-300 hover:shadow-violet-500/40"
            >
              Get in Touch <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AffiliateSection;
