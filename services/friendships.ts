import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

type Client = SupabaseClient<Database>;

export async function sendFriendRequest(supabase: Client, requesterId: string, addresseeId: string) {
  const { data, error } = await supabase
    .from("friendships")
    .insert({ requester_id: requesterId, addressee_id: addresseeId })
    .select()
    .single();

  if (!error) {
    // Create notification
    await supabase.from("notifications").insert({
      user_id: addresseeId,
      type: "friend_request",
      title: "New friend request",
      body: "Someone sent you a friend request",
      data: { friendship_id: data.id, requester_id: requesterId },
    });
  }

  return { data, error };
}

export async function acceptFriendRequest(supabase: Client, friendshipId: string, addresseeId: string) {
  const { data, error } = await supabase
    .from("friendships")
    .update({ status: "accepted", updated_at: new Date().toISOString() })
    .eq("id", friendshipId)
    .eq("addressee_id", addresseeId)
    .select()
    .single();

  if (!error && data) {
    await supabase.from("notifications").insert({
      user_id: data.requester_id,
      type: "friend_accepted",
      title: "Friend request accepted",
      body: "Your friend request was accepted!",
      data: { friendship_id: data.id },
    });
  }

  return { data, error };
}

export async function rejectFriendRequest(supabase: Client, friendshipId: string, addresseeId: string) {
  const { error } = await supabase
    .from("friendships")
    .update({ status: "rejected", updated_at: new Date().toISOString() })
    .eq("id", friendshipId)
    .eq("addressee_id", addresseeId);
  return { error };
}

export async function removeFriend(supabase: Client, friendshipId: string, userId: string) {
  const { error } = await supabase
    .from("friendships")
    .delete()
    .eq("id", friendshipId)
    .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`);
  return { error };
}

export async function getFriends(supabase: Client, userId: string) {
  const { data, error } = await supabase
    .from("friendships")
    .select("*, profiles!friendships_requester_id_fkey(*), addressee:profiles!friendships_addressee_id_fkey(*)")
    .eq("status", "accepted")
    .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`);
  return { data, error };
}

export async function getPendingRequests(supabase: Client, userId: string) {
  const { data, error } = await supabase
    .from("friendships")
    .select("*, profiles!friendships_requester_id_fkey(*)")
    .eq("addressee_id", userId)
    .eq("status", "pending")
    .order("created_at", { ascending: false });
  return { data, error };
}

export async function getFriendshipStatus(supabase: Client, userA: string, userB: string) {
  const { data } = await supabase
    .from("friendships")
    .select("*")
    .or(
      `and(requester_id.eq.${userA},addressee_id.eq.${userB}),and(requester_id.eq.${userB},addressee_id.eq.${userA})`
    )
    .single();
  return data;
}
