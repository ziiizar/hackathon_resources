import React, { useState } from "react";
import Header from "./Header";
import { TrendingCarousel } from "./TrendingCarousel";
import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import SupportSection from "./ProMembershipSection";
import AffiliateSection from "./AffiliateSection";
import Footer from "./Footer";

type DifficultyLevel = "Beginner" | "Intermediate" | "Advanced";
type ResourceType = "Frontend" | "Design" | "AI Agents" | "AI Chats";

const Home = () => {
  const [selectedTypes, setSelectedTypes] = useState<ResourceType[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<
    DifficultyLevel[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState<boolean | null>(null);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategoryChange = (category: string) => {
    if (category === "all") {
      setSelectedTypes([]);
    } else {
      setSelectedTypes([category as ResourceType]);
    }
  };

  const handleDifficultyChange = (difficulty: string) => {
    if (difficulty === "all") {
      setSelectedDifficulties([]);
    } else {
      setSelectedDifficulties([difficulty as DifficultyLevel]);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={handleSearch} />
      <main className="">
        <HeroSection />
        <div className="bg-[#0B1121] py-24">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-12 px-6">
              <h2 className="text-4xl font-bold text-white">
                Trending Resources
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Discover the most popular development resources this week
              </p>
            </div>
            <TrendingCarousel />
          </div>
        </div>
        <AffiliateSection />
        <FeaturesSection />
        <SupportSection />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
