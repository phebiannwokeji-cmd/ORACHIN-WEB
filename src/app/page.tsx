import React from 'react';
import Link from 'next/link';
import { PageShell } from '@/components/layout/PageShell';
import { BUSINESS_CONFIG } from '@/lib/config/business';

export default function HomePage() {
  return (
    <PageShell>
      <section
        aria-labelledby="hero-heading"
        className="max-w-3xl mx-auto w-full text-center flex flex-col items-center justify-center space-y-4 py-2"
      >
        {/* Availability & Mode Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container-high border border-outline-variant text-on-surface-variant text-xs font-medium rounded-full">
          <span>{BUSINESS_CONFIG.tagline}</span>
          <span className="text-outline" aria-hidden="true">
            •
          </span>
          <span className="text-primary font-semibold">Available, Made to Order</span>
        </div>

        {/* Main Headline */}
        <h1
          id="hero-heading"
          className="text-2xl sm:text-4xl font-display font-semibold text-on-surface tracking-tight leading-tight"
        >
          Architectural & Industrial Coatings Manufactured in Lagos
        </h1>

        {/* Plain Explanation from PRD §1 & §2 */}
        <p className="text-on-surface-variant text-sm sm:text-base leading-relaxed max-w-2xl">
          Supplying high-performance exterior and interior paints alongside professional painting application services across Lagos and Nigeria.
        </p>

        {/* Delivery & Response Timing Notice (Gate G8 compliant) */}
        <div className="text-xs text-on-surface-variant bg-surface-container px-3.5 py-2 rounded-md border border-outline-variant max-w-xl">
          <p>
            <strong className="text-on-surface">Response hours:</strong> {BUSINESS_CONFIG.hours.days}, 9:00 AM – 5:00 PM.
          </p>
          <p className="mt-0.5">
            <strong className="text-on-surface">Delivery:</strong> {BUSINESS_CONFIG.timing.courierTransitNote}.
          </p>
        </div>

        {/* Two Main Actions per Site-Structure.md */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {/* Action 1: Shop Paints */}
          <Link
            href="#"
            aria-disabled="true"
            className="min-h-touch-target min-w-touch-target px-6 py-2.5 inline-flex items-center justify-center bg-primary text-on-primary font-medium text-sm rounded-md shadow-soft hover:opacity-90 transition-opacity focus-visible:outline-2 focus-visible:outline-primary"
          >
            Shop Paints
          </Link>

          {/* Action 2: Request a Quote */}
          <Link
            href="#"
            aria-disabled="true"
            className="min-h-touch-target min-w-touch-target px-6 py-2.5 inline-flex items-center justify-center bg-surface-container text-on-surface border border-outline font-medium text-sm rounded-md hover:bg-surface-container-high transition-colors focus-visible:outline-2 focus-visible:outline-primary"
          >
            Request a Quote
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
