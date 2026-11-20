-- ====================================================================
-- NovaBoard - Complete Database Schema & Authentication Setup
-- Workspace: NovaStack Studio
-- Platform: Jira-like Project Management System
-- ====================================================================

-- 1. Enable pgcrypto extension for UUID generation
create extension if not exists pgcrypto;

-- 2. Teams Table
create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  team_name text not null,
  product_owner_user_id uuid,
  project_manager_user_id uuid,
  created_at timestamptz not null default now()
);

-- 3. Users Table (Linked to Supabase Auth)
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  username text not null,
  email text not null unique,
  profile_picture_url text default '',
  role text not null default 'developer' check (role in ('admin', 'developer', 'viewer')),
  team_id uuid references public.teams (id) on delete set null,
  created_at timestamptz not null default now()
);

-- Team foreign keys to users
alter table public.teams drop constraint if exists teams_product_owner_fkey;
alter table public.teams
  add constraint teams_product_owner_fkey
  foreign key (product_owner_user_id) references public.users (id) on delete set null;

alter table public.teams drop constraint if exists teams_project_manager_fkey;
alter table public.teams
  add constraint teams_project_manager_fkey
  foreign key (project_manager_user_id) references public.users (id) on delete set null;

-- 4. Projects Table
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  start_date date,
  end_date date,
  created_at timestamptz not null default now()
);

-- 5. Tasks / Issues Table (Jira-style)
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  issue_key text not null unique,
  title text not null,
  description text not null default '',
  status text not null default 'To Do' check (
    status in ('To Do', 'Work In Progress', 'Under Review', 'Completed')
  ),
  priority text not null default 'Medium' check (
    priority in ('Urgent', 'High', 'Medium', 'Low', 'Backlog')
  ),
  tags text not null default '',
  start_date date,
  due_date date,
  points integer default 0,
  project_id uuid not null references public.projects (id) on delete cascade,
  author_user_id uuid references public.users (id) on delete set null,
  assigned_user_id uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

-- Indexes for performance
create index if not exists tasks_project_id_idx on public.tasks (project_id);
create index if not exists tasks_priority_idx on public.tasks (priority);
create index if not exists tasks_status_idx on public.tasks (status);
create index if not exists tasks_assigned_idx on public.tasks (assigned_user_id);
create index if not exists users_team_id_idx on public.users (team_id);
create index if not exists users_email_idx on public.users (email);
create index if not exists users_auth_user_id_idx on public.users (auth_user_id);

-- 6. Row Level Security (RLS)
alter table public.teams enable row level security;
alter table public.users enable row level security;
alter table public.projects enable row level security;
alter table public.tasks enable row level security;

-- Policies allowing access for anon and authenticated users
drop policy if exists novaboard_all on public.teams;
create policy novaboard_all on public.teams for all using (true) with check (true);

drop policy if exists novaboard_all on public.users;
create policy novaboard_all on public.users for all using (true) with check (true);

drop policy if exists novaboard_all on public.projects;
create policy novaboard_all on public.projects for all using (true) with check (true);

drop policy if exists novaboard_all on public.tasks;
create policy novaboard_all on public.tasks for all using (true) with check (true);

-- Permissions for anon, authenticated, service_role
grant usage on schema public to anon, authenticated, service_role;
grant select, insert, update, delete on public.teams to anon, authenticated, service_role;
grant select, insert, update, delete on public.users to anon, authenticated, service_role;
grant select, insert, update, delete on public.projects to anon, authenticated, service_role;
grant select, insert, update, delete on public.tasks to anon, authenticated, service_role;

-- 7. Auto Confirm Email Trigger on auth.users
-- This ensures Admin and any Developer accounts created by Admin can sign in immediately
-- without waiting for email verification links!
create or replace function public.auto_confirm_auth_user()
returns trigger as $$
begin
  new.email_confirmed_at = coalesce(new.email_confirmed_at, now());
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created_auto_confirm on auth.users;
create trigger on_auth_user_created_auto_confirm
  before insert or update on auth.users
  for each row execute procedure public.auto_confirm_auth_user();

-- Auto-confirm any existing users in auth.users right now (e.g. studionovastack@gmail.com)
update auth.users set email_confirmed_at = now() where email_confirmed_at is null;

-- 8. Trigger to automatically sync auth.users into public.users
create or replace function public.handle_new_auth_user()
returns trigger as $$
declare
  is_admin boolean;
  assigned_role text;
  display_name text;
begin
  is_admin := (lower(new.email) = 'studionovastack@gmail.com');
  if is_admin then
    assigned_role := 'admin';
    display_name := coalesce(new.raw_user_meta_data->>'username', 'Studio NovaStack (Admin)');
  else
    assigned_role := coalesce(new.raw_user_meta_data->>'role', 'developer');
    display_name := coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1));
  end if;

  insert into public.users (auth_user_id, email, username, role)
  values (new.id, lower(new.email), display_name, assigned_role)
  on conflict (email) do update
  set auth_user_id = excluded.auth_user_id,
      role = case when excluded.email = 'studionovastack@gmail.com' then 'admin' else public.users.role end;

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_auth_user();

-- 9. Ensure Admin user exists in public.users if already registered in auth.users
insert into public.users (auth_user_id, email, username, role)
select id, lower(email), 'Studio NovaStack (Admin)', 'admin'
from auth.users
where lower(email) = 'studionovastack@gmail.com'
on conflict (email) do update
set auth_user_id = excluded.auth_user_id,
    role = 'admin';
