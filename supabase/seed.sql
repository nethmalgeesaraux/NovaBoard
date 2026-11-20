-- Optional sample workspace. Run after schema.sql.
-- Uses fixed ids so the board matches the in-browser demo data.

insert into public.teams (id, team_name)
values
  ('8c1a0a10-1b2c-4d3e-8f02-000000000001', 'Product Engineering'),
  ('8c1a0a10-1b2c-4d3e-8f02-000000000002', 'Client Delivery')
on conflict (id) do nothing;

insert into public.users (id, username, email, team_id)
values
  ('8c1a0a10-1b2c-4d3e-8f01-000000000001', 'Anika Perera', 'anika@novastack.studio', '8c1a0a10-1b2c-4d3e-8f02-000000000001'),
  ('8c1a0a10-1b2c-4d3e-8f01-000000000002', 'Nimal Fernando', 'nimal@novastack.studio', '8c1a0a10-1b2c-4d3e-8f02-000000000001'),
  ('8c1a0a10-1b2c-4d3e-8f01-000000000003', 'Sahan Silva', 'sahan@novastack.studio', '8c1a0a10-1b2c-4d3e-8f02-000000000001'),
  ('8c1a0a10-1b2c-4d3e-8f01-000000000004', 'Maya Jayawardena', 'maya@novastack.studio', '8c1a0a10-1b2c-4d3e-8f02-000000000002'),
  ('8c1a0a10-1b2c-4d3e-8f01-000000000005', 'Ruwan Dias', 'ruwan@novastack.studio', '8c1a0a10-1b2c-4d3e-8f02-000000000001')
on conflict (id) do nothing;

update public.teams
set
  product_owner_user_id = '8c1a0a10-1b2c-4d3e-8f01-000000000001',
  project_manager_user_id = '8c1a0a10-1b2c-4d3e-8f01-000000000002'
where id = '8c1a0a10-1b2c-4d3e-8f02-000000000001';

update public.teams
set
  product_owner_user_id = '8c1a0a10-1b2c-4d3e-8f01-000000000004',
  project_manager_user_id = '8c1a0a10-1b2c-4d3e-8f01-000000000001'
where id = '8c1a0a10-1b2c-4d3e-8f02-000000000002';

insert into public.projects (id, name, description, start_date, end_date)
values
  (
    '8c1a0a10-1b2c-4d3e-8f03-000000000001',
    'NovaBoard Platform',
    'Internal project hub for NovaStack Studio — boards, priorities, and delivery tracking.',
    '2026-11-01',
    '2026-12-20'
  ),
  (
    '8c1a0a10-1b2c-4d3e-8f03-000000000002',
    'Client Portal',
    'Customer workspace for project status, invoices, and shared files.',
    '2026-10-15',
    '2026-11-30'
  ),
  (
    '8c1a0a10-1b2c-4d3e-8f03-000000000003',
    'Studio Website',
    'Public site for NovaStack Studio case studies and contact.',
    '2026-11-10',
    '2027-01-15'
  )
on conflict (id) do nothing;

