import React, { useState, useEffect, useRef } from 'react';
import { MOCK_TESTS, SAMPLE_QUESTIONS } from '../data';
import { useAuth } from '../context/AuthContext';
import './MockTests.css';

const DIFF_COLOR = { Easy: 'badge-green', Medium: 'badge-blue', Hard: 'badge-orange' };

function ExamModal({ test, onClose }) {
  const { saveScore } = useAuth();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(test.duration * 60);
  const timerRef = useRef();

  useEffect(() => {
    if (submitted) {
      const timeSpent = `${Math.floor((test.duration * 60 - timeLeft) / 60)} min`;
      saveScore(test, pct, timeSpent);
    }
  }, [submitted]);

  useEffect(() => {
    if (submitted) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setSubmitted(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [submitted]);

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const qs = SAMPLE_QUESTIONS[test.subjectId] || SAMPLE_QUESTIONS.math;
  const score = qs.filter((q, i) => answers[i] === q.answer).length;
  const pct = Math.round((score / qs.length) * 100);

  const handleSubmit = () => {
    clearInterval(timerRef.current);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="modal-overlay animate-fadeIn">
        <div className="modal-box card">
          <div className={`result-circle ${pct >= 70 ? 'pass' : 'fail'}`}>
            <div className="result-pct">{pct}%</div>
            <div className="result-label">{pct >= 70 ? 'Passed' : 'Failed'}</div>
          </div>
          <h3>Test Complete!</h3>
          <p>{test.title}</p>
          <div className="result-stats">
            <div><strong>{score}</strong><span>Correct</span></div>
            <div><strong>{qs.length - score}</strong><span>Wrong</span></div>
            <div><strong>{qs.length}</strong><span>Total</span></div>
          </div>
          <div className="result-review">
            {qs.map((q, i) => (
              <div key={i} className={`review-row ${answers[i] === q.answer ? 'correct' : 'wrong'}`}>
                <span>{answers[i] === q.answer ? '✓' : '✗'}</span>
                <span>{q.q}</span>
                <span className="review-ans">Correct: {q.options[q.answer]}</span>
              </div>
            ))}
          </div>
          <button className="btn-primary" onClick={onClose} style={{ marginTop: '1rem' }}>Close</button>
        </div>
      </div>
    );
  }

  const q = qs[current];

  return (
    <div className="modal-overlay animate-fadeIn">
      <div className="modal-box card">
        <div className="exam-header">
          <div>
            <div className="exam-title">{test.title}</div>
            <div className="exam-progress">Q {current + 1} of {qs.length}</div>
          </div>
          <div className={`exam-timer ${timeLeft < 60 ? 'urgent' : ''}`}>{fmt(timeLeft)}</div>
        </div>

        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${((current) / qs.length) * 100}%` }} />
        </div>

        <div className="exam-question">{q.q}</div>

        <div className="options-list">
          {q.options.map((opt, i) => (
            <button
              key={i}
              className={`option-btn ${answers[current] === i ? 'selected' : ''}`}
              onClick={() => setAnswers({ ...answers, [current]: i })}
            >
              <span className="opt-letter">{['A', 'B', 'C', 'D'][i]}</span>
              <span>{opt}</span>
            </button>
          ))}
        </div>

        <div className="exam-nav">
          <button className="btn-outline" onClick={() => setCurrent(c => c - 1)} disabled={current === 0}>← Prev</button>
          <div className="dot-nav">
            {qs.map((_, i) => (
              <button
                key={i}
                className={`dot ${i === current ? 'active' : ''} ${answers[i] !== undefined ? 'answered' : ''}`}
                onClick={() => setCurrent(i)}
              />
            ))}
          </div>
          {current < qs.length - 1
            ? <button className="btn-primary" onClick={() => setCurrent(c => c + 1)}>Next →</button>
            : <button className="btn-accent" onClick={handleSubmit}>Submit</button>
          }
        </div>
      </div>
    </div>
  );
}

export default function MockTests() {
  const [filter, setFilter] = useState('All');
  const [activeTest, setActiveTest] = useState(null);
  const subjects = ['All', ...new Set(MOCK_TESTS.map(t => t.subject))];
  const filtered = filter === 'All' ? MOCK_TESTS : MOCK_TESTS.filter(t => t.subject === filter);

  return (
    <div className="tests-page">
      <div className="page-wrap">
        <div className="page-header animate-fadeUp">
          <div>
            <h2>Mock Tests</h2>
            <p>Practice with timed tests and instant feedback.</p>
          </div>
        </div>

        <div className="filter-tabs animate-fadeUp">
          {subjects.map(s => (
            <button key={s} className={`filter-tab ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>
              {s}
            </button>
          ))}
        </div>

        <div className="tests-grid">
          {filtered.map((t, i) => (
            <div key={t.id} className="test-card card animate-fadeUp" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="test-card-top">
                <span className="test-subject-badge">{t.subject}</span>
                <span className={`badge ${DIFF_COLOR[t.difficulty]}`}>{t.difficulty}</span>
              </div>
              <h3 className="test-card-title">{t.title}</h3>
              <div className="test-card-meta">
                <span>📝 {t.questions} Questions</span>
                <span>⏱ {t.duration} min</span>
                <span>👥 {t.attempts.toLocaleString()} attempts</span>
              </div>
              <button className="btn-primary" style={{ width: '100%' }} onClick={() => setActiveTest(t)}>
                Start Test
              </button>
            </div>
          ))}
        </div>
      </div>

      {activeTest && <ExamModal test={activeTest} onClose={() => setActiveTest(null)} />}
    </div>
  );
}
