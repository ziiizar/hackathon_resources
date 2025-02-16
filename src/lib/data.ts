export type ResourceType = "Frontend" | "Design" | "AI Agents" | "AI Chats";

export interface ResourceWithRelations {
  trending_score?: number;
  likes_count?: number;
  id: string;
  subcategory_id: string;
  title: string;
  description: string | null;
  url: string;
  is_paid: boolean;
  created_at: string;
  updated_at: string;
  is_affiliate?: boolean;
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
