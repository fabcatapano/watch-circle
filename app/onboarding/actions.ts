"use server";

import { createClient } from "@/lib/supabase/server";
import { getTvDetails } from "@/lib/tmdb";
import { ensureMovieExists } from "@/services/movies";
import { upsertRating } from "@/services/ratings";
import { setUserSubscriptions } from "@/services/subscriptions";
import { updateProfile } from "@/services/profiles";

interface SelectedSeries {
  id: number;
  name: string;
  poster_path: string | null;
}

export async function completeOnboardingAction(
  providerIds: string[],
  selectedSeries: SelectedSeries[]
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated. Please refresh and try again." };
  }

  // 1. Save streaming subscriptions
  const { error: subError } = await setUserSubscriptions(
    supabase,
    user.id,
    providerIds
  );
  if (subError) {
    console.error("[onboarding] setUserSubscriptions failed:", subError);
    return { error: "Failed to save streaming services." };
  }

  // 2. For each selected TV series: fetch TMDB details, save to DB, create rating
  const results = await Promise.allSettled(
    selectedSeries.map(async (series) => {
      const details = await getTvDetails(series.id);

      const { data: movie, error: movieError } = await ensureMovieExists(
        supabase,
        series.id,
        "tv",
        details
      );
      if (movieError || !movie) {
        console.error("[onboarding] ensureMovieExists failed:", movieError);
        throw new Error(`Failed to save ${series.name}`);
      }

      const { error: ratingError } = await upsertRating(
        supabase,
        user.id,
        movie.id,
        5,
        null
      );
      if (ratingError) {
        console.error("[onboarding] upsertRating failed:", ratingError);
        throw new Error(`Failed to rate ${series.name}`);
      }
    })
  );

  const rejected = results.filter(
    (r) => r.status === "rejected"
  ) as PromiseRejectedResult[];

  if (rejected.length === results.length) {
    const reason = rejected[0]?.reason?.message || "Failed to save series.";
    console.error("[onboarding] all series failed:", rejected.map((r) => r.reason?.message));
    return { error: reason };
  }

  // 3. Mark onboarding as completed
  const { error: profileError } = await updateProfile(supabase, user.id, {
    onboarding_completed: true,
  });
  if (profileError) {
    console.error("[onboarding] updateProfile failed:", profileError);
    return { error: "Failed to complete setup." };
  }

  return { error: null };
}
