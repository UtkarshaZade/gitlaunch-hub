import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import './App.css';

function AdminGate() {
  const [password, setPassword] = useState('');
  const [authed, setAuthed]     = useState(false);
  const [error, setError]       = useState(false);

  if (authed) return <Dashboard />;

  return (
    <div style={{
      minHeight: '100vh', background: '#020817',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        background: '#0f172a', border: '1px solid #1e3a5f',
        borderRadius: 16, padding: '2.5rem', width: 340,
        display: 'flex', flexDirection: 'column', gap: 16
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9', fontFamily: 'Geist, sans-serif' }}>
            GitLaunch HUB
          </div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
            ADMIN ACCESS REQUIRED
          </div>
        </div>
        <input
          type="password"
          placeholder="Enter admin password"
          value={password}
          onChange={e => { setPassword(e.target.value); setError(false); }}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              if (password === 'gitlaunch2026') setAuthed(true);
              else setError(true);
            }
          }}
          style={{
            background: '#1e293b', border: `1px solid ${error ? '#ef4444' : '#334155'}`,
            borderRadius: 8, padding: '10px 14px', color: '#f1f5f9',
            fontSize: 14, outline: 'none', fontFamily: 'Geist, sans-serif'
          }}
        />
        {error && (
          <div style={{ color: '#ef4444', fontSize: 12, textAlign: 'center' }}>
            Incorrect password
          </div>
        )}
        <button
          onClick={() => {
            if (password === 'gitlaunch2026') setAuthed(true);
            else setError(true);
          }}
          style={{
            background: '#38bdf8', color: '#0f172a', border: 'none',
            borderRadius: 8, padding: '10px', fontWeight: 700,
            fontSize: 14, cursor: 'pointer', fontFamily: 'Geist, sans-serif'
          }}
        >
          LOGIN
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/"      element={<Home />}      />
        <Route path="/admin" element={<AdminGate />} />
      </Routes>
    </Router>
  );
}

export default App;