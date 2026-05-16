import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    const ok = register(form);
    setLoading(false);

    if (ok) navigate('/dashboard');
    else setError('Please fill all fields and use a new email with 4+ character password.');
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-brand">
          <span className="brand-icon-lg">✍️</span>
          <h1>Create <strong>Account</strong></h1>
          <p>Register once and start tracking your mock test progress.</p>
        </div>
        <div className="login-features">
          {[
            ['✅', 'Quick signup'],
            ['📈', 'Save test scores'],
            ['🎯', 'Subject-wise practice'],
            ['🔐', 'Simple account setup'],
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
          <h2>Sign Up</h2>
          <p className="login-sub">Create your account to continue.</p>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="field-group">
              <label>Name</label>
              <input
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="field-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="field-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <div className="field-group">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                required
              />
            </div>

            {error && <div className="login-error">{error}</div>}

            <button type="submit" className="btn-primary login-btn" disabled={loading}>
              {loading ? <span className="spinner" /> : 'Create Account →'}
            </button>

            <div className="login-hint">
              Already have an account? <Link to="/login">Sign in</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}