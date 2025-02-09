import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Search, ChevronRight, ChevronDown } from "lucide-react";
import { getCategories } from "@/lib/api";
import type { Category } from "@/lib/api";

interface SidebarProps {
  onSearch?: (query: string) => void;
  onCategorySelect?: (categoryId: string | null) => void;
  onSubcategorySelect?: (subcategoryId: string | null) => void;
  onPriceFilterChange?: (isPaid: boolean | null) => void;
}

const Sidebar = ({
  onSearch = () => {},
  onCategorySelect = () => {},
  onSubcategorySelect = () => {},
  onPriceFilterChange = () => {},
}: SidebarProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(),
  );
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
        // Expand all categories by default
        setExpandedCategories(new Set(data.map((cat) => cat.id)));
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    };
    loadCategories();
  }, []);

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleCategoryClick = (categoryId: string) => {
    const newCategoryId = selectedCategory === categoryId ? null : categoryId;
    setSelectedCategory(newCategoryId);
    setSelectedSubcategory(null);
    onCategorySelect(newCategoryId);
    onSubcategorySelect(null);
  };

  const handleSubcategoryClick = (subcategoryId: string) => {
    const newSubcategoryId =
      selectedSubcategory === subcategoryId ? null : subcategoryId;
    setSelectedSubcategory(newSubcategoryId);
    onSubcategorySelect(newSubcategoryId);
  };

  return (
    <aside className="w-[280px] fixed left-0 top-[72px] h-[calc(100vh-72px)] border-r bg-background p-6 flex flex-col gap-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Search</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search resources..."
            className="pl-10"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Categories</h3>
        <div className="space-y-1">
          {categories.map((category) => (
            <div key={category.id} className="space-y-1">
              <Button
                variant="ghost"
                className={`w-full justify-start ${selectedCategory === category.id ? "bg-accent" : ""}`}
                onClick={() => handleCategoryClick(category.id)}
              >
                <span
                  className="p-1 hover:bg-accent rounded-sm cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCategory(category.id);
                  }}
                >
                  {expandedCategories.has(category.id) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </span>
                {category.name}
              </Button>
              {expandedCategories.has(category.id) &&
                category.subcategories && (
                  <div className="ml-4 space-y-1">
                    {category.subcategories.map((subcategory) => (
                      <Button
                        key={subcategory.id}
                        variant="ghost"
                        className={`w-full justify-start pl-6 ${selectedSubcategory === subcategory.id ? "bg-accent" : ""}`}
                        onClick={() => handleSubcategoryClick(subcategory.id)}
                      >
                        {subcategory.name}
                      </Button>
                    ))}
                  </div>
                )}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Price</h3>
        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            onClick={() => onPriceFilterChange(null)}
            className="justify-start"
          >
            <Badge variant="outline" className="mr-2">
              All
            </Badge>
            All Resources
          </Button>
          <Button
            variant="outline"
            onClick={() => onPriceFilterChange(false)}
            className="justify-start"
          >
            <Badge variant="secondary" className="mr-2">
              Free
            </Badge>
            Free Resources
          </Button>
          <Button
            variant="outline"
            onClick={() => onPriceFilterChange(true)}
            className="justify-start"
          >
            <Badge variant="destructive" className="mr-2">
              Paid
            </Badge>
            Premium Resources
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
