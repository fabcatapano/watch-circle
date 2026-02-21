"use client";

import Image from "next/image";
import { Tv } from "lucide-react";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/utils/cn";
import { TMDB_LOGO } from "@/utils/constants";
import type { StreamingProvider } from "@/types";

export function StreamingSubscriptions({ userId }: { userId: string }) {
  const { allProviders, selectedIds, loading, saveSubscriptions } =
    useSubscriptions(userId);

  if (loading) {
    return (
      <div className="mt-4 bg-card rounded-xl border border-border p-4">
        <Skeleton className="h-4 w-40 mb-3" />
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (allProviders.length === 0) return null;

  // "All" first (tmdb_provider_id = 0), then alphabetical
  const sorted = [...allProviders].sort((a, b) => {
    if (a.tmdb_provider_id === 0) return -1;
    if (b.tmdb_provider_id === 0) return 1;
    return a.name.localeCompare(b.name);
  });

  const allProvider = sorted.find((p) => p.tmdb_provider_id === 0);

  const handleToggle = (provider: StreamingProvider) => {
    const isAll = provider.tmdb_provider_id === 0;
    const isSelected = selectedIds.includes(provider.id);

    let next: string[];
    if (isAll) {
      // Toggle "All": if already selected, clear everything; otherwise select only "All"
      next = isSelected ? [] : [provider.id];
    } else if (isSelected) {
      // Deselect this provider
      next = selectedIds.filter((id) => id !== provider.id);
    } else {
      // Select this provider, and remove "All" if it was selected
      next = [
        ...selectedIds.filter((id) => id !== allProvider?.id),
        provider.id,
      ];
    }

    saveSubscriptions(next);
  };

  return (
    <div className="mt-4 bg-card rounded-xl border border-border p-4">
      <h3 className="text-sm font-semibold text-foreground mb-3">
        My Streaming Services
      </h3>
      <div className="grid grid-cols-4 gap-2">
        {sorted.map((provider) => {
          const isSelected = selectedIds.includes(provider.id);
          return (
            <button
              key={provider.id}
              onClick={() => handleToggle(provider)}
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

  // Fallback: first letter
  return (
    <div className="h-10 w-10 rounded-lg bg-muted/20 flex items-center justify-center text-sm font-bold text-muted">
      {provider.name.charAt(0)}
    </div>
  );
}
