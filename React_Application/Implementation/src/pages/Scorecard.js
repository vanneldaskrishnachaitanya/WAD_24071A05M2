import React, { useState } from 'react';
import { SCORE_HISTORY } from '../data';
import { useAuth } from '../context/AuthContext';
import './Scorecard.css';

function ScoreBar({ score }) {
  const color = score >= 80 ? '#2ea87e' : score >= 60 ? '#d97706' : '#e85d26';
  return (
    <div className="score-bar-wrap">
      <div className="score-bar-bg">
        <div className="score-bar-fill" style={{ width: `${score}%`, background: color }} />
      </div>
      <span className="score-bar-label" style={{ color }}>{score}%</span>
    </div>
  );
}

export default function Scorecard() {
  const { user } = useAuth();
  const [sort, setSort] = useState('date');
  const scores = user?.testScores?.length > 0 ? user.testScores : SCORE_HISTORY;

  const sorted = [...scores].sort((a, b) => {
    if (sort === 'date') return new Date(b.date) - new Date(a.date);
    if (sort === 'score') return b.score - a.score;
    if (sort === 'rank') return a.rank - b.rank;
    return 0;
  });

  const avg = scores.length > 0 ? Math.round(scores.reduce((s, r) => s + r.score, 0) / scores.length) : 0;
  const best = scores.length > 0 ? Math.max(...scores.map(r => r.score)) : 0;
  const bestRank = scores.length > 0 ? Math.min(...scores.map(r => r.rank)) : 0;

  return (
    <div className="scorecard-page">
      <div className="page-wrap">
        <div className="page-header animate-fadeUp">
          <div>
            <h2>Scorecard</h2>
            <p>Your complete performance history across all tests.</p>
          </div>
        </div>

        <div className="score-summary animate-fadeUp">
          <div className="summary-item">
            <div className="summary-val">{avg}%</div>
            <div className="summary-key">Average Score</div>
          </div>
          <div className="summary-divider" />
          <div className="summary-item">
            <div className="summary-val">{best}%</div>
            <div className="summary-key">Best Score</div>
          </div>
          <div className="summary-divider" />
          <div className="summary-item">
            <div className="summary-val">#{bestRank}</div>
            <div className="summary-key">Best Rank</div>
          </div>
          <div className="summary-divider" />
          <div className="summary-item">
            <div className="summary-val">{scores.length}</div>
            <div className="summary-key">Tests Taken</div>
          </div>
        </div>

        {/* Chart */}
        <div className="card score-chart-card animate-fadeUp" style={{ animationDelay: '0.1s' }}>
          <h3>Score Trend</h3>
          <div className="chart-bars">
            {scores.map((s, i) => (
              <div key={s.id} className="chart-col">
                <div className="chart-bar-wrap">
                  <div
                    className="chart-bar"
                    style={{
                      height: `${s.score}%`,
                      background: s.score >= 80 ? '#2ea87e' : s.score >= 60 ? '#d97706' : '#e85d26'
                    }}
                    title={`${s.score}%`}
                  />
                </div>
                <div className="chart-label">{s.subject.slice(0, 4)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="card table-card animate-fadeUp" style={{ animationDelay: '0.15s' }}>
          <div className="table-header">
            <h3>Attempt History</h3>
            <div className="sort-group">
              <span>Sort by:</span>
              {['date', 'score', 'rank'].map(s => (
                <button
                  key={s}
                  className={`sort-btn ${sort === s ? 'active' : ''}`}
                  onClick={() => setSort(s)}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="attempts-table">
            <div className="table-head-row">
              <span>Test</span>
              <span>Subject</span>
              <span>Date</span>
              <span>Score</span>
              <span>Rank</span>
              <span>Time</span>
            </div>
            {sorted.map(s => (
              <div key={s.id} className="table-row">
                <span className="row-test">{s.test}</span>
                <span className="row-sub">{s.subject}</span>
                <span className="row-date">{s.date}</span>
                <div><ScoreBar score={s.score} /></div>
                <span className="row-rank">#{s.rank}</span>
                <span className="row-time">{s.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
