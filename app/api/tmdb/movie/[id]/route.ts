import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getMovieDetails } from "@/lib/tmdb";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const data = await getMovieDetails(Number(id));
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch movie" }, { status: 500 });
  }
}
