import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { searchMulti } from "@/lib/tmdb";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const query = request.nextUrl.searchParams.get("q");
  if (!query) {
    return NextResponse.json({ results: [], total_results: 0 });
  }

  try {
    const data = await searchMulti(query);
    // Filter out people, only return movies and TV
    const filtered = data.results.filter(
      (r) => r.media_type === "movie" || r.media_type === "tv"
    );
    return NextResponse.json({ results: filtered, total_results: filtered.length });
  } catch {
    return NextResponse.json({ error: "Failed to search" }, { status: 500 });
  }
}
