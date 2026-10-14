/**
 * Homepage — assembles the three homepage sections per pattern brief.
 *
 * Pattern brief:
 *   §1 Hero     — HeroSection
 *   §2 Cards    — FeatureCards (three image cards)
 *   §3 Tools    — ToolsRow (calculator tile only at launch)
 *
 * The old six components (FeaturedCategories, PaintingServicesSection,
 * CalculatorHighlight, CommercialBulkSection, DeliveryAndLocationSection)
 * are removed from the homepage; their files are kept for future reuse.
 *
 * Homepage metadata and indexing remain governed by the production gate.
 */
import React from 'react';
import type { Metadata } from 'next';
import { PageShell } from '@/components/layout/PageShell';
import { HeroSection } from '@/components/home/HeroSection';
import { FeatureCards } from '@/components/home/FeatureCards';
import { ToolsRow } from '@/components/home/ToolsRow';
import { isGateCleared } from '@/lib/config/business';

const isProductionLaunched = isGateCleared('G10');

export const metadata: Metadata = {
  title: 'Paint Manufacturer in Lagos, Nigeria',
  description:
    'ORACHIN Paints manufactures architectural and decorative paints made to order in Lagos. Quote-only paint supply and painting application services.',
  keywords: [
    'paint manufacturer Lagos',
    'architectural paints',
    'decorative paints Nigeria',
    'made to order paint',
    'painting application services',
    'ORACHIN paints',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'ORACHIN Paints | Paint Manufacturer in Lagos',
    description:
      'Architectural and decorative paints made to order in Lagos. Request a quote online for paint supply and professional application services.',
    url: '/',
    siteName: 'ORACHIN Paints',
    locale: 'en_NG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ORACHIN Paints | Paint Manufacturer in Lagos',
    description:
      'Architectural and decorative paints made to order in Lagos. Request a quote online for paint supply and professional application services.',
  },
  robots: {
    index: isProductionLaunched,
    follow: isProductionLaunched,
  },
};

export default function HomePage() {
  return (
    <PageShell>
      <HeroSection />
      <FeatureCards />
      <ToolsRow />
    </PageShell>
  );
}
