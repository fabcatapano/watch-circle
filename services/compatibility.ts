import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

type Client = SupabaseClient<Database>;

interface CompatibilityResult {
  score: number;
  commonCount: number;
}

export async function calculateCompatibility(
  supabase: Client,
  userA: string,
  userB: string
): Promise<CompatibilityResult> {
  // Get all ratings for both users
  const [{ data: ratingsA }, { data: ratingsB }] = await Promise.all([
    supabase.from("ratings").select("movie_id, score").eq("user_id", userA),
    supabase.from("ratings").select("movie_id, score").eq("user_id", userB),
  ]);

  if (!ratingsA || !ratingsB) {
    return { score: 0, commonCount: 0 };
  }

  // Build a map of userB's ratings
  const bMap = new Map(ratingsB.map((r) => [r.movie_id, r.score]));

  // Find common movies
  const commonRatings: Array<{ scoreA: number; scoreB: number }> = [];
  for (const ratingA of ratingsA) {
    const scoreB = bMap.get(ratingA.movie_id);
    if (scoreB !== undefined) {
      commonRatings.push({ scoreA: ratingA.score, scoreB });
    }
  }

  if (commonRatings.length === 0) {
    return { score: 0, commonCount: 0 };
  }

  // Calculate compatibility: (maxDiff - actualDiff) / maxDiff * 100
  const maxDiff = 4; // max difference between 1 and 5
  const totalDiff = commonRatings.reduce(
    (sum, { scoreA, scoreB }) => sum + Math.abs(scoreA - scoreB),
    0
  );
  const avgDiff = totalDiff / commonRatings.length;
  const score = Math.round(((maxDiff - avgDiff) / maxDiff) * 100);

  return { score, commonCount: commonRatings.length };
}
