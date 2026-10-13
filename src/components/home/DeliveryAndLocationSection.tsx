import React from 'react';
import { MapPin, Clock, Truck, ShieldAlert } from 'lucide-react';
import { BUSINESS_CONFIG } from '@/lib/config/business';

export function DeliveryAndLocationSection() {
  return (
    <section
      aria-labelledby="delivery-heading"
      className="py-12 border-t border-outline-variant/60"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Logistics &amp; Contact
          </span>
          <h2
            id="delivery-heading"
            className="text-2xl sm:text-3xl font-display font-semibold text-on-surface"
          >
            Location &amp; Delivery Information
          </h2>
          <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
            All paints are formulated and dispatched directly from our manufacturing base in Mafoluku, Lagos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Factory Address */}
          <div className="p-6 bg-surface-container rounded-lg border border-outline-variant space-y-3 shadow-soft">
            <div className="w-10 h-10 rounded-md bg-surface-container-high border border-outline-variant flex items-center justify-center text-primary">
              <MapPin className="w-5 h-5" aria-hidden="true" />
            </div>
            <h3 className="text-base font-semibold text-on-surface">Manufacturing Base</h3>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              {BUSINESS_CONFIG.address}
            </p>
            <p className="text-xs text-primary font-medium pt-1">
              Serving residential &amp; commercial clients in Lagos &amp; across Nigeria.
            </p>
          </div>

          {/* Card 2: Operating Hours & Monitored Responders */}
          <div className="p-6 bg-surface-container rounded-lg border border-outline-variant space-y-3 shadow-soft">
            <div className="w-10 h-10 rounded-md bg-surface-container-high border border-outline-variant flex items-center justify-center text-primary">
              <Clock className="w-5 h-5" aria-hidden="true" />
            </div>
            <h3 className="text-base font-semibold text-on-surface">Working Hours</h3>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              <strong>{BUSINESS_CONFIG.hours.days}</strong>
              <br />
              {BUSINESS_CONFIG.hours.time} ({BUSINESS_CONFIG.hours.timezone})
            </p>
            <p className="text-xs text-on-surface-variant pt-1">
              Monitored by {BUSINESS_CONFIG.responders.primary} &amp; {BUSINESS_CONFIG.responders.deputy}.
            </p>
          </div>

          {/* Card 3: Delivery Terms (Gate G8 compliant) */}
          <div className="p-6 bg-surface-container rounded-lg border border-outline-variant space-y-3 shadow-soft">
            <div className="w-10 h-10 rounded-md bg-surface-container-high border border-outline-variant flex items-center justify-center text-primary">
              <Truck className="w-5 h-5" aria-hidden="true" />
            </div>
            <h3 className="text-base font-semibold text-on-surface">Courier Delivery</h3>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              Deliveries are handled by verified third-party courier services and quoted individually per job based on order weight and destination.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-on-surface-variant pt-1">
              <ShieldAlert className="w-3.5 h-3.5 text-outline shrink-0" aria-hidden="true" />
              <span>No unconfirmed nationwide delivery promises.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
