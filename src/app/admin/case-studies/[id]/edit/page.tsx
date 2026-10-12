import React from 'react';
import { caseStudyService } from '@/lib/case-studies/service';
import { requireStaffActor } from '@/lib/staff-auth';
import CaseStudyForm from '@/components/admin/CaseStudyForm';
import { notFound } from 'next/navigation';

export default async function EditCaseStudyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const actor = await requireStaffActor();
  const item = await caseStudyService.getCaseStudyById(id, actor);

  if (!item) {
    notFound();
  }

  return <CaseStudyForm initialData={item} isEdit={true} />;
}
