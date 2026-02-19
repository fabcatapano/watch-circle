"use client";

import { useState } from "react";
import { Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useFriends } from "@/hooks/useFriends";
import { UserSearchBar } from "@/components/friends/UserSearchBar";
import { FriendsList } from "@/components/friends/FriendsList";
import { FriendRequestCard } from "@/components/friends/FriendRequestCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/utils/cn";

type Tab = "friends" | "requests";

export default function FriendsPage() {
  const { user, loading: authLoading } = useAuth();
  const [tab, setTab] = useState<Tab>("friends");

  if (authLoading || !user) {
    return (
      <div className="px-4 py-4 space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  return <FriendsContent userId={user.id} tab={tab} setTab={setTab} />;
}

function FriendsContent({
  userId,
  tab,
  setTab,
}: {
  userId: string;
  tab: Tab;
  setTab: (tab: Tab) => void;
}) {
  const { friends, pending, loading, sendRequest, accept, reject, remove } = useFriends(userId);

  return (
    <div className="px-4 py-4">
      {/* Search */}
      <UserSearchBar userId={userId} onSendRequest={sendRequest} />

      {/* Tabs */}
      <div className="mt-4 flex border-b border-border">
        <button
          className={cn(
            "flex-1 py-3 text-sm font-medium transition-colors",
            tab === "friends"
              ? "text-accent border-b-2 border-accent"
              : "text-muted"
          )}
          onClick={() => setTab("friends")}
        >
          Friends ({friends.length})
        </button>
        <button
          className={cn(
            "flex-1 py-3 text-sm font-medium transition-colors relative",
            tab === "requests"
              ? "text-accent border-b-2 border-accent"
              : "text-muted"
          )}
          onClick={() => setTab("requests")}
        >
          Requests
          {pending.length > 0 && (
            <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white px-1">
              {pending.length}
            </span>
          )}
        </button>
      </div>

      <div className="mt-4">
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : tab === "friends" ? (
          friends.length > 0 ? (
            <FriendsList userId={userId} friends={friends} onRemove={remove} />
          ) : (
            <EmptyState
              icon={Users}
              title="No friends yet"
              description="Search for users above and send friend requests"
            />
          )
        ) : pending.length > 0 ? (
          <div className="space-y-2">
            {pending.map(({ id, profile }) => (
              <FriendRequestCard
                key={id}
                id={id}
                profile={profile}
                onAccept={accept}
                onReject={reject}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Users}
            title="No pending requests"
            description="When someone sends you a friend request, it will appear here"
          />
        )}
      </div>
    </div>
  );
}
