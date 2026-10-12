'use client';

import React, { useState, useId } from 'react';
import Link from 'next/link';
import {
  calculatePaintQuantity,
  ProductCoverageInfo,
  CalculatorResult,
} from '@/lib/calculator/arithmetic';
import { BUSINESS_CONFIG } from '@/lib/config/business';

interface CalculatorClientProps {
  products: ProductCoverageInfo[];
  isSampleData: boolean;
}

export function CalculatorClient({ products, isSampleData }: CalculatorClientProps) {
  const [selectedProductIndex, setSelectedProductIndex] = useState<number>(0);
  const [grossArea, setGrossArea] = useState<string>('100');
  const [deductions, setDeductions] = useState<string>('0');
  const [coats, setCoats] = useState<string>(
    String(products[0]?.recommendedCoats || 2)
  );
  const [allowance, setAllowance] = useState<string>(
    String(BUSINESS_CONFIG.commercial.calculatorAllowancePercent || 0)
  );
  const [result, setResult] = useState<CalculatorResult | null>(() => {
    if (products[0]) {
      return calculatePaintQuantity({
        grossAreaM2: '100',
        deductionsM2: '0',
        coats: products[0].recommendedCoats || 2,
        allowancePercent: BUSINESS_CONFIG.commercial.calculatorAllowancePercent || 0,
        product: products[0],
      });
    }
    return null;
  });

  // Unique accessible IDs
  const productSelectId = useId();
  const grossAreaId = useId();
  const deductionsId = useId();
  const coatsId = useId();
  const allowanceId = useId();

  const selectedProduct = products[selectedProductIndex];

  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const idx = Number(e.target.value);
    setSelectedProductIndex(idx);
    const prod = products[idx];
    if (prod && prod.recommendedCoats) {
      setCoats(String(prod.recommendedCoats));
    }
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) {
      setResult({
        success: false,
        errors: { product: 'Please select a product.' },
      });
      return;
    }

    const calc = calculatePaintQuantity({
      grossAreaM2: grossArea,
      deductionsM2: deductions,
      coats,
      allowancePercent: allowance,
      product: selectedProduct,
    });
    setResult(calc);
  };

  const primaryPhone = BUSINESS_CONFIG.phoneNumbers[0];
  const primaryWhatsapp = BUSINESS_CONFIG.whatsappNumbers[0];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Sample Data Banner per requirement 5 */}
      {isSampleData && (
        <div
          role="note"
          aria-label="Demo notice"
          className="p-3.5 bg-surface-container-high border border-outline-variant text-on-surface-variant text-xs rounded-md flex items-start gap-2.5"
        >
          <span
            className="w-2 h-2 rounded-full bg-primary mt-1 shrink-0"
            aria-hidden="true"
          />
          <div>
            <strong className="text-on-surface font-semibold">Sample data active:</strong>{' '}
            Sample products and demonstration specifications are shown for evaluation. These are not real product claims and will not appear in production.
          </div>
        </div>
      )}

      {/* Intro Header */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-display font-semibold text-on-surface tracking-tight">
          Paint Quantity Calculator
        </h1>
        <p className="text-sm text-on-surface-variant max-w-2xl leading-relaxed">
          Estimate the required litres and pack combination for your painting project based on manufacturer coverage data.
        </p>
        <div className="p-3 bg-surface-container rounded-sm border border-outline-variant text-xs text-on-surface-variant">
          <strong className="text-on-surface">Important reminder:</strong> Wall surface area is not floor area. Measure the height and length of each wall to be painted.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Form Column */}
        <form
          onSubmit={handleCalculate}
          noValidate
          className="md:col-span-7 bg-surface-container p-5 rounded-md border border-outline-variant space-y-4 shadow-soft"
        >
          {/* 1. Product Selection */}
          <div className="space-y-1.5">
            <label
              htmlFor={productSelectId}
              className="block text-xs font-semibold text-on-surface uppercase tracking-wider"
            >
              1. Select Paint Product
            </label>
            {products.length === 0 ? (
              <p className="text-xs text-on-surface-variant italic">
                No products currently available for calculation.
              </p>
            ) : (
              <select
                id={productSelectId}
                value={selectedProductIndex}
                onChange={handleProductChange}
                className="w-full min-h-touch-target px-3 py-2 text-sm bg-surface text-on-surface border border-outline rounded-sm focus-visible:outline-2 focus-visible:outline-primary"
              >
                {products.map((p, idx) => (
                  <option key={p.name} value={idx}>
                    {p.name}
                  </option>
                ))}
              </select>
            )}
            {selectedProduct && (
              <p className="text-xs text-on-surface-variant">
                Coverage basis:{' '}
                {selectedProduct.coverageM2PerLitre
                  ? `${selectedProduct.coverageM2PerLitre} m²/L (${selectedProduct.coverageBasis === 'per_coat' ? 'per coat' : 'complete system'})`
                  : 'No approved coverage data'}
              </p>
            )}
            {result && !result.success && result.errors.product && (
              <p
                id={`${productSelectId}-error`}
                role="alert"
                className="text-xs text-on-error-container bg-error-container p-2 rounded-xs border border-error font-medium"
              >
                {result.errors.product}
              </p>
            )}
          </div>

          {/* 2. Gross Wall Area */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-baseline">
              <label
                htmlFor={grossAreaId}
                className="block text-xs font-semibold text-on-surface uppercase tracking-wider"
              >
                2. Gross Wall Area (m²)
              </label>
              <span className="text-xs text-on-surface-variant font-medium">Unit: Square metres</span>
            </div>
            <div className="relative">
              <input
                id={grossAreaId}
                type="text"
                inputMode="decimal"
                value={grossArea}
                onChange={(e) => setGrossArea(e.target.value)}
                aria-describedby={
                  result && !result.success && result.errors.grossArea
                    ? `${grossAreaId}-error`
                    : undefined
                }
                aria-invalid={Boolean(result && !result.success && result.errors.grossArea)}
                className="w-full min-h-touch-target px-3 py-2 text-sm bg-surface text-on-surface border border-outline rounded-sm focus-visible:outline-2 focus-visible:outline-primary"
                placeholder="e.g. 100"
              />
            </div>
            {result && !result.success && result.errors.grossArea && (
              <p
                id={`${grossAreaId}-error`}
                role="alert"
                className="text-xs text-on-error-container bg-error-container p-2 rounded-xs border border-error font-medium"
              >
                {result.errors.grossArea}
              </p>
            )}
          </div>

          {/* 3. Opening Deductions */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-baseline">
              <label
                htmlFor={deductionsId}
                className="block text-xs font-semibold text-on-surface uppercase tracking-wider"
              >
                3. Openings & Windows Deductions (m²)
              </label>
              <span className="text-xs text-on-surface-variant font-medium">Optional (default 0)</span>
            </div>
            <input
              id={deductionsId}
              type="text"
              inputMode="decimal"
              value={deductions}
              onChange={(e) => setDeductions(e.target.value)}
              aria-describedby={
                result && !result.success && result.errors.deductions
                  ? `${deductionsId}-error`
                  : undefined
              }
              aria-invalid={Boolean(result && !result.success && result.errors.deductions)}
              className="w-full min-h-touch-target px-3 py-2 text-sm bg-surface text-on-surface border border-outline rounded-sm focus-visible:outline-2 focus-visible:outline-primary"
              placeholder="0"
            />
            {result && !result.success && result.errors.deductions && (
              <p
                id={`${deductionsId}-error`}
                role="alert"
                className="text-xs text-on-error-container bg-error-container p-2 rounded-xs border border-error font-medium"
              >
                {result.errors.deductions}
              </p>
            )}
          </div>

          {/* 4. Number of Coats */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-baseline">
              <label
                htmlFor={coatsId}
                className="block text-xs font-semibold text-on-surface uppercase tracking-wider"
              >
                4. Number of Coats
              </label>
              <span className="text-xs text-on-surface-variant font-medium">Whole number</span>
            </div>
            <input
              id={coatsId}
              type="text"
              inputMode="numeric"
              value={coats}
              onChange={(e) => setCoats(e.target.value)}
              aria-describedby={
                result && !result.success && result.errors.coats
                  ? `${coatsId}-error`
                  : undefined
              }
              aria-invalid={Boolean(result && !result.success && result.errors.coats)}
              className="w-full min-h-touch-target px-3 py-2 text-sm bg-surface text-on-surface border border-outline rounded-sm focus-visible:outline-2 focus-visible:outline-primary"
              placeholder="2"
            />
            {result && !result.success && result.errors.coats && (
              <p
                id={`${coatsId}-error`}
                role="alert"
                className="text-xs text-on-error-container bg-error-container p-2 rounded-xs border border-error font-medium"
              >
                {result.errors.coats}
              </p>
            )}
          </div>

          {/* 5. Allowance Percentage */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-baseline">
              <label
                htmlFor={allowanceId}
                className="block text-xs font-semibold text-on-surface uppercase tracking-wider"
              >
                5. Waste & Roughness Allowance (%)
              </label>
              <span className="text-xs text-on-surface-variant font-medium">Config default: 0%</span>
            </div>
            <input
              id={allowanceId}
              type="text"
              inputMode="numeric"
              value={allowance}
              onChange={(e) => setAllowance(e.target.value)}
              aria-describedby={
                result && !result.success && result.errors.allowance
                  ? `${allowanceId}-error`
                  : undefined
              }
              aria-invalid={Boolean(result && !result.success && result.errors.allowance)}
              className="w-full min-h-touch-target px-3 py-2 text-sm bg-surface text-on-surface border border-outline rounded-sm focus-visible:outline-2 focus-visible:outline-primary"
              placeholder="0"
            />
            {result && !result.success && result.errors.allowance && (
              <p
                id={`${allowanceId}-error`}
                role="alert"
                className="text-xs text-on-error-container bg-error-container p-2 rounded-xs border border-error font-medium"
              >
                {result.errors.allowance}
              </p>
            )}
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full min-h-touch-target px-5 py-2.5 inline-flex items-center justify-center bg-primary text-on-primary font-medium text-sm rounded-sm shadow-soft hover:opacity-90 transition-opacity focus-visible:outline-2 focus-visible:outline-primary cursor-pointer"
            >
              Calculate Paint Quantity
            </button>
          </div>
        </form>

        {/* Results / Guidance Column */}
        <div className="md:col-span-5 space-y-4">
          {/* Case 1: Missing Coverage Guidance */}
          {result && !result.success && result.missingCoverage && (
            <div className="bg-surface-container p-5 rounded-md border border-outline space-y-4 shadow-soft">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-surface-variant text-on-surface-variant text-xs font-semibold rounded-full">
                <span>Technical Contact Guidance</span>
              </div>
              <h2 className="text-base font-display font-semibold text-on-surface">
                Custom Coverage Specification Required
              </h2>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                This coating does not carry a standardised coverage figure because application rates depend directly on substrate absorption and texture.
              </p>
              <div className="p-3 bg-surface rounded-sm border border-outline-variant space-y-2 text-xs">
                <div>
                  <strong className="text-on-surface">Technical Desk:</strong>
                  <p className="text-on-surface-variant">
                    {BUSINESS_CONFIG.responders.primary} / {BUSINESS_CONFIG.responders.deputy}
                  </p>
                </div>
                <div>
                  <strong className="text-on-surface">Response Hours:</strong>
                  <p className="text-on-surface-variant">{BUSINESS_CONFIG.timing.responseHoursDisplay}</p>
                </div>
                <div>
                  <strong className="text-on-surface">Phone:</strong>
                  <p className="text-on-surface-variant">
                    <a
                      href={`tel:${primaryPhone}`}
                      className="text-primary underline focus-visible:outline-2 focus-visible:outline-primary"
                    >
                      {primaryPhone}
                    </a>
                  </p>
                </div>
              </div>
              <div className="pt-1">
                <a
                  href={`https://wa.me/234${primaryWhatsapp.replace(/^0/, '')}?text=${encodeURIComponent(
                    `Hello ORACHIN Paints, I am requesting technical guidance for ${selectedProduct?.name || 'paint'} for an estimated area of ${grossArea} m².`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full min-h-touch-target px-4 py-2.5 inline-flex items-center justify-center bg-surface-container-high border border-outline text-on-surface font-medium text-xs rounded-sm hover:bg-surface-variant transition-colors focus-visible:outline-2 focus-visible:outline-primary"
                >
                  Contact via WhatsApp ({primaryWhatsapp})
                </a>
              </div>
            </div>
          )}

          {/* Case 2: Calculation Success Result */}
          {result && result.success && (
            <div className="bg-surface-container p-5 rounded-md border border-outline space-y-4 shadow-soft">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-surface-variant text-primary text-xs font-semibold rounded-full">
                <span>Calculation Estimate</span>
              </div>

              {/* Main Headline per calculator.md */}
              <div>
                <h2 className="text-lg sm:text-xl font-display font-semibold text-on-surface">
                  {result.summaryText}
                </h2>
                <p className="text-xs text-on-surface-variant font-medium mt-1">
                  {result.suppliedText}
                </p>
              </div>

              {/* Pack Breakdown */}
              <div className="p-3.5 bg-surface rounded-sm border border-outline-variant space-y-2 text-xs">
                <div className="flex justify-between border-b border-outline-variant pb-1.5">
                  <span className="text-on-surface-variant">Net Paintable Area:</span>
                  <span className="font-semibold text-on-surface">{result.netAreaM2} m²</span>
                </div>
                <div className="flex justify-between border-b border-outline-variant pb-1.5">
                  <span className="text-on-surface-variant">Specified Coats:</span>
                  <span className="font-semibold text-on-surface">{result.coats}</span>
                </div>
                <div className="flex justify-between border-b border-outline-variant pb-1.5">
                  <span className="text-on-surface-variant">Coverage Rate:</span>
                  <span className="font-semibold text-on-surface">
                    {result.coverageM2PerLitre} m²/L ({result.coverageBasis === 'per_coat' ? 'per coat' : 'complete system'})
                  </span>
                </div>
                <div className="flex justify-between border-b border-outline-variant pb-1.5">
                  <span className="text-on-surface-variant">Allowance:</span>
                  <span className="font-semibold text-on-surface">{result.allowancePercent}%</span>
                </div>
                <div className="flex justify-between pt-0.5">
                  <span className="text-on-surface-variant">Pack Allocation:</span>
                  <span className="font-semibold text-primary">
                    {result.packs.length > 0
                      ? result.packs.map((p) => `${p.count} × ${p.sizeLitres}L`).join(', ')
                      : 'None required (0 m²)'}
                  </span>
                </div>
              </div>

              {/* Approved Preparation Notice */}
              {result.preparation && (
                <div className="text-xs text-on-surface-variant bg-surface-container-low p-3 rounded-xs border border-outline-variant">
                  <strong className="text-on-surface block mb-1">Approved Preparation:</strong>
                  {result.preparation}
                </div>
              )}

              {/* Required Estimate Disclaimer per calculator.md */}
              <p className="text-xs text-on-surface-variant italic leading-normal">
                {result.disclaimer}
              </p>

              {/* Next Step: WhatsApp Contact Handoff with inputs */}
              <div className="pt-2">
                <a
                  href={`https://wa.me/234${primaryWhatsapp.replace(/^0/, '')}?text=${encodeURIComponent(
                    `Hello ORACHIN Paints, I used the quantity calculator for ${selectedProduct?.name}: Area ${result.netAreaM2}m², ${result.coats} coats. Estimate is ${result.summaryText}. I would like to request a quotation.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full min-h-touch-target px-4 py-2.5 inline-flex items-center justify-center bg-primary text-on-primary font-medium text-xs rounded-sm hover:opacity-90 transition-opacity focus-visible:outline-2 focus-visible:outline-primary"
                >
                  Request Quote via WhatsApp ({primaryWhatsapp})
                </a>
              </div>
            </div>
          )}

          {/* Initial / Empty State */}
          {!result && (
            <div className="bg-surface-container p-5 rounded-md border border-outline-variant text-center space-y-2 text-xs text-on-surface-variant">
              <p>Enter your surface measurements and click Calculate to view estimated litres and pack breakdown.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
