import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

function StatNumber({ value, suffix }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
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
    const duration = 800;

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

export function AboutSection({ developer }) {
  return (
    <section className="content-section about-section" id="about">
      <div className="about-editorial-grid">
        {/* Left Column — About Me Intro */}
        <motion.div
          className="about-left-col"
          initial={{ y: 24, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="section-eyebrow">ABOUT ME</span>
          <h2 className="about-heading">{developer.aboutStatement}</h2>
          <p className="about-body-text">{developer.about}</p>
        </motion.div>

        {/* Right Column — 3 Compact Statistic Cards */}
        <div className="about-stats-cards">
          {developer.stats.slice(0, 3).map((stat, index) => (
            <motion.article
              className="minimal-stat-card"
              key={stat.label}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="stat-value-text">
                <StatNumber value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="stat-label-text">{stat.label}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
