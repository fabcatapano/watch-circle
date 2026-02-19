"use client";

import { Clapperboard } from "lucide-react";
import { useFeed } from "@/hooks/useFeed";
import { RatingCard } from "./RatingCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";

interface FeedListProps {
  userId: string;
}

export function FeedList({ userId }: FeedListProps) {
  const { items, loading, error, refetch } = useFeed(userId);

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="p-4 bg-card rounded-xl border border-border">
            <div className="flex items-center gap-3 mb-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-24 w-16 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={refetch} />;
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={Clapperboard}
        title="Your feed is empty"
        description="Add friends and rate movies to see activity here"
      />
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <RatingCard key={item.id} rating={item} />
      ))}
    </div>
  );
}
