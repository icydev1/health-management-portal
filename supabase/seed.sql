-- Seeder: promote one existing auth user to admin/superadmin.
-- IMPORTANT: Create this user in Supabase Auth first (Dashboard) and verify email.
-- Then run this seed file.

-- Change these emails before running:
--   admin_email: a Supabase Auth user you created (and verified)
--   freelancer_email: a Supabase Auth user you created (and verified)
--
-- NOTE: This file is plain SQL (no psql `\set`) so it can be executed by Prisma `db execute`.
-- Replace the literals below with your real emails.
-- Example:
--   where u.email = 'admin@yourdomain.com'
--   where u.email = 'freelancer@yourdomain.com'

insert into public.profiles (id, full_name, role, is_superadmin)
select
  u.id,
  coalesce(u.raw_user_meta_data->>'fullName', u.raw_user_meta_data->>'full_name', 'ADMIN'),
  'ADMIN',
  true
from auth.users u
where u.email = 'admin@example.com'
on conflict (id) do update
set role = excluded.role,
    is_superadmin = excluded.is_superadmin,
    full_name = excluded.full_name;

-- Ensure a freelancer profile exists for a seeded freelancer login.
-- This keeps role-based redirects working for a normal user too.
insert into public.profiles (id, full_name, role, is_superadmin)
select
  u.id,
  coalesce(u.raw_user_meta_data->>'fullName', u.raw_user_meta_data->>'full_name', 'FREELANCER'),
  'FREELANCER',
  false
from auth.users u
where u.email = 'freelancer@example.com'
on conflict (id) do update
set role = excluded.role,
    is_superadmin = excluded.is_superadmin,
    full_name = excluded.full_name;

