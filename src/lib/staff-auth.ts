import 'server-only';

import { cookies } from 'next/headers';

const ACCESS_COOKIE = 'orachin_admin_access';
const REFRESH_COOKIE = 'orachin_admin_refresh';

type SupabaseConfig = {
  url: string;
  publishableKey: string;
};

type AuthUser = {
  id: string;
  email?: string | null;
};

export type SupabaseSession = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: AuthUser;
  aal: 'aal1' | 'aal2';
};

export type StaffActor = {
  id: string;
  email: string | null;
  role: 'owner' | 'administrator';
  accessToken: string;
};

export class StaffAccessError extends Error {
  constructor(
    public readonly status: 401 | 403 | 503,
    message: string
  ) {
    super(message);
  }
}

export class SupabaseRequestError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
  }
}

export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
}

export function getSupabaseConfig(): SupabaseConfig {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    throw new StaffAccessError(
      503,
      'The staff portal is not configured. Set the Supabase URL and publishable key before enabling it.'
    );
  }

  return { url: url.replace(/\/$/, ''), publishableKey };
}

function decodeJwtPayload(token: string): Record<string, unknown> {
  const payload = token.split('.')[1];
  if (!payload) {
    throw new StaffAccessError(401, 'Your staff session is invalid. Please sign in again.');
  }

  try {
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '='));
    return JSON.parse(decoded) as Record<string, unknown>;
  } catch {
    throw new StaffAccessError(401, 'Your staff session is invalid. Please sign in again.');
  }
}

async function readErrorMessage(response: Response) {
  try {
    const body = (await response.json()) as { message?: string; error_description?: string };
    return body.message || body.error_description || 'The staff service could not complete the request.';
  } catch {
    return 'The staff service could not complete the request.';
  }
}

