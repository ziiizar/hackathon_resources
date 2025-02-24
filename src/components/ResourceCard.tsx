import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { isWithinLastMonth } from "@/lib/utils";
import { Button } from "./ui/button";
import { AddToCollectionDialog } from "./collections/AddToCollectionDialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import {
  Layout,
  Palette,
  Bot,
  MessageSquare,
  ExternalLink,
  Heart,
  Plus,
  ListPlus,
  Check,
} from "lucide-react";
import { useAuth } from "@/components/auth";
import { useEffect, useState } from "react";
import {
  getLikesForResources,
  getUserLikesForResources,
  toggleLike,
  recordView,
} from "@/lib/api";
import { supabase } from "@/lib/supabase";
import { useToast } from "./ui/use-toast";
import { AuthModal } from "./auth/AuthModal";

import type { ResourceType } from "@/lib/data";

interface ResourceCardProps {
  id?: string;
  title?: string;
  description?: string;
  type?: ResourceType;
  subcategory?: string;
  isPaid?: boolean;
  url?: string;
  created_at?: string;
  is_affiliate?: boolean;
}

const getIconByType = (type: ResourceType) => {
  switch (type) {
    case "Frontend":
      return Layout;
    case "Design":
      return Palette;
    case "AI Agents":
      return Bot;
    case "AI Chats":
      return MessageSquare;
    default:
      return Layout;
  }
};

const getCategoryColor = (type: ResourceType) => {
  switch (type) {
    case "Frontend":
      return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    case "Design":
      return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    case "AI Agents":
      return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    case "AI Chats":
      return "bg-orange-500/10 text-orange-400 border-orange-500/20";
    default:
      return "bg-gray-500/10 text-gray-400 border-gray-500/20";
  }
};

