import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

type Client = SupabaseClient<Database>;

export async function syncMovieProviders(
  movieId: string,
  tmdbId: number,
  mediaType: "movie" | "tv"
) {
  const res = await fetch(`/api/tmdb/providers/${tmdbId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ movieId, mediaType }),
  });
  return res.ok;
}

export async function getMovieProviders(supabase: Client, movieId: string) {
  const { data, error } = await supabase
    .from("movie_providers")
    .select("*, streaming_providers(*)")
    .eq("movie_id", movieId);

  if (error || !data) {
    return { data: [], error };
  }

  const providers = data
    .map((mp) => mp.streaming_providers)
    .filter((p): p is NonNullable<typeof p> => p !== null);

  return { data: providers, error: null };
}
