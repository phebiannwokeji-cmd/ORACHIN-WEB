import React from 'react';
import Link from 'next/link';
import { BUSINESS_CONFIG } from '@/lib/config/business';
import { requireStaffActor } from '@/lib/staff-auth';
import { Shield, BookOpen, AlertCircle, FileText, ShoppingBag, CreditCard, ClipboardList } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const actor = await requireStaffActor();

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900">
      {/* Top Banner */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-bold text-lg tracking-tight text-white flex items-center gap-2">
              <span className="h-6 w-2 bg-amber-500 rounded-sm inline-block"></span>
              {BUSINESS_CONFIG.name}
            </span>
            <span className="bg-slate-800 text-slate-300 text-xs px-2.5 py-1 rounded-full font-medium border border-slate-700">
              Phase 1 Admin
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs sm:text-sm text-slate-300">
            <span className="hidden sm:inline">
              Signed in: <strong className="text-white font-medium">{actor.email || 'Staff member'}</strong> ({actor.role})
            </span>
            <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded text-xs">
              Staff Portal
            </span>
          </div>
        </div>

        {/* Navigation Bar */}
        <nav aria-label="Admin Navigation" className="bg-slate-800 border-t border-slate-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto py-1 scrollbar-thin">
            <Link
              href="/admin/case-studies"
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-md text-amber-400 bg-slate-900/80 shadow-xs border border-amber-500/30"
            >
              <BookOpen className="w-4 h-4" />
              <span>Case Studies (Projects)</span>
            </Link>

            <span className="text-slate-500 px-2">|</span>

            <span className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-400 opacity-75">
              <ShoppingBag className="w-3.5 h-3.5" />
              Products (CAT01)
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-400 opacity-75">
              <FileText className="w-3.5 h-3.5" />
              Enquiries (ORD01)
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-400 opacity-75">
              <ClipboardList className="w-3.5 h-3.5" />
              Quotes (B2B02)
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-400 opacity-75">
              <CreditCard className="w-3.5 h-3.5" />
              Offline Payments (B2B03)
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-400 opacity-75">
              <Shield className="w-3.5 h-3.5" />
              Audit Log (ADM01)
            </span>
          </div>
        </nav>
      </header>

      {/* Gate G9 Informational Advisory Banner */}
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex items-start sm:items-center gap-2.5 text-xs text-amber-900">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 sm:mt-0" />
          <div>
            <strong>Decision Gate G9 is configured, not cleared:</strong> Staff may create, edit, and curate genuine project case studies here. The public Projects link remains hidden until the owner records approval of genuine project content and imagery.
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-xs text-slate-500 text-center">
        ORACHIN Paints &copy; {new Date().getFullYear()} &bull; Internal Staff Console &bull; {BUSINESS_CONFIG.address}
      </footer>
    </div>
  );
}
