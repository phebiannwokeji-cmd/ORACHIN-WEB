/**
 * ToolsRow — One tile per tool (calculator only at launch)
 *
 * Pattern brief §3:
 *   - One tile per built tool.
 *   - Link only to pages that are built.
 *   - /calculator is the only built tool at this point.
 *
 * Rules applied:
 *   - Calculator.md: the calculator estimates litres and packs; shows contact guidance
 *     when coverage data is missing.
 *   - ui-quality.md: 44 px touch target, visible focus, 320 px min width
 *   - Tokens only: no raw colours, radii or spacing values
 */
import React from 'react';
import Link from 'next/link';

export function ToolsRow() {
  return (
    <section
      aria-labelledby="tools-heading"
      className="w-full bg-surface border-b border-outline-variant"
    >
      <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16 flex flex-col gap-8">
        <h2
          id="tools-heading"
          className="font-display font-semibold text-xl text-on-surface tracking-tight"
        >
          Tools
        </h2>

        {/* Single-tile row — add more tiles here as pages are built */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Calculator tile — /calculator is built */}
          <Link
            href="/calculator"
            className="
              group
              flex flex-col gap-4
              p-6
              bg-surface-container
              border border-outline-variant
              rounded-lg
              shadow-soft
              hover:shadow-medium
              focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2
              transition-shadow
            "
          >
            {/* Icon */}
            <span
              className="
                inline-flex items-center justify-center
                w-11 h-11
                rounded-md
                bg-primary-container
              "
              aria-hidden="true"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                className="w-5 h-5 text-on-primary-container"
                aria-hidden="true"
              >
                <rect x="4" y="2" width="16" height="20" rx="2" />
                <line x1="8" y1="7" x2="16" y2="7" />
                <line x1="8" y1="11" x2="16" y2="11" />
                <line x1="8" y1="15" x2="12" y2="15" />
              </svg>
            </span>

            {/* Heading */}
            <h3 className="font-display font-medium text-base text-on-surface tracking-tight group-hover:text-primary transition-colors">
              Quantity calculator
            </h3>

            {/* One-line description from calculator.md — no invented claims */}
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Enter your area and coat count to estimate how many litres and
              packs you need. Requires an approved product with known coverage.
            </p>
          </Link>
        </div>
      </div>
    </section>
  );
}
