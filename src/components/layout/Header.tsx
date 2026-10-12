import React from 'react';
import Link from 'next/link';
import { BUSINESS_CONFIG } from '@/lib/config/business';

const PRIMARY_NAV_ITEMS = [
  { label: 'Shop Paints', href: '#' },
  { label: 'Colours', href: '#' },
  { label: 'Help Me Choose', href: '/calculator' },
  { label: 'Commercial and Bulk', href: '#' },
  { label: 'Contact and Delivery', href: '#' },
] as const;

export function Header() {
  return (
    <header className="w-full bg-surface-container border-b border-outline-variant shrink-0">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-on-surface font-display font-semibold text-lg tracking-tight hover:text-primary focus-visible:outline-2 focus-visible:outline-primary rounded-xs"
          >
            <span
              className="inline-block w-2.5 h-6 bg-primary rounded-xs shrink-0"
              aria-hidden="true"
            />
            <span>{BUSINESS_CONFIG.name}</span>
          </Link>
          <span className="hidden sm:inline-block text-xs text-on-surface-variant border-l border-outline-variant pl-3">
            Mafoluku, Lagos
          </span>
        </div>

        {/* Phase 1 Status Indicator */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-surface-variant text-on-surface-variant text-xs font-medium rounded-full border border-outline-variant">
          <span
            className="w-1.5 h-1.5 rounded-full bg-primary shrink-0"
            aria-hidden="true"
          />
          <span>Quotation Only</span>
          <span className="text-outline" aria-hidden="true">
            •
          </span>
          <span>Made to Order</span>
        </div>
      </div>

      {/* Primary Navigation per Site-Structure.md */}
      <nav
        aria-label="Primary Navigation"
        className="border-t border-outline-variant bg-surface"
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 overflow-x-auto py-1">
          {PRIMARY_NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              aria-disabled={item.href === '#' ? 'true' : undefined}
              className="min-h-touch-target min-w-touch-target px-3 py-2.5 inline-flex items-center justify-center text-xs font-medium text-on-surface hover:text-primary hover:bg-surface-container-high rounded-sm whitespace-nowrap focus-visible:outline-2 focus-visible:outline-primary"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
