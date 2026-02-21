-- User Streaming Providers (which services each user subscribes to)
create table public.user_streaming_providers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  provider_id uuid not null references public.streaming_providers(id) on delete cascade,
  created_at timestamptz default now() not null,
  unique(user_id, provider_id)
);

-- Indexes
create index idx_user_streaming_providers_user_id on public.user_streaming_providers(user_id);
create index idx_user_streaming_providers_provider_id on public.user_streaming_providers(provider_id);

-- RLS
alter table public.user_streaming_providers enable row level security;

create policy "Users can view own subscriptions" on public.user_streaming_providers
  for select using (auth.uid() = user_id);

create policy "Users can insert own subscriptions" on public.user_streaming_providers
  for insert with check (auth.uid() = user_id);

create policy "Users can delete own subscriptions" on public.user_streaming_providers
  for delete using (auth.uid() = user_id);

-- Seed "All Providers" sentinel row
insert into public.streaming_providers (tmdb_provider_id, name, slug)
values (0, 'All Providers', 'all')
on conflict (tmdb_provider_id) do nothing;
