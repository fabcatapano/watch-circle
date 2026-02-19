import Image from "next/image";
import Link from "next/link";
import { TMDB_POSTER_SM } from "@/utils/constants";
import type { EpisodeWithShow } from "@/types";

interface EpisodeRowProps {
  episode: EpisodeWithShow;
}

export function EpisodeRow({ episode }: EpisodeRowProps) {
  const show = episode.movies;
  const href = `/movie/tv-${show.tmdb_id}`;
  const episodeLabel = `S${String(episode.season_number).padStart(2, "0")}E${String(episode.episode_number).padStart(2, "0")}`;

  return (
    <Link
      href={href}
      className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border hover:bg-card-hover transition-colors"
    >
      <div className="relative h-14 w-10 flex-shrink-0 overflow-hidden rounded bg-border">
        {show.poster_path ? (
          <Image
            src={`${TMDB_POSTER_SM}${show.poster_path}`}
            alt={show.title}
            fill
            sizes="40px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[8px] text-muted">
            {show.title}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{show.title}</p>
        <p className="text-xs text-muted">
          {episodeLabel}
          {episode.name && ` · ${episode.name}`}
        </p>
      </div>
      {episode.air_date && (
        <span className="text-xs text-muted flex-shrink-0">
          {episode.air_date}
        </span>
      )}
    </Link>
  );
}
