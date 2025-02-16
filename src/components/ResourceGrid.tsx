import { useEffect, useState } from "react";
import { ResourceCard } from "./ResourceCard";
import { getResources } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/auth";
import type { ResourceWithRelations } from "@/lib/data";

interface ResourceGridProps {
  selectedCategory?: string | null;
  selectedSubcategory?: string | null;
  searchQuery?: string;
  sortBy?: "recent" | "likes" | "relevance" | "trending_week";
  showFavorites?: boolean;
}

const ResourceGrid = ({
  selectedCategory = null,
  selectedSubcategory = null,
  searchQuery = "",
  sortBy = "recent",
  showFavorites = false,
}: ResourceGridProps) => {
  const { user } = useAuth();
  const [resources, setResources] = useState<ResourceWithRelations[]>([]);
  const [likedResources, setLikedResources] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLikedResources = async () => {
      const { data: likes } = await supabase
        .from("likes")
        .select("resource_id")
        .eq("user_id", user?.id || "");

      if (likes) {
        setLikedResources(new Set(likes.map((like) => like.resource_id)));
      }
    };

    if (user) {
      loadLikedResources();
    } else {
      setLikedResources(new Set());
    }
  }, [user]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Cargar recursos
        const data = await getResources({ sortBy });
        console.log("Resources:", data);
        setResources(data || []);
      } catch (e) {
        console.error("Error loading data:", e);
        setError(e instanceof Error ? e.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [sortBy]);

  const filteredResources = resources.filter((resource) => {
    const categoryMatch =
      !selectedCategory ||
      resource.subcategories?.categories?.id === selectedCategory;

    const subcategoryMatch =
      !selectedSubcategory ||
      resource.subcategories?.id === selectedSubcategory;

    const searchMatch =
      !searchQuery ||
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (resource.description?.toLowerCase() || "").includes(
        searchQuery.toLowerCase(),
      );

    const favoriteMatch = !showFavorites || likedResources.has(resource.id);

    return categoryMatch && subcategoryMatch && searchMatch && favoriteMatch;
  });

  const sortedResources = [...filteredResources].sort((a, b) => {
    if (sortBy === "recent") {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

      const aIsRecent = new Date(a.created_at) > oneMonthAgo;
      const bIsRecent = new Date(b.created_at) > oneMonthAgo;

      if (aIsRecent && !bIsRecent) return -1;
      if (!aIsRecent && bIsRecent) return 1;
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } else if (sortBy === "likes") {
      return (b.likes_count || 0) - (a.likes_count || 0);
    }
    return 0;
  });

  const visibleResources = sortedResources;

  if (loading) {
    return <div className="p-8 text-center">Loading resources...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="w-full bg-[#0B1121] p-8">
      <div className="max-w-[1200px] mx-auto">
        {filteredResources.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No resources found matching your criteria.
          </div>
        ) : (
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleResources.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  id={resource.id}
                  title={resource.title}
                  description={resource.description || ""}
                  type={resource.subcategories?.categories?.name}
                  subcategory={resource.subcategories?.name}
                  isPaid={resource.is_paid}
                  url={resource.url}
                  created_at={resource.created_at}
                  is_affiliate={resource.is_affiliate}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceGrid;
