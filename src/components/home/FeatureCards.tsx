/**
 * FeatureCards — Three image cards below the hero
 *
 * Pattern brief §2:
 *   - Three cards; each has an image area, a short heading and one line.
 *   - Link a card ONLY if its page exists.
 *   - Wording taken from site-structure.md and scope-and-phases.md.
 *
 * Pages that exist:  /  (home)  /calculator
 * Pages that do NOT exist yet: /shop, /colours, /commercial, /contact
 *
 * Rules applied:
 *   - Scope-and-Phases.md: no prices, no checkout, quote-only labels
 *   - ui-quality.md: 44 px touch targets on linked cards, alt text, 320 px min width
 *   - Tokens only: no raw colours, radii or spacing values
 */
import React from 'react';
import Link from 'next/link';

interface Card {
  /** Short section heading */
  heading: string;
  /** One supporting line */
  body: string;
  /** If a page exists, set href; otherwise leave null to render without a link. */
  href: string | null;
  /**
   * Alt text for the image area.
   * When the owner supplies a real <Image>, this becomes the img alt.
   * The placeholder <div> uses role="img" + aria-label with the same text.
   */
  imageAlt: string;
  /** Placeholder label shown inside the box until a real photo is supplied. */
  placeholderLabel: string;
}

/**
 * All copy is taken from site-structure.md and scope-and-phases.md.
 * No marketing language or invented claims.
 */
const CARDS: Card[] = [
  {
    heading: 'Paint products',
    body: 'Architectural and decorative paints, made to order. Quote only — no public prices.',
    href: null, // /shop does not exist yet
    imageAlt: 'Photo of ORACHIN Paints product range — image to be supplied by owner',
    placeholderLabel: 'Product range photo',
  },
  {
    heading: 'Colours',
    body: 'Browse the colour library and explore finish options before requesting a quote.',
    href: null, // /colours does not exist yet
    imageAlt: 'Colour swatches — image to be supplied by owner',
    placeholderLabel: 'Colour library photo',
  },
  {
    heading: 'Painting services',
    body: 'Painting application services are offered alongside paint supply. Enquire for scope and timing.',
    href: null, // /services does not exist yet
    imageAlt: 'Painting application service — image to be supplied by owner',
    placeholderLabel: 'Painting service photo',
  },
];

/** Shared placeholder image block. Replace with <Image> once photos are supplied. */
function ImagePlaceholder({ label, alt }: { label: string; alt: string }) {
  return (
    <div
      role="img"
      aria-label={alt}
      className="
        w-full aspect-[3/2]
        bg-surface-container
        border-b border-outline-variant
        flex flex-col items-center justify-center gap-2
        text-on-surface-variant text-xs text-center px-4
      "
    >
      <span aria-hidden="true">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          className="w-8 h-8 text-outline"
          aria-hidden="true"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
      </span>
      <span className="text-outline">{label}</span>
    </div>
  );
}

/** A single card — linked when href is set, static otherwise. */
function FeatureCard({ card }: { card: Card }) {
  const inner = (
    <>
      <ImagePlaceholder label={card.placeholderLabel} alt={card.imageAlt} />
      <div className="p-5 flex flex-col gap-1.5">
        <h2 className="font-display font-medium text-base text-on-surface tracking-tight">
          {card.heading}
        </h2>
        <p className="text-sm text-on-surface-variant leading-relaxed">
          {card.body}
        </p>
        {card.href === null && (
          <p className="text-xs text-outline mt-1">Page coming soon</p>
        )}
      </div>
    </>
  );

  const sharedClass = `
    flex flex-col
    bg-surface
    border border-outline-variant
    rounded-lg
    overflow-hidden
    shadow-soft
  `;

  if (card.href) {
    return (
      <Link
        href={card.href}
        className={`
          ${sharedClass}
          hover:shadow-medium
          focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2
          transition-shadow
        `}
      >
        {inner}
      </Link>
    );
  }

  return (
    <div
      className={sharedClass}
      aria-label={`${card.heading} — page not yet available`}
    >
      {inner}
    </div>
  );
}

export function FeatureCards() {
  return (
    <section
      aria-labelledby="feature-cards-heading"
      className="w-full bg-surface-container-low border-b border-outline-variant"
    >
      <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16 flex flex-col gap-8">
        <h2
          id="feature-cards-heading"
          className="font-display font-semibold text-xl text-on-surface tracking-tight"
        >
          What we offer
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CARDS.map((card) => (
            <FeatureCard key={card.heading} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
