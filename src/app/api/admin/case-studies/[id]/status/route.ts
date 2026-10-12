import { NextResponse } from 'next/server';
import { caseStudyService } from '@/lib/case-studies/service';
import { requireStaffActor, StaffAccessError } from '@/lib/staff-auth';
import { CaseStudyStatus } from '@/types/case-study';

function errorResponse(error: unknown) {
  if (error instanceof StaffAccessError) {
    return NextResponse.json({ success: false, error: error.message }, { status: error.status });
  }

  const message = error instanceof Error ? error.message : 'Unknown error';
  return NextResponse.json({ success: false, error: message }, { status: 500 });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!['draft', 'published', 'archived'].includes(status)) {
      return NextResponse.json({ success: false, error: 'Invalid status' }, { status: 400 });
    }

    const actor = await requireStaffActor();

    const result = await caseStudyService.setStatus(id, status as CaseStudyStatus, actor);
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (error) {
    return errorResponse(error);
  }
}
