'use client';
import { useState } from 'react';
import type { FormEvent } from 'react';

type Props = { mode: 'login' | 'register' };
const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

export function AuthForm({ mode }: Props) {
  const isRegister = mode === 'register';
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(''); setBusy(true);
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
    try {
      const response = await fetch(`${API}/auth/${mode}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(payload) });
      const data = await response.json();
      if (!response.ok) throw new Error(Array.isArray(data.message) ? data.message.join(', ') : data.message ?? 'Unable to complete your request');
      sessionStorage.setItem('akazi_access_token', data.accessToken); window.location.assign('/dashboard');
    } catch (caught) { setError(caught instanceof Error ? caught.message : 'Something went wrong. Please try again.'); }
    finally { setBusy(false); }
  }
  return <form onSubmit={submit}>
    {isRegister && <><div className="field"><label htmlFor="firstName">First name</label><input id="firstName" name="firstName" autoComplete="given-name" required maxLength={80} /></div><div className="field"><label htmlFor="lastName">Last name</label><input id="lastName" name="lastName" autoComplete="family-name" required maxLength={80} /></div><div className="field"><label htmlFor="workspaceName">Company or workspace name</label><input id="workspaceName" name="workspaceName" required maxLength={120} /></div></>}
    <div className="field"><label htmlFor="email">Email address</label><input id="email" name="email" type="email" autoComplete="email" required maxLength={320} /></div><div className="field"><label htmlFor="password">Password</label><input id="password" name="password" type="password" autoComplete={isRegister ? 'new-password' : 'current-password'} required minLength={isRegister ? 10 : 1} maxLength={72} /></div>
    {error && <p className="error" role="alert">{error}</p>}<button className="btn btn-primary" type="submit" disabled={busy}>{busy ? 'Please wait…' : isRegister ? 'Create account' : 'Log in'}</button>
  </form>;
}
