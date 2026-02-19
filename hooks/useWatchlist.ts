"use client";

import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from "@/services/watchlist";

export function useWatchlist(userId: string, movieId: string) {
  const [inWatchlist, setInWatchlist] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const checkWatchlist = useCallback(async () => {
    const result = await isInWatchlist(supabase, userId, movieId);
    setInWatchlist(result);
  }, [supabase, userId, movieId]);

  const toggleWatchlist = useCallback(async () => {
    setLoading(true);
    if (inWatchlist) {
      await removeFromWatchlist(supabase, userId, movieId);
      setInWatchlist(false);
    } else {
      await addToWatchlist(supabase, userId, movieId);
      setInWatchlist(true);
    }
    setLoading(false);
  }, [supabase, userId, movieId, inWatchlist]);

  return { inWatchlist, loading, checkWatchlist, toggleWatchlist };
}
