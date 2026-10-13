import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Clock, ArrowRight, Calculator } from 'lucide-react';
import { BUSINESS_CONFIG } from '@/lib/config/business';

export function HeroSection() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="max-w-4xl mx-auto w-full text-center flex flex-col items-center justify-center space-y-6 pt-4 pb-10"
    >
      {/* Availability & Mode Badge */}
      <div className="inline-flex flex-wrap items-center justify-center gap-2 px-3.5 py-1.5 bg-surface-container-high border border-outline-variant text-on-surface-variant text-xs font-medium rounded-full shadow-soft">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-primary" aria-hidden="true" />
          <span>{BUSINESS_CONFIG.tagline}</span>
        </span>
        <span className="text-outline hidden sm:inline" aria-hidden="true">
          •
        </span>
        <span className="text-primary font-semibold">Available, Made to Order</span>
        <span className="text-outline hidden sm:inline" aria-hidden="true">
          •
        </span>
        <span className="text-on-surface-variant">Quote Only</span>
      </div>

      {/* Main Headline (PRD §1 & smoke test requirement) */}
      <h1
        id="hero-heading"
        className="text-3xl sm:text-5xl font-display font-semibold text-on-surface tracking-tight leading-[1.15]"
      >
        Paint Manufacturer Serving Residential &amp; Commercial Customers in Lagos &amp; Across Nigeria
      </h1>

      {/* Plain Explanation from PRD §1 */}
      <p className="text-on-surface-variant text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
        Serving residential and commercial customers in Lagos and across Nigeria, with painting application services offered.
      </p>

      {/* Trust & Timing Badges (Gate G8 compliant) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl text-left text-xs text-on-surface-variant">
        <div className="flex items-start gap-2.5 p-3 rounded-md bg-surface-container border border-outline-variant">
          <Clock className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <span className="font-semibold text-on-surface block">Production Lead Time</span>
            <span>{BUSINESS_CONFIG.timing.productionLeadTimeDisplay}</span>
          </div>
        </div>
        <div className="flex items-start gap-2.5 p-3 rounded-md bg-surface-container border border-outline-variant">
          <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <span className="font-semibold text-on-surface block">Courier Delivery</span>
            <span>{BUSINESS_CONFIG.timing.courierTransitNote}</span>
          </div>
        </div>
      </div>

      {/* Two Main Actions per Site-Structure.md */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        {/* Action 1: Shop Paints */}
        <Link
          href="#categories"
          className="min-h-touch-target min-w-touch-target px-6 py-3 inline-flex items-center justify-center gap-2 bg-primary text-on-primary font-medium text-sm rounded-md shadow-soft hover:opacity-90 transition-opacity focus-visible:outline-2 focus-visible:outline-primary"
        >
          <span>Shop Paints</span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>

        {/* Action 2: Request a Quote */}
        <Link
          href="/calculator"
          className="min-h-touch-target min-w-touch-target px-6 py-3 inline-flex items-center justify-center gap-2 bg-surface-container-high text-on-surface border border-outline font-medium text-sm rounded-md hover:bg-surface-variant transition-colors focus-visible:outline-2 focus-visible:outline-primary"
        >
          <Calculator className="w-4 h-4 text-primary" aria-hidden="true" />
          <span>Help Me Choose &amp; Calculate</span>
        </Link>
      </div>

      {/* Working Hours Disclosure */}
      <p className="text-xs text-on-surface-variant/80">
        Response hours: {BUSINESS_CONFIG.hours.days}, 9:00 AM – 5:00 PM (Africa/Lagos)
      </p>
    </section>
  );
}
