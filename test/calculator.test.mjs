import test from 'node:test';
import assert from 'node:assert/strict';

import {
  calculatePaintQuantity,
  optimizePacks,
  parseToFraction,
  createFraction,
  compareFractions,
} from '../src/lib/calculator/arithmetic.ts';
import { getCalculatorProducts } from '../src/lib/calculator/samples.ts';

const standardProduct = {
  name: 'Sample Interior Emulsion',
  coverageM2PerLitre: 10,
  coverageBasis: 'per_coat',
  recommendedCoats: 2,
  packSizesLitres: [1, 4, 20],
  preparation: 'Clean surface before painting.',
};

const completeSystemProduct = {
  name: 'Sample Textured Coating',
  coverageM2PerLitre: 5,
  coverageBasis: 'complete_system',
  recommendedCoats: 1,
  packSizesLitres: [4, 20],
  preparation: 'Wash surface thoroughly.',
};

const missingCoverageProduct = {
  name: 'Sample Specialty Paint',
  coverageM2PerLitre: null,
  coverageBasis: null,
  recommendedCoats: 2,
  packSizesLitres: [4, 20],
};

test('CALC01: 100 m², 2 coats, 10 m²/L returns exactly 20 litres and 1 pack', () => {
  const result = calculatePaintQuantity({
    grossAreaM2: 100,
    deductionsM2: 0,
    coats: 2,
    allowancePercent: 0,
    product: standardProduct,
  });

  assert.equal(result.success, true);
  if (result.success) {
    assert.equal(result.netAreaM2, 100);
    assert.equal(result.coats, 2);
    assert.equal(result.coverageM2PerLitre, 10);
    assert.equal(result.coverageBasis, 'per_coat');
    assert.equal(result.estimatedLitres, 20);
    assert.equal(result.estimatedLitresFormatted, '20');
    assert.equal(result.suppliedLitres, 20);
    assert.equal(result.totalPacksCount, 1);
    assert.deepEqual(result.packs, [{ sizeLitres: 20, count: 1 }]);
    assert.equal(result.summaryText, 'about 20 litres, so 1 pack(s)');
    assert.equal(result.suppliedText, 'Supplied: 20 litres (1 × 20L)');
  }
});

test('CALC01: Rejects product with missing coverage and flags contact guidance', () => {
  const result = calculatePaintQuantity({
    grossAreaM2: 100,
    deductionsM2: 0,
    coats: 2,
    product: missingCoverageProduct,
  });

  assert.equal(result.success, false);
  if (!result.success) {
    assert.equal(result.missingCoverage, true);
    assert.ok(result.errors.product.includes('approved coverage specifications'));
  }
});

test('CALC01: Rejects non-finite, zero, or negative gross area', () => {
  const zeroRes = calculatePaintQuantity({
    grossAreaM2: 0,
    product: standardProduct,
  });
  assert.equal(zeroRes.success, false);
  assert.ok(zeroRes.errors.grossArea);

  const negRes = calculatePaintQuantity({
    grossAreaM2: -50,
    product: standardProduct,
  });
  assert.equal(negRes.success, false);
  assert.ok(negRes.errors.grossArea);

  const nonFiniteRes = calculatePaintQuantity({
    grossAreaM2: 'abc',
    product: standardProduct,
  });
  assert.equal(nonFiniteRes.success, false);
  assert.ok(nonFiniteRes.errors.grossArea);
});

test('CALC01: Allows zero deductions; rejects negative deductions and deductions > gross area', () => {
  // Zero deductions is valid
  const zeroDed = calculatePaintQuantity({
    grossAreaM2: 50,
    deductionsM2: 0,
    coats: 2,
    product: standardProduct,
  });
  assert.equal(zeroDed.success, true);
  if (zeroDed.success) {
    assert.equal(zeroDed.netAreaM2, 50);
  }

  // Negative deductions rejected
  const negDed = calculatePaintQuantity({
    grossAreaM2: 50,
    deductionsM2: -5,
    product: standardProduct,
  });
  assert.equal(negDed.success, false);
  assert.ok(negDed.errors.deductions);

  // Deductions exceeding gross area rejected
  const excessDed = calculatePaintQuantity({
    grossAreaM2: 50,
    deductionsM2: 55,
    product: standardProduct,
  });
  assert.equal(excessDed.success, false);
  assert.ok(excessDed.errors.deductions.includes('cannot exceed gross'));
});

