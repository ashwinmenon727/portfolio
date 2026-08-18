import { Code, Download, Github, Linkedin, Mail, Moon, SunMedium } from 'lucide-react';
import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1];

function validate(values) {
  const errors = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!values.name.trim()) {
    errors.name = 'Name is required.';
  }
  if (!emailRegex.test(values.email.trim())) {
    errors.email = 'Enter a valid email address.';
  }
  if (values.message.trim().length < 12) {
    errors.message = 'Message should be at least 12 characters.';
  }

  return errors;
}

function ContactForm({ email }) {
  const [values, setValues] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');

  const submitMessage = (payload) => {
    const subject = encodeURIComponent(`Portfolio message from ${payload.name}`);
    const body = encodeURIComponent(`${payload.message}\n\n— ${payload.name}\n${payload.email}`);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate(values);

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setStatus('sending');
    submitMessage(values);
    setValues({ name: '', email: '', message: '' });
    setStatus('sent');
  };

  return (
    <form className="minimal-contact-form" onSubmit={handleSubmit} noValidate>
      <div className="contact-field">
        <label htmlFor="contact-name">NAME</label>
        <input
          id="contact-name"
          type="text"
          name="name"
          autoComplete="name"
          value={values.name}
          onChange={(event) => setValues((current) => ({ ...current, name: event.target.value }))}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? 'contact-name-error' : undefined}
          placeholder="Your Name"
        />
        {errors.name && (
          <small id="contact-name-error" role="alert">
            {errors.name}
          </small>
        )}
      </div>

      <div className="contact-field">
        <label htmlFor="contact-email">EMAIL</label>
        <input
          id="contact-email"
          type="email"
          name="email"
          autoComplete="email"
          value={values.email}
          onChange={(event) => setValues((current) => ({ ...current, email: event.target.value }))}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'contact-email-error' : undefined}
          placeholder="you@example.com"
        />
        {errors.email && (
          <small id="contact-email-error" role="alert">
            {errors.email}
          </small>
        )}
      </div>

      <div className="contact-field">
        <label htmlFor="contact-message">MESSAGE</label>
        <textarea
          id="contact-message"
          name="message"
          rows="4"
          value={values.message}
          onChange={(event) => setValues((current) => ({ ...current, message: event.target.value }))}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? 'contact-message-error' : undefined}
          placeholder="Tell me about your project or opportunity..."
        />
        {errors.message && (
          <small id="contact-message-error" role="alert">
            {errors.message}
          </small>
        )}
      </div>

      <div className="contact-form-actions">
        <button type="submit" className="btn-primary-cta">
          SEND MESSAGE →
        </button>
        {status === 'sent' && (
          <p className="form-success" role="status">
            Message draft created in your mail client!
          </p>
        )}
      </div>
    </form>
  );
}

export function ContactSection({ developer, theme, onToggleTheme }) {
  const reduce = useReducedMotion();
  const startHidden = { y: 24, opacity: 0 };
  const reveal = { y: 0, opacity: 1 };
  const viewport = { once: true, amount: 0.25 };

  return (
    <section className="contact-section minimal-cta-section" id="contact">
      <div className="contact-layout">
        <motion.div
          className="contact-intro-col"
          initial={reduce ? false : startHidden}
          whileInView={reveal}
          viewport={viewport}
          transition={{ duration: 0.55, ease: EASE }}
        >
          <span className="section-eyebrow">GET IN TOUCH</span>
          <h2 className="cta-main-title">LET&apos;S BUILD SOMETHING GREAT.</h2>
          <p className="cta-description-text">
            I&apos;m currently open to software engineering, full-stack, and AI application developer roles.
            Whether you have a project to build or an internship opportunity, feel free to reach out.
          </p>

          <div className="contact-direct-links">
            <a className="direct-link-item" href={`mailto:${developer.contact.email}`}>
              <Mail size={18} /> {developer.contact.email}
            </a>
          </div>

          <div className="contact-social-buttons">
            <a href={developer.contact.github} target="_blank" rel="noreferrer" className="social-pill-btn">
              <Github size={15} /> GitHub
            </a>
            <a href={developer.contact.linkedin} target="_blank" rel="noreferrer" className="social-pill-btn">
              <Linkedin size={15} /> LinkedIn
            </a>
            <a href={developer.contact.leetcode} target="_blank" rel="noreferrer" className="social-pill-btn">
              <Code size={15} /> LeetCode
            </a>
          </div>
        </motion.div>

        <motion.div
          className="contact-card-box"
          initial={reduce ? false : startHidden}
          whileInView={reveal}
          viewport={viewport}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
        >
          <div className="contact-card-top">
            <span className="card-top-title">Direct Contact</span>
            <button
              type="button"
              className="minimal-theme-toggle"
              aria-label="Toggle theme"
              onClick={onToggleTheme}
            >
              {theme === 'dark' ? <SunMedium size={16} /> : <Moon size={16} />}
              <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </button>
          </div>

          <ContactForm email={developer.contact.email} />

          <a
            className="download-resume-banner"
            href={developer.contact.resume}
            download="Ashwin_Menon_Resume.pdf"
          >
            <Download size={16} /> Download Full Resume (PDF)
          </a>
        </motion.div>
      </div>

      <footer className="minimal-site-footer">
        <div className="footer-left">
          <span className="footer-logo">ASHWIN</span>
          <span className="footer-tagline">AI Vibe Coder • Software Developer</span>
        </div>
        <p className="footer-copy">© 2026 Ashwin Menon. All rights reserved.</p>
      </footer>
    </section>
  );
}
