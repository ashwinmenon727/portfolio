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
      <div className="section-header-row">
        <div>
          <span className="section-eyebrow">SKILLS</span>
          <h2 className="section-main-title">Technologies & Tools</h2>
        </div>
      </div>

      <div className="minimal-skills-grid">
        {technologies.map((category, catIndex) => {
          const Icon = CATEGORY_ICONS[category.category] || Code;
          return (
            <motion.div
              key={category.category}
              className="minimal-skill-group-card"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.45, delay: catIndex * 0.06, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="skill-group-header">
                <div className="icon-badge">
                  <Icon size={16} />
                </div>
                <h3 className="group-title">{category.category}</h3>
              </div>

              <div className="skill-chips-flex">
                {category.items.map((item) => (
                  <div className="minimal-skill-item" key={item}>
                    <span className="skill-dot" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
