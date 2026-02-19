import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

type Client = SupabaseClient<Database>;

export async function getNotifications(supabase: Client, userId: string) {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);
  return { data, error };
}

export async function getUnreadCount(supabase: Client, userId: string) {
  const { count, error } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("read", false);
  return { count: count ?? 0, error };
}

export async function markAsRead(supabase: Client, notificationId: string) {
  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", notificationId);
  return { error };
}

export async function markAllAsRead(supabase: Client, userId: string) {
  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("user_id", userId)
    .eq("read", false);
  return { error };
}
