export type ResourceType = "Frontend" | "Design" | "AI Agents" | "AI Chats";

export interface ResourceWithRelations {
  id: string;
  subcategory_id: string;
  title: string;
  description: string | null;
  url: string;
  is_paid: boolean;
  created_at: string;
  updated_at: string;
  likes_count?: number
  subcategories: {
    id: string;
    category_id: string;
    name: string;
    description: string | null;
    created_at: string;
    updated_at: string;
    categories: {
      id: string;
      name: ResourceType;
      description: string | null;
      created_at: string;
      updated_at: string;
    };
  };
}