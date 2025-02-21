import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import { supabase } from "@/lib/supabase";
import { Plus, Check, Loader2 } from "lucide-react";
import { CreateCollectionDialog } from "./CreateCollectionDialog";

interface Collection {
  id: string;
  name: string;
  description: string;
  is_public: boolean;
}

interface AddToCollectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resourceId: string;
  userId: string;
}

export function AddToCollectionDialog({
  open,
  onOpenChange,
  resourceId,
  userId,
}: AddToCollectionDialogProps) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [savedCollections, setSavedCollections] = useState<Set<string>>(
    new Set(),
  );
  const { toast } = useToast();

  const loadCollections = async () => {
    try {
      // Load user's collections
      const { data: collectionsData, error: collectionsError } = await supabase
        .from("collections")
        .select("*")
        .eq("user_id", userId);

      if (collectionsError) throw collectionsError;

      // Load which collections already have this resource
      const { data: savedData, error: savedError } = await supabase
        .from("collection_resources")
        .select("collection_id")
        .eq("resource_id", resourceId);

      if (savedError) throw savedError;

      setCollections(collectionsData);
      setSavedCollections(new Set(savedData.map((item) => item.collection_id)));
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
    if (open) {
      loadCollections();
    }
  }, [open, userId, resourceId]);

  const toggleCollection = async (collectionId: string) => {
    setSaving(collectionId);

    // Store previous state for rollback
    const previousSavedCollections = new Set(savedCollections);

    try {
      const isRemoving = savedCollections.has(collectionId);

      // Optimistically update UI
      if (isRemoving) {
        setSavedCollections((prev) => {
          const next = new Set(prev);
          next.delete(collectionId);
          return next;
        });
      } else {
        setSavedCollections((prev) => new Set([...prev, collectionId]));
      }

      // Perform the actual operation
      if (isRemoving) {
        const { error } = await supabase
          .from("collection_resources")
          .delete()
          .eq("collection_id", collectionId)
          .eq("resource_id", resourceId).select(`
            collection_id,
            collections!inner(user_id)
          `);

        if (error) throw error;

        toast({
          title: "Removed from collection",
          description: "Resource removed from collection successfully.",
        });
      } else {
        const { error } = await supabase.from("collection_resources").insert({
          collection_id: collectionId,
          resource_id: resourceId,
        }).select(`
            collection_id,
            collections!inner(user_id)
          `);

        if (error) throw error;

        toast({
          title: "Added to collection",
          description: "Resource added to collection successfully.",
        });
      }
    } catch (error) {
      console.error("Error toggling collection:", error);
      // Revert to previous state
      setSavedCollections(previousSavedCollections);
      toast({
        title: "Error",
        description: "Could not update collection. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add to Collection</DialogTitle>
          <DialogDescription>
            Choose collections to add this resource to.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <div className="space-y-2">
              {collections.map((collection) => (
                <Button
                  key={collection.id}
                  variant="outline"
                  className="w-full justify-between"
                  disabled={saving === collection.id}
                  onClick={() => toggleCollection(collection.id)}
                >
                  <span>{collection.name}</span>
                  {saving === collection.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : savedCollections.has(collection.id) ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </Button>
              ))}

              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowCreateDialog(true)}
              >
                <Plus className="mr-2 h-4 w-4" /> Create New Collection
              </Button>
            </div>
          )}
        </div>
      </DialogContent>

      <CreateCollectionDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={loadCollections}
      />
    </Dialog>
  );
}
