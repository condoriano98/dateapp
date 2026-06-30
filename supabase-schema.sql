-- Supabase backend for the date app.
-- Run this in the Supabase dashboard → SQL Editor → New query → Run.

create table if not exists public.responses (
  id     bigint generated always as identity primary key,
  at     timestamptz default now(),
  answer text,
  day    text,
  "time" text,
  activity text
);

-- The app talks to Supabase from the server using the SERVICE ROLE key, which
-- bypasses Row Level Security — so no policies are needed. RLS stays enabled to
-- block the public anon key from reading/writing directly.
alter table public.responses enable row level security;
