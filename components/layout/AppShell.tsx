"use client";

import { Header } from "./Header";
import { BottomNav } from "./BottomNav";

interface AppShellProps {
  children: React.ReactNode;
  unreadCount: number;
}

export function AppShell({ children, unreadCount }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header unreadCount={unreadCount} />
      <main className="pb-20 pt-2">{children}</main>
      <BottomNav />
    </div>
  );
}
