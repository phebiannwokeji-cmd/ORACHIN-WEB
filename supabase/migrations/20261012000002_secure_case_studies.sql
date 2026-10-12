alter table public.case_studies
    add constraint case_studies_title_length
        check (char_length(trim(title)) between 3 and 150),
    add constraint case_studies_summary_length
        check (char_length(trim(summary)) between 10 and 500),
    add constraint case_studies_content_length
        check (char_length(trim(content)) >= 20),
    add constraint case_studies_location_length
        check (location is null or char_length(trim(location)) <= 100),
    add constraint case_studies_surface_type_length
        check (surface_type is null or char_length(trim(surface_type)) <= 100),
    add constraint case_studies_products_are_array
        check (jsonb_typeof(paint_products_used) = 'array'),
    add constraint case_studies_gallery_is_array
        check (jsonb_typeof(gallery_image_urls) = 'array');

create table if not exists public.staff_roles (
    user_id uuid primary key references auth.users(id) on delete restrict,
    role text not null check (role in ('owner', 'administrator')),
    is_active boolean not null default true,
    granted_by uuid references auth.users(id) on delete set null,
    created_at timestamptz not null default timezone('utc'::text, now()),
    updated_at timestamptz not null default timezone('utc'::text, now())
);

drop trigger if exists trg_staff_roles_set_timestamp on public.staff_roles;
create trigger trg_staff_roles_set_timestamp
before update on public.staff_roles
for each row
execute function public.set_utc_timestamp();

alter table public.staff_roles enable row level security;

create or replace function public.current_staff_role()
returns text
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
declare
    current_role text;
begin
    if coalesce(auth.jwt() ->> 'aal', 'aal1') <> 'aal2' then
        return null;
    end if;

    select role
    into current_role
    from public.staff_roles
    where user_id = auth.uid()
      and is_active = true;

    return current_role;
end;
$$;

drop policy if exists "Public can read published case studies" on public.case_studies;
drop policy if exists "Staff can manage all case studies" on public.case_studies;
drop policy if exists "Staff can insert audit logs" on public.audit_logs;
drop policy if exists "Staff can view audit logs" on public.audit_logs;

create policy "Active MFA staff can read case studies"
on public.case_studies
for select
to authenticated
using (public.current_staff_role() is not null);

create policy "Active MFA staff can read case-study audit logs"
on public.audit_logs
for select
to authenticated
using (public.current_staff_role() is not null and entity_name = 'case_study');

revoke all on table public.case_studies from anon, authenticated;
revoke all on table public.audit_logs from anon, authenticated;
revoke all on table public.staff_roles from anon, authenticated;
grant select on table public.case_studies to authenticated;
grant select on table public.audit_logs to authenticated;

create or replace function public.create_case_study(
    p_title text,
    p_slug text,
    p_summary text,
    p_client_type text,
    p_location text,
    p_service_scope text,
    p_surface_type text,
    p_paint_products_used jsonb,
    p_hero_image_url text,
    p_gallery_image_urls jsonb,
    p_content text,
    p_status text
)
returns public.case_studies
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
    staff_role text;
    created_case_study public.case_studies;
begin
    staff_role := public.current_staff_role();
    if staff_role is null then
        raise exception 'An active staff role and multi-factor verification are required.' using errcode = '42501';
    end if;

    insert into public.case_studies (
        title, slug, summary, client_type, location, service_scope, surface_type,
        paint_products_used, hero_image_url, gallery_image_urls, content, status,
        published_at, created_by, updated_by
    ) values (
        trim(p_title), trim(p_slug), trim(p_summary), p_client_type, nullif(trim(p_location), ''),
        p_service_scope, nullif(trim(p_surface_type), ''), coalesce(p_paint_products_used, '[]'::jsonb),
        nullif(trim(p_hero_image_url), ''), coalesce(p_gallery_image_urls, '[]'::jsonb), trim(p_content),
        p_status, case when p_status = 'published' then timezone('utc'::text, now()) else null end,
        auth.uid()::text, auth.uid()::text
    ) returning * into created_case_study;

    insert into public.audit_logs (entity_name, entity_id, action, actor_id, actor_role, payload)
    values (
        'case_study', created_case_study.id::text, 'create', auth.uid()::text, staff_role,
        jsonb_build_object('title', created_case_study.title, 'slug', created_case_study.slug, 'status', created_case_study.status)
    );

    return created_case_study;
end;
$$;

