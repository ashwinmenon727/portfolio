import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

function StatNumber({ value, suffix }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const isString = typeof value === 'string';
  const [display, setDisplay] = useState(isString ? value : (value === '∞' ? '∞' : 0));

  useEffect(() => {
    if (!inView || isString || value === '∞') {
      return undefined;
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      setDisplay(value);
      return undefined;
    }

    let frameId;
    const start = performance.now();
    const duration = 900;

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      setDisplay(Math.round(value * (1 - (1 - progress) ** 3)));

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [inView, value, isString]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

const TECHNICAL_DOMAINS = [
  {
    num: '01',
    title: 'FRONTEND',
    skills: 'React 19 / JavaScript / HTML5 / CSS3',
    desc: 'Interactive, responsive UI workflows and high-performance Web Apps.',
  },
  {
    num: '02',
    title: 'BACKEND',
    skills: 'Node.js / Express / ASP.NET / REST APIs',
    desc: 'Scalable backend API architectures, authentication, and logic.',
  },
  {
    num: '03',
    title: 'AI INTEGRATION',
    skills: 'AI APIs / LLM Workflows / NLP Apps',
    desc: 'Building modern AI assistants and intelligent agent workflows.',
  },
  {
    num: '04',
    title: 'DATABASE & DATA',
    skills: 'PostgreSQL / MongoDB / SQLite / EF Core',
    desc: 'Structured database schemas, ORM models, and efficient queries.',
  },
];

export function AboutSection({ developer }) {
  return (
    <section className="content-section about-section" id="about">
      <div className="section-heading">
        <p className="eyebrow">Technical Overview</p>
        <h2>About & Core Engineering</h2>
      </div>

      <div className="about-technical-grid">
        {/* Left Column — Intro & Profile */}
        <motion.div
          className="about-intro-col"
          initial={{ y: 28, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h3 className="about-statement-title">{developer.aboutStatement}</h3>
          <p className="about-description-text">{developer.about}</p>

          <div className="about-quick-specs">
            <div className="spec-item">
              <span className="spec-label">LOCATION</span>
              <span className="spec-value">India // Remote</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">FOCUS</span>
              <span className="spec-value">AI Applications & Full-Stack</span>
            </div>
          </div>
        </motion.div>

        {/* Right Column — 4 Technical Information Cards */}
        <div className="about-cards-col">
          {TECHNICAL_DOMAINS.map((domain, index) => (
            <motion.article
              className="about-tech-card"
              key={domain.num}
              initial={{ y: 24, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="card-top-row">
                <span className="card-num">{domain.num}</span>
                <span className="card-domain-title">{domain.title}</span>
              </div>
              <p className="card-skills-list">{domain.skills}</p>
              <p className="card-domain-desc">{domain.desc}</p>
            </motion.article>
          ))}
        </div>
      </div>

      {/* Stats Counter Grid */}
      <div className="stats-grid">
        {developer.stats.map((stat, index) => (
          <motion.article
            className="stat-card"
            key={stat.label}
            initial={{ y: 24, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
          >
            <StatNumber value={stat.value} suffix={stat.suffix} />
            <p>{stat.label}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
