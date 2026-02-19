"use client";

import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { followShow, unfollowShow, isFollowing } from "@/services/follows";

export function useFollows(userId: string, movieId: string) {
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const checkFollow = useCallback(async () => {
    const result = await isFollowing(supabase, userId, movieId);
    setFollowing(result);
  }, [supabase, userId, movieId]);

  const toggleFollow = useCallback(async () => {
    setLoading(true);
    if (following) {
      await unfollowShow(supabase, userId, movieId);
      setFollowing(false);
    } else {
      await followShow(supabase, userId, movieId);
      setFollowing(true);
    }
    setLoading(false);
  }, [supabase, userId, movieId, following]);

  return { following, loading, checkFollow, toggleFollow };
}
