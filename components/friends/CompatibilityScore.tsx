"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { calculateCompatibility } from "@/services/compatibility";
import { cn } from "@/utils/cn";

interface CompatibilityScoreProps {
  userId: string;
  friendId: string;
  compact?: boolean;
}

export function CompatibilityScore({ userId, friendId, compact = false }: CompatibilityScoreProps) {
  const [score, setScore] = useState<number | null>(null);
  const [commonCount, setCommonCount] = useState(0);
  const supabase = createClient();

  useEffect(() => {
    const load = async () => {
      const result = await calculateCompatibility(supabase, userId, friendId);
      setScore(result.score);
      setCommonCount(result.commonCount);
    };
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, friendId]);

  if (score === null || commonCount === 0) return null;

  const getColor = (s: number) => {
    if (s >= 80) return "text-success";
    if (s >= 60) return "text-star";
    if (s >= 40) return "text-foreground";
    return "text-danger";
  };

  if (compact) {
    return (
      <span className={cn("text-xs font-bold", getColor(score))}>
        {score}%
      </span>
    );
  }

  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-16 w-16">
        <svg className="h-16 w-16 -rotate-90" viewBox="0 0 64 64">
          <circle
            cx="32"
            cy="32"
            r={radius}
            fill="none"
            stroke="var(--border)"
            strokeWidth="4"
          />
          <circle
            cx="32"
            cy="32"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={cn("transition-all duration-500", getColor(score))}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn("text-sm font-bold", getColor(score))}>
            {score}%
          </span>
        </div>
      </div>
      <p className="mt-1 text-xs text-muted">
        {commonCount} in common
      </p>
    </div>
  );
}
