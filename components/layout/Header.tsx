"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { ROUTES } from "@/utils/constants";

interface HeaderProps {
  unreadCount: number;
}

export function Header({ unreadCount }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-background/80 backdrop-blur-md px-4">
      <Link href={ROUTES.FEED} className="text-xl font-bold text-accent">
        Watch Circle
      </Link>
      <Link href={ROUTES.NOTIFICATIONS} className="relative p-2">
        <Bell className="h-5 w-5 text-muted hover:text-foreground transition-colors" />
        <Badge count={unreadCount} />
      </Link>
    </header>
  );
}
