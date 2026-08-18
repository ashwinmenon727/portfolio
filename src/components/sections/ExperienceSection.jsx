import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export function ExperienceSection({ items }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 70%', 'end 45%'],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="content-section experience-section" id="experience" ref={ref}>
      <div className="section-heading">
        <p className="eyebrow">Timeline</p>
        <h2>Experience</h2>
      </div>

      <div className="experience-timeline">
        <div className="timeline-rail" aria-hidden="true">
          <motion.span style={{ scaleY: lineScale }} />
        </div>

        {items.map((item, index) => (
          <motion.article
            className="experience-card"
            key={`${item.year}-${item.role}`}
            initial={{ y: 34, opacity: 0, rotateX: 4 }}
            whileInView={{ y: 0, opacity: 1, rotateX: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.58, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="timeline-dot" />
            <p className="experience-year">{item.year}</p>
            <div>
              <h3>{item.role}</h3>
              <p className="experience-company">{item.company}</p>
              <p className="experience-description">{item.description}</p>
              <ul>
                {item.technologies.map((technology) => (
                  <li key={technology}>{technology}</li>
                ))}
              </ul>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
