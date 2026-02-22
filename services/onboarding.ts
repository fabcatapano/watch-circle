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

function fetchWithTimeout(url: string, timeoutMs = 10000): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { signal: controller.signal }).finally(() => clearTimeout(timer));
}

export async function completeOnboarding(
  supabase: Client,
  userId: string,
  providerIds: string[],
  selectedSeries: SelectedSeries[]
): Promise<{ error: { message: string } | null }> {
  // 1. Save streaming subscriptions
  const { error: subError } = await setUserSubscriptions(supabase, userId, providerIds);
  if (subError) return { error: subError };

  // 2. For each selected TV series: fetch details, ensure in DB, create rating
  const results = await Promise.allSettled(
    selectedSeries.map(async (series) => {
      const res = await fetchWithTimeout(`/api/tmdb/tv/${series.id}`);
      if (!res.ok) throw new Error(`Failed to fetch details for ${series.name}`);

      const details: TMDBTvDetail = await res.json();

      const { data: movie, error: movieError } = await ensureMovieExists(
        supabase,
        series.id,
        "tv",
        details
      );
      if (movieError || !movie) throw new Error(`Failed to save ${series.name}`);

      await upsertRating(supabase, userId, movie.id, 5, null);
    })
  );

  // If all series failed, report an error
  const allFailed = results.every((r) => r.status === "rejected");
  if (allFailed) return { error: { message: "Failed to save series. Please try again." } };

  // 3. Mark onboarding as completed
  const { error: profileError } = await updateProfile(supabase, userId, {
    onboarding_completed: true,
  });

  return { error: profileError };
}