export const ResourceCard = ({
  title = "Sample Resource",
  description = "This is a sample resource description that provides an overview of what this resource category contains.",
  type = "Frontend",
  subcategory = "General",
  isPaid = false,
  url = "#",
  id = "",
  created_at = new Date().toISOString(),
  is_affiliate = false,
}: ResourceCardProps) => {
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"none" | "some" | "all">("none");
  const [totalCollections, setTotalCollections] = useState(0);
  const [savedCollections, setSavedCollections] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCollectionDialog, setShowCollectionDialog] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const checkSaveStatus = async () => {
    if (!user || !id) return;

    try {
      // Get total number of user's collections
      const { data: userCollections, error: collectionsError } = await supabase
        .from("collections")
        .select("id")
        .eq("user_id", user.id);

      if (collectionsError) throw collectionsError;
      const totalCount = userCollections?.length || 0;
      setTotalCollections(totalCount);

      // Get collections where this resource is saved
      const { data: savedData, error: savedError } = await supabase
        .from("collection_resources")
        .select(
          `
          collection_id,
          collections!inner(id)
        `,
        )
        .eq("resource_id", id)
        .eq("collections.user_id", user.id);

      if (savedError) throw savedError;
      const savedCount = savedData?.length || 0;
      setSavedCollections(savedCount);

      // Update save status
      if (savedCount === 0) setSaveStatus("none");
      else if (savedCount === totalCount) setSaveStatus("all");
      else setSaveStatus("some");
    } catch (error) {
      console.error("Error checking save status:", error);
    }
  };

  // Load initial data and set up subscriptions
  useEffect(() => {
    if (!id) return;

    const loadInitialData = async () => {
      try {
        // Load likes count in batch
        const likesData = await getLikesForResources([id]);
        setLikes(likesData[id] || 0);

        // Only check user-specific data if logged in
        if (user) {
          const userLikes = await getUserLikesForResources(user.id, [id]);
          setIsLiked(userLikes.has(id));

          await checkSaveStatus();
        }
      } catch (error) {
        console.error("Error loading initial data:", error);
      }
    };

    loadInitialData();

    // Always subscribe to likes changes
    const likesChannel = supabase
      .channel(`likes:${id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "likes",
          filter: `resource_id=eq.${id}`,
        },
        () => {
          getLikesForResources([id])
            .then((data) => setLikes(data[id] || 0))
            .catch(console.error);
        },
      )
      .subscribe();

    // Only set up collection-related subscriptions if user is logged in
    let bookmarksChannel;
    let collectionsChannel;

    if (user) {
      bookmarksChannel = supabase
        .channel(`bookmarks:${id}:${user.id}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "collection_resources",
            filter: `resource_id=eq.${id}`,
          },
          async (payload) => {
            console.log("Collection change detected:", payload);
            await checkSaveStatus();
          },
        )
        .subscribe();

      collectionsChannel = supabase
        .channel(`collections:${user.id}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "collections",
            filter: `user_id=eq.${user.id}`,
          },
          async () => {
            console.log("Collections changed");
            await checkSaveStatus();
          },
        )
        .subscribe();
    }

    return () => {
      supabase.removeChannel(likesChannel);
      if (bookmarksChannel) supabase.removeChannel(bookmarksChannel);
      if (collectionsChannel) supabase.removeChannel(collectionsChannel);
    };
  }, [id, user]);

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!user) {
      setShowAuthModal(true);
      return;
    }

    // Optimistically update UI
    const previousIsLiked = isLiked;
    const previousLikes = likes;
    setIsLiked(!isLiked);
    setLikes((prev) => prev + (isLiked ? -1 : 1));

    try {
      await toggleLike(id, user.id);
    } catch (error) {
      // Revert optimistic update on error
      setIsLiked(previousIsLiked);
      setLikes(previousLikes);
      console.error("Error toggling like:", error);
      toast({
        title: "Error",
        description: "Could not update like status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const Icon = getIconByType(type);
  const categoryColor = getCategoryColor(type);

  const handleClick = async () => {
    if (user?.id) {
      await recordView(id, user.id);
    }
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <TooltipProvider>
      <Card
        className={`group relative flex flex-col h-[140px] transition-all duration-300 ${is_affiliate ? "bg-gradient-to-r from-violet-500/10 to-violet-400/5 hover:from-violet-500/20 hover:to-violet-400/10 border-2 border-violet-500/50 shadow-lg shadow-violet-500/20" : "bg-[#0F172A] hover:bg-[#1E293B] border border-gray-800/50 hover:border-violet-500/30"}`}
      >
        <CardHeader className="pb-1 pt-3 flex-none relative">
          {is_affiliate && (
            <Badge className="absolute -top-2 -right-2 bg-violet-500 text-white border-none shadow-lg">
              Featured
            </Badge>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded ${categoryColor}`}>
                <Icon className="w-4 h-4" />
              </div>
              <h3 className="text-base font-medium text-white line-clamp-1">
                {title}
              </h3>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pb-1 pt-0 flex-grow">
          <p className="text-sm text-gray-400 line-clamp-2">{description}</p>
        </CardContent>

        <CardFooter className="flex justify-between items-center mt-auto pt-0 pb-3">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2 max-w-[65%] overflow-hidden">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                <Badge
                  variant="outline"
                  className={`${categoryColor} border whitespace-nowrap`}
                >
                  {subcategory}
                </Badge>
              </div>
              {isWithinLastMonth(created_at) && (
                <Badge
                  variant="secondary"
                  className="bg-green-500/10 text-green-400 border-green-500/20 whitespace-nowrap flex-shrink-0"
                >
                  New
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-gray-700/50 transition-colors"
                  onClick={handleLikeClick}
                >
                  <Heart
                    className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : "text-gray-500"}`}
                  />
                </Button>
                <span className="text-sm text-gray-500 min-w-[1rem] text-start">
                  {likes}
                </span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-8 w-8 hover:bg-gray-700/50 transition-colors ${saveStatus !== "none" ? "text-violet-500" : "text-gray-500"}`}
                      onClick={() =>
                        user
                          ? setShowCollectionDialog(true)
                          : setShowAuthModal(true)
                      }
                    >
                      {saveStatus === "none" && <Plus className="h-4 w-4" />}
                      {saveStatus === "some" && (
                        <ListPlus className="h-4 w-4" />
                      )}
                      {saveStatus === "all" && <Check className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    {saveStatus === "none" && "Add to collection"}
                    {saveStatus === "some" &&
                      `Saved in ${savedCollections} collection${savedCollections !== 1 ? "s" : ""}`}
                    {saveStatus === "all" && "Saved in all collections"}
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </CardFooter>

        <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
        {user && (
          <AddToCollectionDialog
            open={showCollectionDialog}
            onOpenChange={setShowCollectionDialog}
            resourceId={id}
            userId={user.id}
          />
        )}

        <button
          onClick={handleClick}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-gray-700/50 rounded-full"
        >
          <ExternalLink className="w-4 h-4 text-gray-400" />
        </button>
      </Card>
    </TooltipProvider>
  );
};
