"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { getFriendsFeed } from "@/services/ratings";
import type { RatingWithDetails } from "@/types";

export function useFeed(userId: string) {
  const [items, setItems] = useState<RatingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchFeed = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await getFriendsFeed(supabase, userId);
    if (error) {
      setError(error.message);
    } else {
      setItems((data as unknown as RatingWithDetails[]) ?? []);
    }
    setLoading(false);
  }, [supabase, userId]);

  useEffect(() => {
    fetchFeed();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { items, loading, error, refetch: fetchFeed };
}
