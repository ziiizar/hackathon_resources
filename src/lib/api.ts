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

export async function getResources(options: { trending?: boolean } = {}) {
  const query = supabase.from(
    options.trending ? "trending_resources" : "resources",
  ).select(`
      *,
      subcategories (*, 
        categories (*)
      )
    `);

  if (options.trending) {
    query.order("trending_score", { ascending: false }).limit(10);
  }

  const { data: resources, error: resourcesError } = await query;

  if (resourcesError) {
    console.error("Error fetching resources:", resourcesError);
    throw resourcesError;
  }

  // Get likes count for each resource using a more compatible approach
  const likesMap = new Map();

  // Get all likes
  const { data: likes, error: likesError } = await supabase
    .from("likes")
    .select("resource_id");

  if (likesError) {
    console.error("Error fetching likes:", likesError);
    throw likesError;
  }

  // Count likes for each resource
  likes?.forEach((like) => {
    const count = likesMap.get(like.resource_id) || 0;
    likesMap.set(like.resource_id, count + 1);
  });

  // Combine resources with their likes count
  const resourcesWithLikes =
    resources?.map((resource) => ({
      ...resource,
      likes_count: likesMap.get(resource.id) || 0,
    })) || [];

  return resourcesWithLikes;
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
