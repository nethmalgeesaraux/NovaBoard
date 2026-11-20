-- NovaBoard schema for Supabase.
-- 1. Open the Supabase SQL editor and run this file.
-- 2. Optional: run supabase/seed.sql to load the same sample workspace as demo mode.
-- 3. Copy the project URL and anon key into .env.local.
--
-- These policies let the browser anon key read and write before Supabase Auth
-- is added. Replace them with authenticated policies before a public launch.

create extension if not exists pgcrypto;

create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  team_name text not null,
  product_owner_user_id uuid,
  project_manager_user_id uuid,
  created_at timestamptz not null default now()
);

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  username text not null,
  email text not null unique,
  profile_picture_url text,
  team_id uuid references public.teams (id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.teams drop constraint if exists teams_product_owner_fkey;
alter table public.teams
  add constraint teams_product_owner_fkey
  foreign key (product_owner_user_id) references public.users (id) on delete set null;

alter table public.teams drop constraint if exists teams_project_manager_fkey;
alter table public.teams
  add constraint teams_project_manager_fkey
  foreign key (project_manager_user_id) references public.users (id) on delete set null;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  start_date date,
  end_date date,
  created_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  issue_key text not null unique,
  title text not null,
  description text not null default '',
  status text not null check (
    status in ('To Do', 'Work In Progress', 'Under Review', 'Completed')
  ),
  priority text not null check (
    priority in ('Urgent', 'High', 'Medium', 'Low', 'Backlog')
  ),
  tags text not null default '',
  start_date date,
  due_date date,
  points integer,
  project_id uuid not null references public.projects (id) on delete cascade,
  author_user_id uuid references public.users (id) on delete set null,
  assigned_user_id uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists tasks_project_id_idx on public.tasks (project_id);
create index if not exists tasks_priority_idx on public.tasks (priority);
create index if not exists tasks_status_idx on public.tasks (status);
create index if not exists users_team_id_idx on public.users (team_id);

alter table public.teams enable row level security;
alter table public.users enable row level security;
alter table public.projects enable row level security;
alter table public.tasks enable row level security;

drop policy if exists novaboard_all on public.teams;
create policy novaboard_all on public.teams
  for all using (true) with check (true);

drop policy if exists novaboard_all on public.users;
create policy novaboard_all on public.users
  for all using (true) with check (true);

drop policy if exists novaboard_all on public.projects;
create policy novaboard_all on public.projects
  for all using (true) with check (true);

drop policy if exists novaboard_all on public.tasks;
create policy novaboard_all on public.tasks
  for all using (true) with check (true);

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on public.teams to anon, authenticated;
grant select, insert, update, delete on public.users to anon, authenticated;
grant select, insert, update, delete on public.projects to anon, authenticated;
grant select, insert, update, delete on public.tasks to anon, authenticated;
