-- Pre-launch email list for the landing page.
-- Run against the same project as 0001 (SQL editor, or `supabase db push`).

create table public.rsvps (
  id         uuid primary key default gen_random_uuid(),
  -- Stored lower-cased so the unique index doubles as case-insensitive.
  email      text not null unique
               check (email = lower(email))
               check (char_length(email) between 3 and 254),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Row level security
--
-- Anonymous visitors need to add themselves and nothing else. There is
-- deliberately no SELECT policy: with RLS on and no read policy, the list of
-- addresses is unreadable through the anon and authenticated keys, so a
-- leaked public key can't be used to harvest it. Read the list from the
-- Supabase dashboard (or with the service-role key server-side).
-- ---------------------------------------------------------------------------

alter table public.rsvps enable row level security;

create policy "anyone may add themselves to the list"
  on public.rsvps for insert
  with check (true);
