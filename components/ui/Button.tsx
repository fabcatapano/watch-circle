"use client";

import { cn } from "@/utils/cn";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none",
        variant === "primary" && "bg-accent text-white hover:bg-accent-hover",
        variant === "secondary" && "bg-card text-foreground border border-border hover:bg-card-hover",
        variant === "ghost" && "text-foreground hover:bg-card",
        variant === "danger" && "bg-danger text-white hover:bg-danger/80",
        size === "sm" && "h-9 px-3 text-sm",
        size === "md" && "min-h-[48px] px-4 text-sm",
        size === "lg" && "min-h-[52px] px-6 text-base",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
