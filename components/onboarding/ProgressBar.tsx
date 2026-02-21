"use client";

import { cn } from "@/utils/cn";
import type { OnboardingStep } from "@/hooks/useOnboarding";

const STEPS = [
  { label: "Services", step: 1 },
  { label: "Favorites", step: 2 },
  { label: "Done", step: 3 },
] as const;

export function ProgressBar({ currentStep }: { currentStep: OnboardingStep }) {
  return (
    <div className="w-full px-4 pt-2 pb-4">
      <div className="flex items-center gap-2">
        {STEPS.map(({ label, step }, i) => (
          <div key={step} className="flex-1 flex flex-col items-center gap-1.5">
            <div className="w-full flex items-center gap-2">
              {i > 0 && <div className="flex-1" />}
              <div
                className={cn(
                  "h-1.5 w-full rounded-full transition-colors",
                  step <= currentStep ? "bg-accent" : "bg-border"
                )}
              />
              {i < STEPS.length - 1 && <div className="flex-1" />}
            </div>
            <span
              className={cn(
                "text-xs transition-colors",
                step <= currentStep ? "text-accent font-medium" : "text-muted"
              )}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
