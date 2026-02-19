import Image from "next/image";
import { cn } from "@/utils/cn";

interface AvatarProps {
  src?: string | null;
  username: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-16 w-16 text-xl",
};

export function Avatar({ src, username, size = "md", className }: AvatarProps) {
  const initial = username.charAt(0).toUpperCase();
  const sizeClass = sizes[size];
  const pixelSize = size === "sm" ? 32 : size === "md" ? 40 : 64;

  if (src) {
    return (
      <Image
        src={src}
        alt={username}
        width={pixelSize}
        height={pixelSize}
        className={cn("rounded-full object-cover", sizeClass, className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-accent font-bold text-white",
        sizeClass,
        className
      )}
    >
      {initial}
    </div>
  );
}
