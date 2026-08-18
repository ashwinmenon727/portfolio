import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLayoutEffect, useRef } from 'react';
import { SectionShell } from '../layout/SectionShell.jsx';

export function TechStackSection({ technologies }) {
  const shellRef = useRef(null);

  useLayoutEffect(() => {
    if (!shellRef.current) {
      return undefined;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        shellRef.current,
        { opacity: 0.45, y: 32, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: shellRef.current,
            start: 'top 78%',
            once: true,
          },
        },
      );
    }, shellRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [technologies]);

  return (
    <SectionShell id="skills" eyebrow="Skills" title="Tech Stack">
      <div ref={shellRef} className="tech-stack-shell">
        <div className="tech-categories" aria-label="Technology categories and tools">
          {technologies.map((category, catIndex) => (
            <motion.div
              key={category.category}
              className="tech-category"
              initial={{ y: 24, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.6, delay: catIndex * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <h3 className="category-title">{category.category}</h3>
              <div className="tech-badges">
                {category.items.map((tech, techIndex) => (
                  <motion.span
                    key={tech}
                    className="tech-badge"
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{
                      duration: 0.45,
                      delay: catIndex * 0.08 + techIndex * 0.04,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
