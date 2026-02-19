import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CalendarView } from "@/components/calendar/CalendarView";

export default async function CalendarPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="px-4 py-4">
      <h2 className="text-lg font-bold text-foreground mb-4">Calendar</h2>
      <CalendarView userId={user.id} />
    </div>
  );
}
