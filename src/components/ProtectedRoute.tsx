import { useState, useEffect, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

const USERNAME = 'roei';        // שנה אם תרצה
const PASSWORD = 'barak2026';   // ← שנה לסיסמה חזקה שלך (רק אתה יודע!)

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [inputUser, setInputUser] = useState('');
  const [inputPass, setInputPass] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (localStorage.getItem('skiAuth') === 'true') setIsAuthenticated(true);
  }, []);

  const handleLogin = () => {
    if (inputUser === USERNAME && inputPass === PASSWORD) {
      localStorage.setItem('skiAuth', 'true');
      setIsAuthenticated(true);
      setShowLogin(false);
    } else {
      setError('שם משתמש או סיסמה שגויים');
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', background: '#060910', display: 'flex', alignItems: 'center', justifyContent: 'center', direction: 'rtl', fontFamily: 'Heebo' }}>
        <div style={{ background: '#0f1623', padding: 40, borderRadius: 16, border: '1px solid #1e2d4a', width: 380 }}>
          <h2 style={{ textAlign: 'center', marginBottom: 20, color: '#4db8ff' }}>🔒 כניסה ל-Dashboard</h2>
          <input value={inputUser} onChange={e => setInputUser(e.target.value)} placeholder="שם משתמש" style={{ width: '100%', padding: 12, marginBottom: 12, borderRadius: 8, background: '#080d18', border: '1px solid #1e2d4a', color: '#fff' }} />
          <input type="password" value={inputPass} onChange={e => setInputPass(e.target.value)} placeholder="סיסמה" style={{ width: '100%', padding: 12, marginBottom: 12, borderRadius: 8, background: '#080d18', border: '1px solid #1e2d4a', color: '#fff' }} />
          <button onClick={handleLogin} style={{ width: '100%', padding: 14, background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700 }}>כניסה</button>
          {error && <p style={{ color: '#f87171', textAlign: 'center', marginTop: 10 }}>{error}</p>}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}