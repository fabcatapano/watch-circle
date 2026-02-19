"use client";

import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Check, X } from "lucide-react";
import type { Profile } from "@/types";

interface FriendRequestCardProps {
  id: string;
  profile: Profile;
  onAccept: (friendshipId: string) => Promise<void>;
  onReject: (friendshipId: string) => Promise<void>;
}

export function FriendRequestCard({ id, profile, onAccept, onReject }: FriendRequestCardProps) {
  return (
    <div className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border">
      <Avatar
        src={profile.avatar_url}
        username={profile.username}
        size="md"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">
          {profile.display_name || profile.username}
        </p>
        <p className="text-xs text-muted">@{profile.username}</p>
      </div>
      <div className="flex gap-2">
        <Button variant="primary" size="sm" onClick={() => onAccept(id)}>
          <Check className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onReject(id)}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
