-- test/fixtures/catalogue-seed.sql
-- Development and test fixture data only. NEVER RUN IN PRODUCTION.
-- Every row is explicitly labelled with [FIXTURE] and FIX- prefix.

-- 1. Fixture Options
insert into public.catalogue_options (id, option_type, code, label, sort_order, is_active) values
('00000000-0000-0000-0000-000000000001', 'finish', 'matt', '[FIXTURE] Matt Finish', 1, true),
('00000000-0000-0000-0000-000000000002', 'finish', 'satin', '[FIXTURE] Satin Finish', 2, true),
('00000000-0000-0000-0000-000000000003', 'pack_size', '4l', '[FIXTURE] 4 Litres', 1, true),
('00000000-0000-0000-0000-000000000004', 'pack_size', '20l', '[FIXTURE] 20 Litres', 2, true),
('00000000-0000-0000-0000-000000000005', 'category', 'emulsion', '[FIXTURE] Premium Emulsion', 1, true),
('00000000-0000-0000-0000-000000000006', 'surface', 'masonry', '[FIXTURE] Masonry & Plaster', 1, true),
('00000000-0000-0000-0000-000000000007', 'use', 'exterior', '[FIXTURE] Exterior', 1, true)
on conflict do nothing;

-- 2. Fixture Products
-- Product A: per-coat coverage (10 m2/L per coat)
insert into public.products (
    id, name, slug, description, category, surfaces, use_environment, preparation,
    recommended_coats, coverage_m2_per_litre, coverage_basis, drying_hours, recoat_hours, status
) values (
    '10000000-0000-0000-0000-000000000001',
    '[FIXTURE] WeatherShield Per-Coat Emulsion',
    'fixture-weathershield-per-coat',
    '[FIXTURE] Exterior weather-resistant acrylic emulsion.',
    'emulsion',
    array['masonry', 'concrete'],
    'exterior',
    'Clean surface thoroughly. Ensure dry before application.',
    2,
    10.0,
    'per_coat',
    2.0,
    4.0,
    'published'
);

-- Product B: complete-system coverage (5 m2/L complete system)
insert into public.products (
    id, name, slug, description, category, surfaces, use_environment, preparation,
    recommended_coats, coverage_m2_per_litre, coverage_basis, drying_hours, recoat_hours, status
) values (
    '10000000-0000-0000-0000-000000000002',
    '[FIXTURE] DuraCoat Complete-System Acrylic',
    'fixture-duracoat-complete-system',
    '[FIXTURE] High-build exterior masonry protection system.',
    'acrylic',
    array['masonry'],
    'exterior',
    'Prime with approved sealer.',
    2,
    5.0,
    'complete_system',
    4.0,
    8.0,
    'published'
);

-- Product C: product with no approved coverage data (null coverage)
insert into public.products (
    id, name, slug, description, category, surfaces, use_environment, preparation,
    recommended_coats, coverage_m2_per_litre, coverage_basis, drying_hours, recoat_hours, status
) values (
    '10000000-0000-0000-0000-000000000003',
    '[FIXTURE] Artisan Texture Finish (No Coverage)',
    'fixture-artisan-texture-no-coverage',
    '[FIXTURE] Decorative specialty finish requiring specialist assessment.',
    'specialty',
    array['interior_plaster'],
    'interior',
    'Smooth plaster base required.',
    1,
    null,
    null,
    6.0,
    12.0,
    'published'
);

-- Product D: Draft product (invisible to anonymous)
insert into public.products (
    id, name, slug, description, category, surfaces, use_environment, preparation,
    recommended_coats, coverage_m2_per_litre, coverage_basis, status
) values (
    '10000000-0000-0000-0000-000000000004',
    '[FIXTURE] Unreleased Satin Enamel (Draft)',
    'fixture-unreleased-satin-draft',
    '[FIXTURE] Product awaiting commercial signoff.',
    'enamel',
    array['wood', 'metal'],
    'interior',
    'Sand and prime.',
    2,
    12.0,
    'per_coat',
    'draft'
);

-- Product E: Archived product (invisible to anonymous)
insert into public.products (
    id, name, slug, description, category, surfaces, use_environment, preparation,
    recommended_coats, coverage_m2_per_litre, coverage_basis, status
) values (
    '10000000-0000-0000-0000-000000000005',
    '[FIXTURE] Discontinued Primer (Archived)',
    'fixture-discontinued-primer-archived',
    '[FIXTURE] Retired formulation.',
    'primer',
    array['plaster'],
    'interior',
    'Dust off.',
    1,
    8.0,
    'per_coat',
    'archived'
);

-- 3. Fixture Colours
insert into public.colours (id, name, code, hex, status) values
('20000000-0000-0000-0000-000000000001', '[FIXTURE] Signal White', 'FIX-WHT', '#ffffff', 'active'),
('20000000-0000-0000-0000-000000000002', '[FIXTURE] Coastal Blue', 'FIX-BLU', '#204080', 'active'),
('20000000-0000-0000-0000-000000000003', '[FIXTURE] Forest Moss', 'FIX-MOS', '#2a5530', 'active');

-- 4. Product-Colour Compatibility (COL01)
-- Signal White and Coastal Blue fit Product A (WeatherShield)
insert into public.product_colours (id, product_id, colour_id) values
('30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001'),
('30000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002');

-- Forest Moss fits Product B (DuraCoat) ONLY (does NOT fit Product A)
insert into public.product_colours (id, product_id, colour_id) values
('30000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000003');

-- 5. Product Variants
-- Product A variants
insert into public.product_variants (
    id, product_id, colour_id, finish, pack_size_litres, sku, lead_time_days, availability, price_state, status
) values (
    '40000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001',
    'matt',
    20.0,
    'FIX-WHT-MATT-20L',
    3,
    'made_to_order',
    'quote_only',
    'published'
);

-- Product B variants
insert into public.product_variants (
    id, product_id, colour_id, finish, pack_size_litres, sku, lead_time_days, availability, price_state, status
) values (
    '40000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000002',
    '20000000-0000-0000-0000-000000000003',
    'satin',
    20.0,
    'FIX-DUR-MOS-20L',
    3,
    'made_to_order',
    'quote_only',
    'published'
);

-- Draft variant for Product A
insert into public.product_variants (
    id, product_id, colour_id, finish, pack_size_litres, sku, lead_time_days, availability, price_state, status
) values (
    '40000000-0000-0000-0000-000000000003',
    '10000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000002',
    'satin',
    4.0,
    'FIX-BLU-SAT-4L-DRAFT',
    3,
    'made_to_order',
    'quote_only',
    'draft'
);
