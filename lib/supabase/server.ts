import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";

export async function createClient() {
  const cookieStore = await cookies();

  // Keep a local map so getAll() always reflects tokens refreshed via setAll()
  const cookieMap = new Map(
    cookieStore.getAll().map((c) => [c.name, c.value])
  );

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return [...cookieMap].map(([name, value]) => ({ name, value }));
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieMap.set(name, value);
              cookieStore.set(name, value, options);
            });
          } catch {
            // The `setAll` method is called from a Server Component
            // which cannot set cookies. This can be ignored if middleware
            // is refreshing user sessions.
          }
        },
      },
    }
  );
}
