"use client";

import Image from "next/image";
import Link from "next/link";
import { TMDB_POSTER_SM } from "@/utils/constants";
import type { TMDBSearchResult } from "@/types/tmdb";

interface PosterCardProps {
  item: TMDBSearchResult;
}

export function PosterCard({ item }: PosterCardProps) {
  const title = item.title || item.name || "Unknown";
  const year = (item.release_date || item.first_air_date || "").slice(0, 4);
  const href = `/movie/${item.media_type}-${item.id}`;

  return (
    <Link href={href} className="group">
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-card">
        {item.poster_path ? (
          <Image
            src={`${TMDB_POSTER_SM}${item.poster_path}`}
            alt={title}
            fill
            sizes="(max-width: 640px) 33vw, 200px"
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted text-sm p-2 text-center">
            {title}
          </div>
        )}
      </div>
      <div className="mt-1.5 px-0.5">
        <p className="text-sm font-medium text-foreground truncate">{title}</p>
        {year && <p className="text-xs text-muted">{year}</p>}
      </div>
    </Link>
  );
}
