import { useEffect, useState, useRef, useCallback } from "react";
import { ResourceCard } from "./ResourceCard";
import { getResources } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/auth";
import type { ResourceWithRelations } from "@/lib/data";
import { Skeleton } from "./ui/skeleton";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface ResourceGridProps {
  selectedCategory?: string | null;
  selectedSubcategory?: string | null;
  searchQuery?: string;
  sortBy?: "recent" | "likes" | "relevance";
  showFavorites?: boolean;
}

const ITEMS_PER_PAGE = 12;

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
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const observer = useRef<IntersectionObserver>();

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

  const lastResourceRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetching) {
          loadMore();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, isFetching],
  );

  const loadMore = useCallback(async () => {
    if (!hasMore || isFetching) return;

    try {
      setIsFetching(true);
      const data = await getResources({
        sortBy,
        page,
        limit: ITEMS_PER_PAGE,
        categoryId: selectedCategory,
        subcategoryId: selectedSubcategory,
        searchQuery: searchQuery,
      });

      if (data.length < ITEMS_PER_PAGE) {
        setHasMore(false);
      }

      setResources((prev) => {
        const existingIds = new Set(prev.map((r) => r.id));
        const newResources = data.filter((r) => !existingIds.has(r.id));
        return [...prev, ...newResources];
      });
      setPage((p) => p + 1);
    } catch (e) {
      console.error("Error loading more data:", e);
      setError(e instanceof Error ? e.message : "Failed to load data");
    } finally {
      setIsFetching(false);
    }
  }, [
    hasMore,
    isFetching,
    page,
    sortBy,
    selectedCategory,
    selectedSubcategory,
    searchQuery,
  ]);

  // Carga inicial y reset cuando cambian los filtros
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        setResources([]);
        setPage(1);
        setHasMore(true);
        setError(null);
        setIsFetching(false);

        console.log("Loading resources with filters:", {
          sortBy,
          categoryId: selectedCategory,
          subcategoryId: selectedSubcategory,
          searchQuery,
        });

        const data = await getResources({
          sortBy,
          page: 1,
          limit: ITEMS_PER_PAGE,
          categoryId: selectedCategory,
          subcategoryId: selectedSubcategory,
          searchQuery: searchQuery,
        });

        console.log("Loaded resources:", data);
        setResources(data);
        setHasMore(data.length === ITEMS_PER_PAGE);
      } catch (e) {
        console.error("Error loading initial data:", e);
        setError(e instanceof Error ? e.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [sortBy, selectedCategory, selectedSubcategory, searchQuery]);

  const visibleResources = showFavorites
    ? resources.filter((resource) => likedResources.has(resource.id))
    : resources;

  if (loading) {
    return (
      <div className="w-full bg-[#0B1121] p-8">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-[140px] relative overflow-hidden">
                <Skeleton className="h-full w-full bg-[#1E293B]/50">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#1E293B]/10 to-transparent skeleton-shimmer" />
                </Skeleton>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-[#0B1121] p-8">
        <div className="max-w-[1200px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 px-4 rounded-lg bg-red-500/10 border border-red-500/20"
          >
            <p className="text-red-400 text-lg">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 text-sm text-red-400 hover:text-red-300 underline"
            >
              Try again
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#0B1121] p-8">
      <div className="max-w-[1200px] mx-auto">
        {visibleResources.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 px-4 rounded-lg bg-[#1E293B]/50 border border-gray-700/50"
          >
            <p className="text-gray-400 text-lg">
              No resources found matching your criteria.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 text-sm text-violet-400 hover:text-violet-300 underline"
            >
              Reset filters
            </button>
          </motion.div>
        ) : (
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleResources.map((resource, index) => (
                <div
                  key={resource.id}
                  ref={
                    index === visibleResources.length - 1
                      ? lastResourceRef
                      : null
                  }
                >
                  <ResourceCard
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
                </div>
              ))}
            </div>
            {isFetching && (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 flex items-center justify-center py-8">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#1E293B]/50 border border-gray-700/50">
                  <Loader2 className="h-4 w-4 animate-spin text-violet-400" />
                  <span className="text-sm text-violet-400">
                    Loading more resources...
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceGrid;
