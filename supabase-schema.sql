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

alter table public.responses enable row level security;

-- ── Choose ONE of the two access models ──────────────────────────────────────
--
-- A) SERVICE-ROLE KEY (most private, recommended):
--    Set SUPABASE_KEY in Vercel to the *service_role* secret. It bypasses RLS,
--    so NO policies are needed and the public/anon key can never read the table.
--    If you go this route you can stop here.
--
-- B) PUBLISHABLE / ANON KEY (works with the key you already have):
--    The app uses the key server-side only, but RLS still applies to the anon
--    role, so add the policies below to allow insert / read / clear.

create policy "anon can insert" on public.responses
  for insert to anon, authenticated with check (true);

create policy "anon can read" on public.responses
  for select to anon, authenticated using (true);

create policy "anon can delete" on public.responses
  for delete to anon, authenticated using (true);
