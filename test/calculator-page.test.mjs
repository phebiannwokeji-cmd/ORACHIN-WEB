import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const htmlPath = resolve(process.cwd(), '.next/server/app/calculator.html');

test('Smoke test - Prerendered Calculator HTML exists and renders key elements', () => {
  assert.ok(existsSync(htmlPath), 'Production build HTML for calculator page must exist');
  const html = readFileSync(htmlPath, 'utf8');

  // Title and Header
  assert.match(html, /Paint Quantity Calculator/);

  // Unit Labels (calculator.md)
  assert.match(html, /Gross Wall Area \(m²\)/);
  assert.match(html, /Openings &amp; Windows Deductions \(m²\)/);
  assert.match(html, /Number of Coats/);
  assert.match(html, /Waste &amp; Roughness Allowance \(%\)/);

  // Critical Guidance
  assert.match(html, /Wall surface area is not floor area/);

  // Touch target & Accessibility
  assert.match(html, /min-h-touch-target/);
  assert.match(html, /Calculate Paint Quantity/);
});
