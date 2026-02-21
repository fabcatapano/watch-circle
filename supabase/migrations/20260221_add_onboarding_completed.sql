alter table public.profiles
  add column onboarding_completed boolean not null default false;

-- Existing users should be treated as onboarded
update public.profiles set onboarding_completed = true;
