export interface TMDBSearchResult {
  id: number;
  media_type: "movie" | "tv" | "person";
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  genre_ids: number[];
}

export interface TMDBSearchResponse {
  page: number;
  results: TMDBSearchResult[];
  total_pages: number;
  total_results: number;
}

export interface TMDBGenre {
  id: number;
  name: string;
}

export interface TMDBMovieDetail {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  genres: TMDBGenre[];
  runtime: number | null;
  tagline: string | null;
  status: string;
}

export interface TMDBTvDetail {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  genres: TMDBGenre[];
  episode_run_time: number[];
  number_of_seasons: number;
  number_of_episodes: number;
  status: string;
  tagline: string | null;
  seasons: TMDBSeason[];
}

export interface TMDBSeason {
  id: number;
  season_number: number;
  name: string;
  episode_count: number;
  air_date: string | null;
  poster_path: string | null;
}

export interface TMDBEpisode {
  id: number;
  season_number: number;
  episode_number: number;
  name: string;
  overview: string;
  air_date: string | null;
  still_path: string | null;
  runtime: number | null;
  vote_average: number;
}

export interface TMDBSeasonDetail {
  id: number;
  season_number: number;
  episodes: TMDBEpisode[];
}
