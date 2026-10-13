/**
 * Footer — columns grouped by page type.
 *
 * Pattern brief §4:
 *   "A footer in columns grouped by page type. Include only pages that exist."
 *
 * Site-Structure.md mandates: About, Projects (G9-gated), Privacy,
 * Sales Terms, Returns and Damaged Goods.
 *
 * Pages that are built and public:
 *   /           Home
 *   /calculator Help Me Choose (calculator)
 *
 * All other nav items link to "#" with aria-disabled and a visual note,
 * because their pages are not yet built.
 *
 * G4 Gate: policy pages not linked until text is approved.
 * G9 Gate: Projects hidden until genuine case studies exist.
 *
 * Tokens only: no raw colours, spacing, font sizes or radii.
 */
import React from 'react';
import Link from 'next/link';
import { BUSINESS_CONFIG, isProjectsPublicDisplayCleared } from '@/lib/config/business';

// ── Column definitions ───────────────────────────────────────────────────────
// Each column has a heading and a list of links.
// href: null means the page is not yet built — rendered as plain text + "(coming soon)".
// href: "#" + disabled means the page exists but is blocked by a gate (policies).

interface FooterLink {
  label: string;
  /** A real path when the page is built, "#" for gate-blocked, null for not yet built. */
  href: string | '#' | null;
  disabled?: boolean;
}

const FOOTER_COLUMNS: { heading: string; links: FooterLink[] }[] = [
  {
    heading: 'Navigate',
    links: [
      { label: 'Home',                href: '/' },
      { label: 'Shop Paints',         href: null },      // /shop not yet built
      { label: 'Colours',             href: null },      // /colours not yet built
      { label: 'Help Me Choose',      href: '/calculator' },
      { label: 'Commercial and Bulk', href: null },      // /commercial not yet built
      { label: 'Contact and Delivery',href: null },      // /contact not yet built
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About',   href: null },  // /about not yet built
      // Projects rendered conditionally below (G9 gate)
    ],
  },
  {
    heading: 'Legal',
    links: [
      // G4 Gate: all policy pages blocked until text is approved.
      { label: 'Privacy',                  href: '#', disabled: true },
      { label: 'Sales Terms',              href: '#', disabled: true },
      { label: 'Returns and Damaged Goods',href: '#', disabled: true },
    ],
  },
];

function FooterLinkItem({ item }: { item: FooterLink }) {
  const baseClass = `
    block
    py-1
    text-sm text-on-surface-variant
    hover:text-primary
    focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-1
    rounded-xs
    transition-colors
  `;

  if (item.href === null) {
    // Page not built yet — plain text, no anchor
    return (
      <span className="block py-1 text-sm text-outline">
        {item.label}
        <span className="ml-1 text-xs text-outline opacity-70">(coming soon)</span>
      </span>
    );
  }

  if (item.disabled) {
    // Gate-blocked — rendered as a span so no event handler is needed
    // (Server Component safe; pointer-events-none prevents clicks in CSS)
    return (
      <span
        aria-disabled="true"
        className="block py-1 text-sm text-on-surface-variant opacity-50 cursor-not-allowed pointer-events-none"
      >
        {item.label}
      </span>
    );
  }

  return (
    <Link href={item.href} className={baseClass}>
      {item.label}
    </Link>
  );
}

export function Footer() {
  const showProjects = isProjectsPublicDisplayCleared();

  return (
    <footer
      className="
        w-full
        bg-surface-container-high
        border-t border-outline-variant
      "
      aria-label="Site footer"
    >
      <div className="max-w-7xl mx-auto px-4 py-10 sm:py-14">
        {/* ── Column grid ── */}
        <div
          className="
            grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4
            gap-8 sm:gap-10
          "
        >
          {/* Brand column */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1 flex flex-col gap-3">
            <p className="font-display font-semibold text-base text-on-surface tracking-tight">
              {BUSINESS_CONFIG.name}
            </p>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Paint manufacturer. Mafoluku, Lagos.
            </p>
            <p className="text-xs text-on-surface-variant">
              {BUSINESS_CONFIG.hours.days},{' '}
              {BUSINESS_CONFIG.hours.time}
            </p>
            <p className="text-xs text-on-surface-variant">
              {BUSINESS_CONFIG.timing.courierTransitNote}
            </p>
          </div>

          {/* Link columns */}
          {FOOTER_COLUMNS.map((col) => (
            <nav
              key={col.heading}
              aria-label={`${col.heading} links`}
              className="flex flex-col gap-1"
            >
              <h3 className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-2">
                {col.heading}
              </h3>
              {col.links.map((item) => (
                <FooterLinkItem key={item.label} item={item} />
              ))}

              {/* G9-gated Projects link — only in the Company column */}
              {col.heading === 'Company' && showProjects && (
                <Link
                  href="/projects"
                  className="
                    block py-1
                    text-sm text-on-surface-variant
                    hover:text-primary
                    focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-1
                    rounded-xs transition-colors
                  "
                >
                  Projects
                </Link>
              )}
            </nav>
          ))}
        </div>

        {/* ── Bottom bar ── */}
        <div
          className="
            mt-10 pt-6
            border-t border-outline-variant
            flex flex-col sm:flex-row items-center justify-between
            gap-3
            text-xs text-on-surface-variant
          "
        >
          <p>© 2026 {BUSINESS_CONFIG.name}. All rights reserved.</p>
          <p className="text-outline text-xs">
            Quotation only — no checkout or live payments at this stage.
          </p>
        </div>
      </div>
    </footer>
  );
}
