import React from 'react';
import { Building2, FileSpreadsheet, Truck, CheckCircle2, PhoneCall } from 'lucide-react';
import { BUSINESS_CONFIG } from '@/lib/config/business';

export function CommercialBulkSection() {
  const primaryWhatsApp = BUSINESS_CONFIG.whatsappNumbers[0];
  const primaryPhone = BUSINESS_CONFIG.phoneNumbers[0];
  const whatsappUrl = `https://wa.me/234${primaryWhatsApp.slice(1)}`;

  return (
    <section
      aria-labelledby="commercial-heading"
      className="py-12 border-t border-outline-variant/60"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Contractors &amp; Developers
          </span>
          <h2
            id="commercial-heading"
            className="text-2xl sm:text-3xl font-display font-semibold text-on-surface"
          >
            Commercial, Bulk &amp; Project Enquiries
          </h2>
          <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
            Direct manufacturer supply for real estate developers, contractors, educational institutions, and facilities managers requiring volume supply and reliable project scheduling.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-surface-container rounded-lg border border-outline-variant space-y-3 shadow-soft">
            <div className="w-10 h-10 rounded-md bg-surface-container-high border border-outline-variant flex items-center justify-center text-primary">
              <FileSpreadsheet className="w-5 h-5" aria-hidden="true" />
            </div>
            <h3 className="text-base font-semibold text-on-surface">
              Bill of Quantities (BoQ) Review
            </h3>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              Have an architect’s schedule or BoQ? Submit your project document to receive a line-item estimate matching technical specifications and substrate conditions.
            </p>
          </div>

          <div className="p-6 bg-surface-container rounded-lg border border-outline-variant space-y-3 shadow-soft">
            <div className="w-10 h-10 rounded-md bg-surface-container-high border border-outline-variant flex items-center justify-center text-primary">
              <Building2 className="w-5 h-5" aria-hidden="true" />
            </div>
            <h3 className="text-base font-semibold text-on-surface">
              Custom Architectural Colours
            </h3>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              Specialized corporate colours and batch consistency for brand identity, large estates, or multi-block residential developments.
            </p>
          </div>

          <div className="p-6 bg-surface-container rounded-lg border border-outline-variant space-y-3 shadow-soft">
            <div className="w-10 h-10 rounded-md bg-surface-container-high border border-outline-variant flex items-center justify-center text-primary">
              <Truck className="w-5 h-5" aria-hidden="true" />
            </div>
            <h3 className="text-base font-semibold text-on-surface">
              Phased Site Deliveries
            </h3>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              Stagger deliveries according to your project milestones to avoid congested on-site storage. Third-party courier transit quoted per drop.
            </p>
          </div>
        </div>

        {/* Commercial terms & direct communication */}
        <div className="bg-surface-container-high p-6 rounded-lg border border-outline-variant flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-semibold text-primary">
              <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
              <span>Official Versioned Quotes &amp; Structured Payment Terms</span>
            </div>
            <p className="text-xs text-on-surface-variant">
              Commercial quotations snapshot versioned pricing, lead times (1–3 days), and delivery arrangements.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5 shrink-0">
            <a
              href={`tel:${primaryPhone}`}
              className="min-h-touch-target px-4 py-2 inline-flex items-center gap-2 bg-primary text-on-primary text-xs sm:text-sm font-medium rounded-md hover:opacity-90 transition-opacity focus-visible:outline-2 focus-visible:outline-primary"
            >
              <PhoneCall className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Call Commercial Desk ({primaryPhone})</span>
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-touch-target px-4 py-2 inline-flex items-center gap-2 bg-surface text-on-surface border border-outline text-xs sm:text-sm font-medium rounded-md hover:bg-surface-container transition-colors focus-visible:outline-2 focus-visible:outline-primary"
            >
              <span>WhatsApp Handoff</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
