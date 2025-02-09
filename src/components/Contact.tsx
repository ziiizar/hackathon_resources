import Header from "./Header";
import Footer from "./Footer";
import { Mail } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-[72px] min-h-[calc(100vh-72px)] flex items-center justify-center px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8 flex justify-center">
            <div className="bg-primary/10 p-4 rounded-full">
              <Mail className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-6">
            Suggest a Resource
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Know of a great development resource that should be featured on our
            platform? We're always looking to expand our collection with
            high-quality resources that can help developers grow.
          </p>
          <a
            href="mailto:ziizar2001@gmail.com"
            className="inline-block text-2xl font-medium text-white hover:text-white/90 transition-colors bg-[#1A2333] hover:bg-[#1A2333]/80 px-8 py-4 rounded-lg"
          >
            ziizar2001@gmail.com
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
