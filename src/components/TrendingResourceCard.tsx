import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Heart, ExternalLink, TrendingUp } from "lucide-react";
import { useAuth } from "@/components/auth";
import { useState, useEffect } from "react";
import { toggleLike, recordView, getLikes } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import { useToast } from "./ui/use-toast";
import { AuthModal } from "./auth/AuthModal";
import { motion } from "framer-motion";
import type { ResourceType } from "@/lib/data";

interface TrendingResourceCardProps {
  id: string;
  title: string;
  description: string;
  type: ResourceType | string;
  subcategory: string;
  isPaid: boolean;
  url: string;
  likes_count: number;
  trending_score: number;
  screenshot_url?: string;
  logo_url?: string;
}

export function TrendingResourceCard({
  id,
  title,
  description,
  type,
  subcategory,
  url,
  likes_count,
  trending_score,
  screenshot_url,
  logo_url,
}: TrendingResourceCardProps) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [localLikesCount, setLocalLikesCount] = useState(likes_count);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!id || !user) return;

    const checkLikeStatus = async () => {
      try {
        const { data } = await supabase
          .from("likes")
          .select("id")
          .eq("resource_id", id)
          .eq("user_id", user.id)
          .maybeSingle();
        setIsLiked(!!data);
      } catch (error) {
        console.error("Error checking like status:", error);
      }
    };

    checkLikeStatus();

    // Subscribe to likes changes
    const channel = supabase
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
          getLikes(id).then(setLocalLikesCount).catch(console.error);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, user]);

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    // Optimistic update
    const previousIsLiked = isLiked;
    const previousLikesCount = localLikesCount;
    setIsLiked(!isLiked);
    setLocalLikesCount((prev) => prev + (isLiked ? -1 : 1));

    try {
      await toggleLike(id, user.id);
    } catch (error) {
      // Revert optimistic update on error
      setIsLiked(previousIsLiked);
      setLocalLikesCount(previousLikesCount);
      console.error("Error toggling like:", error);
      toast({
        title: "Error",
        description: "Could not update like status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleClick = async () => {
    if (user?.id) {
      await recordView(id, user.id);
    }
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Card
      className="group relative overflow-hidden border-0 h-[400px] cursor-pointer transition-all duration-700 hover:shadow-2xl hover:shadow-violet-500/10 hover:scale-[1.02] hover:-translate-y-1"
      onClick={handleClick}
    >
      {screenshot_url ? (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center blur-[4px]"
            style={{ backgroundImage: `url(${screenshot_url})` }}
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/40 z-10" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1f35] to-[#111827]" />
      )}

      <CardContent className="relative h-full p-8 flex flex-col justify-end z-20">
        {logo_url && (
          <div className="absolute top-4 left-4 w-12 h-12 rounded-lg overflow-hidden bg-white/10 backdrop-blur-md p-2">
            <img
              src={logo_url}
              alt="Logo"
              className="w-full h-full object-contain"
            />
          </div>
        )}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <Badge
            className="bg-violet-500/20 text-violet-300 border border-violet-500/30"
            variant="outline"
          >
            <TrendingUp className="w-3 h-3 mr-1" />
            Trending
          </Badge>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            ease: [0.4, 0, 0.2, 1],
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white leading-tight">
              {title}
            </h2>
            <p className="text-gray-300 line-clamp-2">{description}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {type && (
              <Badge
                variant="outline"
                className="border-violet-500/30 text-violet-300 whitespace-nowrap"
              >
                {type}
              </Badge>
            )}
            {subcategory && (
              <Badge
                variant="outline"
                className="border-blue-500/30 text-blue-300 whitespace-nowrap"
              >
                {subcategory}
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-white/10 gap-2"
                onClick={handleLikeClick}
              >
                <Heart
                  className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : "text-gray-400"}`}
                />
                <span className="text-gray-400">{localLikesCount}</span>
              </Button>
            </div>
          </div>
        </motion.div>
      </CardContent>

      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </Card>
  );
}
