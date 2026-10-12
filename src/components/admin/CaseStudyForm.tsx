'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CaseStudy, CaseStudyFormData, ClientType, ServiceScope, CaseStudyStatus } from '@/types/case-study';
import { Plus, Trash2, ArrowLeft, Save, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface Props {
  initialData?: CaseStudy;
  isEdit?: boolean;
}

export default function CaseStudyForm({ initialData, isEdit = false }: Props) {
  const router = useRouter();
  const [formData, setFormData] = useState<CaseStudyFormData>({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    summary: initialData?.summary || '',
    client_type: initialData?.client_type || 'commercial',
    location: initialData?.location || '',
    service_scope: initialData?.service_scope || 'supply_and_application',
    surface_type: initialData?.surface_type || '',
    paint_products_used: initialData?.paint_products_used || [
      { product_name: '', finish: '', colour_name: '', colour_code: '' },
    ],
    hero_image_url: initialData?.hero_image_url || '',
    gallery_image_urls: initialData?.gallery_image_urls || [],
    content: initialData?.content || '',
    status: initialData?.status || 'draft',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Auto-generate slug from title if not manually customized on creation
  const handleTitleChange = (val: string) => {
    setFormData((prev) => {
      const updated = { ...prev, title: val };
      if (!isEdit && (!prev.slug || prev.slug === slugify(prev.title))) {
        updated.slug = slugify(val);
      }
      return updated;
    });
  };

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleProductChange = (index: number, field: string, val: string) => {
    setFormData((prev) => {
      const updatedProducts = [...prev.paint_products_used];
      updatedProducts[index] = { ...updatedProducts[index], [field]: val };
      return { ...prev, paint_products_used: updatedProducts };
    });
  };

  const addProductRow = () => {
    setFormData((prev) => ({
      ...prev,
      paint_products_used: [
        ...prev.paint_products_used,
        { product_name: '', finish: '', colour_name: '', colour_code: '' },
      ],
    }));
  };

  const removeProductRow = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      paint_products_used: prev.paint_products_used.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setGeneralError(null);
    setSubmitting(true);

    // Filter empty product entries
    const cleanedProducts = formData.paint_products_used.filter(
      (p) => p.product_name.trim().length > 0
    );

    const payload = {
      ...formData,
      paint_products_used: cleanedProducts,
      hero_image_url: formData.hero_image_url?.trim() || undefined,
    };

    try {
      const url = isEdit
        ? `/api/admin/case-studies/${initialData?.id}`
        : '/api/admin/case-studies';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!json.success) {
        if (Array.isArray(json.issues)) {
          setErrors(Object.fromEntries(json.issues.map((issue: { field: string; message: string }) => [issue.field, issue.message])));
        }
        setGeneralError(json.error || 'Validation or processing error occurred');
      } else {
        router.push('/admin/case-studies');
        router.refresh();
      }
    } catch {
      setGeneralError('Network failure occurred. Please verify your connection.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl" noValidate>
      {/* Back link */}
      <div>
        <Link
          href="/admin/case-studies"
          className="min-h-[44px] inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 focus:ring-2 focus:ring-amber-500 rounded p-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Case Studies</span>
        </Link>
      </div>

      {/* Header */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
          {isEdit ? 'Edit Case Study' : 'Create Project Case Study'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Record genuine architectural, commercial, or residential project specifications.
        </p>
      </div>

      {generalError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-800 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-semibold">Validation Error</strong>
            <p className="mt-0.5">{generalError}</p>
          </div>
        </div>
      )}

      {/* Core Details Card */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-2">
          Project Identity
        </h2>

        {/* Title */}
        <div>
          <label htmlFor="cs-title" className="block text-sm font-medium text-slate-700 mb-1">
            Project Title <span className="text-red-500">*</span>
          </label>
          <input
            id="cs-title"
            type="text"
            required
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? 'cs-title-error' : undefined}
            placeholder="e.g. Residential exterior repaint"
            className="w-full min-h-[44px] px-3.5 py-2 text-sm rounded-md border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
          <p className="text-xs text-slate-500 mt-1">
            Must accurately describe the genuine project.
          </p>
          {errors.title && <p id="cs-title-error" className="mt-1 text-xs text-red-700">{errors.title}</p>}
        </div>

        {/* Slug */}
        <div>
          <label htmlFor="cs-slug" className="block text-sm font-medium text-slate-700 mb-1">
            URL Slug <span className="text-red-500">*</span>
          </label>
          <div className="flex rounded-md shadow-xs">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-300 bg-slate-50 text-slate-500 text-xs sm:text-sm">
              /projects/
            </span>
            <input
              id="cs-slug"
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase() })}
              aria-invalid={Boolean(errors.slug)}
              aria-describedby={errors.slug ? 'cs-slug-error' : undefined}
              placeholder="orachin-mafoluku-facility-refresh"
              className="flex-1 min-h-[44px] px-3.5 py-2 text-sm rounded-r-md border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 font-mono text-xs sm:text-sm"
            />
          </div>
          {errors.slug && <p id="cs-slug-error" className="mt-1 text-xs text-red-700">{errors.slug}</p>}
        </div>

        {/* Sector & Service Scope */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="cs-client-type" className="block text-sm font-medium text-slate-700 mb-1">
              Client Sector <span className="text-red-500">*</span>
            </label>
            <select
              id="cs-client-type"
              value={formData.client_type}
              onChange={(e) => setFormData({ ...formData, client_type: e.target.value as ClientType })}
              className="w-full min-h-[44px] px-3.5 py-2 text-sm rounded-md border border-slate-300 focus:ring-2 focus:ring-amber-500 bg-white"
            >
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="industrial">Industrial</option>
              <option value="institutional">Institutional</option>
            </select>
          </div>

          <div>
            <label htmlFor="cs-service-scope" className="block text-sm font-medium text-slate-700 mb-1">
              Service Scope Offered <span className="text-red-500">*</span>
            </label>
            <select
              id="cs-service-scope"
              value={formData.service_scope}
              onChange={(e) => setFormData({ ...formData, service_scope: e.target.value as ServiceScope })}
              className="w-full min-h-[44px] px-3.5 py-2 text-sm rounded-md border border-slate-300 focus:ring-2 focus:ring-amber-500 bg-white"
            >
              <option value="supply_and_application">Paint Supply & Professional Application</option>
              <option value="paint_supply">Paint Supply Only</option>
              <option value="application_service">Painting Application Service Only</option>
            </select>
          </div>
        </div>

        {/* Location & Surface Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="cs-location" className="block text-sm font-medium text-slate-700 mb-1">
              Project Location
            </label>
            <input
              id="cs-location"
              type="text"
              value={formData.location || ''}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. Mafoluku, Lagos or Victoria Island, Lagos"
              className="w-full min-h-[44px] px-3.5 py-2 text-sm rounded-md border border-slate-300 focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label htmlFor="cs-surface-type" className="block text-sm font-medium text-slate-700 mb-1">
              Surface & Substrate Type
            </label>
            <input
              id="cs-surface-type"
              type="text"
              value={formData.surface_type || ''}
              onChange={(e) => setFormData({ ...formData, surface_type: e.target.value })}
              placeholder="e.g. Exterior sandcrete blockwork, interior plaster"
              className="w-full min-h-[44px] px-3.5 py-2 text-sm rounded-md border border-slate-300 focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Summary and Content Narrative */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-2">
          Project Narrative & Summary
        </h2>

        <div>
          <label htmlFor="cs-summary" className="block text-sm font-medium text-slate-700 mb-1">
            Summary / Overview Excerpt <span className="text-red-500">*</span>
          </label>
          <textarea
            id="cs-summary"
            required
            rows={2}
            value={formData.summary}
            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
            aria-invalid={Boolean(errors.summary)}
            aria-describedby={errors.summary ? 'cs-summary-error' : undefined}
            placeholder="Brief 2-3 sentence overview of the project scope and outcome."
            className="w-full px-3.5 py-2 text-sm rounded-md border border-slate-300 focus:ring-2 focus:ring-amber-500 leading-relaxed"
          />
          {errors.summary && <p id="cs-summary-error" className="mt-1 text-xs text-red-700">{errors.summary}</p>}
        </div>

        <div>
          <label htmlFor="cs-content" className="block text-sm font-medium text-slate-700 mb-1">
            Detailed Narrative & Scope Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="cs-content"
            required
            rows={5}
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            aria-invalid={Boolean(errors.content)}
            aria-describedby={errors.content ? 'cs-content-error' : undefined}
            placeholder="Detail surface preparation, environmental considerations, coats applied, and results achieved."
            className="w-full px-3.5 py-2 text-sm rounded-md border border-slate-300 focus:ring-2 focus:ring-amber-500 leading-relaxed font-sans"
          />
          {errors.content && <p id="cs-content-error" className="mt-1 text-xs text-red-700">{errors.content}</p>}
        </div>
      </div>

      {/* Paint Products Used */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Paint Systems & Products Applied
            </h2>
            <p className="text-xs text-slate-500">
              Link genuine ORACHIN paint products and finishes used in this job.
            </p>
          </div>
          <button
            type="button"
            onClick={addProductRow}
            className="min-h-[44px] inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded focus:ring-2 focus:ring-amber-500"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Product</span>
          </button>
        </div>

        <div className="space-y-3">
          {formData.paint_products_used.map((prod, idx) => (
            <div
              key={idx}
              className="p-3 bg-slate-50 rounded-md border border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center"
            >
              <div className="sm:col-span-4">
                <label htmlFor={`prod-name-${idx}`} className="block text-xs font-medium text-slate-600 mb-1">
                  Product Name
                </label>
                <input
                  id={`prod-name-${idx}`}
                  type="text"
                  value={prod.product_name}
                  onChange={(e) => handleProductChange(idx, 'product_name', e.target.value)}
                  placeholder="Approved product name"
                  className="w-full min-h-[40px] px-2.5 py-1.5 text-xs rounded border border-slate-300 bg-white"
                />
              </div>

              <div className="sm:col-span-3">
                <label htmlFor={`prod-finish-${idx}`} className="block text-xs font-medium text-slate-600 mb-1">
                  Finish
                </label>
                <input
                  id={`prod-finish-${idx}`}
                  type="text"
                  value={prod.finish || ''}
                  onChange={(e) => handleProductChange(idx, 'finish', e.target.value)}
                  placeholder="e.g. Matt / Satin / Gloss"
                  className="w-full min-h-[40px] px-2.5 py-1.5 text-xs rounded border border-slate-300 bg-white"
                />
              </div>

              <div className="sm:col-span-3">
                <label htmlFor={`prod-colour-${idx}`} className="block text-xs font-medium text-slate-600 mb-1">
                  Colour & Code
                </label>
                <input
                  id={`prod-colour-${idx}`}
                  type="text"
                  value={prod.colour_name || ''}
                  onChange={(e) => handleProductChange(idx, 'colour_name', e.target.value)}
                  placeholder="Approved colour name and code"
                  className="w-full min-h-[40px] px-2.5 py-1.5 text-xs rounded border border-slate-300 bg-white"
                />
              </div>

              <div className="sm:col-span-2 flex sm:justify-end pt-2 sm:pt-4">
                <button
                  type="button"
                  onClick={() => removeProductRow(idx)}
                  disabled={formData.paint_products_used.length <= 1}
                  aria-label={`Remove product row ${idx + 1}`}
                  className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-slate-400 hover:text-red-600 disabled:opacity-30"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Publication Status & Actions */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-2">
          Publication State
        </h2>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="max-w-md">
            <label htmlFor="cs-status" className="block text-sm font-medium text-slate-700 mb-1">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              id="cs-status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as CaseStudyStatus })}
              className="min-h-[44px] px-3.5 py-2 text-sm rounded-md border border-slate-300 focus:ring-2 focus:ring-amber-500 bg-white w-full sm:w-auto"
            >
              <option value="draft">Draft (Internal review only)</option>
              <option value="published">Published (Gated on public site by Gate G9)</option>
              <option value="archived">Archived</option>
            </select>
            <p className="text-xs text-slate-500 mt-1">
              New case studies default to Draft per Agent Default AD-2026-10-12-01.
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2 sm:pt-0">
            <Link
              href="/admin/case-studies"
              className="min-h-[44px] inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={submitting}
              className="min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-md shadow-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{submitting ? 'Saving...' : isEdit ? 'Update Case Study' : 'Save Case Study'}</span>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
