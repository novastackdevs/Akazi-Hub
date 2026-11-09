'use client';
import { useEffect, useState } from 'react';
export default function DashboardPage() {
  const [ready, setReady] = useState(false);
  useEffect(() => { if (!sessionStorage.getItem('akazi_access_token')) window.location.replace('/login'); else setReady(true); }, []);
  if (!ready) return <main className="container section">Loading your workspace…</main>;
  return <main className="container section"><a className="brand" href="/">akazi<span>hub</span></a><span className="eyebrow">Employer workspace</span><h1>Welcome to your Akazi Hub workspace.</h1><p>Your account is ready. Job management, candidate pipelines, and team tools are coming in the next delivery phase.</p><button className="btn btn-outline" onClick={() => { sessionStorage.removeItem('akazi_access_token'); window.location.assign('/login'); }}>Sign out</button></main>;
}
