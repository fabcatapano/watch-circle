import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NotificationList } from "@/components/notifications/NotificationList";

export default async function NotificationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="px-4 py-4">
      <h2 className="text-lg font-bold text-foreground mb-4">Notifications</h2>
      <NotificationList userId={user.id} />
    </div>
  );
}
