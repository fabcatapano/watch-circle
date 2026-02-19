import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

type Client = SupabaseClient<Database>;

export async function getProfile(supabase: Client, userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  return { data, error };
}

export async function updateProfile(
  supabase: Client,
  userId: string,
  updates: Database["public"]["Tables"]["profiles"]["Update"]
) {
  const { data, error } = await supabase
    .from("profiles")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", userId)
    .select()
    .single();
  return { data, error };
}

export async function checkUsernameAvailable(supabase: Client, username: string) {
  const { data } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username)
    .single();
  return !data;
}

export async function searchProfiles(supabase: Client, query: string, currentUserId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .neq("id", currentUserId)
    .or(`username.ilike.%${query}%,display_name.ilike.%${query}%`)
    .limit(20);
  return { data, error };
}
