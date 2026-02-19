"use client";

import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { CompatibilityScore } from "./CompatibilityScore";
import { UserMinus } from "lucide-react";
import type { Profile } from "@/types";

interface FriendsListProps {
  userId: string;
  friends: Array<{ id: string; profile: Profile }>;
  onRemove: (friendshipId: string) => Promise<void>;
}

export function FriendsList({ userId, friends, onRemove }: FriendsListProps) {
  return (
    <div className="space-y-2">
      {friends.map(({ id, profile }) => (
        <div
          key={id}
          className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border"
        >
          <Avatar
            src={profile.avatar_url}
            username={profile.username}
            size="md"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-foreground truncate">
                {profile.display_name || profile.username}
              </p>
              <CompatibilityScore userId={userId} friendId={profile.id} compact />
            </div>
            <p className="text-xs text-muted">@{profile.username}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(id)}
            className="text-muted hover:text-danger"
          >
            <UserMinus className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
