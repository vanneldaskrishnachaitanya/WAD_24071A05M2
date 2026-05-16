import React, { useState } from 'react';
import './Contact.css';

const FAQS = [
  { q: 'How do I enroll in a subject?', a: 'Go to the Subjects page and click "Enroll" on any subject card.' },
  { q: 'Are mock tests timed?', a: 'Yes, each test has a set duration. The timer is visible during the test.' },
  { q: 'Can I retake a test?', a: 'Absolutely! You can attempt mock tests as many times as you like.' },
  { q: 'How is my score calculated?', a: 'Each correct answer scores 1 point. There is no negative marking.' },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: 'General', message: '' });
  const [sent, setSent] = useState(false);
  const [open, setOpen] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="contact-page">
      <div className="page-wrap">
        <div className="page-header animate-fadeUp">
          <div>
            <h2>Contact Us</h2>
            <p>Have questions? We're here to help.</p>
          </div>
        </div>

        <div className="contact-grid">
          {/* Left: info + FAQ */}
          <div className="contact-left animate-fadeUp">
            <div className="card info-card">
              <h3>Get in Touch</h3>
              <div className="info-items">
                <div className="info-item">
                  <span className="info-icon">📧</span>
                  <div>
                    <div className="info-label">Email</div>
                    <div className="info-value">support@eduexam.in</div>
                  </div>
                </div>
                <div className="info-item">
                  <span className="info-icon">📞</span>
                  <div>
                    <div className="info-label">Phone</div>
                    <div className="info-value">+91 98765 43210</div>
                  </div>
                </div>
                <div className="info-item">
                  <span className="info-icon">🕐</span>
                  <div>
                    <div className="info-label">Support Hours</div>
                    <div className="info-value">Mon–Sat, 9AM–6PM IST</div>
                  </div>
                </div>
                <div className="info-item">
                  <span className="info-icon">📍</span>
                  <div>
                    <div className="info-label">Address</div>
                    <div className="info-value">Hyderabad, Telangana, India</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card faq-card" style={{ marginTop: '1.25rem' }}>
              <h3>Frequently Asked Questions</h3>
              <div className="faq-list">
                {FAQS.map((f, i) => (
                  <div key={i} className="faq-item">
                    <button className="faq-q" onClick={() => setOpen(open === i ? null : i)}>
                      <span>{f.q}</span>
                      <span className="faq-arrow">{open === i ? '▲' : '▼'}</span>
                    </button>
                    {open === i && <div className="faq-a">{f.a}</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: form */}
          <div className="contact-right animate-fadeUp" style={{ animationDelay: '0.1s' }}>
            <div className="card contact-form-card">
              <h3>Send a Message</h3>
              {sent ? (
                <div className="sent-msg">
                  <div className="sent-icon">✅</div>
                  <h4>Message Sent!</h4>
                  <p>We'll get back to you within 24 hours.</p>
                  <button className="btn-primary" onClick={() => { setSent(false); setForm({ name: '', email: '', subject: 'General', message: '' }); }}>
                    Send Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="field-group">
                    <label>Full Name</label>
                    <input type="text" placeholder="Your name" value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })} required />
                  </div>
                  <div className="field-group">
                    <label>Email Address</label>
                    <input type="email" placeholder="you@example.com" value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })} required />
                  </div>
                  <div className="field-group">
                    <label>Subject</label>
                    <select value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}>
                      <option>General</option>
                      <option>Technical Issue</option>
                      <option>Payment</option>
                      <option>Feedback</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="field-group">
                    <label>Message</label>
                    <textarea rows="5" placeholder="Describe your issue or question..."
                      value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required />
                  </div>
                  <button type="submit" className="btn-primary" style={{ width: '100%' }}>Send Message →</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
