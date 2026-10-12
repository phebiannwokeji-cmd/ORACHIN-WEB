import React from 'react';
import Link from 'next/link';
import { Phone, MessageSquare, FileText } from 'lucide-react';
import { BUSINESS_CONFIG } from '@/lib/config/business';

export function MobileContactBar() {
  const primaryPhone = BUSINESS_CONFIG.phoneNumbers[0];
  const primaryWhatsApp = BUSINESS_CONFIG.whatsappNumbers[0];
  const whatsappUrl = `https://wa.me/234${primaryWhatsApp.slice(1)}`;

  return (
    <aside
      aria-label="Quick Contact Actions"
      className="md:hidden w-full bg-surface-container-high border-t border-outline-variant shrink-0 z-20"
    >
      {/* Responders & Hours disclosure per Site-Structure.md */}
      <div className="px-3 py-1 bg-surface-variant/50 text-xs text-on-surface-variant flex flex-wrap items-center justify-between gap-1 border-b border-outline-variant/50">
        <span>
          Monitored by {BUSINESS_CONFIG.responders.primary} / {BUSINESS_CONFIG.responders.deputy}
        </span>
        <span>{BUSINESS_CONFIG.hours.days}, 9am–5pm</span>
      </div>

      {/* Persistent 3 actions */}
      <div className="grid grid-cols-3 divide-x divide-outline-variant">
        {/* Action 1: Quote Request */}
        <Link
          href="#"
          aria-disabled="true"
          className="min-h-touch-target p-2 flex flex-col items-center justify-center gap-1 text-on-surface hover:text-primary focus-visible:outline-2 focus-visible:outline-primary"
        >
          <FileText className="w-4 h-4 text-primary" aria-hidden="true" />
          <span className="text-xs font-medium">Quote Request</span>
        </Link>

        {/* Action 2: WhatsApp Handoff */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="min-h-touch-target p-2 flex flex-col items-center justify-center gap-1 text-on-surface hover:text-primary focus-visible:outline-2 focus-visible:outline-primary"
        >
          <MessageSquare className="w-4 h-4 text-primary" aria-hidden="true" />
          <span className="text-xs font-medium">WhatsApp</span>
        </a>

        {/* Action 3: Call */}
        <a
          href={`tel:${primaryPhone}`}
          className="min-h-touch-target p-2 flex flex-col items-center justify-center gap-1 text-on-surface hover:text-primary focus-visible:outline-2 focus-visible:outline-primary"
        >
          <Phone className="w-4 h-4 text-primary" aria-hidden="true" />
          <span className="text-xs font-medium">Call</span>
        </a>
      </div>
    </aside>
  );
}
