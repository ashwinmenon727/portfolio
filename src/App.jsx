import { Code2, ExternalLink, Github, Linkedin, Mail, MoveRight } from 'lucide-react';
import Lenis from 'lenis';
import { motion } from 'framer-motion';
import { Suspense, lazy, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { developer, experience, sections } from './data/developer.js';
import { projectFilters, projects } from './data/projects.js';
import { Navigation } from './components/layout/Navigation.jsx';
import { AboutSection } from './components/sections/AboutSection.jsx';
import { ContactSection } from './components/sections/ContactSection.jsx';
import { ExperienceSection } from './components/sections/ExperienceSection.jsx';
import { HolographicPortrait } from './components/scene/HolographicPortrait.jsx';
import { AmbientBackground } from './components/ui/AmbientBackground.jsx';

const ProjectsSection = lazy(() => import('./components/sections/ProjectsSection.jsx').then((module) => ({ default: module.ProjectsSection })));
const TechStackSection = lazy(() => import('./components/sections/TechStackSection.jsx').then((module) => ({ default: module.TechStackSection })));

function GitHubSection({ username }) {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const fetchRepos = async () => {
      try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=6&sort=updated`);
        if (!response.ok) {
          throw new Error('GitHub request failed');
        }

        const data = await response.json();
        if (!ignore) {
          setRepos(data.filter((repo) => !repo.fork));
        }
      } catch (error) {
        if (!ignore) {
          setRepos([]);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchRepos();
    return () => {
      ignore = true;
    };
  }, [username]);

  return (
    <section className="content-section github-section" id="github">
      <div className="section-header-row">
        <div>
          <span className="section-eyebrow">OPEN SOURCE</span>
          <h2 className="section-main-title">GitHub Repositories</h2>
        </div>
      </div>

      <div className="minimal-github-grid">
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div key={`gh-skeleton-${index}`} className="minimal-github-card github-card-loading" aria-hidden="true" />
          ))
        ) : repos.length > 0 ? (
          repos.map((repo) => (
            <a className="minimal-github-card" key={repo.id} href={repo.html_url} target="_blank" rel="noreferrer">
              <div className="github-card-header">
                <span className="github-repo-name">{repo.name}</span>
                <span className="github-repo-stars">★ {repo.stargazers_count}</span>
              </div>
              <p className="github-repo-desc">{repo.description || 'Repository details coming soon.'}</p>
              <div className="github-meta-row">
                <span>{repo.language || 'Code'}</span>
                <span>{repo.forks_count} forks</span>
              </div>
            </a>
          ))
        ) : (
          <div className="github-empty">
            <p>GitHub data couldn&apos;t be loaded right now.</p>
          </div>
        )}
      </div>
    </section>
  );
}

function App() {
  const mainRef = useRef(null);
  const [theme, setTheme] = useState('light');
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    localStorage.setItem('portfolio-theme', theme);
  }, [theme]);

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
      setScrollProgress(progress);
    };

    updateScrollProgress();
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);

  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      return undefined;
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
    });

    let frameId;
    const raf = (time) => {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    };

    frameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
    };
  }, []);

  return (
    <main className="site-shell" ref={mainRef}>
      <div className="scroll-progress" aria-hidden="true" style={{ width: `${scrollProgress}%` }} />
      <AmbientBackground />
      <Navigation sections={sections} developer={developer} />

      <header className="hero-section" id="home">
        <div className="hero-grid">
          <section className="hero-copy" aria-labelledby="hero-title">
            <motion.p
              className="hero-status-pill"
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="status-dot" aria-hidden="true" /> AVAILABLE FOR OPPORTUNITIES
            </motion.p>

            <h1 className="hero-title" id="hero-title">
              <motion.span
                className="hero-line hero-highlight"
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                AI VIBE CODER &
              </motion.span>
              <motion.span
                className="hero-line"
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                SOFTWARE DEVELOPER
              </motion.span>
            </h1>

            <motion.p
              className="hero-summary"
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {developer.summary}
            </motion.p>

            <div className="hero-actions" aria-label="Action buttons">
              <a className="btn-primary" href="#projects">
                VIEW PROJECTS
                <MoveRight aria-hidden="true" size={16} />
              </a>
              <a className="btn-secondary" href="#contact">
                CONTACT ME
              </a>
              <div className="hero-social-row" aria-label="Social profiles">
                <a href={developer.github} target="_blank" rel="noreferrer" aria-label="GitHub">
                  <Github size={18} />
                </a>
                <a href={developer.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                  <Linkedin size={18} />
                </a>
                <a href={developer.leetcode} target="_blank" rel="noreferrer" aria-label="LeetCode">
                  <Code2 size={18} />
                </a>
              </div>
            </div>
          </section>

          <HolographicPortrait />
        </div>
      </header>

      <AboutSection developer={developer} />

      <Suspense fallback={<div className="content-section"><span className="section-eyebrow">PROJECTS</span><h2>Selected Projects</h2></div>}>
        <ProjectsSection projects={projects} filters={projectFilters} />
      </Suspense>

      <ExperienceSection items={experience} />

      <Suspense fallback={<div className="content-section"><span className="section-eyebrow">SKILLS</span><h2>Tech Stack</h2></div>}>
        <TechStackSection technologies={developer.techStack} />
      </Suspense>

      <GitHubSection username={developer.githubUsername} />

      <section className="content-section services-section" id="services">
        <div className="section-header-row">
          <div>
            <span className="section-eyebrow">SERVICES</span>
            <h2 className="section-main-title">What I Offer</h2>
          </div>
        </div>

        <div className="minimal-services-grid" aria-label="Service offerings">
          {developer.services.map((service, index) => (
            <article className="minimal-service-card" key={service.title}>
              <span className="service-card-num">0{index + 1}</span>
              <h3 className="service-card-title">{service.title}</h3>
              <p className="service-card-desc">{service.description}</p>
            </article>
          ))}
        </div>
      </section>

      <ContactSection
        developer={developer}
        theme={theme}
        onToggleTheme={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
      />
    </main>
  );
}

export default App;
