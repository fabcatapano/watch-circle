import { cn } from "@/utils/cn";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className, onClick }: CardProps) {
  return (
    <div
      className={cn(
        "bg-card rounded-xl border border-border",
        onClick && "cursor-pointer hover:bg-card-hover transition-colors",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
