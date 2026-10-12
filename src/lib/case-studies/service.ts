import 'server-only';

import { isProjectsPublicDisplayCleared } from '@/lib/config/business';
import {
  StaffActor,
  SupabaseRequestError,
  supabaseFetch,
} from '@/lib/staff-auth';
import {
  CaseStudy,
  CaseStudyFormData,
  CaseStudyStatus,
  CaseStudyValidationIssue,
  caseStudySchema,
  getCaseStudyValidationIssues,
} from '@/types/case-study';

export interface AuditRecord {
  id: string;
  entity_name: 'case_study';
  entity_id: string;
  action: 'create' | 'update' | 'status_change' | 'archive';
  actor_id: string;
  actor_role: 'owner' | 'administrator';
  payload: Record<string, unknown>;
  created_at: string;
}

type ServiceResult = {
  success: boolean;
  data?: CaseStudy;
  error?: string;
  issues?: CaseStudyValidationIssue[];
};

function getErrorMessage(error: unknown) {
  if (error instanceof SupabaseRequestError) {
    if (error.status === 23505 || /duplicate key|already exists/i.test(error.message)) {
      return 'A case study already uses this URL slug.';
    }
    return error.message;
  }

  return error instanceof Error ? error.message : 'The case-study request could not be completed.';
}

function parseCaseStudy(value: unknown): CaseStudy {
  if (!value || typeof value !== 'object') {
    throw new Error('The database returned an invalid case-study record.');
  }

  const record = value as Record<string, unknown>;
  const parsed = caseStudySchema.parse({
    ...record,
    hero_image_url: record.hero_image_url ?? null,
    gallery_image_urls: record.gallery_image_urls ?? [],
  });

  const id = record.id;
  const createdAt = record.created_at;
  const updatedAt = record.updated_at;
  if (typeof id !== 'string' || typeof createdAt !== 'string' || typeof updatedAt !== 'string') {
    throw new Error('The database returned an incomplete case-study record.');
  }

  return {
    ...parsed,
    id,
    published_at: typeof record.published_at === 'string' ? record.published_at : null,
    created_at: createdAt,
    updated_at: updatedAt,
    created_by: typeof record.created_by === 'string' ? record.created_by : null,
    updated_by: typeof record.updated_by === 'string' ? record.updated_by : null,
  };
}

function singleRecord(value: unknown) {
  return Array.isArray(value) ? value[0] : value;
}

function toDatabasePayload(input: CaseStudyFormData) {
  return {
    p_title: input.title,
    p_slug: input.slug,
    p_summary: input.summary,
    p_client_type: input.client_type,
    p_location: input.location || null,
    p_service_scope: input.service_scope,
    p_surface_type: input.surface_type || null,
    p_paint_products_used: input.paint_products_used,
    p_hero_image_url: input.hero_image_url || null,
    p_gallery_image_urls: input.gallery_image_urls,
    p_content: input.content,
    p_status: input.status,
  };
}

class CaseStudyService {
  async getAdminCaseStudies(actor: StaffActor, status?: CaseStudyStatus) {
    const query = new URLSearchParams({
      select: '*',
      order: 'updated_at.desc',
    });
    if (status) {
      query.set('status', `eq.${status}`);
    }

    const response = await supabaseFetch(`/rest/v1/case_studies?${query}`, { method: 'GET' }, actor.accessToken);
    return ((await response.json()) as unknown[]).map(parseCaseStudy);
  }

  async getCaseStudyById(id: string, actor: StaffActor) {
    const query = new URLSearchParams({ select: '*', id: `eq.${id}`, limit: '1' });
    const response = await supabaseFetch(`/rest/v1/case_studies?${query}`, { method: 'GET' }, actor.accessToken);
    const rows = (await response.json()) as unknown[];
    return rows[0] ? parseCaseStudy(rows[0]) : null;
  }

  async getPublicCaseStudies() {
    if (!isProjectsPublicDisplayCleared()) {
      return { isGated: true, caseStudies: [] as CaseStudy[] };
    }

    try {
      const query = new URLSearchParams({
        select: '*',
        status: 'eq.published',
        order: 'published_at.desc',
      });
      const response = await supabaseFetch(`/rest/v1/case_studies?${query}`, { method: 'GET' }, undefined, true);
      return {
        isGated: false,
        caseStudies: ((await response.json()) as unknown[]).map(parseCaseStudy),
      };
    } catch {
      return { isGated: true, caseStudies: [] as CaseStudy[] };
    }
  }

  async createCaseStudy(rawInput: unknown, actor: StaffActor): Promise<ServiceResult> {
    const parsed = caseStudySchema.safeParse(rawInput);
    if (!parsed.success) {
      return {
        success: false,
        error: 'Review the highlighted fields and try again.',
        issues: getCaseStudyValidationIssues(rawInput),
      };
    }

    try {
      const response = await supabaseFetch('/rest/v1/rpc/create_case_study', {
        method: 'POST',
        body: JSON.stringify(toDatabasePayload(parsed.data)),
      }, actor.accessToken);
      return { success: true, data: parseCaseStudy(singleRecord(await response.json())) };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  }

  async updateCaseStudy(id: string, rawInput: unknown, actor: StaffActor): Promise<ServiceResult> {
    const parsed = caseStudySchema.safeParse(rawInput);
    if (!parsed.success) {
      return {
        success: false,
        error: 'Review the highlighted fields and try again.',
        issues: getCaseStudyValidationIssues(rawInput),
      };
    }

    try {
      const response = await supabaseFetch('/rest/v1/rpc/update_case_study', {
        method: 'POST',
        body: JSON.stringify({ p_id: id, ...toDatabasePayload(parsed.data) }),
      }, actor.accessToken);
      return { success: true, data: parseCaseStudy(singleRecord(await response.json())) };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  }

  async setStatus(id: string, status: CaseStudyStatus, actor: StaffActor): Promise<ServiceResult> {
    try {
      const response = await supabaseFetch('/rest/v1/rpc/set_case_study_status', {
        method: 'POST',
        body: JSON.stringify({ p_id: id, p_status: status }),
      }, actor.accessToken);
      return { success: true, data: parseCaseStudy(singleRecord(await response.json())) };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  }

  async getAuditLogs(actor: StaffActor) {
    const query = new URLSearchParams({
      select: 'id,entity_name,entity_id,action,actor_id,actor_role,payload,created_at',
      entity_name: 'eq.case_study',
      order: 'created_at.desc',
    });
    const response = await supabaseFetch(`/rest/v1/audit_logs?${query}`, { method: 'GET' }, actor.accessToken);
    return (await response.json()) as AuditRecord[];
  }
}

export const caseStudyService = new CaseStudyService();
