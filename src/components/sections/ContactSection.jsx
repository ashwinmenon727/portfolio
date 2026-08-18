import { Code, Download, Github, Linkedin, Mail, Moon, SunMedium } from 'lucide-react';
import { Suspense, lazy, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const ContactCore = lazy(() =>
  import('../scene/ContactCore.jsx').then((module) => ({ default: module.ContactCore })),
);

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

  // Frontend-ready submission handler. No backend exists yet: this opens a
  // pre-filled mailto draft. Swap the body below for a fetch() to your
  // email service when one is connected.
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
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="contact-field">
        <label htmlFor="contact-name">Name</label>
        <input
          id="contact-name"
          type="text"
          name="name"
          autoComplete="name"
          value={values.name}
          onChange={(event) => setValues((current) => ({ ...current, name: event.target.value }))}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? 'contact-name-error' : undefined}
          placeholder="Your name"
        />
        {errors.name && (
          <small id="contact-name-error" role="alert">
            {errors.name}
          </small>
        )}
      </div>

      <div className="contact-field">
        <label htmlFor="contact-email">Email</label>
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
        <label htmlFor="contact-message">Message</label>
        <textarea
          id="contact-message"
          name="message"
          rows="4"
          value={values.message}
          onChange={(event) => setValues((current) => ({ ...current, message: event.target.value }))}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? 'contact-message-error' : undefined}
          placeholder="Tell me about your project or opportunity"
        />
        {errors.message && (
          <small id="contact-message-error" role="alert">
            {errors.message}
          </small>
        )}
      </div>

      <div className="contact-form-actions">
        <button type="submit" className="cta-magnetic">
          SEND MESSAGE <span aria-hidden="true">→</span>
        </button>
        <p className="form-success" aria-live="polite">
          {status === 'sent' ? 'Thanks! Your message draft is ready.' : ''}
        </p>
      </div>
    </form>
  );
}

export function ContactSection({ developer, theme, onToggleTheme }) {
  const reduce = useReducedMotion();
  const startHidden = (y = 40) => (reduce ? false : { y, opacity: 0 });
  const reveal = { y: 0, opacity: 1 };
  const viewport = { once: true, amount: 0.25 };

  return (
    <section className="contact-section" id="contact">
      <Suspense fallback={null}>
        <ContactCore />
      </Suspense>

      <div className="contact-layout">
        <motion.div
          className="contact-intro"
          initial={startHidden(54)}
          whileInView={reveal}
          viewport={viewport}
          transition={{ duration: 0.75, ease: EASE }}
        >
          <p className="eyebrow">Let&apos;s build something</p>
          <h2 className="contact-heading">AMAZING TOGETHER.</h2>
          <p className="contact-description">
            I&apos;m currently looking for software development, full-stack, and AI engineering
            internship opportunities. If you have an interesting idea, project, or opportunity,
            I&apos;d love to connect.
          </p>
          <p className="contact-availability">
            <span className="status-dot" aria-hidden="true" />
            {developer.contact.availability}
          </p>
        </motion.div>

        <motion.div
          className="contact-card"
          initial={reduce ? false : { y: 70, opacity: 0, rotateX: 10, rotateY: -6 }}
          whileInView={{ y: 0, opacity: 1, rotateX: 0, rotateY: 0 }}
          viewport={viewport}
          transition={{ duration: 0.85, delay: 0.12, ease: EASE }}
        >
          <div className="contact-card-head">
            <p className="eyebrow">Get in touch</p>
            <button
              type="button"
              className="theme-toggle"
              aria-label="Toggle dark and light mode"
              onClick={onToggleTheme}
            >
              {theme === 'dark' ? <SunMedium size={18} /> : <Moon size={18} />}
              <span>{theme === 'dark' ? 'Light' : 'Dark'} mode</span>
            </button>
          </div>

          <a className="contact-email-link" href={`mailto:${developer.contact.email}`}>
            <Mail size={16} aria-hidden="true" />
            {developer.contact.email}
          </a>

          <div className="contact-actions" aria-label="Contact links">
            <a
              className="contact-button contact-button-primary"
              href={`mailto:${developer.contact.email}`}
            >
              <Mail size={16} aria-hidden="true" />
              Email Me
            </a>
            <a
              className="contact-button contact-button-social"
              href={developer.contact.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github size={16} aria-hidden="true" />
              GitHub
            </a>
            <a
              className="contact-button contact-button-social"
              href={developer.contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin size={16} aria-hidden="true" />
              LinkedIn
            </a>
            <a
              className="contact-button contact-button-social"
              href={developer.contact.leetcode}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Code size={16} aria-hidden="true" />
              LeetCode
            </a>
          </div>

          <a
            className="contact-button contact-button-resume"
            href={developer.contact.resume}
            download="Ashwin_Menon_Resume.pdf"
          >
            <Download size={16} aria-hidden="true" />
            Download Resume
          </a>

          <ContactForm email={developer.contact.email} />
        </motion.div>
      </div>

      <motion.footer
        className="site-footer contact-footer"
        initial={startHidden(24)}
        whileInView={reveal}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <div>
          <span>ASHWIN</span>
          <span>AI Vibe Coder • Software Developer</span>
        </div>
        <div className="contact-footer-socials" aria-label="Developer profiles">
          <a href={developer.contact.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <Github size={16} />
          </a>
          <a href={developer.contact.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <Linkedin size={16} />
          </a>
          <a href={developer.contact.leetcode} target="_blank" rel="noopener noreferrer" aria-label="LeetCode">
            <Code size={16} />
          </a>
          <a href={`mailto:${developer.contact.email}`} aria-label="Email">
            <Mail size={16} />
          </a>
        </div>
        <p>© 2026 Ashwin Menon. Built with code + AI.</p>
      </motion.footer>
    </section>
  );
}
