import { supabase } from "./supabase";
import type { Database } from "@/types/database";

export type Resource = Database["public"]["Tables"]["resources"]["Row"];

export type Category = Database["public"]["Tables"]["categories"]["Row"] & {
  subcategories: Subcategory[];
};
export type Subcategory =
  Database["public"]["Tables"]["subcategories"]["Row"] & {
    categories?: Category;
  };

export async function getLikes(resourceId: string) {
  if (!resourceId) return 0; // Return 0 if no resourceId is provided
  const { count, error } = await supabase
    .from("likes")
    .select("*", { count: "exact", head: true })
    .eq("resource_id", resourceId);

  if (error) {
    console.error("Error fetching likes:", error);
    throw error;
  }

  return count || 0;
}

export async function recordView(resourceId: string, userId: string) {
  if (!resourceId || !userId) return;

  try {
    await supabase.from("resource_views").insert({
      resource_id: resourceId,
      user_id: userId,
    });
  } catch (error) {
    console.error("Error recording view:", error);
  }
}

export async function toggleLike(resourceId: string, userId: string) {
  if (!resourceId || !userId) return false; // Return false if either id is missing
  // First check if the like exists
  const { data: existingLike } = await supabase
    .from("likes")
    .select("id")
    .eq("resource_id", resourceId)
    .eq("user_id", userId)
    .maybeSingle();

  if (existingLike) {
    // Unlike
    const { error } = await supabase
      .from("likes")
      .delete()
      .eq("resource_id", resourceId)
      .eq("user_id", userId);

    if (error) throw error;
    return false;
  } else {
    // Like
    const { error } = await supabase.from("likes").insert({
      resource_id: resourceId,
      user_id: userId,
    });

    if (error) throw error;
    return true;
  }
}

export async function getResources(
  options: {
    trending?: boolean;
    sortBy?: "recent" | "likes" | "relevance";
    page?: number;
    limit?: number;
    categoryId?: string | null;
    subcategoryId?: string | null;
    searchQuery?: string;
  } = {},
) {
  let query = supabase.from("resources").select(`
    *,
    subcategories (*, 
      categories (*)
    ),
    views:resource_views(count),
    likes:likes(count)
  `);

  // Aplicar filtros
  if (options.categoryId) {
    query = query.eq("subcategories.category_id", options.categoryId);
  }

  if (options.subcategoryId) {
    query = query.eq("subcategory_id", options.subcategoryId);
  }

  if (options.searchQuery) {
    query = query.or(
      `title.ilike.%${options.searchQuery}%,description.ilike.%${options.searchQuery}%,subcategories.name.ilike.%${options.searchQuery}%,subcategories.categories.name.ilike.%${options.searchQuery}%`,
    );
  }

  // Aplicar paginación
  if (options.page && options.limit) {
    const start = (options.page - 1) * options.limit;
    const end = start + options.limit - 1;
    query = query.range(start, end);
  }

  // Get the data
  const { data: resources, error: resourcesError } = await query;

  if (resourcesError) {
    console.error("Error fetching resources:", resourcesError);
    throw resourcesError;
  }

  // Calculate scores and sort
  const resourcesWithScores =
    resources?.map((resource) => {
      const viewCount = resource.views?.[0]?.count || 0;
      const likeCount = resource.likes?.[0]?.count || 0;

      return {
        ...resource,
        relevance_score: viewCount + likeCount,
        trending_score: viewCount + likeCount,
        likes_count: likeCount,
      };
    }) || [];

  // Sort based on option
  switch (options.sortBy) {
    case "likes":
      resourcesWithScores.sort(
        (a, b) => (b.likes?.[0]?.count || 0) - (a.likes?.[0]?.count || 0),
      );
      break;
    case "relevance":
      resourcesWithScores.sort((a, b) => b.relevance_score - a.relevance_score);
      break;
    default:
      // Default to recent
      resourcesWithScores.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
  }

  return resourcesWithScores;
}

export async function getCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("*, subcategories(*)")
    .order("name");

  if (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
  console.log("Fetched categories:", data);
  return data || [];
}

export async function getSubcategories() {
  const { data, error } = await supabase
    .from("subcategories")
    .select("*, categories(*)")
    .order("name");

  if (error) throw error;
  return data;
}
