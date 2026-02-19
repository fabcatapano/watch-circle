create table public.watchlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  movie_id uuid not null references public.movies(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, movie_id)
);

create index idx_watchlist_user_id on public.watchlist(user_id);

alter table public.watchlist enable row level security;

create policy "Users can view own watchlist"
  on public.watchlist for select using (auth.uid() = user_id);
create policy "Users can add to own watchlist"
  on public.watchlist for insert with check (auth.uid() = user_id);
create policy "Users can remove from own watchlist"
  on public.watchlist for delete using (auth.uid() = user_id);
