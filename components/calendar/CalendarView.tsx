"use client";

import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { useCalendar } from "@/hooks/useCalendar";
import { EpisodeRow } from "./EpisodeRow";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/utils/cn";
import { friendlyDate } from "@/utils/formatDate";

interface CalendarViewProps {
  userId: string;
}

export function CalendarView({ userId }: CalendarViewProps) {
  const {
    viewMode,
    setViewMode,
    episodes,
    loading,
    goNext,
    goPrev,
    goToday,
    rangeLabel,
  } = useCalendar(userId);

  // Group episodes by date
  const grouped = episodes.reduce<Record<string, typeof episodes>>((acc, ep) => {
    const date = ep.air_date || "Unknown";
    if (!acc[date]) acc[date] = [];
    acc[date].push(ep);
    return acc;
  }, {});

  return (
    <div>
      {/* View mode toggle */}
      <div className="flex items-center gap-2 mb-4">
        <button
          className={cn(
            "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
            viewMode === "week"
              ? "bg-accent text-white"
              : "bg-card text-muted border border-border"
          )}
          onClick={() => setViewMode("week")}
        >
          Week
        </button>
        <button
          className={cn(
            "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
            viewMode === "month"
              ? "bg-accent text-white"
              : "bg-card text-muted border border-border"
          )}
          onClick={() => setViewMode("month")}
        >
          Month
        </button>
        <Button variant="ghost" size="sm" onClick={goToday} className="ml-auto">
          Today
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={goPrev} className="p-2 text-muted hover:text-foreground">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="text-sm font-medium text-foreground">{rangeLabel}</span>
        <button onClick={goNext} className="p-2 text-muted hover:text-foreground">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Episodes */}
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : Object.keys(grouped).length > 0 ? (
        <div className="space-y-4">
          {Object.entries(grouped).map(([date, eps]) => (
            <div key={date}>
              <h3 className="text-xs font-semibold text-muted uppercase mb-2">
                {friendlyDate(date)}
              </h3>
              <div className="space-y-2">
                {eps.map((ep) => (
                  <EpisodeRow key={ep.id} episode={ep} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={CalendarDays}
          title="No episodes this period"
          description="Follow TV shows to see upcoming episodes here"
        />
      )}
    </div>
  );
}
