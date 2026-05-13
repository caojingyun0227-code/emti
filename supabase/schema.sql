drop table if exists public.personalities;
drop table if exists public.questions;

create table if not exists public.personalities (
  id integer primary key,
  name text not null,
  core text not null,
  keywords jsonb not null default '[]'::jsonb,
  description text not null,
  code text generated always as (id::text) stored,
  title text generated always as (name) stored,
  subtitle text generated always as (core) stored,
  strengths jsonb generated always as (keywords) stored
);

create table if not exists public.questions (
  id integer primary key,
  text text not null,
  options jsonb not null default '[]'::jsonb
);

alter table public.personalities enable row level security;
alter table public.questions enable row level security;

drop policy if exists "Allow public read personalities" on public.personalities;
create policy "Allow public read personalities"
on public.personalities
for select
to anon, authenticated
using (true);

drop policy if exists "Allow public read questions" on public.questions;
create policy "Allow public read questions"
on public.questions
for select
to anon, authenticated
using (true);
