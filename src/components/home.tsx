import React, { useState } from "react";
import Header from "./Header";
import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import ProMembershipSection from "./ProMembershipSection";
import Footer from "./Footer";

type DifficultyLevel = "Beginner" | "Intermediate" | "Advanced";
type ResourceType = "Frontend" | "Design" | "AI Agents" | "AI Chats";

const Home = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<ResourceType[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<
    DifficultyLevel[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState<boolean | null>(null);

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

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
      <Header
        isDarkMode={isDarkMode}
        onThemeToggle={handleThemeToggle}
        onSearch={handleSearch}
      />
      <main className="">
        <HeroSection />
        <ProMembershipSection />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
