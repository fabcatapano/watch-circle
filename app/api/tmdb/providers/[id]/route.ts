import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getWatchProviders } from "@/lib/tmdb";
import type { Database } from "@/types/database";

type ProviderInsert = Database["public"]["Tables"]["streaming_providers"]["Insert"];
type MovieProviderInsert = Database["public"]["Tables"]["movie_providers"]["Insert"];

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const tmdbId = Number(id);
  const body = await request.json() as { movieId: string; mediaType: "movie" | "tv"; country?: string };
  const { movieId, mediaType, country = "US" } = body;

  try {
    const watchData = await getWatchProviders(mediaType, tmdbId);
    const countryData = watchData.results[country];
    const flatrate = countryData?.flatrate ?? [];

    if (flatrate.length === 0) {
      // No streaming providers — clear any stale entries
      await supabase
        .from("movie_providers")
        .delete()
        .eq("movie_id", movieId);
      return NextResponse.json({ success: true });
    }

    // Upsert each streaming provider
    const providerInserts: ProviderInsert[] = flatrate.map((p) => ({
      tmdb_provider_id: p.provider_id,
      name: p.provider_name,
      slug: p.provider_name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      logo_path: p.logo_path,
    }));

    const { data: upserted, error: upsertError } = await supabase
      .from("streaming_providers")
      .upsert(providerInserts, { onConflict: "tmdb_provider_id" })
      .select("id, tmdb_provider_id");

    if (upsertError || !upserted) {
      throw new Error(upsertError?.message ?? "Failed to upsert providers");
    }

    // Build a map of tmdb_provider_id -> our provider uuid
    const providerMap = new Map(upserted.map((p) => [p.tmdb_provider_id, p.id]));

    // Replace movie_providers: delete old, insert new
    await supabase
      .from("movie_providers")
      .delete()
      .eq("movie_id", movieId);

    const movieProviders: MovieProviderInsert[] = flatrate
      .map((p) => providerMap.get(p.provider_id))
      .filter((id): id is string => !!id)
      .map((providerId) => ({
        movie_id: movieId,
        provider_id: providerId,
      }));

    if (movieProviders.length > 0) {
      await supabase
        .from("movie_providers")
        .insert(movieProviders);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to sync providers:", err);
    return NextResponse.json({ error: "Failed to sync providers" }, { status: 500 });
  }
}
