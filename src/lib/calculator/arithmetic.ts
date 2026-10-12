/**
 * Pure arithmetic and validation module for the ORACHIN Paints Quantity Calculator.
 * Requirements: CALC01, calculator.md, data-integrity.md.
 *
 * Rules:
 * - Reject non-finite, negative inputs.
 * - Require positive area, coverage, and coat count.
 * - Allow zero deductions (<= gross area) and zero allowance.
 * - Treat zero net area as zero packs.
 * - Calculate litres as:
 *     per_coat: (netArea * coats) / coverage + allowance
 *     complete_system: netArea / coverage + allowance
 * - Avoid floats: exact rational/integer calculations.
 * - Round positive needs up to whole packs.
 * - Optimization (Agent default AD-2026-10-12-02):
 *     Choose the pack combination with the fewest supplied litres at or above the need,
 *     and fewer packs on a tie.
 */

export interface ProductCoverageInfo {
  name: string;
  coverageM2PerLitre?: number | null;
  coverageBasis?: 'per_coat' | 'complete_system' | null;
  recommendedCoats?: number | null;
  packSizesLitres: number[];
  preparation?: string | null;
}

export interface CalculatorInputs {
  grossAreaM2: number | string;
  deductionsM2?: number | string;
  coats?: number | string;
  allowancePercent?: number | string;
  product: ProductCoverageInfo;
}

export interface PackAllocation {
  sizeLitres: number;
  count: number;
}

export interface CalculatorSuccessResult {
  success: true;
  grossAreaM2: number;
  deductionsM2: number;
  netAreaM2: number;
  coats: number;
  coverageM2PerLitre: number;
  coverageBasis: 'per_coat' | 'complete_system';
  allowancePercent: number;
  estimatedLitres: number;
  estimatedLitresFormatted: string;
  suppliedLitres: number;
  packs: PackAllocation[];
  totalPacksCount: number;
  summaryText: string;
  suppliedText: string;
  disclaimer: string;
  preparation?: string;
}

export interface CalculatorErrorResult {
  success: false;
  errors: Record<string, string>;
  missingCoverage?: boolean;
}

export type CalculatorResult = CalculatorSuccessResult | CalculatorErrorResult;

export interface Fraction {
  num: bigint;
  den: bigint;
}

function gcd(a: bigint, b: bigint): bigint {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;
  while (y !== 0n) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x;
}

export function createFraction(num: bigint, den: bigint): Fraction {
  if (den === 0n) throw new Error('Division by zero');
  if (den < 0n) {
    num = -num;
    den = -den;
  }
  const g = gcd(num, den);
  return { num: num / g, den: den / g };
}

export function parseToFraction(val: number | string): Fraction | null {
  const str = String(val).trim();
  if (!str) return null;

  const numVal = Number(str);
  if (!Number.isFinite(numVal)) return null;

  const parts = str.split('.');
  if (parts.length === 1) {
    return createFraction(BigInt(parts[0]), 1n);
  }
  if (parts.length === 2) {
    const intPart = parts[0];
    const fracPart = parts[1];
    const den = 10n ** BigInt(fracPart.length);
    const num = BigInt(intPart) * den + (intPart.startsWith('-') ? -BigInt(fracPart) : BigInt(fracPart));
    return createFraction(num, den);
  }
  return null;
}

export function addFractions(a: Fraction, b: Fraction): Fraction {
  return createFraction(a.num * b.den + b.num * a.den, a.den * b.den);
}

export function subtractFractions(a: Fraction, b: Fraction): Fraction {
  return createFraction(a.num * b.den - b.num * a.den, a.den * b.den);
}

export function multiplyFractions(a: Fraction, b: Fraction): Fraction {
  return createFraction(a.num * b.num, a.den * b.den);
}

export function divideFractions(a: Fraction, b: Fraction): Fraction {
  return createFraction(a.num * b.den, a.den * b.num);
}

export function compareFractions(a: Fraction, b: Fraction): number {
  const diff = a.num * b.den - b.num * a.den;
  if (diff < 0n) return -1;
  if (diff > 0n) return 1;
  return 0;
}

export function fractionToNumber(f: Fraction): number {
  return Number(f.num) / Number(f.den);
}

/**
 * Solves pack combination:
 * Selects non-negative integers for each pack size such that:
 * 1. Total supplied litres >= required litres.
 * 2. Total supplied litres is minimal.
 * 3. On ties of supplied litres, total number of packs is minimal.
 * 4. On further ties, prefer larger pack sizes.
 */
