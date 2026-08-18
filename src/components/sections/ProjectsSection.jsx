import { ExternalLink, Github, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

const cardPositions = [
  { x: -24, y: 0, rotate: -5 },
  { x: 18, y: 30, rotate: 4 },
  { x: -10, y: -12, rotate: 2 },
  { x: 20, y: -4, rotate: -3 },
  { x: -18, y: 18, rotate: 5 },
  { x: 8, y: -20, rotate: -2 },
];

function ProjectCard({ project, index, selected, onSelect }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const [isMobile, setIsMobile] = useState(false);
    const position = cardPositions[index % cardPositions.length];
    const isSelected = selected?.title === project.title;

    useEffect(() => {
      const mediaQuery = window.matchMedia('(max-width: 820px)');
      const update = () => setIsMobile(mediaQuery.matches);

      update();
      mediaQuery.addEventListener('change', update);

      return () => mediaQuery.removeEventListener('change', update);
    }, []);

    const onPointerMove = (event) => {
      if (isMobile) {
        return;
      }

      const rect = event.currentTarget.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      setTilt({ x: y * -8, y: x * 10 });
    };

  return (
    <motion.article
      layout
      className={isSelected ? 'project-orbit-card selected' : 'project-orbit-card'}
      initial={{ opacity: 0, scale: 0.78, rotateX: 12, z: -80 }}
      animate={{
        opacity: 1,
        scale: isSelected ? 1.08 : 1,
        x: isMobile ? 0 : position.x,
        y: isMobile ? 0 : position.y,
        rotate: isMobile ? 0 : position.rotate,
        rotateX: tilt.x,
        rotateY: tilt.y,
        z: isSelected ? 90 : 0,
      }}
      exit={{ opacity: 0, scale: 0.72, rotateX: -8, z: -120 }}
      whileHover={{ z: 120, scale: isSelected ? 1.1 : 1.04 }}
      transition={{ type: 'spring', stiffness: 120, damping: 19, mass: 0.7 }}
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
      <div className="project-image" style={{ background: project.image }}>
        <span>{project.category}</span>
      </div>
      <div className="project-card-body">
        <p>{project.year}</p>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <ul>
          {project.stack.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
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
        <div className="modal-image" style={{ background: project.image }} />
        <p className="eyebrow">{project.category} / {project.year}</p>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <ul>
          {project.stack.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <div className="modal-actions">
          <a href={project.github} target="_blank" rel="noreferrer">
            <Github size={18} aria-hidden="true" />
            GitHub
          </a>
          <a href={project.demo} target="_blank" rel="noreferrer">
            <ExternalLink size={18} aria-hidden="true" />
            Live Demo
          </a>
        </div>
      </motion.article>
    </motion.div>
  );
}

export function ProjectsSection({ projects, filters }) {
  const sectionRef = useRef(null);
  const orbitRef = useRef(null);
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

  useLayoutEffect(() => {
    if (!sectionRef.current) {
      return undefined;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const cards = orbitRef.current ? gsap.utils.toArray('.project-orbit-card', orbitRef.current) : [];
      if (cards.length > 0) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 110, rotateX: 22, z: -180 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            z: 0,
            stagger: 0.09,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 74%',
              once: true,
            },
          },
        );
      }

      if (orbitRef.current) {
        gsap.to(orbitRef.current, {
          y: 14,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom 20%',
            scrub: true,
          },
        });
      }
    }, sectionRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [filteredProjects.length]);

  return (
    <section ref={sectionRef} className="content-section projects-section" id="projects">
      <div className="projects-header">
        <div>
          <p className="eyebrow">Selected Work</p>
          <h2>SELECTED WORK</h2>
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

      <motion.div ref={orbitRef} className="project-orbit" layout>
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project, index) => (
            <ProjectCard
              index={index}
              key={project.title}
              project={project}
              selected={selectedProject}
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
