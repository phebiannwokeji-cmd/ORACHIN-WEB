import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

import { BUSINESS_CONFIG, isProjectsPublicDisplayCleared } from '../src/lib/config/business.ts';

const htmlPath = resolve(process.cwd(), '.next/server/app/index.html');

test('Smoke test - Prerendered HomePage HTML exists and contains hero content', () => {
  assert.ok(existsSync(htmlPath), 'Production build HTML for home page must exist');
  const html = readFileSync(htmlPath, 'utf8');
  assert.match(html, /Architectural &amp; Industrial Coatings Manufactured in Lagos/);
  assert.match(html, /Supplying high-performance exterior and interior paints/);
});

test('Site-Structure.md - Header renders all five required primary navigation labels', () => {
  const html = readFileSync(htmlPath, 'utf8');
  const expectedLabels = [
    'Shop Paints',
    'Colours',
    'Help Me Choose',
    'Commercial and Bulk',
    'Contact and Delivery',
  ];

  for (const label of expectedLabels) {
    assert.match(html, new RegExp(label), `Missing navigation label: ${label}`);
  }
});

test('Site-Structure.md / Gate G9 - Footer hides Projects while Gate G9 is active', () => {
  assert.equal(isProjectsPublicDisplayCleared(), false);
  const html = readFileSync(htmlPath, 'utf8');
  assert.doesNotMatch(html, /href="\/projects"/);
});

test('Site-Structure.md - MobileContactBar renders three actions with verified contacts and hours', () => {
  const html = readFileSync(htmlPath, 'utf8');
  assert.match(html, /Quote Request/);
  assert.match(html, /WhatsApp/);
  assert.match(html, /Call/);
  assert.match(html, new RegExp(BUSINESS_CONFIG.responders.primary));
  assert.match(html, new RegExp(BUSINESS_CONFIG.responders.deputy));
  assert.match(html, /9am–5pm/);
});

test('Security / Indexing - Prerendered HTML contains noindex robots meta tag', () => {
  const html = readFileSync(htmlPath, 'utf8');
  assert.match(html, /<meta name="robots" content="noindex, nofollow"\/>/);
});
