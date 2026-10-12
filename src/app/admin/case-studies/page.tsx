'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CaseStudy, CaseStudyStatus } from '@/types/case-study';
import { 
  Plus, 
  Edit3, 
  Eye, 
  EyeOff, 
  MapPin, 
  Tag, 
  Paintbrush, 
  Clock, 
  History, 
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

interface AuditLog {
  id: string;
  action: string;
  actor_id: string;
  actor_role: string;
  created_at: string;
  payload: Record<string, unknown>;
}

export default function AdminCaseStudiesPage() {
  const [items, setItems] = useState<CaseStudy[]>([]);
  const [filter, setFilter] = useState<'all' | CaseStudyStatus>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [showAuditModal, setShowAuditModal] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = filter === 'all' 
        ? '/api/admin/case-studies' 
        : `/api/admin/case-studies?status=${filter}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.success) {
        setItems(json.data);
      } else {
        setError(json.error || 'Failed to load case studies');
      }
    } catch {
      setError('Network communication failed. Please verify your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [filter]);

  const handleStatusChange = async (id: string, newStatus: CaseStudyStatus) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/case-studies/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        setItems((prev) =>
          prev.map((item) => (item.id === id ? json.data : item))
        );
      } else {
        alert(`Status update failed: ${json.error}`);
      }
    } catch {
      alert('Network error while updating status');
    } finally {
      setUpdatingId(null);
    }
  };

  const loadAuditTrail = async () => {
    setShowAuditModal(true);
    try {
      const auditRes = await fetch('/api/admin/case-studies/audit');
      if (auditRes.ok) {
        const json = await auditRes.json();
        if (json.success) setAuditLogs(json.data);
      }
    } catch {
      // Non-blocking
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Case Studies & Project Stories
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            ADM01 Content Type &bull; Record genuine painting and coating projects for the portfolio.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchItems}
            disabled={loading}
            aria-label="Refresh case studies list"
            className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center p-2.5 rounded-md border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <Link
            href="/admin/case-studies/new"
            className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium text-sm rounded-md shadow-xs focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:outline-hidden transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Case Study</span>
          </Link>
        </div>
      </div>

      {/* Filter Tabs & Audit Button */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-md shadow-xs p-1 bg-slate-200" role="group" aria-label="Filter by publication status">
          {(['all', 'draft', 'published', 'archived'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`min-h-[44px] px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded capitalize transition-all focus:ring-2 focus:ring-amber-500 focus:outline-hidden ${
                filter === tab
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab === 'all' ? 'All Records' : `${tab}s`}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={loadAuditTrail}
          className="min-h-[44px] inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
        >
          <History className="w-3.5 h-3.5 text-slate-500" />
          <span>View Audit Trail (ADM01)</span>
        </button>
      </div>

      {/* Error Notice */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-800 text-sm flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
          <div>{error}</div>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="p-5 bg-white border border-slate-200 rounded-lg animate-pulse space-y-3">
              <div className="h-5 bg-slate-200 rounded w-1/3"></div>
              <div className="h-4 bg-slate-100 rounded w-2/3"></div>
              <div className="h-8 bg-slate-100 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && items.length === 0 && (
        <div className="bg-white border border-dashed border-slate-300 rounded-lg p-10 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
            <Tag className="w-6 h-6" />
          </div>
          <h2 className="text-base font-semibold text-slate-900">No case studies found</h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            {filter === 'all'
              ? 'No project case studies have been registered yet. Add a genuine project story after verifying its content and imagery.'
              : `There are currently no case studies with status "${filter}".`}
          </p>
          <div className="pt-2">
            <Link
              href="/admin/case-studies/new"
              className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium text-sm rounded-md shadow-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Case Study</span>
            </Link>
          </div>
        </div>
      )}

      {/* Case Studies List */}
      {!loading && items.length > 0 && (
        <div className="grid grid-cols-1 gap-4">
          {items.map((item) => (
            <article
              key={item.id}
              className="bg-white rounded-lg border border-slate-200 shadow-xs hover:border-slate-300 transition-all p-5 flex flex-col md:flex-row md:items-start md:justify-between gap-5"
            >
              <div className="space-y-3 flex-1">
                {/* Status & Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider ${
                      item.status === 'published'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : item.status === 'draft'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-slate-200 text-slate-700 border border-slate-300'
                    }`}
                  >
                    {item.status}
                  </span>

                  <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-slate-100 text-slate-700 capitalize border border-slate-200">
                    {item.client_type}
                  </span>

                  <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-blue-50 text-blue-700 capitalize border border-blue-200">
                    {item.service_scope.replace(/_/g, ' ')}
                  </span>

                  {item.location && (
                    <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {item.location}
                    </span>
                  )}
                </div>

                {/* Title & Slug */}
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    {item.title}
                  </h2>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    Slug: /{item.slug}
                  </p>
                </div>

                {/* Summary */}
                <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                  {item.summary}
                </p>

                {/* Products & Details */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 pt-1 border-t border-slate-100">
                  <span className="inline-flex items-center gap-1">
                    <Paintbrush className="w-3.5 h-3.5 text-slate-400" />
                    <strong>{item.paint_products_used?.length || 0}</strong> products registered
                  </span>

                  {item.surface_type && (
                    <span>
                      Surface: <span className="text-slate-700 font-medium">{item.surface_type}</span>
                    </span>
                  )}

                  <span className="inline-flex items-center gap-1 text-slate-400">
                    <Clock className="w-3 h-3" />
                    Updated {new Date(item.updated_at).toLocaleDateString('en-GB', { timeZone: 'Africa/Lagos' })}
                  </span>
                </div>
              </div>

              {/* Action buttons (Min 44x44px target) */}
              <div className="flex flex-wrap md:flex-col items-center md:items-end gap-2 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                <Link
                  href={`/admin/case-studies/${item.id}/edit`}
                  className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                >
                  <Edit3 className="w-4 h-4 text-slate-600" />
                  <span>Edit Details</span>
                </Link>

                {item.status === 'draft' && (
                  <button
                    type="button"
                    onClick={() => handleStatusChange(item.id, 'published')}
                    disabled={updatingId === item.id}
                    className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded hover:bg-emerald-100 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Set Published</span>
                  </button>
                )}

                {item.status === 'published' && (
                  <button
                    type="button"
                    onClick={() => handleStatusChange(item.id, 'draft')}
                    disabled={updatingId === item.id}
                    className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded hover:bg-amber-100 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  >
                    <EyeOff className="w-4 h-4" />
                    <span>Set Draft</span>
                  </button>
                )}

                {item.status !== 'archived' && (
                  <button
                    type="button"
                    onClick={() => handleStatusChange(item.id, 'archived')}
                    disabled={updatingId === item.id}
                    className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center px-2 py-1 text-xs text-slate-500 hover:text-slate-800"
                  >
                    Archive
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Audit Modal / Drawer */}
      {showAuditModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <History className="w-4 h-4 text-amber-600" />
                Case Studies Append-Only Audit Trail
              </h3>
              <button
                type="button"
                onClick={() => setShowAuditModal(false)}
                className="min-h-[44px] min-w-[44px] text-slate-400 hover:text-slate-600 text-lg font-bold"
                aria-label="Close audit log"
              >
                &times;
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3 flex-1 text-xs">
              <p className="text-slate-600">
                Every create, edit, publish, draft, and archive action is recorded append-only in UTC with its staff actor.
              </p>
              {auditLogs.length === 0 ? (
                <div className="p-4 text-center text-slate-500 bg-slate-50 rounded">
                  Audit events logged on action. Trigger an edit or status change to generate entries.
                </div>
              ) : (
                <div className="space-y-2">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded font-mono">
                      <div className="flex justify-between font-bold text-slate-700">
                        <span>ACTION: {log.action.toUpperCase()}</span>
                        <span>{new Date(log.created_at).toLocaleString('en-GB', { timeZone: 'Africa/Lagos' })} Lagos</span>
                      </div>
                      <div className="text-slate-500 mt-1">
                        Actor: {log.actor_id} ({log.actor_role})
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-3 border-t border-slate-200 bg-slate-50 text-right">
              <button
                type="button"
                onClick={() => setShowAuditModal(false)}
                className="min-h-[44px] px-4 py-2 bg-slate-800 text-white text-xs font-semibold rounded hover:bg-slate-700"
              >
                Close Audit View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
