/**
 * HeroSection — Homepage hero
 *
 * Pattern brief §1:
 *   - One headline
 *   - One supporting sentence
 *   - Two agreed buttons: "Shop Paints" and "Request a Quote"
 *   - Large labelled image placeholder (replace when owner supplies a photo)
 *
 * Rules applied:
 *   - Site-Structure.md: two main actions, plain explanation, no delivery promise (G8)
 *   - Scope-and-Phases.md: quote-only, no prices, no checkout
 *   - ui-quality.md: 44 px touch targets, visible focus, 320 px min width
 *   - Tokens only: no raw colours, spacing, font sizes or radii
 */
import React from 'react';
import Link from 'next/link';
import { BUSINESS_CONFIG } from '@/lib/config/business';

export function HeroSection() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="
        w-full
        bg-surface
        border-b border-outline-variant
      "
    >
      <div
        className="
          max-w-7xl mx-auto
          px-4 py-12 sm:py-20
          grid grid-cols-1 lg:grid-cols-2
          gap-10 lg:gap-16
          items-center
        "
      >
        {/* ── Text column ── */}
        <div className="flex flex-col gap-6">
          {/* Availability badge — scope-and-phases.md: "Quote only" / "Made to order" */}
          <p className="inline-flex items-center gap-2 self-start text-xs font-medium text-on-surface-variant">
            <span
              className="inline-block w-2 h-2 rounded-full bg-primary shrink-0"
              aria-hidden="true"
            />
            Available, made to order · Quote only
          </p>

          {/* Headline: one sentence, factual, from PRD §1 and site-structure.md */}
          <h1
            id="hero-heading"
            className="
              font-display font-semibold
              text-3xl sm:text-4xl lg:text-5xl
              leading-tight tracking-tight
              text-on-surface
            "
          >
            Paint manufacturer serving Lagos and across Nigeria
          </h1>

          {/* Supporting sentence: plain explanation per site-structure.md */}
          <p className="text-base sm:text-lg text-on-surface-variant leading-relaxed">
            {BUSINESS_CONFIG.name} makes architectural and decorative paints
            to order. Painting application services are offered alongside paint
            supply.
          </p>

          {/* Two agreed actions per site-structure.md */}
          <div className="flex flex-wrap gap-3">
            {/*
              "Shop Paints" — page not yet built; href="#" with aria-disabled.
              When /shop exists, remove aria-disabled and set href="/shop".
            */}
            <a
              href="#"
              aria-disabled="true"
              aria-label="Shop Paints (page coming soon)"
              className="
                inline-flex items-center justify-center
                min-h-[44px] px-6
                bg-primary text-on-primary
                text-sm font-medium
                rounded-md shadow-soft
                hover:opacity-90
                focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2
                transition-opacity
                cursor-not-allowed opacity-70
              "
            >
              Shop Paints
            </a>

            {/* "Request a Quote" — /calculator is built */}
            <Link
              href="/calculator"
              className="
                inline-flex items-center justify-center
                min-h-[44px] px-6
                bg-surface-container-high text-on-surface
                border border-outline
                text-sm font-medium
                rounded-md
                hover:bg-surface-variant
                focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2
                transition-colors
              "
            >
              Request a Quote
            </Link>
          </div>

          {/* Hours disclosure — G8: no delivery promise */}
          <p className="text-xs text-on-surface-variant">
            Response hours: {BUSINESS_CONFIG.hours.days},{' '}
            {BUSINESS_CONFIG.hours.time} ({BUSINESS_CONFIG.hours.timezone})
          </p>
        </div>

        {/* ── Image placeholder column ── */}
        {/*
          Owner action: replace this <div> with a real <Image> once a photo is supplied.
          The placeholder must keep its aspect ratio and label so it never silently disappears.
        */}
        <div
          role="img"
          aria-label="Photo of ORACHIN Paints products — image to be supplied by owner"
          className="
            w-full
            aspect-[4/3] lg:aspect-auto lg:h-[420px]
            rounded-lg
            bg-surface-container
            border border-outline-variant
            flex flex-col items-center justify-center gap-3
            text-on-surface-variant text-sm text-center px-4
          "
        >
          <span
            className="
              block w-14 h-14
              rounded-full bg-surface-container-high
              border border-outline-variant
              flex items-center justify-center
            "
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className="w-7 h-7 text-outline"
              aria-hidden="true"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </span>
          <span className="block font-medium text-on-surface-variant">
            Product photo
          </span>
          <span className="block text-xs text-outline">
            Owner to supply image — labelled placeholder shown
          </span>
        </div>
      </div>
    </section>
  );
}
