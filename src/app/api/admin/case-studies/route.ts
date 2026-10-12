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

export async function GET(request: Request) {
  try {
    const actor = await requireStaffActor();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as CaseStudyStatus | null;
    if (status && !['draft', 'published', 'archived'].includes(status)) {
      return NextResponse.json({ success: false, error: 'Invalid status filter.' }, { status: 400 });
    }
    const items = await caseStudyService.getAdminCaseStudies(actor, status || undefined);
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const actor = await requireStaffActor();
    const body = await request.json();
    const result = await caseStudyService.createCaseStudy(body, actor);
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error, issues: result.issues }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: result.data }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
