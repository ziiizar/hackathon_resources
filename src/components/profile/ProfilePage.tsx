import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/components/auth";
import { supabase } from "@/lib/supabase";
import Header from "../Header";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Heart, Settings, Crown } from "lucide-react";

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return <div>Profile not found</div>;
  }

  const isOwnProfile = user?.id === profile.id;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-[72px] px-6">
        <div className="max-w-4xl mx-auto py-12">
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
                {isOwnProfile && (
                  <Button variant="outline" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-500" />
                <span>{profile.likes_count} resources liked</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
