import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export function ExperienceSection({ items }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 75%', 'end 50%'],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="content-section experience-section" id="experience" ref={ref}>
      <div className="section-heading">
        <p className="eyebrow">Timeline & Track Record</p>
        <h2>Work Experience</h2>
      </div>

      <div className="experience-timeline">
        <div className="timeline-rail" aria-hidden="true">
          <motion.span style={{ scaleY: lineScale }} />
        </div>

        {items.map((item, index) => (
          <motion.article
            className="experience-card"
            key={`${item.year}-${item.role}`}
            initial={{ y: 32, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="timeline-dot" />

            <div className="timeline-header">
              <span className="experience-year">{item.year}</span>
              <h3 className="experience-role">{item.role}</h3>
              <span className="experience-company">{item.company}</span>
            </div>

            <p className="experience-description">{item.description}</p>

            <ul className="experience-tech-tags">
              {item.technologies.map((technology) => (
                <li key={technology}>{technology}</li>
              ))}
            </ul>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
