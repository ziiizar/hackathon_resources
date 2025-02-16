import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { TrendingResourceCard } from "./TrendingResourceCard";
import { getResources } from "@/lib/api";
import type { ResourceWithRelations } from "@/lib/data";
import { Skeleton } from "./ui/skeleton";
import AutoplayPlugin, { AutoplayType } from "embla-carousel-autoplay";
type CreatePluginType<T, U> = any;
type LoosePluginType = any;

export function TrendingCarousel() {
  const [resources, setResources] = useState<ResourceWithRelations[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrending = async () => {
      try {
        const data = await getResources({ trending: true });
        setResources(data || []);
      } catch (error) {
        console.error("Error loading trending resources:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTrending();
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto px-6">
        <div className="flex gap-6 overflow-hidden">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="w-[600px] h-[400px] flex-shrink-0" />
          ))}
        </div>
      </div>
    );
  }

  if (resources.length === 0) {
    return null;
  }

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
        dragFree: true,
        skipSnaps: false,
        inViewThreshold: 0.7,
      }}
      plugins={[
        (AutoplayPlugin as unknown as CreatePluginType<LoosePluginType, {}>)({
          delay: 5000,
          stopOnInteraction: false,
          stopOnMouseEnter: true,
        }),
      ]}
      className="w-full max-w-6xl mx-auto px-6"
    >
      <CarouselContent>
        {resources.map((resource) => (
          <CarouselItem key={resource.id} className="md:basis-1/2">
            <TrendingResourceCard
              id={resource.id}
              title={resource.title}
              description={resource.description || ""}
              type={resource.subcategories?.categories?.name}
              subcategory={resource.subcategories?.name}
              isPaid={resource.is_paid}
              url={resource.url}
              likes_count={resource.likes_count || 0}
              trending_score={resource.trending_score || 0}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="-left-12 bg-white/5 hover:bg-white/10 border-0" />
      <CarouselNext className="-right-12 bg-white/5 hover:bg-white/10 border-0" />
    </Carousel>
  );
}
