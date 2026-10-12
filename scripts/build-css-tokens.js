#!/usr/bin/env node
// @ts-check
/**
 * build-css-tokens.js
 *
 * Converts design-tokens.tokens.json → src/styles/tokens.css
 *
 * Architecture
 * ─────────────────────────────────────────────────────────────────
 *  Layer 1 · Primitives   (internal)  --_p-<palette>-<step>
 *    Color palettes (primary, secondary, tertiary, neutral,
 *    neutral-variant, error) and key colors.
 *    Prefixed with --_p- to signal "do not use directly in UI".
 *
 *  Layer 2 · Color Roles  (public)    --color-<role>
 *    Semantic tokens used directly on the UI.  Values point to
 *    Layer 1 via var() references, so primitives remain the
 *    single source of truth.
 *
 *  Layer 3 · Typography   (public)    --font-<scale>-<prop>
 *    font-size, line-height, letter-spacing, font-weight,
 *    font-family per type scale step.
 *
 *  Layer 4 · Effects      (public)    --shadow-<name>
 *    drop-shadow shorthand values.
 *
 * Usage
 * ─────────────────────────────────────────────────────────────────
 *   node scripts/build-css-tokens.js
 *   # (or add to package.json scripts → "tokens": "node scripts/build-css-tokens.js")
 *
 * Output
 * ─────────────────────────────────────────────────────────────────
 *   src/styles/tokens.css   (committed alongside the script)
 *
 * Regenerate whenever design-tokens.tokens.json changes.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { resolve, join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

// ─── Paths ──────────────────────────────────────────────────────────────────

const ROOT       = resolve(__dirname, '..');
const TOKEN_FILE = join(ROOT, 'design-tokens.tokens.json');
const OUT_FILE   = join(ROOT, 'src', 'styles', 'tokens.css');

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Convert a token name like "primary container" to "primary-container".
 */
function slug(str) {
  return str
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-');
}

/**
 * Strip the alpha byte from Figma's 8-char hex colours (#rrggbbff → #rrggbb).
 * Convert semi-transparent colours to rgba().
 */
