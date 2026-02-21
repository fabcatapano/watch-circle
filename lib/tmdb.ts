import "server-only";
import type { TMDBSearchResponse, TMDBMovieDetail, TMDBTvDetail, TMDBSeasonDetail, TMDBWatchProvidersResponse } from "@/types/tmdb";

const TMDB_BASE = "https://api.themoviedb.org/3";
const API_KEY = process.env.TMDB_API_KEY!;

async function tmdbFetch<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${TMDB_BASE}${path}`);
  url.searchParams.set("api_key", API_KEY);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`TMDB API error: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

export async function searchMulti(query: string, page = 1): Promise<TMDBSearchResponse> {
  return tmdbFetch<TMDBSearchResponse>("/search/multi", {
    query,
    page: String(page),
    include_adult: "false",
  });
}

export async function getMovieDetails(id: number): Promise<TMDBMovieDetail> {
  return tmdbFetch<TMDBMovieDetail>(`/movie/${id}`);
}

export async function getTvDetails(id: number): Promise<TMDBTvDetail> {
  return tmdbFetch<TMDBTvDetail>(`/tv/${id}`);
}

export async function getTvSeasonEpisodes(tvId: number, seasonNumber: number): Promise<TMDBSeasonDetail> {
  return tmdbFetch<TMDBSeasonDetail>(`/tv/${tvId}/season/${seasonNumber}`);
}

export async function getWatchProviders(mediaType: "movie" | "tv", id: number): Promise<TMDBWatchProvidersResponse> {
  return tmdbFetch<TMDBWatchProvidersResponse>(`/${mediaType}/${id}/watch/providers`);
}
