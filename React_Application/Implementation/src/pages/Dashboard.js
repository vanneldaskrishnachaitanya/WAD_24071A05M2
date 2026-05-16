import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SCORE_HISTORY, MOCK_TESTS } from '../data';
import './Dashboard.css';

function StatCard({ label, value, sub, color }) {
  return (
    <div className="stat-card card" style={{ borderTop: `3px solid ${color}` }}>
      <div className="stat-value" style={{ color }}>{value}</div>
      <div className="stat-label">{label}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const avgScore = Math.round(SCORE_HISTORY.reduce((a, s) => a + s.score, 0) / SCORE_HISTORY.length);
  const recent = SCORE_HISTORY.slice(-3).reverse();

  return (
    <div className="dashboard-page">
      <div className="page-wrap">
        {/* Hero */}
        <div className="dash-hero animate-fadeUp">
          <div>
            <p className="greeting">Good day,</p>
            <h1>{user?.email?.split('@')[0]} 👋</h1>
            <p className="dash-sub">Track your progress, take tests and climb the rankings.</p>
          </div>
          <Link to="/mock-tests" className="btn-accent hero-cta">Start a Test →</Link>
        </div>

        {/* Stats */}
        <div className="stats-grid animate-fadeUp" style={{ animationDelay: '0.1s' }}>
          <StatCard label="Tests Taken" value={SCORE_HISTORY.length} sub="This month" color="var(--primary)" />
          <StatCard label="Average Score" value={`${avgScore}%`} sub="Across all subjects" color="var(--accent2)" />
          <StatCard label="Best Score" value="91%" sub="Computer Science" color="#7c3aed" />
          <StatCard label="Enrolled Subjects" value={user?.enrolled?.length} sub="Active courses" color="var(--accent)" />
        </div>

        {/* Two columns */}
        <div className="dash-columns">
          {/* Recent scores */}
          <div className="card dash-card animate-fadeUp" style={{ animationDelay: '0.2s' }}>
            <div className="card-header">
              <h3>Recent Attempts</h3>
              <Link to="/scorecard" className="link-sm">View all →</Link>
            </div>
            <div className="score-list">
              {recent.map(s => (
                <div key={s.id} className="score-row">
                  <div>
                    <div className="score-test">{s.test}</div>
                    <div className="score-subject">{s.subject} • {s.date}</div>
                  </div>
                  <div className={`score-pct ${s.score >= 80 ? 'good' : s.score >= 60 ? 'mid' : 'low'}`}>
                    {s.score}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming tests */}
          <div className="card dash-card animate-fadeUp" style={{ animationDelay: '0.3s' }}>
            <div className="card-header">
              <h3>Popular Tests</h3>
              <Link to="/mock-tests" className="link-sm">Browse →</Link>
            </div>
            <div className="test-list">
              {MOCK_TESTS.slice(0, 4).map(t => (
                <div key={t.id} className="test-row">
                  <div>
                    <div className="test-title">{t.title}</div>
                    <div className="test-meta">{t.questions} Qs • {t.duration} min • {t.subject}</div>
                  </div>
                  <Link to="/mock-tests" className="btn-outline" style={{ fontSize: '0.78rem', padding: '0.3rem 0.7rem' }}>
                    Start
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
