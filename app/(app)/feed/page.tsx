import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FeedList } from "@/components/feed/FeedList";

export default async function FeedPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="px-4 py-4">
      <h2 className="text-lg font-bold text-foreground mb-4">Feed</h2>
      <FeedList userId={user.id} />
    </div>
  );
}
