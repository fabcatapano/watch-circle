"use client";

import { useState, useEffect, useCallback } from "react";
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  addWeeks,
  addMonths,
  subWeeks,
  subMonths,
  format,
} from "date-fns";
import { createClient } from "@/lib/supabase/client";
import { getUpcomingEpisodes } from "@/services/episodes";
import type { EpisodeWithShow } from "@/types";

type ViewMode = "week" | "month";

export function useCalendar(userId: string) {
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [episodes, setEpisodes] = useState<EpisodeWithShow[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const dateRange = useCallback(() => {
    if (viewMode === "week") {
      return {
        start: startOfWeek(currentDate, { weekStartsOn: 1 }),
        end: endOfWeek(currentDate, { weekStartsOn: 1 }),
      };
    }
    return {
      start: startOfMonth(currentDate),
      end: endOfMonth(currentDate),
    };
  }, [viewMode, currentDate]);

  const fetchEpisodes = useCallback(async () => {
    setLoading(true);
    const { start, end } = dateRange();
    const { data } = await getUpcomingEpisodes(
      supabase,
      userId,
      format(start, "yyyy-MM-dd"),
      format(end, "yyyy-MM-dd")
    );
    setEpisodes((data as unknown as EpisodeWithShow[]) ?? []);
    setLoading(false);
  }, [supabase, userId, dateRange]);

  useEffect(() => {
    fetchEpisodes();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode, currentDate]);

  const goNext = () => {
    setCurrentDate((prev) =>
      viewMode === "week" ? addWeeks(prev, 1) : addMonths(prev, 1)
    );
  };

  const goPrev = () => {
    setCurrentDate((prev) =>
      viewMode === "week" ? subWeeks(prev, 1) : subMonths(prev, 1)
    );
  };

  const goToday = () => setCurrentDate(new Date());

  const rangeLabel = (() => {
    const { start, end } = dateRange();
    if (viewMode === "week") {
      return `${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`;
    }
    return format(currentDate, "MMMM yyyy");
  })();

  return {
    viewMode,
    setViewMode,
    episodes,
    loading,
    goNext,
    goPrev,
    goToday,
    rangeLabel,
  };
}
