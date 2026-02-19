export const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";
export const TMDB_POSTER_SM = `${TMDB_IMAGE_BASE}/w342`;
export const TMDB_POSTER_LG = `${TMDB_IMAGE_BASE}/w500`;
export const TMDB_BACKDROP = `${TMDB_IMAGE_BASE}/w1280`;
export const TMDB_STILL = `${TMDB_IMAGE_BASE}/w300`;

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  FEED: "/feed",
  SEARCH: "/search",
  CALENDAR: "/calendar",
  FRIENDS: "/friends",
  PROFILE: "/profile",
  WATCHLIST: "/watchlist",
  NOTIFICATIONS: "/notifications",
  MOVIE: (id: string) => `/movie/${id}`,
} as const;
