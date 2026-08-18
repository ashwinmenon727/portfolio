import { motion } from 'framer-motion';

export function ExperienceSection({ items }) {
  return (
    <section className="content-section experience-section" id="experience">
      <div className="section-header-row">
        <div>
          <span className="section-eyebrow">EXPERIENCE</span>
          <h2 className="section-main-title">Work & Internships</h2>
        </div>
      </div>

      <div className="minimal-timeline-container">
        <div className="minimal-timeline-line" aria-hidden="true" />

        {items.map((item, index) => (
          <motion.article
            className="minimal-timeline-item"
            key={`${item.year}-${item.role}`}
            initial={{ y: 24, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="timeline-node" />

            <div className="timeline-meta-row">
              <span className="timeline-year">{item.year}</span>
              <span className="timeline-company">• {item.company}</span>
            </div>

            <h3 className="timeline-role">{item.role}</h3>
            <p className="timeline-desc">{item.description}</p>

            <div className="timeline-tech-chips">
              {item.technologies.map((tech) => (
                <span key={tech} className="minimal-tech-chip">
                  {tech}
                </span>
              ))}
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
