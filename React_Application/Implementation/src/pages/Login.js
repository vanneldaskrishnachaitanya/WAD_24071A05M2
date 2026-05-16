import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    const ok = login(form.email, form.password);
    setLoading(false);
    if (ok) navigate('/dashboard');
    else setError('Invalid credentials. Use any email & password (min 4 chars).');
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-brand">
          <span className="brand-icon-lg">📖</span>
          <h1>Edu<strong>Exam</strong></h1>
          <p>Your gateway to smarter learning and exam success.</p>
        </div>
        <div className="login-features">
          {[
            ['📚', 'Access 6+ subjects'],
            ['📝', '40+ Mock Tests'],
            ['📊', 'Detailed Scorecards'],
            ['🏆', 'Rank among peers'],
          ].map(([icon, text]) => (
            <div key={text} className="feature-item">
              <span>{icon}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="login-right">
        <div className="login-card card animate-fadeUp">
          <h2>Sign In</h2>
          <p className="login-sub">Welcome back! Enter your credentials to continue.</p>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="field-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="field-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            {error && <div className="login-error">{error}</div>}

            <button type="submit" className="btn-primary login-btn" disabled={loading}>
              {loading ? <span className="spinner" /> : 'Sign In →'}
            </button>

            <div className="login-hint">
              <strong>Demo:</strong> Any email + password (4+ chars)
            </div>

            <div className="login-hint">
              New here? <Link to="/register">Create an account</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
