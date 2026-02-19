import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getTvSeasonEpisodes } from "@/lib/tmdb";
import type { Database } from "@/types/database";

type EpisodeInsert = Database["public"]["Tables"]["episodes"]["Insert"];

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
  const body = await request.json() as { movieId: string; numberOfSeasons: number };
  const { movieId, numberOfSeasons } = body;

  try {
    for (let season = 1; season <= numberOfSeasons; season++) {
      const seasonData = await getTvSeasonEpisodes(tmdbId, season);

      if (seasonData.episodes) {
        const episodes: EpisodeInsert[] = seasonData.episodes.map((ep) => ({
          movie_id: movieId,
          season_number: ep.season_number,
          episode_number: ep.episode_number,
          name: ep.name,
          overview: ep.overview,
          air_date: ep.air_date,
          still_path: ep.still_path,
          runtime: ep.runtime,
        }));

        // Upsert episodes
        await supabase
          .from("episodes")
          .upsert(episodes, {
            onConflict: "movie_id,season_number,episode_number",
          });
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to sync episodes" }, { status: 500 });
  }
}
