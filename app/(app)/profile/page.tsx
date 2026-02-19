"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { LogOut, Film, User, Bookmark, ChevronRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { createClient } from "@/lib/supabase/client";
import { signOut } from "@/services/auth";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StarRating } from "@/components/movie/StarRating";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { TMDB_POSTER_SM } from "@/utils/constants";

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  if (authLoading || !user) {
    return (
      <div className="px-4 py-4 space-y-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>
    );
  }

  return <ProfileContent userId={user.id} supabase={supabase} router={router} />;
}

function ProfileContent({
  userId,
  supabase,
  router,
}: {
  userId: string;
  supabase: ReturnType<typeof createClient>;
  router: ReturnType<typeof useRouter>;
}) {
  const { profile, ratings, loading } = useProfile(userId);

  const handleSignOut = async () => {
    await signOut(supabase);
    router.push("/login");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="px-4 py-4 space-y-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>
    );
  }

  const avgRating =
    ratings.length > 0
      ? (ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length).toFixed(1)
      : "—";

  return (
    <div className="px-4 py-4">
      {/* Profile header */}
      <div className="flex items-center gap-4">
        <Avatar
          src={profile?.avatar_url}
          username={profile?.username ?? "?"}
          size="lg"
        />
        <div>
          <h2 className="text-xl font-bold text-foreground">
            {profile?.display_name || profile?.username}
          </h2>
          <p className="text-sm text-muted">@{profile?.username}</p>
        </div>
      </div>

      {profile?.bio && (
        <p className="mt-3 text-sm text-muted">{profile.bio}</p>
      )}

      {/* Stats */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-foreground">{ratings.length}</p>
          <p className="text-xs text-muted">Ratings</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-foreground">{avgRating}</p>
          <p className="text-xs text-muted">Avg Rating</p>
        </Card>
      </div>

      {/* Watchlist link */}
      <Link href="/watchlist" className="mt-4 flex items-center justify-between p-4 bg-card rounded-xl border border-border">
        <div className="flex items-center gap-3">
          <Bookmark className="h-5 w-5 text-muted" />
          <span className="text-sm font-medium text-foreground">My Watchlist</span>
        </div>
        <ChevronRight className="h-4 w-4 text-muted" />
      </Link>

      {/* Rated movies */}
      <h3 className="mt-6 text-sm font-semibold text-foreground mb-3">Rated Movies</h3>
      {ratings.length > 0 ? (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {ratings.map((r) => (
            <Link
              key={r.id}
              href={`/movie/${r.movies.media_type}-${r.movies.tmdb_id}`}
            >
              <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-card">
                {r.movies.poster_path ? (
                  <Image
                    src={`${TMDB_POSTER_SM}${r.movies.poster_path}`}
                    alt={r.movies.title}
                    fill
                    sizes="(max-width: 640px) 33vw, 200px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[10px] text-muted p-1 text-center">
                    {r.movies.title}
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-1.5">
                  <StarRating value={r.score} size="sm" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Film}
          title="No ratings yet"
          description="Search for movies and rate them!"
          actionLabel="Search"
          onAction={() => router.push("/search")}
        />
      )}

      {/* Sign out */}
      <Button
        variant="ghost"
        className="mt-8 w-full text-danger"
        onClick={handleSignOut}
      >
        <LogOut className="h-4 w-4 mr-2" />
        Sign Out
      </Button>
    </div>
  );
}
