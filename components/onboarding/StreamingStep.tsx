"use client";

import Image from "next/image";
import { Tv } from "lucide-react";
import { cn } from "@/utils/cn";
import { TMDB_LOGO } from "@/utils/constants";
import type { StreamingProvider } from "@/types";

interface StreamingStepProps {
  allProviders: StreamingProvider[];
  selectedIds: string[];
  onToggle: (provider: StreamingProvider) => void;
  onNext: () => void;
  canAdvance: boolean;
}

export function StreamingStep({
  allProviders,
  selectedIds,
  onToggle,
  onNext,
  canAdvance,
}: StreamingStepProps) {
  // "All" first (tmdb_provider_id = 0), then alphabetical
  const sorted = [...allProviders].sort((a, b) => {
    if (a.tmdb_provider_id === 0) return -1;
    if (b.tmdb_provider_id === 0) return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="flex flex-col flex-1 px-4">
      <h1 className="text-2xl font-bold text-foreground mb-1">
        Your streaming services
      </h1>
      <p className="text-sm text-muted mb-6">
        Select the services you subscribe to. We&apos;ll use this to filter your feed.
      </p>

      <div className="grid grid-cols-4 gap-2 flex-1 content-start overflow-y-auto">
        {sorted.map((provider) => {
          const isSelected = selectedIds.includes(provider.id);
          return (
            <button
              key={provider.id}
              onClick={() => onToggle(provider)}
              className={cn(
                "flex flex-col items-center gap-1.5 rounded-lg p-2 transition-colors border",
                isSelected
                  ? "border-accent bg-accent/10"
                  : "border-transparent hover:bg-card-hover"
              )}
            >
              <ProviderIcon provider={provider} />
              <span className="text-[10px] text-muted leading-tight text-center line-clamp-1">
                {provider.tmdb_provider_id === 0 ? "All" : provider.name}
              </span>
            </button>
          );
        })}
      </div>

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
          Continue
        </button>
      </div>
    </div>
  );
}

function ProviderIcon({ provider }: { provider: StreamingProvider }) {
  if (provider.tmdb_provider_id === 0) {
    return (
      <div className="h-10 w-10 rounded-lg bg-muted/20 flex items-center justify-center">
        <Tv className="h-5 w-5 text-muted" />
      </div>
    );
  }

  if (provider.logo_path) {
    return (
      <Image
        src={`${TMDB_LOGO}${provider.logo_path}`}
        alt={provider.name}
        width={40}
        height={40}
        className="rounded-lg"
      />
    );
  }

  return (
    <div className="h-10 w-10 rounded-lg bg-muted/20 flex items-center justify-center text-sm font-bold text-muted">
      {provider.name.charAt(0)}
    </div>
  );
}
