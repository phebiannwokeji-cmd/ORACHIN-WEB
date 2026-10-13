import React from 'react';
import Link from 'next/link';
import { Calculator, Check, ArrowRight, Info } from 'lucide-react';

export function CalculatorHighlight() {
  return (
    <section
      aria-labelledby="calculator-feature-heading"
      className="py-12 border-t border-outline-variant/60"
    >
      <div className="max-w-7xl mx-auto bg-gradient-to-br from-surface-container to-surface-container-high rounded-xl border border-outline-variant p-6 sm:p-10 shadow-soft">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold">
              <Calculator className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Project Planning Tool</span>
            </div>

            <h2
              id="calculator-feature-heading"
              className="text-2xl sm:text-3xl font-display font-semibold text-on-surface"
            >
              Don't Guess Your Paint Quantity. Calculate Exactly.
            </h2>

            <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
              Under-buying causes mismatched colour touch-ups; over-buying wastes project budget. Use our approved Paint Quantity Calculator to compute exact litres and optimal pack combinations based on verified manufacturer coverage.
            </p>

            <ul className="space-y-2 text-xs sm:text-sm text-on-surface pt-1">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
                <span>Wall area arithmetic with window and door deductions</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
                <span>Per-coat vs. complete-system coverage safeguards</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
                <span>Smart pack rounding (1L, 4L, 20L) with fewest total drums</span>
              </li>
            </ul>

            <div className="pt-2 flex items-center gap-2 text-xs text-on-surface-variant">
              <Info className="w-4 h-4 text-outline shrink-0" aria-hidden="true" />
              <span>Remember: wall paintable area is different from room floor area.</span>
            </div>
          </div>

          <div className="md:col-span-5 flex flex-col items-center justify-center p-6 bg-surface rounded-lg border border-outline-variant text-center space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <Calculator className="w-6 h-6" aria-hidden="true" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-semibold text-on-surface">
                Ready to plan your room or building?
              </h3>
              <p className="text-xs text-on-surface-variant">
                Enter your wall dimensions and get immediate pack recommendations.
              </p>
            </div>

            <Link
              href="/calculator"
              className="w-full min-h-touch-target px-5 py-2.5 inline-flex items-center justify-center gap-2 bg-primary text-on-primary font-medium text-xs sm:text-sm rounded-md shadow-soft hover:opacity-90 transition-opacity focus-visible:outline-2 focus-visible:outline-primary"
            >
              <span>Open Quantity Calculator</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
