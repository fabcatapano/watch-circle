import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMovieDetails, getTvDetails } from "@/lib/tmdb";
import { MovieDetail } from "@/components/movie/MovieDetail";
import type { RatingWithDetails } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function MoviePage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Parse id: "movie-12345" or "tv-12345"
  const [mediaType, tmdbIdStr] = id.split("-");
  const tmdbId = Number(tmdbIdStr);

  if (!mediaType || !tmdbId || (mediaType !== "movie" && mediaType !== "tv")) {
    notFound();
  }

  try {
    const details = mediaType === "movie"
      ? await getMovieDetails(tmdbId)
      : await getTvDetails(tmdbId);

    // Get friend ratings for this movie
    let friendRatings: RatingWithDetails[] = [];
    const movieResult = await supabase
      .from("movies")
      .select("*")
      .eq("tmdb_id", tmdbId)
      .limit(1);

    const movieId = (movieResult.data as Array<{ id: string }> | null)?.[0]?.id;
    if (movieId) {
      const { data: ratings } = await supabase
        .from("ratings")
        .select("*, profiles(*), movies(*)")
        .eq("movie_id", movieId)
        .neq("user_id", user.id)
        .order("created_at", { ascending: false });

      friendRatings = (ratings as unknown as RatingWithDetails[]) ?? [];
    }

    return (
      <MovieDetail
        tmdbId={tmdbId}
        mediaType={mediaType as "movie" | "tv"}
        details={details}
        userId={user.id}
        friendRatings={friendRatings}
      />
    );
  } catch {
    notFound();
  }
}
