import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

type Client = SupabaseClient<Database>;

const ALL_PROVIDERS_TMDB_ID = 0;

export async function getAllProviders(supabase: Client) {
  const { data, error } = await supabase
    .from("streaming_providers")
    .select("*")
    .order("tmdb_provider_id", { ascending: true });

  return { data: data ?? [], error };
}

export async function getUserSubscribedProviderIds(supabase: Client, userId: string) {
  const { data, error } = await supabase
    .from("user_streaming_providers")
    .select("provider_id")
    .eq("user_id", userId);

  if (error || !data) return [];
  return data.map((row) => row.provider_id);
}

export async function setUserSubscriptions(
  supabase: Client,
  userId: string,
  providerIds: string[]
) {
  // Delete all existing subscriptions
  const { error: deleteError } = await supabase
    .from("user_streaming_providers")
    .delete()
    .eq("user_id", userId);

  if (deleteError) return { error: deleteError };

  // Insert new set
  if (providerIds.length === 0) return { error: null };

  const rows = providerIds.map((provider_id) => ({
    user_id: userId,
    provider_id,
  }));

  const { error: insertError } = await supabase
    .from("user_streaming_providers")
    .insert(rows);

  return { error: insertError };
}

export async function getFilteredMovieIds(
  supabase: Client,
  userId: string
): Promise<string[] | null> {
  // Get user's subscribed providers with their tmdb_provider_id
  const { data: subs } = await supabase
    .from("user_streaming_providers")
    .select("provider_id, streaming_providers(tmdb_provider_id)")
    .eq("user_id", userId);

  // No subscriptions → no filtering
  if (!subs || subs.length === 0) return null;

  // Check if "All" is selected (tmdb_provider_id = 0)
  const hasAll = subs.some((s) => {
    const provider = s.streaming_providers as unknown as { tmdb_provider_id: number } | null;
    return provider?.tmdb_provider_id === ALL_PROVIDERS_TMDB_ID;
  });

  if (hasAll) return null;

  // Get provider UUIDs
  const providerIds = subs.map((s) => s.provider_id);

  // Find movies available on those providers
  const { data: movieProviders } = await supabase
    .from("movie_providers")
    .select("movie_id")
    .in("provider_id", providerIds);

  if (!movieProviders || movieProviders.length === 0) return [];

  // Deduplicate movie IDs
  const movieIds = [...new Set(movieProviders.map((mp) => mp.movie_id))];
  return movieIds;
}
