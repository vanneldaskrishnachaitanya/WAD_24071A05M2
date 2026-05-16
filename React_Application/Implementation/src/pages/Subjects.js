import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SUBJECTS } from '../data';
import './Subjects.css';

export default function Subjects() {
  const { user } = useAuth();
  const [enrolled, setEnrolled] = useState(new Set(user?.enrolled || []));

  const toggleEnroll = (name) => {
    setEnrolled(prev => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  const levelColor = { Beginner: 'badge-green', Intermediate: 'badge-blue', Advanced: 'badge-orange' };

  return (
    <div className="subjects-page">
      <div className="page-wrap">
        <div className="page-header animate-fadeUp">
          <div>
            <h2>Subjects</h2>
            <p>Choose subjects to enroll and start practicing with mock tests.</p>
          </div>
          <div className="enroll-count">
            <strong>{enrolled.size}</strong> enrolled
          </div>
        </div>

        <div className="subjects-grid">
          {SUBJECTS.map((sub, i) => {
            const isEnrolled = enrolled.has(sub.name);
            return (
              <div
                key={sub.id}
                className="subject-card card animate-fadeUp"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <div className="subject-top" style={{ background: sub.color }}>
                  <span className="subject-icon">{sub.icon}</span>
                  <span className={`badge ${levelColor[sub.level]}`}>{sub.level}</span>
                </div>
                <div className="subject-body">
                  <h3>{sub.name}</h3>
                  <p className="subject-desc">{sub.description}</p>
                  <div className="subject-meta">
                    <span>📝 {sub.tests} Tests</span>
                    <span>⏱ {sub.duration}</span>
                  </div>
                  <div className="topic-tags">
                    {sub.topics.slice(0, 3).map(t => (
                      <span key={t} className="topic-tag">{t}</span>
                    ))}
                    {sub.topics.length > 3 && (
                      <span className="topic-tag muted">+{sub.topics.length - 3}</span>
                    )}
                  </div>
                  <div className="subject-actions">
                    <button
                      className={isEnrolled ? 'btn-outline enrolled' : 'btn-primary'}
                      onClick={() => toggleEnroll(sub.name)}
                    >
                      {isEnrolled ? '✓ Enrolled' : 'Enroll'}
                    </button>
                    {isEnrolled && (
                      <Link to="/mock-tests" className="btn-accent" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', borderRadius: '8px', display: 'inline-block', color: '#fff' }}>
                        Practice
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
