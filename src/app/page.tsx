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
 * Smoke-test string requirement: the hero heading must contain
 * "Paint manufacturer" — preserved in HeroSection.
 */
import React from 'react';
import type { Metadata } from 'next';
import { PageShell } from '@/components/layout/PageShell';
import { HeroSection } from '@/components/home/HeroSection';
import { FeatureCards } from '@/components/home/FeatureCards';
import { ToolsRow } from '@/components/home/ToolsRow';

export const metadata: Metadata = {
  title: 'ORACHIN Paints | Paint Manufacturer in Lagos, Nigeria',
  description:
    'ORACHIN Paints manufactures architectural and decorative paints made to order in Lagos. Quote-only. Painting application services offered.',
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
