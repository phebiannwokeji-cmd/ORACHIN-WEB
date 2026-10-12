import { NextResponse } from 'next/server';
import { caseStudyService } from '@/lib/case-studies/service';
import { requireStaffActor, StaffAccessError } from '@/lib/staff-auth';

export async function GET() {
  try {
    const actor = await requireStaffActor();
    const logs = await caseStudyService.getAuditLogs(actor);
    return NextResponse.json({ success: true, data: logs });
  } catch (error) {
    if (error instanceof StaffAccessError) {
      return NextResponse.json({ success: false, error: error.message }, { status: error.status });
    }
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
