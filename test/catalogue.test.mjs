import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { PGlite } from '@electric-sql/pglite';

const migrationPath = resolve(process.cwd(), 'supabase/migrations/20261012000003_create_catalogue_tables.sql');
const fixturePath = resolve(process.cwd(), 'test/fixtures/catalogue-seed.sql');

async function setupTestDb() {
  const db = new PGlite();

  // Create standard Supabase roles
  await db.exec(`
    create role anon;
    create role authenticated;
    grant usage on schema public to anon, authenticated;
  `);

  // 1. Apply real migration
  const migrationSql = await readFile(migrationPath, 'utf8');
  await db.exec(migrationSql);

  // Grant select on tables to anon role per Supabase convention
  await db.exec(`
    grant select on public.catalogue_options to anon;
    grant select on public.products to anon;
    grant select on public.colours to anon;
    grant select on public.product_colours to anon;
    grant select on public.product_variants to anon;
  `);

  // 2. Apply test fixtures
  const fixtureSql = await readFile(fixturePath, 'utf8');
  await db.exec(fixtureSql);

  return db;
}

test('CAT01: Migrations contain no fixture rows or synthetic data', async () => {
  const migrationSql = await readFile(migrationPath, 'utf8');
  assert.doesNotMatch(migrationSql, /insert\s+into/i, 'Migration must contain zero INSERT statements');
  assert.doesNotMatch(migrationSql, /\[fixture\]/i, 'Migration must contain zero fixture references');
});

test('CAT01: Anonymous read returns published records only and denies draft/archived products', async () => {
  const db = await setupTestDb();

  // Verify superuser sees all 5 products
  const adminRes = await db.query('select count(*)::int as count from public.products;');
  assert.equal(adminRes.rows[0].count, 5);

  // Switch to anonymous role
  await db.exec('set role anon;');

  const anonRes = await db.query('select id, name, status from public.products;');
  // Should only see published products (3 of them: Product A, B, C)
  assert.equal(anonRes.rows.length, 3);
  for (const row of anonRes.rows) {
    assert.equal(row.status, 'published', 'Anonymous role must only see published products');
    assert.doesNotMatch(row.name, /draft|archived/i);
  }

  // Explicit query for draft product returns 0 rows
  const draftQuery = await db.query("select * from public.products where slug = 'fixture-unreleased-satin-draft';");
  assert.equal(draftQuery.rows.length, 0, 'Draft product must be invisible to anon');

  // Explicit query for archived product returns 0 rows
  const archivedQuery = await db.query("select * from public.products where slug = 'fixture-discontinued-primer-archived';");
  assert.equal(archivedQuery.rows.length, 0, 'Archived product must be invisible to anon');

  await db.exec('reset role;');
});

test('CAT01: Anonymous read returns published variants only and hides draft/archived variants', async () => {
  const db = await setupTestDb();

  await db.exec('set role anon;');

  const variantRes = await db.query('select id, sku, status from public.product_variants;');
  assert.equal(variantRes.rows.length, 2, 'Anonymous role must only see published variants');
  for (const row of variantRes.rows) {
    assert.equal(row.status, 'published');
  }

  // Explicit check for draft variant
  const draftVariant = await db.query("select * from public.product_variants where sku = 'FIX-BLU-SAT-4L-DRAFT';");
  assert.equal(draftVariant.rows.length, 0, 'Draft variant must be invisible to anon');

  await db.exec('reset role;');
});

test('CAT01: Anonymous cannot insert, update or delete on catalogue tables', async () => {
  const db = await setupTestDb();

  await db.exec('set role anon;');

  // 1. Insert attempt
  await assert.rejects(
    db.query(`
      insert into public.products (name, slug, description, category, use_environment, preparation)
      values ('Hacked Product', 'hacked-product', 'Malicious insert', 'emulsion', 'exterior', 'None');
    `),
    /permission denied/i,
    'Anonymous INSERT must be rejected'
  );

  // 2. Update attempt
  await assert.rejects(
    db.query("update public.products set name = 'Defaced' where slug = 'fixture-weathershield-per-coat';"),
    /permission denied/i,
    'Anonymous UPDATE must be rejected'
  );

  // 3. Delete attempt
  await assert.rejects(
    db.query("delete from public.products where slug = 'fixture-weathershield-per-coat';"),
    /permission denied/i,
    'Anonymous DELETE must be rejected'
  );

  await db.exec('reset role;');
});

test('CAT01 / CAT02: Unique constraints enforce unique slug and unique SKU', async () => {
  const db = await setupTestDb();

  // Duplicate slug on products
  await assert.rejects(
    db.query(`
      insert into public.products (
        name, slug, description, category, use_environment, preparation
      ) values (
        '[FIXTURE] Duplicate Slug Product',
        'fixture-weathershield-per-coat',
        'Duplicate slug test',
        'emulsion',
        'exterior',
        'None'
      );
    `),
    /duplicate key value violates unique constraint/i,
    'Duplicate product slug must be rejected'
  );

  // Duplicate SKU on product_variants
  await assert.rejects(
    db.query(`
      insert into public.product_variants (
        product_id, colour_id, finish, pack_size_litres, sku
      ) values (
        '10000000-0000-0000-0000-000000000001',
        '20000000-0000-0000-0000-000000000001',
        'matt',
        4.0,
        'FIX-WHT-MATT-20L'
      );
    `),
    /duplicate key value violates unique constraint/i,
    'Duplicate variant SKU must be rejected'
  );
});

test('COL01: Relational constraint rejects an incompatible colour and product pair', async () => {
  const db = await setupTestDb();

  // Colour 3 (Forest Moss) is compatible with Product B, but NOT Product A.
  // Attempting to create a variant of Product A with Colour 3 must be rejected by foreign key constraint!
  await assert.rejects(
    db.query(`
      insert into public.product_variants (
        product_id, colour_id, finish, pack_size_litres, sku
      ) values (
        '10000000-0000-0000-0000-000000000001',
        '20000000-0000-0000-0000-000000000003',
        'matt',
        4.0,
        'FIX-INCOMPATIBLE-COLOUR'
      );
    `),
    /violates foreign key constraint "fk_variant_product_colour_compatibility"/i,
    'Incompatible colour and product pair must be rejected at database level'
  );
});
