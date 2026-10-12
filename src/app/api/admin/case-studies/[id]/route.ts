import { NextResponse } from 'next/server';
import { caseStudyService } from '@/lib/case-studies/service';
import { requireStaffActor, StaffAccessError } from '@/lib/staff-auth';

function errorResponse(error: unknown) {
  if (error instanceof StaffAccessError) {
    return NextResponse.json({ success: false, error: error.message }, { status: error.status });
  }

  const message = error instanceof Error ? error.message : 'Unknown error';
  return NextResponse.json({ success: false, error: message }, { status: 500 });
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const actor = await requireStaffActor();
    const item = await caseStudyService.getCaseStudyById(id, actor);
    if (!item) {
      return NextResponse.json({ success: false, error: 'Case study not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const actor = await requireStaffActor();

    const result = await caseStudyService.updateCaseStudy(id, body, actor);
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error, issues: result.issues }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (error) {
    return errorResponse(error);
  }
}
