import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Heart } from "lucide-react";
import { getCategories } from "@/lib/api";
import type { Category } from "@/lib/api";

interface FilterBarProps {
  onCategoryChange?: (categoryId: string | null) => void;
  onSubcategoryChange?: (subcategoryId: string | null) => void;
  onSortChange?: (sort: "recent" | "likes" | "relevance") => void;
  showFavorites?: boolean;
  onFavoritesChange?: (showFavorites: boolean) => void;
}

const FilterBar = ({
  onCategoryChange = () => {},
  onSubcategoryChange = () => {},
  onSortChange = () => {},
  showFavorites = false,
  onFavoritesChange = () => {},
}: FilterBarProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        console.log("Loaded categories:", data); // Debug log
        setCategories(data);
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    };
    loadCategories();
  }, []);

  const handleCategoryChange = (value: string) => {
    console.log("Category changed to:", value);
    const categoryId = value === "all" ? null : value;
    setSelectedCategory(categoryId);
    setSelectedSubcategory(null);
    onCategoryChange(categoryId);
    onSubcategoryChange(null);
  };

  const handleSubcategoryChange = (value: string) => {
    console.log("Subcategory changed to:", value);
    const subcategoryId = value === "all" ? null : value;
    setSelectedSubcategory(subcategoryId);
    onSubcategoryChange(subcategoryId);
  };

  const selectedCategoryData = categories.find(
    (cat) => cat.id === selectedCategory,
  );

  return (
    <div className="w-full h-[60px] bg-[#0F172A] border-b border-gray-800 flex items-center place-content-center px-6 gap-4">
      <Select
        value={selectedCategory || "all"}
        onValueChange={handleCategoryChange}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={selectedSubcategory || "all"}
        onValueChange={handleSubcategoryChange}
        disabled={!selectedCategory}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Subcategory" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Subcategories</SelectItem>
          {selectedCategoryData?.subcategories?.map((subcategory) => (
            <SelectItem key={subcategory.id} value={subcategory.id}>
              {subcategory.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select onValueChange={onSortChange} defaultValue="recent">
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="recent">Recently Added</SelectItem>
          <SelectItem value="likes">Most Liked</SelectItem>
          <SelectItem value="relevance">Most Relevant</SelectItem>
        </SelectContent>
      </Select>

      <Button
        variant={showFavorites ? "default" : "outline"}
        size="icon"
        onClick={() => onFavoritesChange(!showFavorites)}
        className={`transition-colors ${showFavorites ? "bg-violet-600 hover:bg-violet-700" : "hover:text-violet-500"}`}
      >
        <Heart className={`h-4 w-4 ${showFavorites ? "fill-current" : ""}`} />
      </Button>
    </div>
  );
};

export default FilterBar;
