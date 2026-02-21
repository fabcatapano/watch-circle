-- Streaming Providers

-- Catalog of known streaming providers (e.g. Netflix, Disney+)
create table public.streaming_providers (
  id uuid primary key default gen_random_uuid(),
  tmdb_provider_id integer unique not null,
  name text not null,
  slug text not null,
  logo_path text,
  created_at timestamptz default now() not null
);

-- Many-to-many: which providers carry which movies/shows
create table public.movie_providers (
  id uuid primary key default gen_random_uuid(),
  movie_id uuid not null references public.movies(id) on delete cascade,
  provider_id uuid not null references public.streaming_providers(id) on delete cascade,
  created_at timestamptz default now() not null,
  unique(movie_id, provider_id)
);

-- Indexes
create index idx_movie_providers_movie_id on public.movie_providers(movie_id);
create index idx_movie_providers_provider_id on public.movie_providers(provider_id);

-- RLS
alter table public.streaming_providers enable row level security;
alter table public.movie_providers enable row level security;

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

-- Seed common US streaming providers
insert into public.streaming_providers (tmdb_provider_id, name, slug, logo_path) values
  (8,   'Netflix',        'netflix',        '/t2yyOv40HZeVlLjYsCsPHnWLk4W.jpg'),
  (9,   'Amazon Prime Video', 'amazon-prime', '/emthp39XA2YScoYL1p0sdbAH2WA.jpg'),
  (337, 'Disney Plus',    'disney-plus',    '/7rwgEs15tFwyR9NPQ5vpzxTj19Q.jpg'),
  (384, 'HBO Max',        'hbo-max',        '/aS2zvJWn9mwiCOeaaCkIh4wleZS.jpg'),
  (15,  'Hulu',           'hulu',           '/zxrVdFjIjLqkfnwyghnfywTn3Lh.jpg'),
  (350, 'Apple TV Plus',  'apple-tv-plus',  '/6uhKBfmtzFqOcLousHwZuzcrScK.jpg'),
  (531, 'Paramount Plus', 'paramount-plus', '/xbhHHa1YgtpwhC8lb1NQ3ACVcZd.jpg');
