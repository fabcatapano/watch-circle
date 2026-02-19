"use client";

import { cn } from "@/utils/cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-muted">
          {label}
        </label>
      )}
      <input
        className={cn(
          "w-full min-h-[48px] rounded-lg border border-border bg-card px-4 text-foreground placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors",
          error && "border-danger focus:border-danger focus:ring-danger",
          className
        )}
        {...props}
      />
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
}
