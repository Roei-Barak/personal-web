import { useState } from 'react';

export default function AuthPage({ onAuth }: { onAuth: () => void }) {
  const [mode, setMode] = useState<'login'|'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Unknown error');
      if (mode === 'login') {
        localStorage.setItem('token', data.token);
        onAuth();
      } else {
        setMode('login');
        setError('Registration successful! Please log in.');
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 340, margin: '80px auto', background: '#18223a', borderRadius: 16, padding: 32, boxShadow: '0 8px 32px rgba(0,0,0,0.2)', color: '#dde8f7', fontFamily: 'Heebo, sans-serif' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>{mode === 'login' ? 'התחברות' : 'הרשמה'}</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="אימייל" required style={{ width: '100%', marginBottom: 12, padding: 10, borderRadius: 8, border: '1px solid #3b82f6', fontFamily: 'inherit' }} />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="סיסמה" required style={{ width: '100%', marginBottom: 12, padding: 10, borderRadius: 8, border: '1px solid #3b82f6', fontFamily: 'inherit' }} />
        {error && <div style={{ color: '#f87171', marginBottom: 10 }}>{error}</div>}
        <button type="submit" disabled={loading} style={{ width: '100%', padding: 12, borderRadius: 8, background: '#3b82f6', color: 'white', fontWeight: 700, border: 'none', fontFamily: 'inherit', marginBottom: 10 }}>{loading ? 'טוען...' : (mode === 'login' ? 'התחבר' : 'הרשם')}</button>
      </form>
      <div style={{ textAlign: 'center', marginTop: 8 }}>
        {mode === 'login' ? (
          <span>אין לך חשבון? <button onClick={() => setMode('register')} style={{ color: '#60a5fa', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>הרשמה</button></span>
        ) : (
          <span>יש לך חשבון? <button onClick={() => setMode('login')} style={{ color: '#60a5fa', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>התחבר</button></span>
        )}
      </div>
    </div>
  );
}
