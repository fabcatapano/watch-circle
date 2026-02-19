"use client";

import { Bell, UserPlus, UserCheck, Tv, Star } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { relativeTime } from "@/utils/formatDate";
import { cn } from "@/utils/cn";
import type { Notification } from "@/types";

interface NotificationListProps {
  userId: string;
}

const typeIcons: Record<Notification["type"], typeof Bell> = {
  friend_request: UserPlus,
  friend_accepted: UserCheck,
  new_episode: Tv,
  new_rating: Star,
};

export function NotificationList({ userId }: NotificationListProps) {
  const { notifications, loading, markRead, markAllRead } = useNotifications(userId);

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <EmptyState
        icon={Bell}
        title="No notifications"
        description="You're all caught up!"
      />
    );
  }

  const hasUnread = notifications.some((n) => !n.read);

  return (
    <div>
      {hasUnread && (
        <div className="flex justify-end mb-3">
          <Button variant="ghost" size="sm" onClick={markAllRead}>
            Mark all as read
          </Button>
        </div>
      )}
      <div className="space-y-2">
        {notifications.map((n) => {
          const Icon = typeIcons[n.type] ?? Bell;
          return (
            <div
              key={n.id}
              className={cn(
                "flex items-start gap-3 p-3 rounded-xl border border-border transition-colors cursor-pointer",
                n.read ? "bg-card" : "bg-card-hover"
              )}
              onClick={() => !n.read && markRead(n.id)}
            >
              <div className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full flex-shrink-0",
                n.read ? "bg-border" : "bg-accent/20"
              )}>
                <Icon className={cn("h-4 w-4", n.read ? "text-muted" : "text-accent")} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn("text-sm", n.read ? "text-muted" : "text-foreground font-medium")}>
                  {n.title}
                </p>
                {n.body && (
                  <p className="text-xs text-muted mt-0.5">{n.body}</p>
                )}
                <p className="text-xs text-muted/60 mt-1">
                  {relativeTime(n.created_at)}
                </p>
              </div>
              {!n.read && (
                <div className="h-2 w-2 rounded-full bg-accent flex-shrink-0 mt-2" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
