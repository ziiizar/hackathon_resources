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

export async function getResources() {
  const { data, error } = await supabase
    .from("resources")
    .select(
      `
      *,
      subcategories (*, 
        categories (*)
      )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching resources:", error);
    throw error;
  }
  console.log("Fetched resources:", data);
  return data;
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
