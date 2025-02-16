import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/components/auth";
import { supabase } from "@/lib/supabase";
import Header from "../Header";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Heart, Settings, Crown } from "lucide-react";
import { CollectionsGrid } from "../collections/CollectionsGrid";
import { Skeleton } from "../ui/skeleton";

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  is_pro: boolean;
  likes_count?: number;
}

const ProfilePage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Get user profile
        const { data: userData, error: userError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", id)
          .single();

        if (userError) throw userError;

        // Get likes count
        const { count: likesCount } = await supabase
          .from("likes")
          .select("*", { count: "exact", head: true })
          .eq("user_id", id);

        setProfile({ ...userData, likes_count: likesCount || 0 });
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProfile();
  }, [id]);

  const renderProfileContent = () => {
    if (!profile) {
      return (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Skeleton className="h-20 w-20 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
              <Skeleton className="h-10 w-10 rounded-md" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-4 w-32" />
            <div className="space-y-4">
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
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={
                    profile.avatar_url ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.id}`
                  }
                />
                <AvatarFallback>
                  {profile.full_name?.charAt(0) || profile.email.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">
                    {profile.full_name || profile.email}
                  </h1>
                  {profile.is_pro && (
                    <Crown className="h-5 w-5 text-yellow-500" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Member since{" "}
                  {new Date(profile.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            {user?.id === profile.id && (
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-red-500" />
            <span>{profile.likes_count} resources liked</span>
          </div>

          <CollectionsGrid userId={profile.id} />
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-[72px] px-6">
        <div className="max-w-4xl mx-auto py-12">{renderProfileContent()}</div>
      </main>
    </div>
  );
};

export default ProfilePage;