create or replace function public.update_case_study(
    p_id uuid,
    p_title text,
    p_slug text,
    p_summary text,
    p_client_type text,
    p_location text,
    p_service_scope text,
    p_surface_type text,
    p_paint_products_used jsonb,
    p_hero_image_url text,
    p_gallery_image_urls jsonb,
    p_content text,
    p_status text
)
returns public.case_studies
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
    staff_role text;
    existing_case_study public.case_studies;
    updated_case_study public.case_studies;
    audit_action text;
begin
    staff_role := public.current_staff_role();
    if staff_role is null then
        raise exception 'An active staff role and multi-factor verification are required.' using errcode = '42501';
    end if;

    select * into existing_case_study from public.case_studies where id = p_id for update;
    if not found then
        raise exception 'Case study not found.' using errcode = 'P0002';
    end if;

    update public.case_studies
    set
        title = trim(p_title),
        slug = trim(p_slug),
        summary = trim(p_summary),
        client_type = p_client_type,
        location = nullif(trim(p_location), ''),
        service_scope = p_service_scope,
        surface_type = nullif(trim(p_surface_type), ''),
        paint_products_used = coalesce(p_paint_products_used, '[]'::jsonb),
        hero_image_url = nullif(trim(p_hero_image_url), ''),
        gallery_image_urls = coalesce(p_gallery_image_urls, '[]'::jsonb),
        content = trim(p_content),
        status = p_status,
        published_at = case
            when p_status = 'published' and existing_case_study.status <> 'published' then timezone('utc'::text, now())
            when p_status = 'published' then existing_case_study.published_at
            else null
        end,
        updated_by = auth.uid()::text
    where id = p_id
    returning * into updated_case_study;

    audit_action := case when existing_case_study.status <> updated_case_study.status then 'status_change' else 'update' end;
    insert into public.audit_logs (entity_name, entity_id, action, actor_id, actor_role, payload)
    values (
        'case_study', updated_case_study.id::text, audit_action, auth.uid()::text, staff_role,
        jsonb_build_object(
            'title', updated_case_study.title,
            'slug', updated_case_study.slug,
            'previous_status', existing_case_study.status,
            'new_status', updated_case_study.status
        )
    );

    return updated_case_study;
end;
$$;

create or replace function public.set_case_study_status(p_id uuid, p_status text)
returns public.case_studies
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
    staff_role text;
    existing_case_study public.case_studies;
    updated_case_study public.case_studies;
    audit_action text;
begin
    staff_role := public.current_staff_role();
    if staff_role is null then
        raise exception 'An active staff role and multi-factor verification are required.' using errcode = '42501';
    end if;

    if p_status not in ('draft', 'published', 'archived') then
        raise exception 'Invalid case-study status.' using errcode = '22023';
    end if;

    select * into existing_case_study from public.case_studies where id = p_id for update;
    if not found then
        raise exception 'Case study not found.' using errcode = 'P0002';
    end if;

    update public.case_studies
    set
        status = p_status,
        published_at = case
            when p_status = 'published' and existing_case_study.status <> 'published' then timezone('utc'::text, now())
            when p_status = 'published' then existing_case_study.published_at
            else null
        end,
        updated_by = auth.uid()::text
    where id = p_id
    returning * into updated_case_study;

    audit_action := case when p_status = 'archived' then 'archive' else 'status_change' end;
    insert into public.audit_logs (entity_name, entity_id, action, actor_id, actor_role, payload)
    values (
        'case_study', updated_case_study.id::text, audit_action, auth.uid()::text, staff_role,
        jsonb_build_object('previous_status', existing_case_study.status, 'new_status', updated_case_study.status)
    );

    return updated_case_study;
end;
$$;

revoke all on function public.current_staff_role() from public;
revoke all on function public.create_case_study(text, text, text, text, text, text, text, jsonb, text, jsonb, text, text) from public;
revoke all on function public.update_case_study(uuid, text, text, text, text, text, text, text, jsonb, text, jsonb, text, text) from public;
revoke all on function public.set_case_study_status(uuid, text) from public;

grant execute on function public.current_staff_role() to authenticated;
grant execute on function public.create_case_study(text, text, text, text, text, text, text, jsonb, text, jsonb, text, text) to authenticated;
grant execute on function public.update_case_study(uuid, text, text, text, text, text, text, text, jsonb, text, jsonb, text, text) to authenticated;
grant execute on function public.set_case_study_status(uuid, text) to authenticated;
