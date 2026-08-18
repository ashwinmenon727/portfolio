import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

export function AmbientBackground() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(motionQuery.matches);

    update();
    motionQuery.addEventListener('change', update);

    return () => motionQuery.removeEventListener('change', update);
  }, []);

  const particles = useMemo(
    () =>
      Array.from({ length: reducedMotion ? 8 : 18 }, (_, index) => ({
        id: index,
        left: `${(index * 31) % 100}%`,
        delay: index * 0.28,
        size: 2 + (index % 3),
      })),
    [reducedMotion],
  );

  return (
    <div className="ambient-background" aria-hidden="true">
      <div className="ambient-orb orb-1" />
      <div className="ambient-orb orb-2" />
      <div className="ambient-orb orb-3" />
      <div className="ambient-grid" />
      <div className="ambient-scanlines" />
      {particles.map((particle) => (
        <motion.span
          className="ambient-particle"
          key={particle.id}
          style={{
            left: particle.left,
            width: particle.size,
            height: particle.size,
            background: particle.id % 2 === 0 ? '#00f0ff' : '#a855f7',
            boxShadow: particle.id % 2 === 0 ? '0 0 10px rgba(0,240,255,0.6)' : '0 0 10px rgba(168,85,247,0.6)',
          }}
          animate={{ y: reducedMotion ? ['0vh', '0vh'] : ['105vh', '-10vh'], opacity: reducedMotion ? [0.2, 0.2] : [0, 0.45, 0] }}
          transition={{
            duration: reducedMotion ? 0 : 18 + (particle.id % 6),
            delay: reducedMotion ? 0 : particle.delay,
            repeat: reducedMotion ? 0 : Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}