export function optimizePacks(
  neededLitres: Fraction,
  packSizesLitres: number[]
): { packs: PackAllocation[]; suppliedLitres: number; totalCount: number } {
  if (compareFractions(neededLitres, { num: 0n, den: 1n }) <= 0) {
    return { packs: [], suppliedLitres: 0, totalCount: 0 };
  }

  // Convert pack sizes to unique sorted descending positive fractions
  const uniqueSizes = Array.from(new Set(packSizesLitres))
    .filter((s) => Number.isFinite(s) && s > 0)
    .sort((a, b) => b - a);

  if (uniqueSizes.length === 0) {
    return { packs: [], suppliedLitres: 0, totalCount: 0 };
  }

  const packFractions = uniqueSizes.map((s) => ({
    sizeNumber: s,
    sizeFrac: parseToFraction(s)!,
  }));

  const largest = packFractions[0];

  // Upper bound on largest pack count if we only used largest
  // ceil(needed / largest)
  const maxLargestOnly = (neededLitres.num * largest.sizeFrac.den + (neededLitres.den * largest.sizeFrac.num - 1n)) /
    (neededLitres.den * largest.sizeFrac.num);
  const baselineSupplied = multiplyFractions(largest.sizeFrac, { num: maxLargestOnly, den: 1n });

  let bestSupplied: Fraction = baselineSupplied;
  let bestCount: number = Number(maxLargestOnly);
  let bestAllocation: number[] = new Array(packFractions.length).fill(0);
  bestAllocation[0] = Number(maxLargestOnly);

  // Search bounded combinations
  function search(index: number, currentSupplied: Fraction, currentCount: number, currentAllocation: number[]) {
    // If currentSupplied already satisfies neededLitres
    if (compareFractions(currentSupplied, neededLitres) >= 0) {
      const cmpSupplied = compareFractions(currentSupplied, bestSupplied);
      if (cmpSupplied < 0) {
        bestSupplied = currentSupplied;
        bestCount = currentCount;
        bestAllocation = [...currentAllocation];
      } else if (cmpSupplied === 0 && currentCount < bestCount) {
        bestCount = currentCount;
        bestAllocation = [...currentAllocation];
      }
      return;
    }

    if (index >= packFractions.length) return;

    // Prune if currentSupplied already exceeds bestSupplied
    if (compareFractions(currentSupplied, bestSupplied) > 0) return;

    const pack = packFractions[index];
    // Maximum copies of this pack size worth trying
    const remainingNeed = subtractFractions(neededLitres, currentSupplied);
    const maxThisPack = Number(
      (remainingNeed.num * pack.sizeFrac.den + (remainingNeed.den * pack.sizeFrac.num - 1n)) /
        (remainingNeed.den * pack.sizeFrac.num)
    ) + 1;

    for (let c = maxThisPack; c >= 0; c--) {
      currentAllocation[index] = c;
      const addedSupplied = multiplyFractions(pack.sizeFrac, { num: BigInt(c), den: 1n });
      const nextSupplied = addFractions(currentSupplied, addedSupplied);
      search(index + 1, nextSupplied, currentCount + c, currentAllocation);
    }
    currentAllocation[index] = 0;
  }

  const initialAlloc = new Array(packFractions.length).fill(0);
  search(0, { num: 0n, den: 1n }, 0, initialAlloc);

  const packs: PackAllocation[] = [];
  for (let i = 0; i < packFractions.length; i++) {
    if (bestAllocation[i] > 0) {
      packs.push({
        sizeLitres: packFractions[i].sizeNumber,
        count: bestAllocation[i],
      });
    }
  }

  return {
    packs,
    suppliedLitres: fractionToNumber(bestSupplied),
    totalCount: bestCount,
  };
}

/**
 * Main pure calculation function.
 */
