import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Heart, ExternalLink, TrendingUp } from "lucide-react";
import { useAuth } from "@/components/auth";
import { useState } from "react";
import { toggleLike, recordView } from "@/lib/api";
import { useToast } from "./ui/use-toast";
import { AuthModal } from "./auth/AuthModal";
import { motion } from "framer-motion";
import type { ResourceType } from "@/lib/data";

interface TrendingResourceCardProps {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  subcategory: string;
  isPaid: boolean;
  url: string;
  likes_count: number;
  trending_score: number;
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
}: TrendingResourceCardProps) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    try {
      const newIsLiked = await toggleLike(id, user.id);
      setIsLiked(newIsLiked);
      toast({
        title: newIsLiked ? "Resource liked!" : "Resource unliked",
        duration: 1500,
      });
    } catch (error) {
      console.error("Error toggling like:", error);
      toast({
        title: "Error",
        description: "Could not update like status",
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
      className="group relative overflow-hidden bg-gradient-to-br from-[#1a1f35] to-[#111827] border-0 h-[400px] cursor-pointer transition-all duration-500 hover:shadow-2xl hover:shadow-violet-500/10"
      onClick={handleClick}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent z-10" />

      <CardContent className="relative h-full p-8 flex flex-col justify-end z-20">
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
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white leading-tight">
              {title}
            </h2>
            <p className="text-gray-300 line-clamp-2">{description}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className="border-violet-500/30 text-violet-300"
            >
              {type}
            </Badge>
            <Badge
              variant="outline"
              className="border-blue-500/30 text-blue-300"
            >
              {subcategory}
            </Badge>
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
                <span className="text-gray-400">{likes_count}</span>
              </Button>
            </div>

            <Button variant="ghost" size="icon" className="hover:bg-white/10">
              <ExternalLink className="h-4 w-4 text-gray-400" />
            </Button>
          </div>
        </motion.div>
      </CardContent>

      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </Card>
  );
}
