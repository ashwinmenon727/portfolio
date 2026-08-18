import { ExternalLink, Github, Sparkles, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

function ProjectCard({ project, index, isFeatured, onSelect }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const onPointerMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -6, y: x * 8 });
  };

  return (
    <motion.article
      layout
      className={`project-asymmetric-card ${isFeatured ? 'featured-card' : ''}`}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      style={{
        rotateX: tilt.x,
        rotateY: tilt.y,
        transformStyle: 'preserve-3d',
      }}
      onPointerMove={onPointerMove}
      onPointerLeave={() => setTilt({ x: 0, y: 0 })}
      onClick={() => onSelect(project)}
      tabIndex={0}
      role="button"
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          onSelect(project);
        }
      }}
    >
      <div className="card-gradient-glow" />

      {isFeatured && (
        <div className="featured-badge">
          <Sparkles size={12} /> FEATURED BUILD
        </div>
      )}

      <div className="project-card-header">
        <span className="project-category-tag">{project.category} // {project.year}</span>
        <h3 className="project-title">{project.title}</h3>
      </div>

      <p className="project-summary">{project.description}</p>

      <ul className="project-stack-tags">
        {project.stack.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <div className="project-card-links" onClick={(e) => e.stopPropagation()}>
        <a href={project.github} target="_blank" rel="noreferrer" className="card-link">
          <Github size={15} /> Code
        </a>
        <a href={project.demo} target="_blank" rel="noreferrer" className="card-link primary">
          <ExternalLink size={15} /> Demo
        </a>
      </div>
    </motion.article>
  );
}

function ProjectModal({ project, onClose }) {
  return (
    <motion.div
      className="project-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.article
        className="project-modal"
        initial={{ y: 36, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 24, opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="modal-close" aria-label="Close project" onClick={onClose}>
          <X size={18} />
        </button>

        <p className="eyebrow">{project.category} / {project.year}</p>
        <h3>{project.title}</h3>
        <p>{project.description}</p>

        <ul className="project-stack-tags">
          {project.stack.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <div className="modal-actions">
          <a href={project.github} target="_blank" rel="noreferrer">
            <Github size={18} aria-hidden="true" />
            View Source Code
          </a>
          <a href={project.demo} target="_blank" rel="noreferrer" className="primary">
            <ExternalLink size={18} aria-hidden="true" />
            Launch Live Demo
          </a>
        </div>
      </motion.article>
    </motion.div>
  );
}

export function ProjectsSection({ projects, filters }) {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [selectedProject, setSelectedProject] = useState(null);

  const filteredProjects = useMemo(
    () =>
      activeFilter === 'ALL'
        ? projects
        : projects.filter((project) => project.category === activeFilter),
    [activeFilter, projects],
  );

  useEffect(() => {
    if (selectedProject && !filteredProjects.some((project) => project.title === selectedProject.title)) {
      setSelectedProject(null);
    }
  }, [filteredProjects, selectedProject]);

  return (
    <section className="content-section projects-section" id="projects">
      <div className="projects-header">
        <div>
          <p className="eyebrow">Selected Work</p>
          <h2>PROJECT HIGHLIGHTS</h2>
        </div>

        <div className="project-filters" aria-label="Project filters">
          {filters.map((filter) => (
            <button
              className={activeFilter === filter ? 'active' : ''}
              key={filter}
              type="button"
              aria-pressed={activeFilter === filter}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <motion.div className="projects-asymmetric-grid" layout>
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project, index) => (
            <ProjectCard
              index={index}
              isFeatured={index === 0}
              key={project.title}
              project={project}
              onSelect={setSelectedProject}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {selectedProject && (
          <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