insert into public.tasks (
  id, issue_key, title, description, status, priority, tags,
  start_date, due_date, points, project_id, author_user_id, assigned_user_id, created_at
)
values
  (
    '8c1a0a10-1b2c-4d3e-8f04-000000000001',
    'NB-101',
    'Design the board columns',
    'Lay out To Do, In Progress, Review, and Done with the NovaStack teal system.',
    'Work In Progress',
    'High',
    'Design',
    '2026-11-03',
    '2026-11-18',
    5,
    '8c1a0a10-1b2c-4d3e-8f03-000000000001',
    '8c1a0a10-1b2c-4d3e-8f01-000000000001',
    '8c1a0a10-1b2c-4d3e-8f01-000000000004',
    '2026-11-03T09:00:00.000Z'
  ),
  (
    '8c1a0a10-1b2c-4d3e-8f04-000000000002',
    'NB-102',
    'Drag and drop issues',
    'Move an issue between columns and persist the new status.',
    'To Do',
    'Urgent',
    'Frontend',
    '2026-11-18',
    '2026-11-28',
    8,
    '8c1a0a10-1b2c-4d3e-8f03-000000000001',
    '8c1a0a10-1b2c-4d3e-8f01-000000000002',
    '8c1a0a10-1b2c-4d3e-8f01-000000000003',
    '2026-11-04T09:00:00.000Z'
  ),
  (
    '8c1a0a10-1b2c-4d3e-8f04-000000000003',
    'NB-103',
    'Supabase schema',
    'Projects, users, teams, and issues with open policies until auth is added.',
    'Under Review',
    'Medium',
    'Backend',
    '2026-11-05',
    '2026-11-17',
    3,
    '8c1a0a10-1b2c-4d3e-8f03-000000000001',
    '8c1a0a10-1b2c-4d3e-8f01-000000000001',
    '8c1a0a10-1b2c-4d3e-8f01-000000000002',
    '2026-11-05T09:00:00.000Z'
  ),
  (
    '8c1a0a10-1b2c-4d3e-8f04-000000000004',
    'NB-104',
    'Dashboard charts',
    'Show open work, priority mix, and recently updated issues.',
    'Completed',
    'Low',
    'Frontend',
    '2026-11-01',
    '2026-11-12',
    5,
    '8c1a0a10-1b2c-4d3e-8f03-000000000001',
    '8c1a0a10-1b2c-4d3e-8f01-000000000001',
    '8c1a0a10-1b2c-4d3e-8f01-000000000003',
    '2026-11-01T09:00:00.000Z'
  ),
  (
    '8c1a0a10-1b2c-4d3e-8f04-000000000005',
    'NB-105',
    'Search across issues',
    'Find issues by key, title, tag, or description.',
    'To Do',
    'Medium',
    'QA',
    '2026-11-20',
    '2026-11-30',
    3,
    '8c1a0a10-1b2c-4d3e-8f03-000000000001',
    '8c1a0a10-1b2c-4d3e-8f01-000000000002',
    '8c1a0a10-1b2c-4d3e-8f01-000000000005',
    '2026-11-06T09:00:00.000Z'
  ),
  (
    '8c1a0a10-1b2c-4d3e-8f04-000000000006',
    'NB-106',
    'Sprint planning notes',
    'Capture the next cycle scope for the studio board.',
    'To Do',
    'Backlog',
    'Planning',
    '2026-12-01',
    '2026-12-15',
    5,
    '8c1a0a10-1b2c-4d3e-8f03-000000000001',
    '8c1a0a10-1b2c-4d3e-8f01-000000000001',
    '8c1a0a10-1b2c-4d3e-8f01-000000000001',
    '2026-11-07T09:00:00.000Z'
  ),
  (
    '8c1a0a10-1b2c-4d3e-8f04-000000000007',
    'CP-101',
    'Client login',
    'Email sign-in for the customer workspace.',
    'Work In Progress',
    'Urgent',
    'Auth',
    '2026-10-20',
    '2026-11-22',
    8,
    '8c1a0a10-1b2c-4d3e-8f03-000000000002',
    '8c1a0a10-1b2c-4d3e-8f01-000000000002',
    '8c1a0a10-1b2c-4d3e-8f01-000000000003',
    '2026-10-20T09:00:00.000Z'
  ),
  (
    '8c1a0a10-1b2c-4d3e-8f04-000000000008',
    'CP-102',
    'Invoice list',
    'Show open and paid invoices for the signed-in client.',
    'Under Review',
    'High',
    'Design',
    '2026-10-28',
    '2026-11-19',
    5,
    '8c1a0a10-1b2c-4d3e-8f03-000000000002',
    '8c1a0a10-1b2c-4d3e-8f01-000000000001',
    '8c1a0a10-1b2c-4d3e-8f01-000000000004',
    '2026-10-28T09:00:00.000Z'
  ),
  (
    '8c1a0a10-1b2c-4d3e-8f04-000000000009',
    'CP-103',
    'Date filter is off by one day',
    'Invoices created on the last day of the month disappear from the range.',
    'To Do',
    'Urgent',
    'Bug',
    '2026-11-14',
    '2026-11-18',
    2,
    '8c1a0a10-1b2c-4d3e-8f03-000000000002',
    '8c1a0a10-1b2c-4d3e-8f01-000000000005',
    '8c1a0a10-1b2c-4d3e-8f01-000000000005',
    '2026-11-14T09:00:00.000Z'
  ),
  (
    '8c1a0a10-1b2c-4d3e-8f04-000000000010',
    'SW-101',
    'Homepage hero',
    'Studio intro, selected work, and a contact path.',
    'Completed',
    'Medium',
    'Design',
    '2026-11-10',
    '2026-11-16',
    3,
    '8c1a0a10-1b2c-4d3e-8f03-000000000003',
    '8c1a0a10-1b2c-4d3e-8f01-000000000004',
    '8c1a0a10-1b2c-4d3e-8f01-000000000004',
    '2026-11-10T09:00:00.000Z'
  ),
  (
    '8c1a0a10-1b2c-4d3e-8f04-000000000011',
    'SW-102',
    'Case studies',
    'Three project stories with outcomes and the stack used.',
    'Work In Progress',
    'High',
    'Content',
    '2026-11-12',
    '2026-11-29',
    5,
    '8c1a0a10-1b2c-4d3e-8f03-000000000003',
    '8c1a0a10-1b2c-4d3e-8f01-000000000001',
    '8c1a0a10-1b2c-4d3e-8f01-000000000001',
    '2026-11-12T09:00:00.000Z'
  ),
  (
    '8c1a0a10-1b2c-4d3e-8f04-000000000012',
    'SW-103',
    'SEO metadata',
    'Titles, descriptions, and social previews for the main pages.',
    'To Do',
    'Low',
    'Content',
    '2026-11-25',
    '2026-12-05',
    2,
    '8c1a0a10-1b2c-4d3e-8f03-000000000003',
    '8c1a0a10-1b2c-4d3e-8f01-000000000002',
    '8c1a0a10-1b2c-4d3e-8f01-000000000002',
    '2026-11-11T09:00:00.000Z'
  )
on conflict (id) do nothing;
