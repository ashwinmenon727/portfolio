import { Download, Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { useActiveSection } from '../../hooks/useActiveSection.js';

export function Navigation({ sections, developer }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const ids = useMemo(() => sections.map((section) => section.id), [sections]);
  const activeSection = useActiveSection(ids);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="minimal-header">
      <div className="header-container">
        <a className="nav-brand" href="#home" onClick={closeMenu}>
          ASHWIN
        </a>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {sections.map((section) => {
            const isActive = activeSection === section.id;
            return (
              <a
                className={`nav-link ${isActive ? 'active' : ''}`}
                href={`#${section.id}`}
                key={section.id}
              >
                {section.label}
                {isActive && (
                  <motion.span
                    className="nav-active-indicator"
                    layoutId="activeIndicator"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            );
          })}
        </nav>

        <div className="header-actions">
          <a
            className="nav-resume-btn"
            href={developer.resume}
            download="Ashwin_Menon_Resume.pdf"
            title="Download Resume"
          >
            <Download size={15} />
            Resume
          </a>

          <button
            className="mobile-hamburger"
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-nav-overlay"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mobile-nav-inner">
              {sections.map((section) => (
                <a
                  className={`mobile-nav-item ${activeSection === section.id ? 'active' : ''}`}
                  href={`#${section.id}`}
                  key={section.id}
                  onClick={closeMenu}
                >
                  {section.label}
                </a>
              ))}
              <a
                className="mobile-resume-btn"
                href={developer.resume}
                download="Ashwin_Menon_Resume.pdf"
                onClick={closeMenu}
              >
                <Download size={16} />
                Download Resume
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
