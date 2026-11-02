import { useState, type FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { ApiError } from '../api/client';
import { useAuth } from './AuthProvider';

export default function LoginPage() {
  const { user, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/" replace />;

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true); setError('');
    try { await login(email.trim(), password); }
    catch (err) {
      setError(err instanceof ApiError && err.status === 429 ? 'Too many attempts. Wait a few minutes and try again.' : 'Email or password is incorrect.');
    } finally { setBusy(false); setPassword(''); }
  }

  return (
    <>
      <header><h1>Vertivo Delivery QC</h1><p>Sign in to continue</p></header>
      <main className="login">
        <section className="panel">
          <h2>Sign in</h2>
          <form onSubmit={submit}>
            {error && <div className="error" role="alert">{error}</div>}
            <div><label htmlFor="email">Email</label>
              <input id="email" type="email" autoComplete="username" required maxLength={254} value={email} onChange={(e) => setEmail(e.target.value)} /></div>
            <div><label htmlFor="password">Password</label>
              <input id="password" type="password" autoComplete="current-password" required maxLength={200} value={password} onChange={(e) => setPassword(e.target.value)} /></div>
            <button className="primary" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
          </form>
        </section>
      </main>
    </>
  );
}
