import { Mail, MoveRight } from 'lucide-react';
import Lenis from 'lenis';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Suspense, lazy, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { developer, experience, sections } from './data/developer.js';
import { projectFilters, projects } from './data/projects.js';
import { Navigation } from './components/layout/Navigation.jsx';
import { AboutSection } from './components/sections/AboutSection.jsx';
import { ContactSection } from './components/sections/ContactSection.jsx';
import { ExperienceSection } from './components/sections/ExperienceSection.jsx';
import { AmbientBackground } from './components/ui/AmbientBackground.jsx';
import { LiquidCursor } from './components/ui/LiquidCursor.jsx';

const ProjectsSection = lazy(() => import('./components/sections/ProjectsSection.jsx').then((module) => ({ default: module.ProjectsSection })));
const TechStackSection = lazy(() => import('./components/sections/TechStackSection.jsx').then((module) => ({ default: module.TechStackSection })));
const HolographicPortrait = lazy(() => import('./components/scene/HolographicPortrait.jsx').then((module) => ({ default: module.HolographicPortrait })));

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
      <div className="section-heading">
        <p className="eyebrow">GitHub</p>
        <h2>Open Source</h2>
      </div>

      <div className="github-grid">
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div key={`gh-skeleton-${index}`} className="github-card github-card-loading" aria-hidden="true" />
          ))
        ) : repos.length > 0 ? (
          repos.map((repo) => (
            <a className="github-card" key={repo.id} href={repo.html_url} target="_blank" rel="noreferrer">
              <div className="github-card-header">
                <span className="github-repo-name">{repo.name}</span>
                <span className="github-repo-stars">★ {repo.stargazers_count}</span>
              </div>
              <p>{repo.description || 'Repository details coming soon.'}</p>
              <div className="github-meta">
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
  const [theme, setTheme] = useState(() => localStorage.getItem('portfolio-theme') || 'dark');
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
    const mobileQuery = window.matchMedia('(max-width: 820px)');

    if (reduceMotion || mobileQuery.matches) {
      return undefined;
    }

    const lenis = new Lenis({
      duration: 1.05,
      easing: (time) => Math.min(1, 1.001 - 2 ** (-10 * time)),
      smoothWheel: true,
    });
    let frameId;

    const raf = (time) => {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    };

    frameId = requestAnimationFrame(raf);
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const heroGrid = mainRef.current?.querySelector('.hero-grid');
      if (heroGrid) {
        gsap.fromTo(
          heroGrid,
          { y: 26, opacity: 0.72 },
          {
            y: 0,
            opacity: 1,
            duration: 0.95,
            ease: 'power3.out',
          },
        );
      }

      const heroNameLines = mainRef.current ? Array.from(mainRef.current.querySelectorAll('.hero-name-line')) : [];
      if (heroNameLines.length) {
        gsap.from(heroNameLines, {
          y: 80,
          opacity: 0,
          filter: 'blur(12px)',
          duration: 1,
          stagger: 0.12,
          ease: 'power4.out',
        });
      }

      const revealSections = mainRef.current ? Array.from(mainRef.current.querySelectorAll('.content-section')) : [];
      if (revealSections.length) {
        gsap.fromTo(
          revealSections,
          { opacity: 0.35, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: '.about-section',
              start: 'top 78%',
              once: true,
            },
          },
        );
      }

      const aboutGrid = mainRef.current?.querySelector('.about-grid');
      if (aboutGrid) {
        gsap.fromTo(
          aboutGrid,
          { y: 80, opacity: 0.35, rotateX: 18 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 0.9,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: '.about-section',
              start: 'top 78%',
              once: true,
            },
          },
        );
      }

      const statCards = mainRef.current ? Array.from(mainRef.current.querySelectorAll('.stats-grid .stat-card')) : [];
      if (statCards.length) {
        gsap.fromTo(
          statCards,
          { y: 42, opacity: 0, rotateX: 18 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            stagger: 0.08,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: '.stats-grid',
              start: 'top 82%',
              once: true,
            },
          },
        );
      }

      const experienceCards = mainRef.current ? Array.from(mainRef.current.querySelectorAll('.experience-card')) : [];
      if (experienceCards.length) {
        gsap.fromTo(
          experienceCards,
          { opacity: 0, y: 80, rotateX: 18, z: -120 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            z: 0,
            stagger: 0.08,
            duration: 0.85,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: '.experience-section',
              start: 'top 78%',
              once: true,
            },
          },
        );
      }

      const projectsSection = mainRef.current?.querySelector('.projects-section');
      if (projectsSection && experienceCards.length) {
        gsap.to(experienceCards, {
          y: 20,
          rotateX: 6,
          scrollTrigger: {
            trigger: projectsSection,
            start: 'top 72%',
            end: 'bottom 24%',
            scrub: true,
          },
        });
      }
    }, mainRef);

    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
      ctx.revert();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <main className="site-shell" ref={mainRef}>
      <div className="scroll-progress" aria-hidden="true" style={{ width: `${scrollProgress}%` }} />
      <AmbientBackground />
      <LiquidCursor />
      <Navigation sections={sections} developer={developer} />

      <header className="hero-section" id="home">
        <div className="hero-grid">
          <section className="hero-copy" aria-labelledby="hero-title">
            <motion.p
              className="hero-status"
              initial={{ y: 18, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="status-dot" aria-hidden="true" /> SYSTEM ONLINE // AVAILABLE FOR OPPORTUNITIES
            </motion.p>
            <h1 className="hero-title" id="hero-title">
              {["AI VIBE CODER &", 'SOFTWARE DEVELOPER'].map((line, index) => (
                <motion.span
                  key={line}
                  initial={{ y: '110%', opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    duration: 0.72,
                    delay: 0.12 + index * 0.12,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {line}
                </motion.span>
              ))}
            </h1>
            <motion.p
              className="hero-summary"
              initial={{ y: 18, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              {developer.summary}
            </motion.p>
            <div className="hero-actions" aria-label="Contact links">
              <a className="primary-action" href="#projects">
                View My Work
                <MoveRight aria-hidden="true" size={18} />
              </a>
              <a href={developer.resume} download="Ashwin_Menon_Resume.pdf">
                <Mail aria-hidden="true" size={18} />
                Download Resume
              </a>
            </div>
          </section>

          <Suspense fallback={<div className="scene-stage scene-stage-loading" aria-hidden="true" />}>
            <HolographicPortrait />
          </Suspense>
        </div>
      </header>

      <AboutSection developer={developer} />

      <Suspense fallback={<div className="content-section"><div className="section-heading"><p className="eyebrow">Selected Work</p><h2>Selected Work</h2></div></div>}>
        <ProjectsSection projects={projects} filters={projectFilters} />
      </Suspense>

      <ExperienceSection items={experience} />

      <Suspense fallback={<div className="content-section"><div className="section-heading"><p className="eyebrow">Skills</p><h2>Tech Stack</h2></div></div>}>
        <TechStackSection technologies={developer.techStack} />
      </Suspense>

      <GitHubSection username={developer.githubUsername} />

      <section className="content-section services-section" id="services">
        <div className="section-heading">
          <p className="eyebrow">Services</p>
          <h2>What I Offer</h2>
        </div>

        <div className="services-grid" aria-label="Service offerings">
          {developer.services.map((service, index) => (
            <article className="service-card" key={service.title}>
              <div className="service-card-index">0{index + 1}</div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
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
