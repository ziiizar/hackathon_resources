import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import Header from "../Header";
import { Card, CardHeader } from "../ui/card";
import { Globe, Lock } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { ResourceCard } from "../ResourceCard";
import type { ResourceWithRelations } from "@/lib/data";

interface Collection {
  id: string;
  name: string;
  description: string;
  is_public: boolean;
  user_id: string;
  created_at: string;
  resources: ResourceWithRelations[];
}

const CollectionDetail = () => {
  const { id } = useParams();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        // Get collection details
        const { data: collectionData, error: collectionError } = await supabase
          .from("collections")
          .select(
            `
            *,
            resources:collection_resources(
              resource:resources(
                *,
                subcategories(*, categories(*))
              )
            )
          `,
          )
          .eq("id", id)
          .single();

        if (collectionError) throw collectionError;

        // Transform the data to match our interface
        const resources = collectionData.resources
          .map((item: any) => item.resource)
          .filter(Boolean);

        setCollection({ ...collectionData, resources });
      } catch (error) {
        console.error("Error fetching collection:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCollection();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-[72px] px-6">
          <div className="max-w-6xl mx-auto py-12">
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-4 w-96" />
                  </div>
                </div>
              </CardHeader>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-[140px] w-full" />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!collection) {
    return <div>Collection not found</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-[72px] px-6">
        <div className="max-w-6xl mx-auto py-12">
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold">{collection.name}</h1>
                    {collection.is_public ? (
                      <Globe className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  {collection.description && (
                    <p className="text-muted-foreground">
                      {collection.description}
                    </p>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collection.resources.map((resource) => (
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
              />
            ))}
          </div>

          {collection.resources.length === 0 && (
            <div className="text-center text-muted-foreground py-12">
              No resources in this collection yet.
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CollectionDetail;
