import Link from 'next/link';
import { AuthForm } from '../auth-form';
export default function RegisterPage() {
  return <main className="auth-wrap"><aside className="auth-aside"><a className="brand" href="/">akazi<span style={{ color: '#d8f36a' }}>hub</span></a><div><h1>Make room for what’s next.</h1><p>Create your account and start connecting opportunity with talent.</p></div><small>© Akazi Hub</small></aside><section className="auth-main"><div className="auth-card"><span className="eyebrow">Get started</span><h2>Create your account</h2><p>Start with your personal and workspace details.</p><AuthForm mode="register" /><p>Already registered? <Link href="/login" style={{ color: 'var(--green)', fontWeight: 700 }}>Log in</Link></p></div></section></main>;
}
