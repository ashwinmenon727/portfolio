import { Menu, X, Download, Github, Linkedin, Code } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { useEffect, useMemo, useState } from 'react';
import { useActiveSection } from '../../hooks/useActiveSection.js';

export function Navigation({ sections, developer }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const ids = useMemo(() => sections.map((section) => section.id), [sections]);
  const activeSection = useActiveSection(ids);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      return undefined;
    }

    const links = gsap.utils.toArray('.magnetic-link');
    const cleanups = links.map((link) => {
      const onMove = (event) => {
        const rect = link.getBoundingClientRect();
        const x = (event.clientX - rect.left - rect.width / 2) * 0.18;
        const y = (event.clientY - rect.top - rect.height / 2) * 0.22;
        gsap.to(link, { x, y, duration: 0.28, ease: 'power3.out' });
      };
      const onLeave = () => {
        gsap.to(link, { x: 0, y: 0, duration: 0.45, ease: 'elastic.out(1, 0.55)' });
      };

      link.addEventListener('pointermove', onMove);
      link.addEventListener('pointerleave', onLeave);

      return () => {
        link.removeEventListener('pointermove', onMove);
        link.removeEventListener('pointerleave', onLeave);
      };
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <motion.nav
        className="floating-nav"
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        aria-label="Primary navigation"
      >
        <a className="nav-logo magnetic-link" href="#home" onClick={closeMenu}>
          ASHWIN
        </a>
        <div className="desktop-nav-links">
          {sections.map((section) => (
            <a
              className={activeSection === section.id ? 'active magnetic-link' : 'magnetic-link'}
              href={`#${section.id}`}
              key={section.id}
            >
              {section.label}
              {activeSection === section.id && <span className="active-pill" />}
            </a>
          ))}
        </div>
        <div className="nav-actions">
          <a 
            className="nav-social-link magnetic-link" 
            href={developer.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            title="GitHub"
          >
            <Github size={18} />
          </a>
          <a 
            className="nav-social-link magnetic-link" 
            href={developer.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            title="LinkedIn"
          >
            <Linkedin size={18} />
          </a>
          <a 
            className="nav-social-link magnetic-link" 
            href={developer.leetcode}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LeetCode"
            title="LeetCode"
          >
            <Code size={18} />
          </a>
          <a 
            className="nav-cta magnetic-link" 
            href={developer.resume}
            download="Ashwin_Menon_Resume.pdf"
            title="Download Resume"
          >
            <Download size={18} />
            Resume
          </a>
        </div>
        <button
          className="mobile-menu-button"
          type="button"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, y: '-100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mobile-menu-links">
              {sections.map((section) => (
                <a
                  className={activeSection === section.id ? 'active' : ''}
                  href={`#${section.id}`}
                  key={section.id}
                  onClick={closeMenu}
                >
                  {section.label}
                </a>
              ))}
            </div>
            <div className="mobile-menu-actions">
              <a 
                className="mobile-social-link" 
                href={developer.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeMenu}
              >
                <Github size={18} />
                GitHub
              </a>
              <a 
                className="mobile-social-link" 
                href={developer.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeMenu}
              >
                <Linkedin size={18} />
                LinkedIn
              </a>
              <a 
                className="mobile-social-link" 
                href={developer.leetcode}
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeMenu}
              >
                <Code size={18} />
                LeetCode
              </a>
              <a 
                className="mobile-cta" 
                href={developer.resume}
                download="Ashwin_Menon_Resume.pdf"
                onClick={closeMenu}
              >
                <Download size={18} />
                Download Resume
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
