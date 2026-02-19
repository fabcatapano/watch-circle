"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { getProfile } from "@/services/profiles";
import { getUserRatings } from "@/services/ratings";
import type { Profile, Rating, Movie } from "@/types";

type RatingWithMovie = Rating & { movies: Movie };

export function useProfile(userId: string) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [ratings, setRatings] = useState<RatingWithMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    const [profileRes, ratingsRes] = await Promise.all([
      getProfile(supabase, userId),
      getUserRatings(supabase, userId),
    ]);
    if (profileRes.data) setProfile(profileRes.data);
    if (ratingsRes.data) setRatings(ratingsRes.data as unknown as RatingWithMovie[]);
    setLoading(false);
  }, [supabase, userId]);

  useEffect(() => {
    fetchProfile();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { profile, ratings, loading, refetch: fetchProfile };
}
