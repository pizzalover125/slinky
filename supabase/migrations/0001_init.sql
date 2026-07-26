-- Slinky MVP schema.
-- Run against a fresh Supabase project (SQL editor, or `supabase db push`).

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- pages
-- ---------------------------------------------------------------------------

create table public.pages (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users (id) on delete cascade,
  -- Stored lower-cased so the unique index doubles as case-insensitive.
  username      text not null unique
                  check (username = lower(username))
                  check (username ~ '^[a-z0-9](?:[a-z0-9-]{1,28}[a-z0-9])$'),
  theme_id      text not null default 'concrete',
  display_name  text not null default '' check (char_length(display_name) <= 50),
  bio           text not null default '' check (char_length(bio) <= 160),
  avatar_url    text,
  customization jsonb not null default '{"accent":null,"border":null,"background":{"type":"theme"}}'::jsonb,
  published     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index pages_user_id_idx on public.pages (user_id);

-- ---------------------------------------------------------------------------
-- links
-- ---------------------------------------------------------------------------

create table public.links (
  id          uuid primary key default gen_random_uuid(),
  page_id     uuid not null references public.pages (id) on delete cascade,
  title       text not null check (char_length(title) between 1 and 80),
  url         text not null,
  active      boolean not null default true,
  position    integer not null default 0,
  click_count integer not null default 0,
  created_at  timestamptz not null default now()
);

create index links_page_id_position_idx on public.links (page_id, position);

-- ---------------------------------------------------------------------------
-- Page cap
--
-- The 3-page limit is enforced here rather than only in the app, so a
-- hand-rolled API call can't quietly exceed it.
-- ---------------------------------------------------------------------------

create or replace function public.enforce_page_limit()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  page_count integer;
begin
  select count(*) into page_count
  from public.pages
  where user_id = new.user_id;

  if page_count >= 3 then
    raise exception 'Page limit reached (3 per account)'
      using errcode = 'check_violation';
  end if;

  return new;
end;
$$;

create trigger pages_limit_check
  before insert on public.pages
  for each row execute function public.enforce_page_limit();

-- Keep updated_at honest.
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger pages_touch_updated_at
  before update on public.pages
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Click counting
--
-- Anonymous visitors must be able to bump a counter without being able to
-- write to `links` generally, so this is the one narrow SECURITY DEFINER
-- path granted to `anon`. It touches exactly one column on one row and
-- returns nothing a caller could mine for data.
-- ---------------------------------------------------------------------------

create or replace function public.increment_link_click(link_id uuid)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  update public.links l
  set click_count = l.click_count + 1
  from public.pages p
  where l.id = link_id
    and l.page_id = p.id
    and l.active
    and p.published;
end;
$$;

revoke all on function public.increment_link_click(uuid) from public;
grant execute on function public.increment_link_click(uuid) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------

alter table public.pages enable row level security;
alter table public.links enable row level security;

-- Anyone may read a published page; owners may read their drafts too.
create policy "published pages are world readable"
  on public.pages for select
  using (published or auth.uid() = user_id);

create policy "owners insert their own pages"
  on public.pages for insert
  with check (auth.uid() = user_id);

create policy "owners update their own pages"
  on public.pages for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "owners delete their own pages"
  on public.pages for delete
  using (auth.uid() = user_id);

-- Links inherit visibility from their page.
create policy "links of published pages are world readable"
  on public.links for select
  using (
    exists (
      select 1 from public.pages p
      where p.id = links.page_id
        and (p.published or p.user_id = auth.uid())
    )
  );

create policy "owners write links on their own pages"
  on public.links for all
  using (
    exists (
      select 1 from public.pages p
      where p.id = links.page_id and p.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.pages p
      where p.id = links.page_id and p.user_id = auth.uid()
    )
  );
