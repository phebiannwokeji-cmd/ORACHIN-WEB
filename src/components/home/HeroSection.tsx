/**
 * HeroSection — Homepage hero
 *
 * Pattern brief §1:
 *   - One headline
 *   - One supporting sentence
 *   - Two agreed buttons: "Shop Paints" and "Get a quote"
 *   - Large approved promotional image
 *
 * Rules applied:
 *   - Site-Structure.md: two main actions, plain explanation, no delivery promise (G8)
 *   - Scope-and-Phases.md: quote-only, no prices, no checkout
 *   - ui-quality.md: 44 px touch targets, visible focus, 320 px min width
 *   - Tokens only: no raw colours, spacing, font sizes or radii
 */
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

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
          {/* Headline */}
          <h1
            id="hero-heading"
            className="
              font-display font-semibold
              text-3xl sm:text-4xl lg:text-5xl
              leading-tight tracking-tighter
              text-on-surface
            "
          >
            Choose your paint. Work out how much you need. Get a quote.
          </h1>

          {/* Supporting line */}
          <p className="text-base sm:text-lg text-on-surface-variant leading-relaxed">
            Made-to-order paint from a Lagos manufacturer, with painting services when you need them. Questions? Message us on WhatsApp, Monday to Saturday, 9am to 5pm.
          </p>

          {/* Two agreed actions */}
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
                rounded-[100px] shadow-soft
                hover:opacity-90
                focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2
                transition-opacity
                cursor-not-allowed opacity-70
              "
            >
              Shop Paints
            </a>

            {/* "Get a quote" — /calculator is built */}
            <Link
              href="/calculator"
              className="
                inline-flex items-center justify-center
                min-h-[44px] px-6
                bg-surface-container-high text-on-surface
                border border-outline
                text-sm font-medium
                rounded-[100px]
                hover:bg-surface-variant
                focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2
                transition-colors
              "
            >
              Get a quote
            </Link>
          </div>
        </div>

        {/* ── Image column ── */}
        <div className="w-full flex items-center justify-center">
          <div className="relative w-full aspect-square max-w-[500px] rounded-2xl overflow-hidden shadow-medium border border-outline-variant bg-surface-container">
            <Image
              src="/images/hero-paint.jpg"
              alt="ORACHIN Paints bucket and roller against a yellow-painted wall"
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 500px"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
