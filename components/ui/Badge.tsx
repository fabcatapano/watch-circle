import { cn } from "@/utils/cn";

interface BadgeProps {
  count: number;
  className?: string;
}

export function Badge({ count, className }: BadgeProps) {
  if (count <= 0) return null;

  return (
    <span
      className={cn(
        "absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white px-1",
        className
      )}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}
