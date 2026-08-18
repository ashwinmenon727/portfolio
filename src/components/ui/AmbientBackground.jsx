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
      <div className="ambient-grid" />
      {particles.map((particle) => (
        <motion.span
          className="ambient-particle"
          key={particle.id}
          style={{
            left: particle.left,
            width: particle.size,
            height: particle.size,
          }}
          animate={{ y: reducedMotion ? ['0vh', '0vh'] : ['105vh', '-10vh'], opacity: reducedMotion ? [0.15, 0.15] : [0, 0.35, 0] }}
          transition={{
            duration: reducedMotion ? 0 : 16 + (particle.id % 5),
            delay: reducedMotion ? 0 : particle.delay,
            repeat: reducedMotion ? 0 : Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}
