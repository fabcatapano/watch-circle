"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  getFriends,
  getPendingRequests,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
} from "@/services/friendships";
import type { Profile } from "@/types";

interface FriendItem {
  id: string;
  profile: Profile;
}

interface PendingItem {
  id: string;
  profile: Profile;
}

export function useFriends(userId: string) {
  const [friends, setFriends] = useState<FriendItem[]>([]);
  const [pending, setPending] = useState<PendingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [friendsRes, pendingRes] = await Promise.all([
      getFriends(supabase, userId),
      getPendingRequests(supabase, userId),
    ]);

    if (friendsRes.data) {
      const mapped = friendsRes.data.map((f: Record<string, unknown>) => {
        const isRequester = (f as { requester_id: string }).requester_id === userId;
        const friendProfile = isRequester
          ? (f as { addressee: Profile }).addressee
          : (f as { profiles: Profile }).profiles;
        return { id: f.id as string, profile: friendProfile };
      });
      setFriends(mapped);
    }

    if (pendingRes.data) {
      const mapped = pendingRes.data.map((f: Record<string, unknown>) => ({
        id: f.id as string,
        profile: (f as { profiles: Profile }).profiles,
      }));
      setPending(mapped);
    }

    setLoading(false);
  }, [supabase, userId]);

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendRequest = async (addresseeId: string) => {
    await sendFriendRequest(supabase, userId, addresseeId);
    await fetchData();
  };

  const accept = async (friendshipId: string) => {
    await acceptFriendRequest(supabase, friendshipId, userId);
    await fetchData();
  };

  const reject = async (friendshipId: string) => {
    await rejectFriendRequest(supabase, friendshipId, userId);
    await fetchData();
  };

  const remove = async (friendshipId: string) => {
    await removeFriend(supabase, friendshipId, userId);
    await fetchData();
  };

  return { friends, pending, loading, sendRequest, accept, reject, remove, refetch: fetchData };
}
