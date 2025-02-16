import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { CollectionCard } from "./CollectionCard";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { CreateCollectionDialog } from "./CreateCollectionDialog";
import { useToast } from "../ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

interface Collection {
  id: string;
  name: string;
  description: string;
  is_public: boolean;
  resource_count: number;
}

interface CollectionsGridProps {
  userId: string;
}

export function CollectionsGrid({ userId }: CollectionsGridProps) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  const loadCollections = async () => {
    try {
      const { data, error } = await supabase
        .from("collections")
        .select(
          `
          *,
          resource_count:collection_resources(count)
        `,
        )
        .eq("user_id", userId);

      if (error) throw error;

      setCollections(
        data.map((collection) => ({
          ...collection,
          resource_count: collection.resource_count?.[0]?.count || 0,
        })),
      );
    } catch (error) {
      console.error("Error loading collections:", error);
      toast({
        title: "Error",
        description: "Could not load collections",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCollections();
  }, [userId]);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase
        .from("collections")
        .delete()
        .eq("id", deleteId);

      if (error) throw error;

      toast({
        title: "Collection deleted",
        description: "Your collection has been deleted successfully.",
      });

      loadCollections();
    } catch (error) {
      console.error("Error deleting collection:", error);
      toast({
        title: "Error",
        description: "Could not delete collection",
        variant: "destructive",
      });
    } finally {
      setDeleteId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[140px] w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">Collections</h2>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" /> New Collection
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {collections.map((collection) => (
          <CollectionCard
            key={collection.id}
            {...collection}
            resourceCount={collection.resource_count}
            onDelete={() => setDeleteId(collection.id)}
          />
        ))}
      </div>

      <CreateCollectionDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={loadCollections}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Collection</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this collection? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
