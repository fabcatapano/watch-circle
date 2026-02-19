"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { ensureMovieExists } from "@/services/movies";
import { upsertRating, getUserRating, deleteRating } from "@/services/ratings";
import { followShow, unfollowShow, isFollowing } from "@/services/follows";
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from "@/services/watchlist";
import { syncEpisodesFromTMDB } from "@/services/episodes";
import { StarRating } from "./StarRating";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { TMDB_POSTER_LG, TMDB_BACKDROP } from "@/utils/constants";
import { yearOnly, relativeTime } from "@/utils/formatDate";
import { Heart, HeartOff, Bookmark, BookmarkMinus } from "lucide-react";
import type { TMDBMovieDetail, TMDBTvDetail } from "@/types/tmdb";
import type { Movie, RatingWithDetails } from "@/types";

interface MovieDetailProps {
  tmdbId: number;
  mediaType: "movie" | "tv";
  details: TMDBMovieDetail | TMDBTvDetail;
  userId: string;
  friendRatings: RatingWithDetails[];
}

export function MovieDetail({ tmdbId, mediaType, details, userId, friendRatings }: MovieDetailProps) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [score, setScore] = useState(0);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);
  const [following, setFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState(false);
  const supabase = createClient();

  const title = "title" in details ? details.title : details.name;
  const releaseDate = "release_date" in details ? details.release_date : details.first_air_date;
  const runtime = "runtime" in details ? details.runtime : details.episode_run_time?.[0];
  const tagline = details.tagline;

  const initMovie = useCallback(async () => {
    const { data } = await ensureMovieExists(supabase, tmdbId, mediaType, details);
    if (data) {
      setMovie(data);
      const { data: rating } = await getUserRating(supabase, userId, data.id);
      if (rating) {
        setScore(rating.score);
        setComment(rating.comment || "");
      }
      if (mediaType === "tv") {
        const isFollow = await isFollowing(supabase, userId, data.id);
        setFollowing(isFollow);
      }
      const watchlisted = await isInWatchlist(supabase, userId, data.id);
      setInWatchlist(watchlisted);
    }
  }, [supabase, tmdbId, mediaType, details, userId]);

  useEffect(() => {
    initMovie();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRate = async (newScore: number) => {
    if (!movie) return;
    setScore(newScore);
    setSaving(true);

    if (newScore === 0) {
      await deleteRating(supabase, userId, movie.id);
    } else {
      await upsertRating(supabase, userId, movie.id, newScore, comment || null);
    }
    setSaving(false);
  };

  const handleComment = async () => {
    if (!movie || score === 0) return;
    setSaving(true);
    await upsertRating(supabase, userId, movie.id, score, comment || null);
    setSaving(false);
  };

  const handleWatchlist = async () => {
    if (!movie) return;
    setWatchlistLoading(true);
    if (inWatchlist) {
      await removeFromWatchlist(supabase, userId, movie.id);
      setInWatchlist(false);
    } else {
      await addToWatchlist(supabase, userId, movie.id);
      setInWatchlist(true);
    }
    setWatchlistLoading(false);
  };

  const handleFollow = async () => {
    if (!movie) return;
    setFollowLoading(true);
    if (following) {
      await unfollowShow(supabase, userId, movie.id);
      setFollowing(false);
    } else {
      await followShow(supabase, userId, movie.id);
      // Sync episodes when following
      if ("number_of_seasons" in details) {
        await syncEpisodesFromTMDB(movie.id, tmdbId, details.number_of_seasons);
      }
      setFollowing(true);
    }
    setFollowLoading(false);
  };

  return (
    <div>
      {/* Backdrop */}
      {details.backdrop_path && (
        <div className="relative h-56 w-full">
          <Image
            src={`${TMDB_BACKDROP}${details.backdrop_path}`}
            alt={title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>
      )}

      <div className="px-4 -mt-16 relative z-10">
        <div className="flex gap-4">
          {/* Poster */}
          <div className="relative h-48 w-32 flex-shrink-0 overflow-hidden rounded-lg shadow-lg">
            {details.poster_path ? (
              <Image
                src={`${TMDB_POSTER_LG}${details.poster_path}`}
                alt={title}
                fill
                sizes="128px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-card text-sm text-muted">
                {title}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 pt-18">
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            <div className="mt-1 flex items-center gap-2 text-sm text-muted">
              {yearOnly(releaseDate) && <span>{yearOnly(releaseDate)}</span>}
              {runtime && <span>{runtime} min</span>}
              <span className="capitalize">{mediaType}</span>
            </div>
            {tagline && (
              <p className="mt-1 text-sm italic text-muted">{tagline}</p>
            )}
          </div>
        </div>

        {/* Genres */}
        {details.genres.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {details.genres.map((g) => (
              <span
                key={g.id}
                className="rounded-full bg-card border border-border px-3 py-1 text-xs text-muted"
              >
                {g.name}
              </span>
            ))}
          </div>
        )}

        {/* Overview */}
        <p className="mt-4 text-sm text-muted leading-relaxed">{details.overview}</p>

        {/* Watchlist button */}
        {movie && (
          <Button
            variant={inWatchlist ? "secondary" : "primary"}
            className="mt-4 w-full"
            onClick={handleWatchlist}
            disabled={watchlistLoading}
          >
            {inWatchlist ? (
              <>
                <BookmarkMinus className="h-4 w-4 mr-2" />
                Remove from Watchlist
              </>
            ) : (
              <>
                <Bookmark className="h-4 w-4 mr-2" />
                Add to Watchlist
              </>
            )}
          </Button>
        )}

        {/* Follow button for TV */}
        {mediaType === "tv" && movie && (
          <Button
            variant={following ? "secondary" : "primary"}
            className="mt-4 w-full"
            onClick={handleFollow}
            disabled={followLoading}
          >
            {following ? (
              <>
                <HeartOff className="h-4 w-4 mr-2" />
                Unfollow Series
              </>
            ) : (
              <>
                <Heart className="h-4 w-4 mr-2" />
                Follow Series
              </>
            )}
          </Button>
        )}

        {/* Rating section */}
        <div className="mt-6 p-4 bg-card rounded-xl border border-border">
          <h3 className="text-sm font-semibold text-foreground mb-3">Your Rating</h3>
          <div className="flex justify-center">
            <StarRating value={score} onChange={handleRate} interactive size="lg" />
          </div>
          {score > 0 && (
            <div className="mt-3">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment (optional)"
                className="w-full rounded-lg border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted/60 focus:border-accent focus:outline-none resize-none"
                rows={2}
              />
              <Button
                variant="secondary"
                size="sm"
                className="mt-2"
                onClick={handleComment}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Comment"}
              </Button>
            </div>
          )}
        </div>

        {/* Friend ratings */}
        {friendRatings.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Friends&apos; Ratings
            </h3>
            <div className="space-y-3">
              {friendRatings.map((r) => (
                <div
                  key={r.id}
                  className="flex items-start gap-3 p-3 bg-card rounded-xl border border-border"
                >
                  <Avatar
                    src={r.profiles.avatar_url}
                    username={r.profiles.username}
                    size="sm"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">
                        {r.profiles.display_name || r.profiles.username}
                      </span>
                      <StarRating value={r.score} size="sm" />
                    </div>
                    {r.comment && (
                      <p className="mt-1 text-sm text-muted">{r.comment}</p>
                    )}
                    <p className="mt-1 text-xs text-muted/60">
                      {relativeTime(r.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
