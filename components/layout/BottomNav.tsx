"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Clapperboard, CalendarDays, Search, Users, User } from "lucide-react";
import { cn } from "@/utils/cn";
import { ROUTES } from "@/utils/constants";

const tabs = [
  { href: ROUTES.FEED, icon: Clapperboard, label: "Feed" },
  { href: ROUTES.CALENDAR, icon: CalendarDays, label: "Calendar" },
  { href: ROUTES.SEARCH, icon: Search, label: "Search" },
  { href: ROUTES.FRIENDS, icon: Users, label: "Friends" },
  { href: ROUTES.PROFILE, icon: User, label: "Profile" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/80 backdrop-blur-md safe-area-inset-bottom">
      <div className="flex h-16 items-center justify-around">
        {tabs.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 px-3 py-2 min-w-[48px] min-h-[48px]",
                isActive ? "text-accent" : "text-muted"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
