import React from 'react';
import type { Metadata } from 'next';
import { PageShell } from '@/components/layout/PageShell';
import { CalculatorClient } from '@/components/calculator/CalculatorClient';
import { getCalculatorProducts, isSampleDataActive } from '@/lib/calculator/samples';

export const metadata: Metadata = {
  title: 'Paint Quantity Calculator',
  description:
    'Calculate the paint litres and pack combination needed for your painting project based on wall dimensions and manufacturer coverage.',
};

export default function CalculatorPage() {
  const products = getCalculatorProducts();
  const isSample = isSampleDataActive();

  return (
    <PageShell>
      <div className="py-2 sm:py-4">
        <CalculatorClient products={products} isSampleData={isSample} />
      </div>
    </PageShell>
  );
}
