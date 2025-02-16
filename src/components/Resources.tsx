import React, { useState } from "react";
import Header from "./Header";
import FilterBar from "./FilterBar";
import ResourceGrid from "./ResourceGrid";

const Resources = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "likes" | "relevance">(
    "recent",
  );
  const [showFavorites, setShowFavorites] = useState(false);

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

  const handleSortChange = (sort: "recent" | "likes" | "relevance") => {
    setSortBy(sort);
  };

  return (
    <div className="h-screen flex flex-col bg-[#0B1121] overflow-hidden">
      <div className="flex-none">
        <Header onSearch={handleSearch} />
      </div>
      <main className="flex-1 flex flex-col pt-[72px] overflow-hidden">
        <div className="flex-none">
          <FilterBar
            onSearch={handleSearch}
            onCategoryChange={handleCategoryChange}
            onSubcategoryChange={handleSubcategoryChange}
            onSortChange={handleSortChange}
            showFavorites={showFavorites}
            onFavoritesChange={setShowFavorites}
          />
        </div>
        <div className="flex-1 overflow-auto">
          <ResourceGrid
            selectedCategory={selectedCategory}
            selectedSubcategory={selectedSubcategory}
            searchQuery={searchQuery}
            sortBy={sortBy}
            showFavorites={showFavorites}
          />
        </div>
      </main>
    </div>
  );
};

export default Resources;
