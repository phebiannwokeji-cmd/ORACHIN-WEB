import { NextResponse } from 'next/server';
import { z } from 'zod';
import {
  applySessionCookies,
  clearSessionCookies,
  createSessionFromPassword,
  createVerifiedSession,
  requireSignedInSession,
  StaffAccessError,
  supabaseFetch,
  SupabaseRequestError,
} from '@/lib/staff-auth';

const credentialsSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1).max(512),
});

const verifySchema = z.object({
  factorId: z.string().uuid(),
  code: z.string().trim().regex(/^\d{6}$/),
});

function errorResponse(error: unknown, fallback: string) {
  if (error instanceof StaffAccessError) {
    return NextResponse.json({ success: false, error: error.message }, { status: error.status });
  }
  if (error instanceof SupabaseRequestError) {
    return NextResponse.json({ success: false, error: fallback }, { status: error.status === 401 ? 401 : 400 });
  }
  return NextResponse.json({ success: false, error: fallback }, { status: 500 });
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request payload.' }, { status: 400 });
  }

  const action = body.action;
  try {
    if (action === 'sign-in') {
      const credentials = credentialsSchema.parse(body);
      const session = await createSessionFromPassword(credentials.email, credentials.password);
      let factorId: string | null = null;
      if (session.aal !== 'aal2') {
        const factorsResponse = await supabaseFetch('/auth/v1/factors', { method: 'GET' }, session.accessToken);
        const factors = (await factorsResponse.json()) as { totp?: Array<{ id?: string; status?: string }> };
        factorId = factors.totp?.find((factor) => factor.status === 'verified')?.id || null;
      }
      const response = NextResponse.json({ success: true, mfaRequired: session.aal !== 'aal2', factorId });
      applySessionCookies(response, session);
      return response;
    }

    if (action === 'sign-out') {
      const response = NextResponse.json({ success: true });
      clearSessionCookies(response);
      return response;
    }

    const session = await requireSignedInSession();
    if (action === 'enroll-totp') {
      const response = await supabaseFetch('/auth/v1/factors', {
        method: 'POST',
        body: JSON.stringify({ factor_type: 'totp', friendly_name: 'ORACHIN staff portal' }),
      }, session.accessToken);
      return NextResponse.json({ success: true, data: await response.json() });
    }

    if (action === 'verify-totp') {
      const { factorId, code } = verifySchema.parse(body);
      const challengeResponse = await supabaseFetch(`/auth/v1/factors/${factorId}/challenge`, {
        method: 'POST',
        body: JSON.stringify({}),
      }, session.accessToken);
      const challenge = (await challengeResponse.json()) as { id?: string };
      if (!challenge.id) {
        return NextResponse.json({ success: false, error: 'Unable to start multi-factor verification.' }, { status: 400 });
      }

      const verifyResponse = await supabaseFetch(`/auth/v1/factors/${factorId}/verify`, {
        method: 'POST',
        body: JSON.stringify({ challenge_id: challenge.id, code }),
      }, session.accessToken);
      const verifiedSession = await createVerifiedSession((await verifyResponse.json()) as Record<string, unknown>);
      const response = NextResponse.json({ success: true });
      applySessionCookies(response, verifiedSession);
      return response;
    }

    return NextResponse.json({ success: false, error: 'Unknown staff session action.' }, { status: 400 });
  } catch (error) {
    return errorResponse(error, action === 'sign-in' ? 'Unable to sign in with those credentials.' : 'The staff request could not be completed.');
  }
}
