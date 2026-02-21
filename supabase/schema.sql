-- Watch Circle Database Schema

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================================
-- TABLES
-- ============================================================

-- Profiles (extends Supabase auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text,
  avatar_url text,
  bio text,
  onboarding_completed boolean default false not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Movies (local cache of TMDB data)
create table public.movies (
  id uuid primary key default uuid_generate_v4(),
  tmdb_id integer unique not null,
  media_type text not null check (media_type in ('movie', 'tv')),
  title text not null,
  overview text,
  poster_path text,
  backdrop_path text,
  release_date text,
  vote_average numeric,
  genres text[],
  runtime integer,
  number_of_seasons integer,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Ratings
create table public.ratings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  movie_id uuid not null references public.movies(id) on delete cascade,
  score integer not null check (score >= 1 and score <= 5),
  comment text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  unique(user_id, movie_id)
);

-- Friendships
create table public.friendships (
  id uuid primary key default uuid_generate_v4(),
  requester_id uuid not null references public.profiles(id) on delete cascade,
  addressee_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected')),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  unique(requester_id, addressee_id)
);

-- Follows (TV series)
create table public.follows (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  movie_id uuid not null references public.movies(id) on delete cascade,
  created_at timestamptz default now() not null,
  unique(user_id, movie_id)
);

-- Episodes
create table public.episodes (
  id uuid primary key default uuid_generate_v4(),
  movie_id uuid not null references public.movies(id) on delete cascade,
  season_number integer not null,
  episode_number integer not null,
  name text,
  overview text,
  air_date text,
  still_path text,
  runtime integer,
  created_at timestamptz default now() not null,
  unique(movie_id, season_number, episode_number)
);

-- Streaming Providers (catalog of known providers)
create table public.streaming_providers (
  id uuid primary key default gen_random_uuid(),
  tmdb_provider_id integer unique not null,
  name text not null,
  slug text not null,
  logo_path text,
  created_at timestamptz default now() not null
);

-- Movie Providers (many-to-many)
create table public.movie_providers (
  id uuid primary key default gen_random_uuid(),
  movie_id uuid not null references public.movies(id) on delete cascade,
  provider_id uuid not null references public.streaming_providers(id) on delete cascade,
  created_at timestamptz default now() not null,
  unique(movie_id, provider_id)
);

-- User Streaming Providers (which services each user subscribes to)
create table public.user_streaming_providers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  provider_id uuid not null references public.streaming_providers(id) on delete cascade,
  created_at timestamptz default now() not null,
  unique(user_id, provider_id)
);

-- Notifications
create table public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null check (type in ('friend_request', 'friend_accepted', 'new_episode', 'new_rating')),
  title text not null,
  body text,
  data jsonb default '{}'::jsonb,
  read boolean default false not null,
  created_at timestamptz default now() not null
);

-- ============================================================
-- INDEXES
-- ============================================================

create index idx_ratings_user_id on public.ratings(user_id);
create index idx_ratings_movie_id on public.ratings(movie_id);
create index idx_ratings_created_at on public.ratings(created_at desc);
create index idx_friendships_requester on public.friendships(requester_id);
create index idx_friendships_addressee on public.friendships(addressee_id);
create index idx_friendships_status on public.friendships(status);
create index idx_follows_user_id on public.follows(user_id);
create index idx_episodes_movie_id on public.episodes(movie_id);
create index idx_episodes_air_date on public.episodes(air_date);
create index idx_movie_providers_movie_id on public.movie_providers(movie_id);
create index idx_movie_providers_provider_id on public.movie_providers(provider_id);
create index idx_user_streaming_providers_user_id on public.user_streaming_providers(user_id);
create index idx_user_streaming_providers_provider_id on public.user_streaming_providers(provider_id);
create index idx_notifications_user_id on public.notifications(user_id);
create index idx_notifications_read on public.notifications(read);
create index idx_movies_tmdb_id on public.movies(tmdb_id);

-- ============================================================
-- HELPER FUNCTIONS
-- ============================================================

-- Check if two users are friends
create or replace function public.are_friends(user_a uuid, user_b uuid)
returns boolean as $$
  select exists (
    select 1 from public.friendships
    where status = 'accepted'
      and (
        (requester_id = user_a and addressee_id = user_b)
        or (requester_id = user_b and addressee_id = user_a)
      )
  );
