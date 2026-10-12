import type { ProductCoverageInfo } from './arithmetic.ts';

/**
 * Sample products for demo and development environments ONLY.
 * Guarded against production exposure per calculator.md and PRD G9.
 */
const SAMPLE_PRODUCTS: ProductCoverageInfo[] = [
  {
    name: 'Sample Interior Emulsion (Demo Only - Per-Coat Coverage)',
    coverageM2PerLitre: 10,
    coverageBasis: 'per_coat',
    recommendedCoats: 2,
    packSizesLitres: [1, 4, 20],
    preparation: 'Ensure wall surface is clean, dry, sound, and free from grease or dust before painting.',
  },
  {
    name: 'Sample Textured Exterior Coating (Demo Only - Complete-System Coverage)',
    coverageM2PerLitre: 5,
    coverageBasis: 'complete_system',
    recommendedCoats: 1,
    packSizesLitres: [4, 20],
    preparation: 'Remove existing peeling paint, fill masonry cracks, and treat any fungal growth prior to application.',
  },
  {
    name: 'Sample Specialty Protective Coating (Demo Only - No Coverage Data)',
    coverageM2PerLitre: null,
    coverageBasis: null,
    recommendedCoats: 2,
    packSizesLitres: [4, 20],
    preparation: 'Industrial surface preparation required; contact ORACHIN technical support for specifications.',
  },
];

/**
 * Returns sample products in development and test environments only.
 * In production builds, returns an empty array to prevent synthetic fixtures from being exposed.
 */
export function getCalculatorProducts(): ProductCoverageInfo[] {
  if (process.env.NODE_ENV === 'production') {
    // Production builds must not leak synthetic sample fixtures (G9 / Catalogue rule)
    return [];
  }
  return SAMPLE_PRODUCTS;
}

export function isSampleDataActive(): boolean {
  return process.env.NODE_ENV !== 'production';
}
