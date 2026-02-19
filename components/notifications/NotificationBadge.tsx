"use client";

import { Badge } from "@/components/ui/Badge";

interface NotificationBadgeProps {
  count: number;
}

export function NotificationBadge({ count }: NotificationBadgeProps) {
  return <Badge count={count} />;
}
