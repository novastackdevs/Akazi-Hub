import Link from 'next/link';
import { AuthForm } from '../auth-form';
export default function LoginPage() {
  return <main className="auth-wrap"><aside className="auth-aside"><a className="brand" href="/">akazi<span style={{ color: '#d8f36a' }}>hub</span></a><div><h1>Welcome back. Your next move is waiting.</h1><p>Sign in to continue building your future with Akazi Hub.</p></div><small>© Akazi Hub</small></aside><section className="auth-main"><div className="auth-card"><span className="eyebrow">Your workspace</span><h2>Log in to Akazi Hub</h2><p>Use your account details to continue.</p><AuthForm mode="login" /><p>New to Akazi Hub? <Link href="/register" style={{ color: 'var(--green)', fontWeight: 700 }}>Create an account</Link></p></div></section></main>;
}
