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
  if (!resourceId) return 0;

  try {
    const { data, error } = await supabase
      .from("resources")
      .select("likes_count")
      .eq("id", resourceId)
      .single();

    if (error) {
      console.error("Error fetching likes:", error);
      return 0;
    }

    return data?.likes_count || 0;
  } catch (error) {
    console.error("Error fetching likes:", error);
    return 0;
  }
}

export async function recordView(resourceId: string, userId: string) {
  if (!resourceId || !userId) return;

  try {
    // Insertar la vista
    const { error } = await supabase.from("resource_views").upsert(
      {
        resource_id: resourceId,
        user_id: userId,
      },
      { onConflict: "resource_id,user_id" },
    );

    if (error && error.code !== "23505") {
      // Ignorar errores de duplicados
      console.error("Error recording view:", error);
    }
  } catch (error) {
    // Silenciosamente fallar para no interrumpir la experiencia del usuario
    console.error("Error recording view:", error);
  }
}

export async function toggleLike(resourceId: string, userId: string) {
  if (!resourceId || !userId) return false;

  try {
    // First check if the like exists
    const { data: existingLike, error: checkError } = await supabase
      .from("likes")
      .select("id")
      .eq("resource_id", resourceId)
      .eq("user_id", userId)
      .maybeSingle();

    if (checkError) throw checkError;

    if (existingLike) {
      // Unlike: Delete the like
      const { error: deleteError } = await supabase
        .from("likes")
        .delete()
        .eq("resource_id", resourceId)
        .eq("user_id", userId);

      if (deleteError) throw deleteError;

      // Update resources counter
      const { error: updateError } = await supabase.rpc("decrement_likes", {
        resource_id: resourceId,
      });

      if (updateError) throw updateError;

      return false;
    } else {
      // Like: Insert new like
      const { error: insertError } = await supabase.from("likes").insert({
        resource_id: resourceId,
        user_id: userId,
      });

      if (insertError) throw insertError;

      // Update resources counter
      const { error: updateError } = await supabase.rpc("increment_likes", {
        resource_id: resourceId,
      });

      if (updateError) throw updateError;

      return true;
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    throw error;
  }
}

export async function getResources(
  options: {
    sortBy?: "recent" | "likes" | "relevance" | "trending";
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
    )
  `);

  // Aplicar ordenamiento primero
  switch (options.sortBy) {
    case "likes":
      query = query.order("likes_count", { ascending: false });
      break;
    case "trending":
    case "relevance":
      query = query.order("trending_score", { ascending: false });
      break;
    default:
      // Default to recent
      query = query.order("created_at", { ascending: false });
  }

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
  } else if (options.limit) {
    query = query.limit(options.limit);
  }

  // Get the data
  const { data: resources, error: resourcesError } = await query;

  if (resourcesError) {
    console.error("Error fetching resources:", resourcesError);
    throw resourcesError;
  }

  return resources || [];
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
