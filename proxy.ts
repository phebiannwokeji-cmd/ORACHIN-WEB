import { NextRequest, NextResponse } from 'next/server';
import {
  applySessionCookies,
  getStaffActor,
  isSupabaseConfigured,
  resolveStaffSession,
  StaffAccessError,
} from '@/lib/staff-auth';

function accessFailure(request: NextRequest, status: 401 | 403 | 503, message: string) {
  if (request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.json({ success: false, error: message }, { status });
  }

  const destination = new URL('/staff/sign-in', request.url);
  destination.searchParams.set('next', request.nextUrl.pathname);
  destination.searchParams.set('reason', status === 403 ? 'mfa-or-role' : 'sign-in');
  return NextResponse.redirect(destination);
}

export async function proxy(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return accessFailure(request, 503, 'The staff portal is not configured.');
  }

  const { session, refreshed } = await resolveStaffSession(
    request.cookies.get('orachin_admin_access')?.value,
    request.cookies.get('orachin_admin_refresh')?.value
  );

  if (!session) {
    return accessFailure(request, 401, 'Please sign in to access the staff portal.');
  }

  try {
    await getStaffActor(session);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Staff access was denied.';
    const status = error instanceof StaffAccessError ? error.status : 403;
    return accessFailure(request, status, message);
  }

  const response = NextResponse.next({ request });
  if (refreshed) {
    applySessionCookies(response, session);
  }
  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
