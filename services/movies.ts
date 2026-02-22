import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import type { TMDBMovieDetail, TMDBTvDetail } from "@/types/tmdb";

type Client = SupabaseClient<Database>;

export async function ensureMovieExists(
  supabase: Client,
  tmdbId: number,
  mediaType: "movie" | "tv",
  details: TMDBMovieDetail | TMDBTvDetail
) {
  const title = "title" in details ? details.title : details.name;
  const releaseDate = "release_date" in details ? details.release_date : details.first_air_date;
  const runtime = "runtime" in details ? details.runtime : details.episode_run_time?.[0] ?? null;
  const numberOfSeasons = "number_of_seasons" in details ? details.number_of_seasons : null;

  const { data, error } = await supabase
    .from("movies")
    .upsert(
      {
        tmdb_id: tmdbId,
        media_type: mediaType,
        title,
        overview: details.overview,
        poster_path: details.poster_path,
        backdrop_path: details.backdrop_path,
        release_date: releaseDate,
        vote_average: details.vote_average,
        genres: details.genres?.map((g) => g.name) ?? [],
        runtime,
        number_of_seasons: numberOfSeasons,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "tmdb_id" }
    )
    .select()
    .single();

  return { data, error };
}

export async function getMovieByTmdbId(supabase: Client, tmdbId: number) {
  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .eq("tmdb_id", tmdbId)
    .single();
  return { data, error };
}

export async function getMovieById(supabase: Client, movieId: string) {
  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .eq("id", movieId)
    .single();
  return { data, error };
}
