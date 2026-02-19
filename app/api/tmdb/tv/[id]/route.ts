import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getTvDetails } from "@/lib/tmdb";

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
    const data = await getTvDetails(Number(id));
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch TV show" }, { status: 500 });
  }
}
