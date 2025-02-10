import { useEffect, useState } from "react";
import { ResourceCard } from "./ResourceCard";
import { getResources } from "@/lib/api";
import type { ResourceWithRelations } from "@/lib/data";
import { useAuth } from "@/components/auth/AuthContext";
import { ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { supabase } from "@/lib/supabase";
import { PaymentModal } from "./PaymentModal";

interface ResourceGridProps {
  selectedCategory?: string | null;
  selectedSubcategory?: string | null;
  searchQuery?: string;
}

const ResourceGrid = ({
  selectedCategory = null,
  selectedSubcategory = null,
  searchQuery = "",
}: ResourceGridProps) => {
  const [resources, setResources] = useState<ResourceWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { user } = useAuth();
  const [profile, setProfile] = useState<{ is_pro: boolean } | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        setProfile(null);
        setLoadingProfile(false);
        return;
      }

      try {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        setProfile(profileData);
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, [user]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Cargar el perfil del usuario si está autenticado
        if (user) {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();
          console.log("Profile data:", profileData);
          setProfile(profileData);
        }

        // Cargar recursos
        const data = await getResources();
        console.log("Resources:", data);
        setResources(data || []);
      } catch (e) {
        console.error("Error loading data:", e);
        setError(e instanceof Error ? e.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const filteredResources = resources.filter((resource) => {
    const categoryMatch =
      !selectedCategory ||
      resource.subcategories?.categories?.id === selectedCategory;

    const subcategoryMatch =
      !selectedSubcategory ||
      resource.subcategories?.id === selectedSubcategory;

    const searchMatch =
      !searchQuery ||
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (resource.description?.toLowerCase() || "").includes(
        searchQuery.toLowerCase(),
      );

    return categoryMatch && subcategoryMatch && searchMatch;
  });

  const visibleResources = filteredResources.filter((resource) => {
    // Si el recurso es gratuito, siempre mostrarlo
    if (!resource.is_paid) return true;

    // Si no hay usuario logueado, no mostrar recursos pagos
    if (!user) return false;

    // Si hay usuario logueado pero no es pro, no mostrar recursos pagos
    if (!profile?.is_pro) return false;

    // Si el usuario es pro, mostrar todo
    return true;
  });

  const hiddenResourcesCount =
    filteredResources.length - visibleResources.length;

  if (loading) {
    return <div className="p-8 text-center">Loading resources...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="w-full min-h-screen bg-[#0B1121] p-8 overflow-y-auto">
      <div className="max-w-[1200px] mx-auto">
        {filteredResources.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No resources found matching your criteria.
          </div>
        ) : (
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleResources.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  title={resource.title}
                  description={resource.description || ""}
                  type={resource.subcategories?.categories?.name}
                  subcategory={resource.subcategories?.name}
                  isPaid={resource.is_paid}
                  url={resource.url}
                />
              ))}
            </div>

            {hiddenResourcesCount > 0 && (
              <div className="relative mt-12">
                <div
                  className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0B1121]/80 to-[#0B1121] pointer-events-none"
                  style={{ height: "200px", top: "-200px" }}
                />
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="p-4 rounded-full bg-violet-500/10 animate-bounce">
                    <ChevronDown className="h-6 w-6 text-violet-400" />
                  </div>
                  <div className="text-lg font-semibold text-white">
                    {hiddenResourcesCount} More Resource
                    {hiddenResourcesCount !== 1 ? "s" : ""} Available
                  </div>
                  <p className="text-gray-400 max-w-md mb-4">
                    Upgrade to Pro to unlock all resources and take your
                    development skills to the next level
                  </p>
                  <Button
                    onClick={() => {
                      if (!user) {
                        window.location.href = "/login";
                        return;
                      }
                      setShowPaymentModal(true);
                    }}
                    className="bg-violet-600 hover:bg-violet-700 text-white px-8"
                  >
                    Upgrade to Pro
                  </Button>
                  <PaymentModal
                    open={showPaymentModal}
                    onOpenChange={setShowPaymentModal}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceGrid;
