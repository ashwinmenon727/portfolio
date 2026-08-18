import { ExternalLink, Github, Sparkles, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

function ProjectCard({ project, index, isFeatured, onSelect }) {
  return (
    <motion.article
      layout
      className={`minimal-project-card ${isFeatured ? 'featured-card' : ''}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => onSelect(project)}
      tabIndex={0}
      role="button"
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          onSelect(project);
        }
      }}
    >
      {isFeatured && (
        <div className="minimal-featured-pill">
          <Sparkles size={13} /> Featured Project
        </div>
      )}

      <div className="project-header-row">
        <span className="project-cat-label">{project.category} • {project.year}</span>
        <h3 className="project-card-title">{project.title}</h3>
      </div>

      <p className="project-card-desc">{project.description}</p>

      <div className="project-tech-badges">
        {project.stack.map((item) => (
          <span key={item} className="minimal-tech-chip">
            {item}
          </span>
        ))}
      </div>

      <div className="project-card-actions" onClick={(e) => e.stopPropagation()}>
        <a href={project.github} target="_blank" rel="noreferrer" className="btn-secondary-sm">
          <Github size={14} /> GitHub
        </a>
        <a href={project.demo} target="_blank" rel="noreferrer" className="btn-primary-sm">
          <ExternalLink size={14} /> Live Demo
        </a>
      </div>
    </motion.article>
  );
}

function ProjectModal({ project, onClose }) {
  return (
    <motion.div
      className="minimal-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.article
        className="minimal-modal-card"
        initial={{ y: 28, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 20, opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="modal-close-btn" aria-label="Close modal" onClick={onClose}>
          <X size={18} />
        </button>

        <span className="section-eyebrow">{project.category} / {project.year}</span>
        <h3 className="modal-title">{project.title}</h3>
        <p className="modal-desc">{project.description}</p>

        <div className="project-tech-badges">
          {project.stack.map((item) => (
            <span key={item} className="minimal-tech-chip">
              {item}
            </span>
          ))}
        </div>

        <div className="modal-actions-row">
          <a href={project.github} target="_blank" rel="noreferrer" className="btn-secondary-sm">
            <Github size={16} /> View GitHub
          </a>
          <a href={project.demo} target="_blank" rel="noreferrer" className="btn-primary-sm">
            <ExternalLink size={16} /> Live Demo
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
      <div className="section-header-row">
        <div>
          <span className="section-eyebrow">PROJECTS</span>
          <h2 className="section-main-title">Selected Projects</h2>
        </div>

        <div className="minimal-filters-row" aria-label="Project filters">
          {filters.map((filter) => (
            <button
              className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
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

      <motion.div className="minimal-projects-grid" layout>
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
