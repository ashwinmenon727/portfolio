import { Code, Cpu, Database, Layout, Wrench } from 'lucide-react';
import { motion } from 'framer-motion';

const CATEGORY_ICONS = {
  Languages: Code,
  Frontend: Layout,
  Backend: Cpu,
  Databases: Database,
  'AI / Development': Cpu,
  Tools: Wrench,
  'Core Concepts': Code,
};

export function TechStackSection({ technologies }) {
  return (
    <section className="content-section tech-stack-section" id="skills">
      <div className="section-heading">
        <p className="eyebrow">Skills & Capabilities</p>
        <h2>Technical Stack</h2>
      </div>

      <div className="tech-categories-grid" aria-label="Technology categories">
        {technologies.map((category, catIndex) => {
          const Icon = CATEGORY_ICONS[category.category] || Code;
          return (
            <motion.div
              key={category.category}
              className="tech-category-card"
              initial={{ y: 24, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.55, delay: catIndex * 0.07, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="category-header">
                <div className="category-icon-box">
                  <Icon size={18} />
                </div>
                <h3 className="category-title">{category.category}</h3>
              </div>

              <div className="tech-badges-list">
                {category.items.map((tech) => (
                  <span key={tech} className="tech-badge-item">
                    <span className="badge-dot" /> {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
