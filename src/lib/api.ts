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

export async function getLikesForResources(
  resourceIds: string[],
): Promise<{ [key: string]: number }> {
  if (!resourceIds.length) return {};

  try {
    const { data, error } = await supabase
      .from("resources")
      .select("id, likes_count")
      .in("id", resourceIds);

    if (error) {
      console.error("Error fetching likes:", error);
      return {};
    }

    return data.reduce((acc, resource) => {
      acc[resource.id] = resource.likes_count || 0;
      return acc;
    }, {});
  } catch (error) {
    console.error("Error fetching likes:", error);
    return {};
  }
}

export async function getSavedStatusForResources(
  userId: string,
  resourceIds: string[],
): Promise<{ [key: string]: { saved: boolean; collections: number } }> {
  if (!userId || !resourceIds.length) return {};

  try {
    // Get all collections where these resources are saved
    const { data, error } = await supabase
      .from("collection_resources")
      .select(
        `
        resource_id,
        collection_id,
        collections!inner(user_id)
      `,
      )
      .eq("collections.user_id", userId)
      .in("resource_id", resourceIds);

    if (error) throw error;

    // Process the data to get saved status and collection count
    const result = resourceIds.reduce((acc, resourceId) => {
      const resourceSaves = data.filter(
        (item) => item.resource_id === resourceId,
      );
      acc[resourceId] = {
        saved: resourceSaves.length > 0,
        collections: resourceSaves.length,
      };
      return acc;
    }, {});

    return result;
  } catch (error) {
    console.error("Error checking saved status:", error);
    return {};
  }
}

export async function getUserLikesForResources(
  userId: string,
  resourceIds: string[],
): Promise<Set<string>> {
  if (!userId || !resourceIds.length) return new Set();

  try {
    const { data, error } = await supabase
      .from("likes")
      .select("resource_id")
      .eq("user_id", userId)
      .in("resource_id", resourceIds);

    if (error) throw error;

    return new Set(data.map((like) => like.resource_id));
  } catch (error) {
    console.error("Error fetching user likes:", error);
    return new Set();
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
  } = {},
) {
  try {
    let query = supabase.from("resources").select(`
        *,
        subcategories!inner (*, 
          categories!inner (*)
        )
      `);

    // Aplicar filtros
    if (options.categoryId) {
      console.log("Filtering by category:", options.categoryId);
      query = query.eq("subcategories.categories.id", options.categoryId);
    }

    if (options.subcategoryId) {
      console.log("Filtering by subcategory:", options.subcategoryId);
      query = query.eq("subcategory_id", options.subcategoryId);
    }

    // Aplicar ordenamiento
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
  } catch (error) {
    console.error("Error in getResources:", error);
    throw error;
  }
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
