import React from 'react';
import type { Metadata } from 'next';
import { PageShell } from '@/components/layout/PageShell';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedCategories } from '@/components/home/FeaturedCategories';
import { PaintingServicesSection } from '@/components/home/PaintingServicesSection';
import { CalculatorHighlight } from '@/components/home/CalculatorHighlight';
import { CommercialBulkSection } from '@/components/home/CommercialBulkSection';
import { DeliveryAndLocationSection } from '@/components/home/DeliveryAndLocationSection';

export const metadata: Metadata = {
  title: 'ORACHIN Paints | Paint Manufacturer in Lagos, Nigeria',
  description:
    'ORACHIN Paints manufactures premium architectural, residential, and commercial paints made to order in Lagos. Quote-only, with painting application services offered.',
};

export default function HomePage() {
  return (
    <PageShell>
      <div className="space-y-4 pb-8">
        <HeroSection />
        <FeaturedCategories />
        <PaintingServicesSection />
        <CalculatorHighlight />
        <CommercialBulkSection />
        <DeliveryAndLocationSection />
      </div>
    </PageShell>
  );
}
