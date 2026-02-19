export type { Database, Json } from "./database";
export type { TMDBSearchResult, TMDBSearchResponse, TMDBMovieDetail, TMDBTvDetail, TMDBEpisode, TMDBSeason } from "./tmdb";

import type { Database } from "./database";

// Convenience row types
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Movie = Database["public"]["Tables"]["movies"]["Row"];
export type Rating = Database["public"]["Tables"]["ratings"]["Row"];
export type Friendship = Database["public"]["Tables"]["friendships"]["Row"];
export type Follow = Database["public"]["Tables"]["follows"]["Row"];
export type Watchlist = Database["public"]["Tables"]["watchlist"]["Row"];
export type Episode = Database["public"]["Tables"]["episodes"]["Row"];
export type Notification = Database["public"]["Tables"]["notifications"]["Row"];

// Composite types for UI
export type RatingWithDetails = Rating & {
  profiles: Profile;
  movies: Movie;
};

export type FriendshipWithProfile = Friendship & {
  profiles: Profile;
};

export type WatchlistWithMovie = Watchlist & {
  movies: Movie;
};

export type EpisodeWithShow = Episode & {
  movies: Movie;
};
