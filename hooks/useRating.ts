"use client";

import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { upsertRating, deleteRating, getUserRating } from "@/services/ratings";

export function useRating(userId: string, movieId: string) {
  const [score, setScore] = useState(0);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  const loadRating = useCallback(async () => {
    const { data } = await getUserRating(supabase, userId, movieId);
    if (data) {
      setScore(data.score);
      setComment(data.comment || "");
    }
  }, [supabase, userId, movieId]);

  const submitRating = useCallback(async (newScore: number, newComment?: string) => {
    setSaving(true);
    if (newScore === 0) {
      await deleteRating(supabase, userId, movieId);
      setScore(0);
      setComment("");
    } else {
      await upsertRating(supabase, userId, movieId, newScore, newComment ?? comment);
      setScore(newScore);
    }
    setSaving(false);
  }, [supabase, userId, movieId, comment]);

  const removeRating = useCallback(async () => {
    setSaving(true);
    await deleteRating(supabase, userId, movieId);
    setScore(0);
    setComment("");
    setSaving(false);
  }, [supabase, userId, movieId]);

  return { score, comment, setComment, saving, loadRating, submitRating, removeRating };
}
