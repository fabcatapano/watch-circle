"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Search, Check, ArrowLeft, X } from "lucide-react";
import { cn } from "@/utils/cn";
import { TMDB_POSTER_SM } from "@/utils/constants";
import type { TMDBSearchResult } from "@/types";

interface FavoritesStepProps {
  selectedSeries: TMDBSearchResult[];
  onToggle: (series: TMDBSearchResult) => void;
  onNext: () => void;
  onBack: () => void;
  canAdvance: boolean;
}

export function FavoritesStep({
  selectedSeries,
  onToggle,
  onNext,
  onBack,
  canAdvance,
}: FavoritesStepProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TMDBSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setResults([]);
      setSearching(false);
      return;
    }

    setSearching(true);

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/tmdb/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        const tvOnly = (data.results ?? []).filter(
          (r: TMDBSearchResult) => r.media_type === "tv"
        );
        setResults(tvOnly);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  return (
    <div className="flex flex-col flex-1 px-4 min-h-0">
      <div className="flex items-center gap-3 mb-1">
        <button onClick={onBack} className="text-muted p-1 -ml-1">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold text-foreground">
          Favorite TV series
        </h1>
      </div>
      <p className="text-sm text-muted mb-4">
        Pick at least 3 shows you love. We&apos;ll add them as 5-star ratings.
      </p>

      {/* Selected chips */}
      {selectedSeries.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {selectedSeries.map((s) => (
            <button
              key={s.id}
              onClick={() => onToggle(s)}
              className="flex items-center gap-1 bg-accent/15 text-accent text-xs font-medium px-2.5 py-1 rounded-full"
            >
              {s.name ?? s.title}
              <X className="h-3 w-3" />
            </button>
          ))}
        </div>
      )}

      {/* Search input */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search TV series..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-accent"
        />
      </div>

      {/* Results grid */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {searching && (
          <p className="text-sm text-muted text-center py-8">Searching...</p>
        )}

        {!searching && query && results.length === 0 && (
          <p className="text-sm text-muted text-center py-8">
            No TV series found
          </p>
        )}

        {!searching && !query && selectedSeries.length === 0 && (
          <p className="text-sm text-muted text-center py-8">
            Search for your favorite TV series above
          </p>
        )}

        <div className="grid grid-cols-3 gap-2">
          {results.map((series) => {
            const isSelected = selectedSeries.some((s) => s.id === series.id);
            return (
              <button
                key={series.id}
                onClick={() => onToggle(series)}
                className="relative rounded-lg overflow-hidden aspect-[2/3] bg-card border border-border"
              >
                {series.poster_path ? (
                  <Image
                    src={`${TMDB_POSTER_SM}${series.poster_path}`}
                    alt={series.name ?? ""}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 30vw, 150px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-2">
                    <span className="text-xs text-muted text-center line-clamp-3">
                      {series.name ?? series.title}
                    </span>
                  </div>
                )}
                {isSelected && (
                  <div className="absolute inset-0 bg-accent/40 flex items-center justify-center">
                    <div className="bg-accent rounded-full p-1">
                      <Check className="h-5 w-5 text-white" />
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Continue button */}
      <div className="py-4">
        <button
          onClick={onNext}
          disabled={!canAdvance}
          className={cn(
            "w-full py-3 rounded-xl font-semibold text-sm transition-colors",
            canAdvance
              ? "bg-accent text-white active:bg-accent/80"
              : "bg-border text-muted cursor-not-allowed"
          )}
        >
          Continue ({selectedSeries.length}/3 minimum)
        </button>
      </div>
    </div>
  );
}
