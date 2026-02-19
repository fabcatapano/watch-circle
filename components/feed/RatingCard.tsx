"use client";

import Image from "next/image";
import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { StarRating } from "@/components/movie/StarRating";
import { Card } from "@/components/ui/Card";
import { TMDB_POSTER_SM } from "@/utils/constants";
import { relativeTime } from "@/utils/formatDate";
import type { RatingWithDetails } from "@/types";

interface RatingCardProps {
  rating: RatingWithDetails;
}

export function RatingCard({ rating }: RatingCardProps) {
  const movie = rating.movies;
  const profile = rating.profiles;
  const href = `/movie/${movie.media_type}-${movie.tmdb_id}`;

  return (
    <Card className="p-4">
      <div className="flex items-center gap-3 mb-3">
        <Avatar
          src={profile.avatar_url}
          username={profile.username}
          size="sm"
        />
        <div className="flex-1">
          <span className="text-sm font-medium text-foreground">
            {profile.display_name || profile.username}
          </span>
          <span className="text-xs text-muted ml-2">
            {relativeTime(rating.created_at)}
          </span>
        </div>
      </div>

      <Link href={href} className="flex gap-3">
        <div className="relative h-24 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-card">
          {movie.poster_path ? (
            <Image
              src={`${TMDB_POSTER_SM}${movie.poster_path}`}
              alt={movie.title}
              fill
              sizes="64px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-[10px] text-muted p-1 text-center">
              {movie.title}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-foreground truncate">
            {movie.title}
          </h3>
          <div className="mt-1">
            <StarRating value={rating.score} size="sm" />
          </div>
          {rating.comment && (
            <p className="mt-1.5 text-sm text-muted line-clamp-2">
              {rating.comment}
            </p>
          )}
        </div>
      </Link>
    </Card>
  );
}
