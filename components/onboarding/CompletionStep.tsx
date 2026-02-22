"use client";

import Image from "next/image";
import { ArrowLeft, Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";
import { TMDB_LOGO, TMDB_POSTER_SM } from "@/utils/constants";
import type { StreamingProvider, TMDBSearchResult } from "@/types";

interface CompletionStepProps {
  allProviders: StreamingProvider[];
  selectedProviderIds: string[];
  selectedSeries: TMDBSearchResult[];
  saving: boolean;
  error: string | null;
  onFinish: () => void;
  onBack: () => void;
}

export function CompletionStep({
  allProviders,
  selectedProviderIds,
  selectedSeries,
  saving,
  error,
  onFinish,
  onBack,
}: CompletionStepProps) {
  const selectedProviders = allProviders.filter((p) =>
    selectedProviderIds.includes(p.id)
  );

  return (
    <div className="flex flex-col flex-1 px-4">
      <div className="flex items-center gap-3 mb-1">
        <button onClick={onBack} disabled={saving} className="text-muted p-1 -ml-1">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold text-foreground">
          You&apos;re all set!
        </h1>
      </div>
      <p className="text-sm text-muted mb-6">
        Here&apos;s a summary of your choices.
      </p>

      {/* Streaming services */}
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-foreground mb-2">
          Streaming Services
        </h3>
        <div className="flex flex-wrap gap-2">
          {selectedProviders.map((provider) => (
            <div
              key={provider.id}
              className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-1.5"
            >
              {provider.logo_path ? (
                <Image
                  src={`${TMDB_LOGO}${provider.logo_path}`}
                  alt={provider.name}
                  width={20}
                  height={20}
                  className="rounded"
                />
              ) : null}
              <span className="text-xs text-foreground">
                {provider.tmdb_provider_id === 0 ? "All" : provider.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Favorite series */}
      <div className="mb-6 flex-1">
        <h3 className="text-sm font-semibold text-foreground mb-2">
          Favorite Series
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {selectedSeries.map((series) => (
            <div key={series.id} className="flex flex-col items-center gap-1">
              <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden bg-card border border-border">
                {series.poster_path ? (
                  <Image
                    src={`${TMDB_POSTER_SM}${series.poster_path}`}
                    alt={series.name ?? ""}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-1">
                    <span className="text-[10px] text-muted text-center line-clamp-2">
                      {series.name ?? series.title}
                    </span>
                  </div>
                )}
              </div>
              <span className="text-[10px] text-muted leading-tight text-center line-clamp-1 w-full">
                {series.name ?? series.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Finish button */}
      <div className="py-4">
        {error && (
          <p className="text-sm text-red-400 text-center mb-3">{error}</p>
        )}
        <button
          onClick={onFinish}
          disabled={saving}
          className={cn(
            "w-full py-3 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2",
            saving
              ? "bg-border text-muted cursor-not-allowed"
              : "bg-accent text-white active:bg-accent/80"
          )}
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {saving ? "Setting up your profile..." : "Get Started"}
        </button>
      </div>
    </div>
  );
}
