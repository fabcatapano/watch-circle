"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { getNotifications, markAsRead, markAllAsRead } from "@/services/notifications";
import type { Notification } from "@/types";

export function useNotifications(userId: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    const { data } = await getNotifications(supabase, userId);
    setNotifications(data ?? []);
    setLoading(false);
  }, [supabase, userId]);

  useEffect(() => {
    fetchNotifications();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const markRead = async (notificationId: string) => {
    await markAsRead(supabase, notificationId);
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
  };

  const markAllRead = async () => {
    await markAllAsRead(supabase, userId);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return { notifications, loading, unreadCount, markRead, markAllRead, refetch: fetchNotifications };
}
