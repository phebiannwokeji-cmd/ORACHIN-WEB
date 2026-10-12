-- Migration: 20261012000003_create_catalogue_tables.sql
-- Scope: CAT01, CAT02, COL01 (§1, §2, catalogue.md, data-integrity.md, security.md)
-- Contains schema definitions, constraints, and RLS policies ONLY. Zero data in migrations.

-- gen_random_uuid() is built-in from Postgres 14+; no extension required.
-- Supabase ships Postgres 15+ so this is always available.

-- 1. Catalogue Options Lookup Table (Finishes, Pack sizes, Categories, Surfaces, Use)
create table if not exists public.catalogue_options (
    id uuid primary key default gen_random_uuid(),
    option_type text not null check (option_type in ('finish', 'pack_size', 'category', 'surface', 'use')),
    code text not null check (code ~ '^[a-z0-9_]+$'),
    label text not null check (char_length(trim(label)) > 0),
    sort_order integer not null default 0,
    is_active boolean not null default true,
    created_at timestamptz not null default timezone('utc'::text, now()),
    constraint uq_catalogue_options_type_code unique (option_type, code)
);

-- 2. Core Products Table
create table if not exists public.products (
    id uuid primary key default gen_random_uuid(),
    name text not null check (char_length(trim(name)) > 0),
    slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
    description text not null check (char_length(trim(description)) > 0),
    category text not null check (char_length(trim(category)) > 0),
    surfaces text[] not null default '{}'::text[],
    use_environment text not null check (use_environment in ('interior', 'exterior', 'interior_exterior')),
    preparation text not null check (char_length(trim(preparation)) > 0),
    recommended_coats integer not null default 2 check (recommended_coats > 0),
    coverage_m2_per_litre numeric check (coverage_m2_per_litre > 0),
    coverage_basis text check (coverage_basis in ('per_coat', 'complete_system')),
    drying_hours numeric check (drying_hours >= 0),
    recoat_hours numeric check (recoat_hours >= 0),
    images jsonb not null default '[]'::jsonb,
    documents jsonb not null default '[]'::jsonb,
    status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
    published_at timestamptz,
    created_at timestamptz not null default timezone('utc'::text, now()),
    updated_at timestamptz not null default timezone('utc'::text, now()),
    constraint chk_product_coverage_consistency check (
        (coverage_m2_per_litre is null and coverage_basis is null) or
        (coverage_m2_per_litre is not null and coverage_basis is not null)
    )
);

-- 3. Approved Colours Table
create table if not exists public.colours (
    id uuid primary key default gen_random_uuid(),
    name text not null check (char_length(trim(name)) > 0),
    code text not null unique check (code ~ '^[a-zA-Z0-9_-]+$'),
    hex text check (hex ~* '^#[0-9a-f]{6}$'),
    status text not null default 'active' check (status in ('active', 'archived')),
    created_at timestamptz not null default timezone('utc'::text, now()),
    updated_at timestamptz not null default timezone('utc'::text, now())
);

-- 4. Product-Colour Compatibility Junction
create table if not exists public.product_colours (
    id uuid primary key default gen_random_uuid(),
    product_id uuid not null references public.products(id) on delete restrict,
    colour_id uuid not null references public.colours(id) on delete restrict,
    created_at timestamptz not null default timezone('utc'::text, now()),
    constraint uq_product_colours unique (product_id, colour_id)
);

-- 5. Product Variants Table
create table if not exists public.product_variants (
    id uuid primary key default gen_random_uuid(),
    product_id uuid not null references public.products(id) on delete restrict,
    colour_id uuid references public.colours(id) on delete restrict,
    finish text not null check (char_length(trim(finish)) > 0),
    pack_size_litres numeric not null check (pack_size_litres > 0),
    sku text not null unique check (sku ~ '^[a-zA-Z0-9_-]+$'),
    lead_time_days integer not null default 3 check (lead_time_days >= 0),
    availability text not null default 'made_to_order' check (availability in ('made_to_order', 'available', 'unavailable')),
    price_state text not null default 'quote_only' check (price_state = 'quote_only'),
    status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
    created_at timestamptz not null default timezone('utc'::text, now()),
    updated_at timestamptz not null default timezone('utc'::text, now()),
    -- Relational enforcement: when colour_id is specified, the pair (product_id, colour_id) MUST exist in product_colours
    constraint fk_variant_product_colour_compatibility
        foreign key (product_id, colour_id)
        references public.product_colours(product_id, colour_id)
        on delete restrict
);

-- 6. Indexes for Filter and Lookup Performance
create index if not exists idx_products_category on public.products (category);
create index if not exists idx_products_status on public.products (status);
create index if not exists idx_products_use on public.products (use_environment);
create index if not exists idx_product_variants_product on public.product_variants (product_id);
create index if not exists idx_product_variants_sku on public.product_variants (sku);
create index if not exists idx_product_colours_product on public.product_colours (product_id);
create index if not exists idx_product_colours_colour on public.product_colours (colour_id);

-- 7. Row Level Security — Deny by default on all tables
alter table public.catalogue_options enable row level security;
alter table public.products enable row level security;
alter table public.colours enable row level security;
alter table public.product_colours enable row level security;
alter table public.product_variants enable row level security;

-- 8. Anonymous Read Access Policies (Published records only, zero writes)
create policy catalogue_options_anon_select
    on public.catalogue_options
    for select
    to anon
    using (is_active = true);

create policy products_anon_select
    on public.products
    for select
    to anon
    using (status = 'published');

create policy colours_anon_select
    on public.colours
    for select
    to anon
    using (status = 'active');

create policy product_colours_anon_select
    on public.product_colours
    for select
    to anon
    using (
        exists (
            select 1 from public.products p
            where p.id = product_colours.product_id
              and p.status = 'published'
        )
    );

create policy product_variants_anon_select
    on public.product_variants
    for select
    to anon
    using (
        status = 'published'
        and exists (
            select 1 from public.products p
            where p.id = product_variants.product_id
              and p.status = 'published'
        )
    );

-- Zero write policies created for anon role. Public INSERT, UPDATE, DELETE are denied by default.
