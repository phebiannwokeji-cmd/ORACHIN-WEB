import React from 'react';
import Link from 'next/link';
import { BUSINESS_CONFIG, isProjectsPublicDisplayCleared } from '@/lib/config/business';

export function Footer() {
  const showProjects = isProjectsPublicDisplayCleared();

  return (
    <footer className="w-full bg-surface-container-high border-t border-outline-variant shrink-0 py-3 text-xs text-on-surface-variant">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Secondary Navigation */}
        <nav
          aria-label="Footer Navigation"
          className="flex flex-wrap items-center justify-center sm:justify-start gap-1"
        >
          <Link
            href="#"
            aria-disabled="true"
            className="min-h-touch-target min-w-touch-target px-2.5 inline-flex items-center text-xs text-on-surface-variant hover:text-primary focus-visible:outline-2 focus-visible:outline-primary rounded-xs"
          >
            About
          </Link>

          {/* G9 Gate: Only show Projects when genuine case studies exist */}
          {showProjects && (
            <Link
              href="/projects"
              className="min-h-touch-target min-w-touch-target px-2.5 inline-flex items-center text-xs text-on-surface-variant hover:text-primary focus-visible:outline-2 focus-visible:outline-primary rounded-xs"
            >
              Projects
            </Link>
          )}

          {/* G4 Gate: Policies rendered as non-navigating while text unapproved */}
          <Link
            href="#"
            aria-disabled="true"
            className="min-h-touch-target min-w-touch-target px-2.5 inline-flex items-center text-xs text-on-surface-variant hover:text-primary focus-visible:outline-2 focus-visible:outline-primary rounded-xs"
          >
            Privacy
          </Link>
          <Link
            href="#"
            aria-disabled="true"
            className="min-h-touch-target min-w-touch-target px-2.5 inline-flex items-center text-xs text-on-surface-variant hover:text-primary focus-visible:outline-2 focus-visible:outline-primary rounded-xs"
          >
            Sales Terms
          </Link>
          <Link
            href="#"
            aria-disabled="true"
            className="min-h-touch-target min-w-touch-target px-2.5 inline-flex items-center text-xs text-on-surface-variant hover:text-primary focus-visible:outline-2 focus-visible:outline-primary rounded-xs"
          >
            Returns & Damaged Goods
          </Link>
        </nav>

        {/* Business and Address metadata */}
        <div className="text-center sm:text-right text-xs text-on-surface-variant">
          <p>© 2026 {BUSINESS_CONFIG.name}. Mafoluku, Lagos.</p>
        </div>
      </div>
    </footer>
  );
}
