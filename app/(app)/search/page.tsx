"use client";

import { Search } from "lucide-react";
import { useSearch } from "@/hooks/useSearch";
import { Input } from "@/components/ui/Input";
import { PosterGrid } from "@/components/movie/PosterGrid";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";

export default function SearchPage() {
  const { query, setQuery, results, loading } = useSearch();

  return (
    <div className="px-4 py-4">
      <Input
        placeholder="Search movies & TV shows..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus
      />

      <div className="mt-4">
        {loading ? (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="aspect-[2/3] rounded-lg" />
                <Skeleton className="mt-1.5 h-4 w-3/4" />
              </div>
            ))}
          </div>
        ) : results.length > 0 ? (
          <PosterGrid items={results} />
        ) : query.trim() ? (
          <EmptyState
            icon={Search}
            title="No results found"
            description={`No movies or TV shows match "${query}"`}
          />
        ) : (
          <EmptyState
            icon={Search}
            title="Search for movies & TV shows"
            description="Find something to watch and share with friends"
          />
        )}
      </div>
    </div>
  );
}
