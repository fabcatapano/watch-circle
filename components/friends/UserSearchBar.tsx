"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { searchProfiles } from "@/services/profiles";
import { getFriendshipStatus } from "@/services/friendships";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { UserPlus } from "lucide-react";
import type { Profile, Friendship } from "@/types";

interface UserSearchBarProps {
  userId: string;
  onSendRequest: (addresseeId: string) => Promise<void>;
}

interface SearchResult {
  profile: Profile;
  friendship: Friendship | null;
}

export function UserSearchBar({ userId, onSendRequest }: UserSearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [sending, setSending] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const supabase = createClient();

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setResults([]);
      return;
    }

    setSearching(true);

    debounceRef.current = setTimeout(async () => {
      const { data: profiles } = await searchProfiles(supabase, query, userId);
      if (profiles) {
        const withStatus = await Promise.all(
          profiles.map(async (p) => {
            const friendship = await getFriendshipStatus(supabase, userId, p.id);
            return { profile: p, friendship };
          })
        );
        setResults(withStatus);
      }
      setSearching(false);
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const handleSend = async (addresseeId: string) => {
    setSending(addresseeId);
    await onSendRequest(addresseeId);
    setResults((prev) =>
      prev.map((r) =>
        r.profile.id === addresseeId
          ? { ...r, friendship: { status: "pending" } as Friendship }
          : r
      )
    );
    setSending(null);
  };

  const getStatusLabel = (friendship: Friendship | null) => {
    if (!friendship) return null;
    if (friendship.status === "accepted") return "Friends";
    if (friendship.status === "pending") return "Pending";
    if (friendship.status === "rejected") return "Rejected";
    return null;
  };

  return (
    <div>
      <Input
        placeholder="Search users by username..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {results.length > 0 && (
        <div className="mt-3 space-y-2">
          {results.map(({ profile, friendship }) => {
            const statusLabel = getStatusLabel(friendship);
            return (
              <div
                key={profile.id}
                className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border"
              >
                <Avatar
                  src={profile.avatar_url}
                  username={profile.username}
                  size="sm"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {profile.display_name || profile.username}
                  </p>
                  <p className="text-xs text-muted">@{profile.username}</p>
                </div>
                {statusLabel ? (
                  <span className="text-xs text-muted">{statusLabel}</span>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleSend(profile.id)}
                    disabled={sending === profile.id}
                  >
                    <UserPlus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {searching && (
        <p className="mt-3 text-sm text-muted text-center">Searching...</p>
      )}
    </div>
  );
}
