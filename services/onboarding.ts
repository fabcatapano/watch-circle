import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import type { TMDBTvDetail } from "@/types/tmdb";
import { setUserSubscriptions } from "@/services/subscriptions";
import { ensureMovieExists } from "@/services/movies";
import { upsertRating } from "@/services/ratings";
import { updateProfile } from "@/services/profiles";

type Client = SupabaseClient<Database>;

interface SelectedSeries {
  id: number;
  name: string;
  poster_path: string | null;
}

export async function completeOnboarding(
  supabase: Client,
  userId: string,
  providerIds: string[],
  selectedSeries: SelectedSeries[]
) {
  // 1. Save streaming subscriptions
  const { error: subError } = await setUserSubscriptions(supabase, userId, providerIds);
  if (subError) return { error: subError };

  // 2. For each selected TV series: fetch details, ensure in DB, create rating
  for (const series of selectedSeries) {
    const res = await fetch(`/api/tmdb/tv/${series.id}`);
    if (!res.ok) continue;

    const details: TMDBTvDetail = await res.json();

    const { data: movie, error: movieError } = await ensureMovieExists(
      supabase,
      series.id,
      "tv",
      details
    );
    if (movieError || !movie) continue;

    await upsertRating(supabase, userId, movie.id, 5, null);
  }

  // 3. Mark onboarding as completed
  const { error: profileError } = await updateProfile(supabase, userId, {
    onboarding_completed: true,
  });

  return { error: profileError };
}
