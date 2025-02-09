import React, { useState } from "react";
import Header from "./Header";
import FilterBar from "./FilterBar";
import ResourceGrid from "./ResourceGrid";

const Resources = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState<boolean | null>(null);

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(null); // Reset subcategory when category changes
  };

  const handleSubcategoryChange = (subcategoryId: string | null) => {
    setSelectedSubcategory(subcategoryId);
  };

  const handlePriceFilterChange = (isPaid: boolean | null) => {
    setPriceFilter(isPaid);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        isDarkMode={isDarkMode}
        onThemeToggle={handleThemeToggle}
        onSearch={handleSearch}
      />
      <main className="pt-[72px]">
        <FilterBar
          onSearch={handleSearch}
          onCategoryChange={handleCategoryChange}
          onSubcategoryChange={handleSubcategoryChange}
          onPriceFilterChange={handlePriceFilterChange}
        />
        <ResourceGrid
          selectedCategory={selectedCategory}
          selectedSubcategory={selectedSubcategory}
          searchQuery={searchQuery}
          isPaid={priceFilter}
        />
      </main>
    </div>
  );
};

export default Resources;