test('CALC01: Zero net area (grossArea equals deductions) returns zero litres and zero packs', () => {
  const result = calculatePaintQuantity({
    grossAreaM2: 50,
    deductionsM2: 50,
    coats: 2,
    product: standardProduct,
  });

  assert.equal(result.success, true);
  if (result.success) {
    assert.equal(result.netAreaM2, 0);
    assert.equal(result.estimatedLitres, 0);
    assert.equal(result.suppliedLitres, 0);
    assert.equal(result.totalPacksCount, 0);
    assert.deepEqual(result.packs, []);
    assert.equal(result.summaryText, 'about 0 litres, so 0 pack(s)');
  }
});

test('CALC01: Rejects negative, zero, and non-integer coat counts', () => {
  const zeroCoats = calculatePaintQuantity({
    grossAreaM2: 50,
    coats: 0,
    product: standardProduct,
  });
  assert.equal(zeroCoats.success, false);
  assert.ok(zeroCoats.errors.coats);

  const floatCoats = calculatePaintQuantity({
    grossAreaM2: 50,
    coats: 2.5,
    product: standardProduct,
  });
  assert.equal(floatCoats.success, false);
  assert.ok(floatCoats.errors.coats);
});

test('CALC01: Complete-system coverage does not multiply area by coat count', () => {
  // 50 m², coats input 3, coverage 5 m²/L complete_system -> 50 / 5 = 10 litres (not 50 * 3 / 5 = 30)
  const result = calculatePaintQuantity({
    grossAreaM2: 50,
    deductionsM2: 0,
    coats: 3,
    allowancePercent: 0,
    product: completeSystemProduct,
  });

  assert.equal(result.success, true);
  if (result.success) {
    assert.equal(result.estimatedLitres, 10);
    assert.equal(result.coverageBasis, 'complete_system');
    assert.equal(result.suppliedLitres, 12); // packs [4, 20] -> 3 x 4L = 12L (closest >= 10)
    assert.deepEqual(result.packs, [{ sizeLitres: 4, count: 3 }]);
  }
});

test('CALC01: Allowance percentage increases estimated litres without float loss', () => {
  // 100 m², 1 coat, 10 m²/L = 10 litres base. + 10% allowance = 11 litres.
  const result = calculatePaintQuantity({
    grossAreaM2: 100,
    deductionsM2: 0,
    coats: 1,
    allowancePercent: 10,
    product: standardProduct,
  });

  assert.equal(result.success, true);
  if (result.success) {
    assert.equal(result.estimatedLitres, 11);
    assert.equal(result.suppliedLitres, 11); // 2 x 4L + 3 x 1L = 11L
  }
});

test('CALC01: Pack rounding at an exact multiple and just above', () => {
  // Need exactly 20 litres with [1, 4, 20] -> 1 x 20L
  const exactRes = optimizePacks(parseToFraction(20), [1, 4, 20]);
  assert.equal(exactRes.suppliedLitres, 20);
  assert.equal(exactRes.totalCount, 1);
  assert.deepEqual(exactRes.packs, [{ sizeLitres: 20, count: 1 }]);

  // Need 20.5 litres with [1, 4, 20] -> 1 x 20L + 1 x 1L = 21L (2 packs)
  const justAboveRes = optimizePacks(parseToFraction('20.5'), [1, 4, 20]);
  assert.equal(justAboveRes.suppliedLitres, 21);
  assert.equal(justAboveRes.totalCount, 2);
  assert.deepEqual(justAboveRes.packs, [
    { sizeLitres: 20, count: 1 },
    { sizeLitres: 1, count: 1 },
  ]);
});

test('CALC01: Tie-breaker selects combination with fewer total packs', () => {
  // Need 4 litres with packs [1, 4]:
  // 1 x 4L = 4L (1 pack) vs 4 x 1L = 4L (4 packs) -> must choose 1 pack
  const res = optimizePacks(parseToFraction(4), [1, 4]);
  assert.equal(res.suppliedLitres, 4);
  assert.equal(res.totalCount, 1);
  assert.deepEqual(res.packs, [{ sizeLitres: 4, count: 1 }]);
});

test('CALC01: Production environment prevents sample data leakage (Gate G9)', () => {
  const originalEnv = process.env.NODE_ENV;
  try {
    process.env.NODE_ENV = 'production';
    const prodProducts = getCalculatorProducts();
    assert.equal(prodProducts.length, 0, 'Production environment must return zero sample products');
  } finally {
    process.env.NODE_ENV = originalEnv;
  }
});
