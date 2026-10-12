-- Migration: 20261012000001_create_case_studies.sql
-- Requirement: ADM01 (§6), Gate G9 (Projects & genuine case studies), Data integrity rules

-- 1. Ensure audit_logs table exists if not already created
create table if not exists public.audit_logs (
    id uuid primary key default gen_random_uuid(),
    entity_name text not null,
    entity_id text not null,
    action text not null check (action in ('create', 'update', 'status_change', 'archive', 'delete_attempt')),
    actor_id text not null,
    actor_role text not null,
    payload jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default timezone('utc'::text, now())
);

-- Ensure append-only audit: revoke update and delete permissions
revoke update, delete on table public.audit_logs from public, anon, authenticated;

-- 2. Create case_studies table
create table if not exists public.case_studies (
    id uuid primary key default gen_random_uuid(),
    title text not null check (char_length(trim(title)) > 0),
    slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
    summary text not null check (char_length(trim(summary)) > 0),
    client_type text not null check (client_type in ('residential', 'commercial', 'industrial', 'institutional')),
    location text,
    service_scope text not null check (service_scope in ('paint_supply', 'application_service', 'supply_and_application')),
    surface_type text,
    paint_products_used jsonb not null default '[]'::jsonb,
    hero_image_url text,
    gallery_image_urls jsonb not null default '[]'::jsonb,
    content text not null check (char_length(trim(content)) > 0),
    status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
    published_at timestamptz,
    created_at timestamptz not null default timezone('utc'::text, now()),
    updated_at timestamptz not null default timezone('utc'::text, now()),
    created_by text,
    updated_by text
);

-- Trigger to automatically update updated_at in UTC
create or replace function public.set_utc_timestamp()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

drop trigger if exists trg_case_studies_set_timestamp on public.case_studies;
create trigger trg_case_studies_set_timestamp
before update on public.case_studies
for each row
execute function public.set_utc_timestamp();

-- 3. Row-level security (RLS)
alter table public.case_studies enable row level security;
alter table public.audit_logs enable row level security;

-- Public read access: Only published case studies (subject to gate G9 enforcement in app)
create policy "Public can read published case studies"
on public.case_studies
for select
using (status = 'published');

-- Staff read/write access: Authenticated staff can read and manage all case studies
create policy "Staff can manage all case studies"
on public.case_studies
for all
to authenticated
using (true)
with check (true);

-- Staff audit log insert policy
create policy "Staff can insert audit logs"
on public.audit_logs
for insert
to authenticated
with check (true);

create policy "Staff can view audit logs"
on public.audit_logs
for select
to authenticated
using (true);
