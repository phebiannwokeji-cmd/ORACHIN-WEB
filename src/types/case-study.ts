import { z } from 'zod';

export type ClientType = 'residential' | 'commercial' | 'industrial' | 'institutional';
export type ServiceScope = 'paint_supply' | 'application_service' | 'supply_and_application';
export type CaseStudyStatus = 'draft' | 'published' | 'archived';

export interface CaseStudyProductReference {
  product_name: string;
  finish?: string;
  colour_name?: string;
  colour_code?: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  slug: string;
  summary: string;
  client_type: ClientType;
  location?: string | null;
  service_scope: ServiceScope;
  surface_type?: string | null;
  paint_products_used: CaseStudyProductReference[];
  hero_image_url?: string | null;
  gallery_image_urls: string[];
  content: string;
  status: CaseStudyStatus;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
  created_by?: string | null;
  updated_by?: string | null;
}

// Zod validation schema for form submission & server actions
export const caseStudySchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Title must be at least 3 characters')
    .max(150, 'Title cannot exceed 150 characters'),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens (e.g. lekki-villa-project)'),
  summary: z
    .string()
    .trim()
    .min(10, 'Summary must be at least 10 characters')
    .max(500, 'Summary cannot exceed 500 characters'),
  client_type: z.enum(['residential', 'commercial', 'industrial', 'institutional'] as const),
  location: z.string().trim().max(100).optional().nullable(),
  service_scope: z.enum(['paint_supply', 'application_service', 'supply_and_application'] as const),
  surface_type: z.string().trim().max(100).optional().nullable(),
  paint_products_used: z.array(
    z.object({
      product_name: z.string().trim().min(1, 'Product name is required'),
      finish: z.string().trim().optional(),
      colour_name: z.string().trim().optional(),
      colour_code: z.string().trim().optional(),
    })
  ).default([]),
  hero_image_url: z.string().url('Must be a valid URL').optional().nullable().or(z.literal('')),
  gallery_image_urls: z.array(z.string().url('Must be a valid URL')).default([]),
  content: z
    .string()
    .trim()
    .min(20, 'Content narrative must be at least 20 characters'),
  status: z.enum(['draft', 'published', 'archived'] as const).default('draft'),
});

export type CaseStudyFormData = z.infer<typeof caseStudySchema>;

export type CaseStudyValidationIssue = {
  field: string;
  message: string;
};

export function getCaseStudyValidationIssues(rawInput: unknown): CaseStudyValidationIssue[] {
  const parsed = caseStudySchema.safeParse(rawInput);

  if (parsed.success) {
    return [];
  }

  return parsed.error.issues.map((issue) => ({
    field: issue.path.join('.') || 'form',
    message: issue.message,
  }));
}
