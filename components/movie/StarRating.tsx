"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/utils/cn";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  interactive?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-10 w-10",
};

export function StarRating({ value, onChange, interactive = false, size = "md" }: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState(0);
  const displayValue = hoverValue || value;

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          className={cn(
            "transition-transform min-h-[44px] min-w-[44px] flex items-center justify-center",
            interactive && "hover:scale-110 cursor-pointer",
            !interactive && "cursor-default"
          )}
          onClick={() => interactive && onChange?.(star === value ? 0 : star)}
          onMouseEnter={() => interactive && setHoverValue(star)}
          onMouseLeave={() => interactive && setHoverValue(0)}
        >
          <Star
            className={cn(
              sizes[size],
              displayValue >= star
                ? "fill-star text-star"
                : "fill-none text-muted/40"
            )}
          />
        </button>
      ))}
    </div>
  );
}
