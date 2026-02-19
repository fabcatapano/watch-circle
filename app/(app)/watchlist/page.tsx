"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bookmark } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { getWatchlist } from "@/services/watchlist";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { TMDB_POSTER_SM } from "@/utils/constants";
import type { WatchlistWithMovie } from "@/types";

export default function WatchlistPage() {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<WatchlistWithMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (authLoading || !user) return;
    (async () => {
      const { data } = await getWatchlist(supabase, user.id);
      if (data) setItems(data as WatchlistWithMovie[]);
      setLoading(false);
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user]);

  if (authLoading || loading) {
    return (
      <div className="px-4 py-4">
        <h2 className="text-xl font-bold text-foreground mb-4">My Watchlist</h2>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[2/3] rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-4">
      <h2 className="text-xl font-bold text-foreground mb-4">My Watchlist</h2>
      {items.length > 0 ? (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/movie/${item.movies.media_type}-${item.movies.tmdb_id}`}
            >
              <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-card">
                {item.movies.poster_path ? (
                  <Image
                    src={`${TMDB_POSTER_SM}${item.movies.poster_path}`}
                    alt={item.movies.title}
                    fill
                    sizes="(max-width: 640px) 33vw, 200px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[10px] text-muted p-1 text-center">
                    {item.movies.title}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Bookmark}
          title="Your watchlist is empty"
          description="Save movies and shows to watch later!"
          actionLabel="Search"
          onAction={() => router.push("/search")}
        />
      )}
    </div>
  );
}
