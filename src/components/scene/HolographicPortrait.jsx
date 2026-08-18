import { motion } from 'framer-motion';
import personCutout from '../../assets/ashwin-cutout.png';

export function HolographicPortrait() {
  const fallbackBase = import.meta.env.BASE_URL || '/';
  const cleanBase = fallbackBase.endsWith('/') ? fallbackBase : `${fallbackBase}/`;
  const fallbackCutoutSrc = `${cleanBase}ashwin-cutout.png`;

  return (
    <div className="hero-portrait-container">
      {/* Soft Light Blue Backdrop Glow Shape */}
      <div className="hero-portrait-shape" aria-hidden="true" />

      {/* Clean Portrait Image Frame */}
      <motion.div
        className="hero-portrait-frame"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <img
          src={personCutout}
          alt="Ashwin Menon - Software Developer & AI Engineer"
          draggable={false}
          onError={(e) => {
            if (e.currentTarget.src !== fallbackCutoutSrc) {
              e.currentTarget.src = fallbackCutoutSrc;
            }
          }}
          className="hero-portrait-image"
        />
      </motion.div>
    </div>
  );
}
