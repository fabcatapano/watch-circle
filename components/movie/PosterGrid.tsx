"use client";

import type { TMDBSearchResult } from "@/types/tmdb";
import { PosterCard } from "./PosterCard";

interface PosterGridProps {
  items: TMDBSearchResult[];
}

export function PosterGrid({ items }: PosterGridProps) {
  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
      {items.map((item) => (
        <PosterCard key={`${item.media_type}-${item.id}`} item={item} />
      ))}
    </div>
  );
}