$$ language sql security definer stable;

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.profiles enable row level security;
alter table public.movies enable row level security;
alter table public.ratings enable row level security;
alter table public.friendships enable row level security;
alter table public.follows enable row level security;
alter table public.episodes enable row level security;
alter table public.streaming_providers enable row level security;
alter table public.movie_providers enable row level security;
alter table public.user_streaming_providers enable row level security;
alter table public.notifications enable row level security;

-- Profiles: anyone can read, users can update own
create policy "Profiles are viewable by everyone" on public.profiles
  for select using (true);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Movies: anyone can read, authenticated can insert/update
create policy "Movies are viewable by everyone" on public.movies
  for select using (true);

create policy "Authenticated users can insert movies" on public.movies
  for insert with check (auth.role() = 'authenticated');

create policy "Authenticated users can update movies" on public.movies
  for update using (auth.role() = 'authenticated');

-- Ratings: viewable by self and friends, users manage own
create policy "Users can view own ratings" on public.ratings
  for select using (auth.uid() = user_id);

create policy "Users can view friend ratings" on public.ratings
  for select using (public.are_friends(auth.uid(), user_id));

create policy "Users can insert own ratings" on public.ratings
  for insert with check (auth.uid() = user_id);

create policy "Users can update own ratings" on public.ratings
  for update using (auth.uid() = user_id);

create policy "Users can delete own ratings" on public.ratings
  for delete using (auth.uid() = user_id);

-- Friendships: involved users can view, requester can insert
create policy "Users can view own friendships" on public.friendships
  for select using (auth.uid() = requester_id or auth.uid() = addressee_id);

create policy "Users can send friend requests" on public.friendships
  for insert with check (auth.uid() = requester_id);

create policy "Users can update friendships they receive" on public.friendships
  for update using (auth.uid() = addressee_id);

create policy "Users can delete own friendships" on public.friendships
  for delete using (auth.uid() = requester_id or auth.uid() = addressee_id);

-- Follows: users manage own
create policy "Users can view own follows" on public.follows
  for select using (auth.uid() = user_id);

create policy "Users can insert own follows" on public.follows
  for insert with check (auth.uid() = user_id);

create policy "Users can delete own follows" on public.follows
  for delete using (auth.uid() = user_id);

-- Episodes: anyone can read, authenticated can insert
create policy "Episodes are viewable by everyone" on public.episodes
  for select using (true);

create policy "Authenticated users can insert episodes" on public.episodes
  for insert with check (auth.role() = 'authenticated');

create policy "Authenticated users can update episodes" on public.episodes
  for update using (auth.role() = 'authenticated');

-- Streaming providers: anyone can read, authenticated can insert/update
create policy "Streaming providers are viewable by everyone" on public.streaming_providers
  for select using (true);

create policy "Authenticated users can insert streaming providers" on public.streaming_providers
  for insert with check (auth.role() = 'authenticated');

create policy "Authenticated users can update streaming providers" on public.streaming_providers
  for update using (auth.role() = 'authenticated');

-- Movie providers: anyone can read, authenticated can insert/delete
create policy "Movie providers are viewable by everyone" on public.movie_providers
  for select using (true);

create policy "Authenticated users can insert movie providers" on public.movie_providers
  for insert with check (auth.role() = 'authenticated');

create policy "Authenticated users can delete movie providers" on public.movie_providers
  for delete using (auth.role() = 'authenticated');

-- User streaming providers: users manage own
create policy "Users can view own subscriptions" on public.user_streaming_providers
  for select using (auth.uid() = user_id);

create policy "Users can insert own subscriptions" on public.user_streaming_providers
  for insert with check (auth.uid() = user_id);

create policy "Users can delete own subscriptions" on public.user_streaming_providers
  for delete using (auth.uid() = user_id);

-- Notifications: users manage own
create policy "Users can view own notifications" on public.notifications
  for select using (auth.uid() = user_id);

create policy "Authenticated users can insert notifications" on public.notifications
  for insert with check (auth.role() = 'authenticated');

create policy "Users can update own notifications" on public.notifications
  for update using (auth.uid() = user_id);

create policy "Users can delete own notifications" on public.notifications
  for delete using (auth.uid() = user_id);
