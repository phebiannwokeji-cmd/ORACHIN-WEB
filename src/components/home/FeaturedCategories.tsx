import React from 'react';
import Link from 'next/link';
import { Layers, Sun, Shield, Sparkles, ArrowUpRight } from 'lucide-react';

interface CategoryItem {
  readonly id: string;
  readonly title: string;
  readonly icon: React.ComponentType<{ className?: string }>;
  readonly description: string;
  readonly surfaces: string[];
  readonly finishTypes: string[];
  readonly leadTime: string;
}

const FEATURED_CATEGORIES: CategoryItem[] = [
  {
    id: 'interior',
    title: 'Interior Wall Finishes',
    icon: Layers,
    description:
      'Smooth, high-opacity matte, silk, and satin emulsions engineered for low odour, rich coverage, and lasting elegance in residential and office spaces.',
    surfaces: ['Plaster', 'Drywall', 'Masonry', 'Ceilings'],
    finishTypes: ['Matte', 'Silk', 'Satin'],
    leadTime: '1–3 days',
  },
  {
    id: 'exterior',
    title: 'Exterior Weather Protection',
    icon: Sun,
    description:
      'Heavy-duty exterior acrylic and textured coatings designed to resist intense UV rays, tropical humidity, rain, and fungal growth across Nigeria.',
    surfaces: ['External Plaster', 'Concrete Blocks', 'Boundary Walls'],
    finishTypes: ['Textured', 'Smooth Weather-Shield'],
    leadTime: '1–3 days',
  },
  {
    id: 'primers',
    title: 'Primers & Sealers',
    icon: Shield,
    description:
      'Deep-penetrating alkali-resisting primers and moisture sealers that ensure optimal adhesion, prevent efflorescence, and maximize paint lifespan.',
    surfaces: ['Fresh Plaster', 'Porous Masonry', 'Screeded Walls'],
    finishTypes: ['Alkali-Resistant Base'],
    leadTime: '1–3 days',
  },
  {
    id: 'enamels',
    title: 'Gloss & Protective Enamels',
    icon: Sparkles,
    description:
      'Tough, washable protective gloss and satin finishes formulated for metal gates, burglar bars, architectural woodwork, and high-traffic trims.',
    surfaces: ['Metalwork', 'Hardwood', 'Doors & Windows', 'Trims'],
    finishTypes: ['High Gloss', 'Eggshell'],
    leadTime: '1–3 days',
  },
];

export function FeaturedCategories() {
  return (
    <section
      id="categories"
      aria-labelledby="categories-heading"
      className="py-12 border-t border-outline-variant/60"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Manufactured in Lagos
          </span>
          <h2
            id="categories-heading"
            className="text-2xl sm:text-3xl font-display font-semibold text-on-surface"
          >
            Manufactured Paint Categories
          </h2>
          <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
            Every batch is freshly formulated and made to order. No old warehouse stock. All products are quote-only with guaranteed 1–3 day production lead times.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FEATURED_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                className="bg-surface-container rounded-lg p-6 border border-outline-variant hover:border-primary/50 transition-colors flex flex-col justify-between space-y-4 shadow-soft"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-md bg-surface-container-high border border-outline-variant flex items-center justify-center text-primary">
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </div>
                    {/* Mode Tag */}
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-container-high text-primary border border-outline-variant">
                      Available, Made to Order
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-display font-semibold text-on-surface">
                      {cat.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mt-1">
                      {cat.description}
                    </p>
                  </div>

                  {/* Surface & Finishes badges */}
                  <div className="space-y-1.5 pt-1 text-xs">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-on-surface-variant font-medium">Surfaces:</span>
                      {cat.surfaces.map((s) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 bg-surface-container-high rounded text-on-surface-variant"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-on-surface-variant font-medium">Finishes:</span>
                      {cat.finishTypes.map((f) => (
                        <span
                          key={f}
                          className="px-2 py-0.5 bg-surface-container-high rounded text-on-surface-variant"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer of Card */}
                <div className="pt-3 border-t border-outline-variant/60 flex items-center justify-between text-xs">
                  <span className="text-on-surface-variant">
                    Lead time: <strong className="text-on-surface">{cat.leadTime}</strong>
                  </span>
                  <Link
                    href="/calculator"
                    className="inline-flex items-center gap-1 text-primary font-medium hover:underline focus-visible:outline-2 focus-visible:outline-primary rounded-xs"
                  >
                    <span>Calculate Litres</span>
                    <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
