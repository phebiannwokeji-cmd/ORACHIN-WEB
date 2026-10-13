import React from 'react';
import Link from 'next/link';
import { Paintbrush, CheckCircle2, PhoneCall, FileText } from 'lucide-react';
import { BUSINESS_CONFIG } from '@/lib/config/business';

export function PaintingServicesSection() {
  const primaryPhone = BUSINESS_CONFIG.phoneNumbers[0];

  return (
    <section
      aria-labelledby="services-heading"
      className="py-12 border-t border-outline-variant/60"
    >
      <div className="max-w-7xl mx-auto bg-surface-container rounded-xl border border-outline-variant p-6 sm:p-10 shadow-soft">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Content */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container-high border border-outline-variant text-primary text-xs font-semibold rounded-full">
              <Paintbrush className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Full Project Execution</span>
            </div>

            <h2
              id="services-heading"
              className="text-2xl sm:text-3xl font-display font-semibold text-on-surface"
            >
              Professional Painting Application Services
            </h2>

            <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
              In addition to manufacturing premium coatings, ORACHIN Paints provides direct painting application services. Our trained crews handle everything from thorough surface preparation and screeding to precise multi-coat application for residential, commercial, and estate projects.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs sm:text-sm text-on-surface">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                <span>Surface preparation, sanding, and crack repairs</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                <span>Manufacturer-supervised coat thickness &amp; drying</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                <span>Interior living spaces, offices &amp; commercial properties</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                <span>Exterior high-reach &amp; weather-guard application</span>
              </div>
            </div>

            <div className="pt-2 text-xs text-on-surface-variant bg-surface-container-high/60 p-3 rounded-md border border-outline-variant">
              <strong>Service terms:</strong> Painting application services are quoted per job based on project scope, surface condition, and location. Contact us directly to schedule a site inspection.
            </div>
          </div>

          {/* Action Card */}
          <div className="lg:col-span-5 bg-surface-container-high rounded-lg p-6 border border-outline-variant flex flex-col justify-between space-y-5">
            <div className="space-y-2">
              <h3 className="text-base font-semibold text-on-surface">
                Need Both Paint Supply &amp; Professional Application?
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Save time and eliminate coordination hassle by procuring genuine paint directly from the manufacturer with installation included.
              </p>
            </div>

            <div className="space-y-2.5">
              <a
                href={`tel:${primaryPhone}`}
                className="w-full min-h-touch-target px-4 py-2.5 inline-flex items-center justify-center gap-2 bg-primary text-on-primary font-medium text-xs sm:text-sm rounded-md shadow-soft hover:opacity-90 transition-opacity focus-visible:outline-2 focus-visible:outline-primary"
              >
                <PhoneCall className="w-4 h-4" aria-hidden="true" />
                <span>Call for Site Inspection ({primaryPhone})</span>
              </a>

              <Link
                href="/calculator"
                className="w-full min-h-touch-target px-4 py-2.5 inline-flex items-center justify-center gap-2 bg-surface text-on-surface border border-outline font-medium text-xs sm:text-sm rounded-md hover:bg-surface-container transition-colors focus-visible:outline-2 focus-visible:outline-primary"
              >
                <FileText className="w-4 h-4 text-primary" aria-hidden="true" />
                <span>Estimate Litres First</span>
              </Link>
            </div>

            <p className="text-[11px] text-center text-on-surface-variant">
              Monitored by {BUSINESS_CONFIG.responders.primary} &amp; {BUSINESS_CONFIG.responders.deputy} ({BUSINESS_CONFIG.hours.days}, 9am–5pm).
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