export function calculatePaintQuantity(inputs: CalculatorInputs): CalculatorResult {
  const errors: Record<string, string> = {};

  // Validate product coverage
  const { product } = inputs;
  if (!product) {
    return {
      success: false,
      errors: { product: 'Product selection is required.' },
    };
  }

  const hasCoverage =
    product.coverageM2PerLitre !== null &&
    product.coverageM2PerLitre !== undefined &&
    Number.isFinite(product.coverageM2PerLitre) &&
    product.coverageM2PerLitre > 0 &&
    (product.coverageBasis === 'per_coat' || product.coverageBasis === 'complete_system');

  if (!hasCoverage) {
    return {
      success: false,
      errors: {
        product:
          'This product does not have approved coverage specifications published. Please contact our technical team for tailored guidance.',
      },
      missingCoverage: true,
    };
  }

  // Validate Gross Area
  const grossAreaFrac = parseToFraction(inputs.grossAreaM2);
  if (!grossAreaFrac || compareFractions(grossAreaFrac, { num: 0n, den: 1n }) <= 0) {
    errors.grossArea = 'Gross wall area must be a positive number greater than 0.';
  }

  // Validate Deductions (default 0)
  const deductionsInput = inputs.deductionsM2 !== undefined && inputs.deductionsM2 !== '' ? inputs.deductionsM2 : 0;
  const deductionsFrac = parseToFraction(deductionsInput);
  if (!deductionsFrac || compareFractions(deductionsFrac, { num: 0n, den: 1n }) < 0) {
    errors.deductions = 'Opening deductions cannot be negative.';
  } else if (grossAreaFrac && compareFractions(deductionsFrac, grossAreaFrac) > 0) {
    errors.deductions = 'Opening deductions cannot exceed gross wall area.';
  }

  // Validate Coats (positive integer)
  const coatsInput =
    inputs.coats !== undefined && inputs.coats !== ''
      ? inputs.coats
      : product.recommendedCoats && product.recommendedCoats > 0
        ? product.recommendedCoats
        : 2;
  const coatsNum = Number(coatsInput);
  if (!Number.isInteger(coatsNum) || coatsNum <= 0) {
    errors.coats = 'Number of coats must be a positive whole number (e.g. 1, 2, 3).';
  }

  // Validate Allowance % (default 0)
  const allowanceInput =
    inputs.allowancePercent !== undefined && inputs.allowancePercent !== '' ? inputs.allowancePercent : 0;
  const allowanceFrac = parseToFraction(allowanceInput);
  if (!allowanceFrac || compareFractions(allowanceFrac, { num: 0n, den: 1n }) < 0) {
    errors.allowance = 'Allowance percentage cannot be negative.';
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  // Net Area calculation: net = gross - deductions
  const netAreaFrac = subtractFractions(grossAreaFrac!, deductionsFrac!);

  // If net area is exactly 0: treat as zero packs
  if (compareFractions(netAreaFrac, { num: 0n, den: 1n }) === 0) {
    return {
      success: true,
      grossAreaM2: fractionToNumber(grossAreaFrac!),
      deductionsM2: fractionToNumber(deductionsFrac!),
      netAreaM2: 0,
      coats: coatsNum,
      coverageM2PerLitre: product.coverageM2PerLitre!,
      coverageBasis: product.coverageBasis!,
      allowancePercent: fractionToNumber(allowanceFrac!),
      estimatedLitres: 0,
      estimatedLitresFormatted: '0',
      suppliedLitres: 0,
      packs: [],
      totalPacksCount: 0,
      summaryText: 'about 0 litres, so 0 pack(s)',
      suppliedText: 'Supplied: 0 litres across 0 pack(s)',
      disclaimer: 'This is an estimate. Actual coverage is affected by surface texture, preparation and application method.',
      preparation: product.preparation || undefined,
    };
  }

  const coverageFrac = parseToFraction(product.coverageM2PerLitre!)!;

  // Base litres calculation
  let baseLitresFrac: Fraction;
  if (product.coverageBasis === 'per_coat') {
    // (netArea * coats) / coverage
    const coatsFrac = createFraction(BigInt(coatsNum), 1n);
    const totalAreaCoats = multiplyFractions(netAreaFrac, coatsFrac);
    baseLitresFrac = divideFractions(totalAreaCoats, coverageFrac);
  } else {
    // complete_system: netArea / coverage (do not multiply by coats again)
    baseLitresFrac = divideFractions(netAreaFrac, coverageFrac);
  }

  // Add allowance percentage: base * (1 + allowance / 100)
  // factor = (100 + allowance) / 100
  const allowanceFactor = addFractions(
    { num: 1n, den: 1n },
    divideFractions(allowanceFrac!, { num: 100n, den: 1n })
  );
  const neededLitresFrac = multiplyFractions(baseLitresFrac, allowanceFactor);

  const estimatedLitresNum = fractionToNumber(neededLitresFrac);
  const estimatedLitresFormatted =
    Number.isInteger(estimatedLitresNum) ? String(estimatedLitresNum) : estimatedLitresNum.toFixed(1);

  // Pack choice optimization
  const packResult = optimizePacks(neededLitresFrac, product.packSizesLitres || []);

  const totalPacks = packResult.totalCount;
  const summaryText = `about ${estimatedLitresFormatted} litres, so ${totalPacks} pack(s)`;
  const packDetails = packResult.packs
    .map((p) => `${p.count} × ${p.sizeLitres}L`)
    .join(', ');
  const suppliedText = totalPacks > 0
    ? `Supplied: ${packResult.suppliedLitres} litres (${packDetails})`
    : 'Supplied: 0 litres';

  return {
    success: true,
    grossAreaM2: fractionToNumber(grossAreaFrac!),
    deductionsM2: fractionToNumber(deductionsFrac!),
    netAreaM2: fractionToNumber(netAreaFrac),
    coats: coatsNum,
    coverageM2PerLitre: product.coverageM2PerLitre!,
    coverageBasis: product.coverageBasis!,
    allowancePercent: fractionToNumber(allowanceFrac!),
    estimatedLitres: estimatedLitresNum,
    estimatedLitresFormatted,
    suppliedLitres: packResult.suppliedLitres,
    packs: packResult.packs,
    totalPacksCount: totalPacks,
    summaryText,
    suppliedText,
    disclaimer: 'This is an estimate. Actual coverage is affected by surface texture, preparation and application method.',
    preparation: product.preparation || undefined,
  };
}
