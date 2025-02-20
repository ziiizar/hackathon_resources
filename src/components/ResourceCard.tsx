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
  Code,
  Database,
  Server,
  Wrench,
  ExternalLink,
  Heart,
} from "lucide-react";
import { useAuth } from "@/components/auth";
import { useEffect, useState } from "react";
import { getLikes, toggleLike, recordView } from "@/lib/api";
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
      return Code;
    case "Design":
      return Wrench;
    case "AI Agents":
      return Server;
    case "AI Chats":
      return Database;
    default:
      return Code;
  }
};

const getCategoryColor = (type: ResourceType) => {
  switch (type) {
    case "Frontend":
      return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    case "Design":
      return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    case "AI Agents":
      return "bg-green-500/10 text-green-400 border-green-500/20";
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
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCollectionDialog, setShowCollectionDialog] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!id) return; // Skip if no id is provided

    const loadInitialData = async () => {
      try {
        // Load initial likes count
        const likesCount = await getLikes(id);
        setLikes(likesCount);

        // Check if user has liked this resource
        if (user) {
          const { data } = await supabase
            .from("likes")
            .select("id")
            .eq("resource_id", id)
            .eq("user_id", user.id)
            .maybeSingle();
          setIsLiked(!!data);
        }
      } catch (error) {
        console.error("Error loading initial data:", error);
      }
    };

    loadInitialData();

    // Subscribe to likes changes
    let channel;
    try {
      channel = supabase
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
            getLikes(id).then(setLikes).catch(console.error);
          },
        )
        .subscribe();
    } catch (error) {
      console.error("Error setting up realtime subscription:", error);
    }

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [id, user]);

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click

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
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={`${categoryColor} border`}>
                {subcategory}
              </Badge>
              <Badge variant="secondary" className={categoryColor}>
                {type}
              </Badge>
              {isWithinLastMonth(created_at) && (
                <Badge
                  variant="secondary"
                  className="bg-green-500/10 text-green-400 border-green-500/20"
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
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-sm text-gray-500 hover:text-gray-400"
                  onClick={() =>
                    user
                      ? setShowCollectionDialog(true)
                      : setShowAuthModal(true)
                  }
                >
                  Save
                </Button>
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
