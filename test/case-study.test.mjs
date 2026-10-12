import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import { isProjectsPublicDisplayCleared } from '../src/lib/config/business.ts';
import { caseStudySchema } from '../src/types/case-study.ts';

test('ADM01 / G9 - Case Study Schema Validation: Valid input passes', () => {
  const validInput = {
    title: 'Lekki Commercial Office Complex',
    slug: 'lekki-commercial-office-complex',
    summary: 'Full exterior weather-resistant coating and anti-fungal emulsion application.',
    client_type: 'commercial',
    service_scope: 'supply_and_application',
    content: 'Full surface preparation and 3-coat application of high-durability acrylic binder.',
    status: 'draft',
    paint_products_used: [
      { product_name: 'Approved exterior coating', finish: 'Matt', colour_name: 'Approved colour' }
    ]
  };

  const parsed = caseStudySchema.safeParse(validInput);
  assert.equal(parsed.success, true);
  if (parsed.success) {
    assert.equal(parsed.data.status, 'draft');
    assert.equal(parsed.data.slug, 'lekki-commercial-office-complex');
  }
});

test('ADM01 / G9 - Case Study Schema Validation: Rejects invalid uppercase or spaced slug', () => {
  const invalidSlugInput = {
    title: 'Lekki Office',
    slug: 'Lekki Office Invalid!',
    summary: 'Exterior weather-resistant coating and anti-fungal emulsion application.',
    client_type: 'commercial',
    service_scope: 'supply_and_application',
    content: 'Full surface preparation and 3-coat application of high-durability acrylic binder.',
    status: 'draft'
  };

  const parsed = caseStudySchema.safeParse(invalidSlugInput);
  assert.equal(parsed.success, false);
  const issues = parsed.error.issues || parsed.error.errors;
  assert.match(issues[0].message, /Slug must be lowercase alphanumeric/);
});

test('ADM01 / G9 - Case Study Schema Validation: Rejects too short narrative content', () => {
  const shortContentInput = {
    title: 'Lekki Office',
    slug: 'lekki-office',
    summary: 'Exterior weather-resistant coating and anti-fungal emulsion application.',
    client_type: 'commercial',
    service_scope: 'supply_and_application',
    content: 'Too short', // less than 20 chars
    status: 'draft'
  };

  const parsed = caseStudySchema.safeParse(shortContentInput);
  assert.equal(parsed.success, false);
});

test('ADM01 / G9 - Decision Gate G9 Enforcement: Public view is gated when G9 flag is false', () => {
  assert.equal(isProjectsPublicDisplayCleared(), false);
});

test('ADM01 / Data integrity - migration exposes only audited case-study writes', async () => {
  const migration = await readFile(new URL('../supabase/migrations/20261012000002_secure_case_studies.sql', import.meta.url), 'utf8');

  assert.match(migration, /create or replace function public\.create_case_study/);
  assert.match(migration, /create or replace function public\.update_case_study/);
  assert.match(migration, /create or replace function public\.set_case_study_status/);
  assert.match(migration, /insert into public\.audit_logs/g);
  assert.match(migration, /revoke all on table public\.audit_logs from anon, authenticated/);
});