function normaliseHex(value) {
  if (typeof value !== 'string') return value;
  const m = value.match(/^#([0-9a-f]{6})([0-9a-f]{2})$/i);
  if (!m) return value;
  const alpha = m[2].toLowerCase();
  if (alpha === 'ff') return `#${m[1]}`;
  const a = parseInt(alpha, 16);
  const r = parseInt(m[1].slice(0, 2), 16);
  const g = parseInt(m[1].slice(2, 4), 16);
  const b = parseInt(m[1].slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${+(a / 255).toFixed(3)})`;
}

/**
 * Resolve a Figma alias like "{primitives.color palettes.primary.primary40}"
 * to a CSS var() reference pointing to the primitive layer.
 *
 * Alias path segments:
 *   [0] "primitives"
 *   [1] "color palettes" | "key colors"
 *   [2] palette name  e.g. "primary"
 *   [3] step name     e.g. "primary40"
 */
function resolveAlias(alias) {
  const inner = alias.replace(/^\{|\}$/g, '');
  const parts = inner.split('.');

  // {primitives.color palettes.<palette>.<step>}
  if (
    parts.length === 4 &&
    parts[0] === 'primitives' &&
    parts[1] === 'color palettes'
  ) {
    const palette = slug(parts[2]);  // e.g. "neutral-variant"
    const stepRaw = parts[3];        // e.g. "neutral variant40" or "primary40"
    // Extract trailing numeric portion (the step number)
    const num = stepRaw.match(/(\d+)$/)?.[1];
    if (!num) {
      console.warn(`  Could not extract step number from alias: ${alias}`);
      return alias;
    }
    return `var(--_p-${palette}-${num})`;
  }

  // {primitives.key colors.<name>}
  if (
    parts.length === 3 &&
    parts[0] === 'primitives' &&
    parts[1] === 'key colors'
  ) {
    return `var(--_p-key-${slug(parts[2])})`;
  }

  console.warn(`  Unresolved alias: ${alias}`);
  return alias;
}

// ─── Token file loading ───────────────────────────────────────────────────────

console.log('Reading', TOKEN_FILE);
const tokens = JSON.parse(readFileSync(TOKEN_FILE, 'utf8'));

// ─── Collect CSS lines ────────────────────────────────────────────────────────

const lines = [];

function comment(text) {
  lines.push(`\n  /* ── ${text} ── */`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// LAYER 1 · PRIMITIVE COLORS
// Internal. Prefixed --_p- to discourage direct use in component styles.
// ═══════════════════════════════════════════════════════════════════════════════

comment('LAYER 1 · PRIMITIVE COLORS  (internal — do not reference directly in component CSS)');

comment('Key colors');
const keyColors = tokens?.primitives?.['key colors'] ?? {};
for (const [name, token] of Object.entries(keyColors)) {
  if (token.type !== 'color') continue;
  const varName = `--_p-key-${slug(name)}`;
  lines.push(`  ${varName}: ${normaliseHex(token.value)};`);
}

comment('Color palettes');
const palettes = tokens?.primitives?.['color palettes'] ?? {};
for (const [paletteName, steps] of Object.entries(palettes)) {
  const paletteSlug = slug(paletteName); // e.g. "neutral-variant"
  comment(`Palette · ${paletteName}`);
  for (const [stepName, token] of Object.entries(steps)) {
    if (token.type !== 'color') continue;
    const num = stepName.match(/(\d+)$/)?.[1];
    if (!num) continue;
    const varName = `--_p-${paletteSlug}-${num}`;
    lines.push(`  ${varName}: ${normaliseHex(token.value)};`);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// LAYER 2 · COLOR ROLES
// Public. These are the variables component CSS must use.
// Each resolves to a primitive via var(), keeping primitives as source of truth.
// ═══════════════════════════════════════════════════════════════════════════════

comment('LAYER 2 · COLOR ROLES  (use these in all component CSS)');

const colorRoles = tokens?.['color roles'] ?? {};
for (const [roleName, token] of Object.entries(colorRoles)) {
  if (token.type !== 'color') continue;
  const varName = `--color-${slug(roleName)}`;
  const raw     = token.value;
  let cssValue;
  if (typeof raw === 'string' && raw.startsWith('{')) {
    cssValue = resolveAlias(raw);
  } else {
    cssValue = normaliseHex(raw);
  }
  lines.push(`  ${varName}: ${cssValue};`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// LAYER 3 · TYPOGRAPHY
// ═══════════════════════════════════════════════════════════════════════════════

comment('LAYER 3 · TYPOGRAPHY');

const typography = tokens?.typography ?? {};
for (const [scaleName, props] of Object.entries(typography)) {
  const scaleSlug = slug(scaleName); // e.g. "display-large"
  comment(`Type scale · ${scaleName}`);

  const get = (key) => props?.[key]?.value;

  const fontSize   = get('fontSize');
  const lineHeight = get('lineHeight');
  const letterSpac = get('letterSpacing');
  const fontWeight = get('fontWeight');
  const fontFamily = get('fontFamily');
  const fontStyle  = get('fontStyle');
  const textDecor  = get('textDecoration');
  const textCase   = get('textCase');

  if (fontSize   != null) lines.push(`  --font-${scaleSlug}-size: ${fontSize}px;`);
  if (lineHeight != null) lines.push(`  --font-${scaleSlug}-line-height: ${lineHeight}px;`);
  if (letterSpac != null) lines.push(`  --font-${scaleSlug}-letter-spacing: ${letterSpac}px;`);
  if (fontWeight != null) lines.push(`  --font-${scaleSlug}-weight: ${fontWeight};`);
  if (fontFamily != null) lines.push(`  --font-${scaleSlug}-family: "${fontFamily}", sans-serif;`);
  if (fontStyle  && fontStyle  !== 'normal') lines.push(`  --font-${scaleSlug}-style: ${fontStyle};`);
  if (textDecor  && textDecor  !== 'none')   lines.push(`  --font-${scaleSlug}-decoration: ${textDecor};`);
  if (textCase   && textCase   !== 'none')   lines.push(`  --font-${scaleSlug}-transform: ${textCase};`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// LAYER 4 · EFFECTS / SHADOWS
// ═══════════════════════════════════════════════════════════════════════════════

comment('LAYER 4 · SHADOWS');

const effects = tokens?.effect ?? {};
for (const [effectName, token] of Object.entries(effects)) {
  if (token.type !== 'custom-shadow') continue;
  const v         = token.value;
  const col       = normaliseHex(v.color);
  const spread    = v.spread ? `${v.spread}px ` : '';
  const boxShadow = `${v.offsetX}px ${v.offsetY}px ${v.radius}px ${spread}${col}`;
  const varName   = `--shadow-${slug(effectName)}`;
  lines.push(`  ${varName}: ${boxShadow};`);
}

// ─── Assemble output file ─────────────────────────────────────────────────────

const header = `/**
 * tokens.css — AUTO-GENERATED. DO NOT EDIT MANUALLY.
 *
 * Source of truth : design-tokens.tokens.json
 * Regenerate      : node scripts/build-css-tokens.js
 *
 * Variable name conventions
 * ────────────────────────────────────────────────────────────
 *  --_p-*          Primitive palette steps  (INTERNAL)
 *                  Prefixed with _ to mark as private.
 *                  Do NOT use these directly in component CSS.
 *
 *  --color-*       Semantic color roles     (PUBLIC)
 *                  These are the only color variables that
 *                  should appear in component / page CSS.
 *                  Each resolves to a primitive via var() so
 *                  the token file is the single source of truth.
 *
 *  --font-*        Typography scale tokens  (PUBLIC)
 *                  e.g. --font-display-large-size
 *                       --font-body-medium-line-height
 *
 *  --shadow-*      Shadow / elevation tokens (PUBLIC)
 *
 * Color system design
 * ────────────────────────────────────────────────────────────
 *  Primitives hold raw palette values (hue + lightness steps).
 *  Color roles give those values semantic meaning (primary,
 *  on-surface, error, etc.) and are what the UI consumes.
 *  Never skip the role layer — it makes theming and dark-mode
 *  overrides a matter of reassigning role values, not hunting
 *  through every component.
 *
 * Generated: ${new Date().toISOString()}
 */

:root {${lines.join('\n')}
}
`;

// ─── Write output ─────────────────────────────────────────────────────────────

const outDir = dirname(OUT_FILE);
if (!existsSync(outDir)) {
  mkdirSync(outDir, { recursive: true });
}

writeFileSync(OUT_FILE, header, 'utf8');
console.log('Written ->', OUT_FILE);
