'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

type MfaEnrollment = {
  id: string;
  totp?: { qr_code?: string; secret?: string };
};

export default function StaffSignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [factorId, setFactorId] = useState('');
  const [code, setCode] = useState('');
  const [enrollment, setEnrollment] = useState<MfaEnrollment | null>(null);
  const [step, setStep] = useState<'sign-in' | 'mfa'>('sign-in');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const nextPath = '/admin/case-studies';

  async function submit(action: string, extra: Record<string, unknown> = {}) {
    const response = await fetch('/api/staff/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, ...extra }),
    });
    const json = await response.json();
    if (!json.success) throw new Error(json.error || 'The staff request could not be completed.');
    return json;
  }

  async function onSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const result = await submit('sign-in', { email, password });
      if (result.mfaRequired) {
        setFactorId(typeof result.factorId === 'string' ? result.factorId : '');
        setStep('mfa');
      }
      else {
        router.replace(nextPath);
        router.refresh();
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to sign in.');
    } finally {
      setSubmitting(false);
    }
  }

  async function startEnrollment() {
    setError(null);
    setSubmitting(true);
    try {
      const result = await submit('enroll-totp');
      const nextEnrollment = result.data as MfaEnrollment;
      setEnrollment(nextEnrollment);
      setFactorId(nextEnrollment.id);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to begin multi-factor enrollment.');
    } finally {
      setSubmitting(false);
    }
  }

  async function verifyMfa(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await submit('verify-totp', { factorId, code });
      router.replace(nextPath);
      router.refresh();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'The verification code could not be confirmed.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 text-slate-900">
      <section className="mx-auto w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">ORACHIN Paints</p>
        <h1 className="mt-2 text-2xl font-bold">Staff portal</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">Case-study records are available only to authorised staff using multi-factor verification.</p>
        {error && <p role="alert" className="mt-5 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}

        {step === 'sign-in' ? (
          <form onSubmit={onSignIn} className="mt-6 space-y-4">
            <div><label htmlFor="staff-email" className="block text-sm font-medium text-slate-700">Email address</label><input id="staff-email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1 min-h-11 w-full rounded-md border border-slate-300 px-3 py-2" /></div>
            <div><label htmlFor="staff-password" className="block text-sm font-medium text-slate-700">Password</label><input id="staff-password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1 min-h-11 w-full rounded-md border border-slate-300 px-3 py-2" /></div>
            <button type="submit" disabled={submitting} className="min-h-11 w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{submitting ? 'Signing in…' : 'Sign in'}</button>
          </form>
        ) : (
          <div className="mt-6 space-y-5">
            {!enrollment ? <><p className="text-sm text-slate-600">Enter a code from your enrolled authenticator app, or enroll a new authenticator.</p><button type="button" onClick={startEnrollment} disabled={submitting} className="min-h-11 w-full rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 disabled:opacity-50">Set up authenticator app</button></> : <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950"><p className="font-semibold">Scan this code with an authenticator app.</p>{enrollment.totp?.qr_code && <img alt="Authenticator setup code" className="mx-auto mt-3 h-48 w-48" src={`data:image/svg+xml;utf8,${encodeURIComponent(enrollment.totp.qr_code)}`} />}{enrollment.totp?.secret && <p className="mt-3 break-all text-xs">Manual key: {enrollment.totp.secret}</p>}</div>}
            <form onSubmit={verifyMfa} className="space-y-4"><div><label htmlFor="totp-code" className="block text-sm font-medium text-slate-700">Authenticator code</label><input id="totp-code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" required value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))} className="mt-1 min-h-11 w-full rounded-md border border-slate-300 px-3 py-2 tracking-[0.35em]" /></div><button type="submit" disabled={submitting || !factorId} className="min-h-11 w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{submitting ? 'Verifying…' : 'Verify and continue'}</button></form>
          </div>
        )}
      </section>
    </main>
  );
}
