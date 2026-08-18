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

export function AboutSection({ developer }) {
  return (
    <section className="content-section about-section" id="about">
      <motion.div
        className="about-grid"
        initial={{ y: 36, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        <div>
          <p className="eyebrow">Profile</p>
          <h2 className="about-statement">{developer.aboutStatement}</h2>
        </div>
        <p className="about-description">{developer.about}</p>
      </motion.div>

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