export async function supabaseFetch(
  path: string,
  init: RequestInit = {},
  accessToken?: string,
  useServiceRole = false
) {
  const { url, publishableKey } = getSupabaseConfig();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const key = useServiceRole ? serviceRoleKey : publishableKey;

  if (!key) {
    throw new StaffAccessError(503, 'The staff portal server key is not configured.');
  }

  const headers = new Headers(init.headers);
  headers.set('apikey', key);
  headers.set('Accept', 'application/json');
  headers.set('Content-Type', 'application/json');
  headers.set('Authorization', `Bearer ${accessToken || key}`);

  const response = await fetch(`${url}${path}`, {
    ...init,
    headers,
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new SupabaseRequestError(response.status, await readErrorMessage(response));
  }

  return response;
}

async function getUser(accessToken: string): Promise<AuthUser> {
  const response = await supabaseFetch('/auth/v1/user', { method: 'GET' }, accessToken);
  const user = (await response.json()) as AuthUser;

  if (!user.id) {
    throw new StaffAccessError(401, 'Your staff session is invalid. Please sign in again.');
  }

  return user;
}

async function refreshSession(refreshToken: string): Promise<SupabaseSession | null> {
  try {
    const response = await supabaseFetch('/auth/v1/token?grant_type=refresh_token', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    const data = (await response.json()) as Record<string, unknown>;
    return createSession(data);
  } catch {
    return null;
  }
}

function createSession(data: Record<string, unknown>): SupabaseSession {
  const accessToken = typeof data.access_token === 'string' ? data.access_token : '';
  const refreshToken = typeof data.refresh_token === 'string' ? data.refresh_token : '';
  const expiresIn = typeof data.expires_in === 'number' ? data.expires_in : 0;

  if (!accessToken || !refreshToken || expiresIn <= 0) {
    throw new StaffAccessError(401, 'The sign-in response did not include a valid staff session.');
  }

  const claims = decodeJwtPayload(accessToken);
  const user = data.user as AuthUser | undefined;
  const subject = typeof claims.sub === 'string' ? claims.sub : user?.id;

  if (!subject) {
    throw new StaffAccessError(401, 'The sign-in response did not include a valid staff identity.');
  }

  return {
    accessToken,
    refreshToken,
    expiresIn,
    user: { id: subject, email: user?.email ?? null },
    aal: claims.aal === 'aal2' ? 'aal2' : 'aal1',
  };
}

export async function createSessionFromPassword(email: string, password: string) {
  const response = await supabaseFetch('/auth/v1/token?grant_type=password', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  return createVerifiedSession((await response.json()) as Record<string, unknown>);
}

export async function createVerifiedSession(data: Record<string, unknown>) {
  const session = createSession(data);
  const verifiedUser = await getUser(session.accessToken);

  if (verifiedUser.id !== session.user.id) {
    throw new StaffAccessError(401, 'The sign-in response did not match the verified staff identity.');
  }

  return { ...session, user: verifiedUser };
}

export async function resolveStaffSession(accessToken?: string, refreshToken?: string) {
  if (!accessToken) {
    return { session: null, refreshed: false };
  }

  try {
    const user = await getUser(accessToken);
    const claims = decodeJwtPayload(accessToken);
    return {
      session: {
        accessToken,
        refreshToken: refreshToken || '',
        expiresIn: 60 * 60,
        user,
        aal: claims.aal === 'aal2' ? ('aal2' as const) : ('aal1' as const),
      },
      refreshed: false,
    };
  } catch {
    if (!refreshToken) {
      return { session: null, refreshed: false };
    }

    const session = await refreshSession(refreshToken);
    return { session, refreshed: Boolean(session) };
  }
}

export async function getServerStaffSession() {
  const cookieStore = await cookies();
  return resolveStaffSession(
    cookieStore.get(ACCESS_COOKIE)?.value,
    cookieStore.get(REFRESH_COOKIE)?.value
  );
}

export async function requireSignedInSession() {
  if (!isSupabaseConfigured()) {
    throw new StaffAccessError(503, 'The staff portal is not configured.');
  }

  const { session } = await getServerStaffSession();
  if (!session) {
    throw new StaffAccessError(401, 'Please sign in to continue.');
  }

  return session;
}

async function getCurrentStaffRole(accessToken: string) {
  const response = await supabaseFetch('/rest/v1/rpc/current_staff_role', {
    method: 'POST',
    body: JSON.stringify({}),
  }, accessToken);
  const role = await response.json();
  return role === 'owner' || role === 'administrator' ? role : null;
}

export async function getStaffActor(session: SupabaseSession): Promise<StaffActor> {
  if (session.aal !== 'aal2') {
    throw new StaffAccessError(403, 'Multi-factor verification is required before using the staff portal.');
  }

  const role = await getCurrentStaffRole(session.accessToken);
  if (!role) {
    throw new StaffAccessError(403, 'This account does not have an active ORACHIN staff role.');
  }

  return {
    id: session.user.id,
    email: session.user.email ?? null,
    role,
    accessToken: session.accessToken,
  };
}

export async function requireStaffActor() {
  if (!isSupabaseConfigured()) {
    throw new StaffAccessError(
      503,
      'The staff portal is not configured. Set the Supabase environment values first.'
    );
  }

  const { session } = await getServerStaffSession();
  if (!session) {
    throw new StaffAccessError(401, 'Please sign in to access the staff portal.');
  }

  return getStaffActor(session);
}

export function applySessionCookies(response: { cookies: { set: Function } }, session: SupabaseSession) {
  const isProduction = process.env.NODE_ENV === 'production';
  response.cookies.set(ACCESS_COOKIE, session.accessToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProduction,
    path: '/',
    maxAge: session.expiresIn,
  });
  response.cookies.set(REFRESH_COOKIE, session.refreshToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProduction,
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
}

export function clearSessionCookies(response: { cookies: { set: Function } }) {
  response.cookies.set(ACCESS_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 });
  response.cookies.set(REFRESH_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 });
}
