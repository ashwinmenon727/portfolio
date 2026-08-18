import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import personCutout from '../../assets/ashwin-cutout.png';

const ACCENT_CYAN = '#00f0ff';
const ACCENT_PURPLE = '#a855f7';

/* ─── Particles canvas — floating cyan/purple data dots ─── */
function ParticlesOverlay() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;

    function resize() {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth || 360;
        canvas.height = parent.clientHeight || 500;
      }
    }
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 45 }, (_, i) => ({
      x: Math.random() * (canvas.width || 360),
      y: Math.random() * (canvas.height || 500),
      vy: -0.2 - Math.random() * 0.45,
      size: 0.8 + Math.random() * 1.6,
      alpha: 0.15 + Math.random() * 0.5,
      color: i % 2 === 0 ? ACCENT_CYAN : ACCENT_PURPLE,
    }));

    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.y += p.vy;
        if (p.y < -5) p.y = canvas.height + 5;
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(render);
    }
    render();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 3,
        width: '100%',
        height: '100%',
      }}
    />
  );
}

export function HolographicPortrait() {
  const fallbackBase = import.meta.env.BASE_URL || '/';
  const cleanBase = fallbackBase.endsWith('/') ? fallbackBase : `${fallbackBase}/`;
  const fallbackCutoutSrc = `${cleanBase}ashwin-cutout.png`;

  return (
    <div
      className="hero-hologram-container"
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        minHeight: '28rem',
        opacity: 1,
        visibility: 'visible',
        zIndex: 10,
      }}
    >
      {/* Soft Ambient Radial Cyan/Purple Aura Behind Figure */}
      <div
        aria-hidden="true"
        className="holo-aura-bg"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '85%',
          height: '85%',
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 240, 255, 0.22) 0%, rgba(168, 85, 247, 0.14) 45%, rgba(59, 130, 246, 0.05) 70%, transparent 90%)',
          pointerEvents: 'none',
          zIndex: 1,
          filter: 'blur(30px)',
        }}
      />

      {/* Floating Projection Wrapper */}
      <motion.div
        className="holo-projection-wrapper"
        animate={{ y: [-6, 6, -6] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'relative',
          zIndex: 5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          maxWidth: '100%',
        }}
      >
        {/* Subtle HUD Badges Floating Around Figure with Thin Connecting Lines */}
        <div className="hud-floating-tag tag-tl">
          <span className="tag-line" />
          <span className="tag-content">[ SYSTEM ONLINE ]</span>
        </div>

        <div className="hud-floating-tag tag-tr">
          <span className="tag-content">[ AI / FULL STACK ]</span>
          <span className="tag-line" />
        </div>

        <div className="hud-floating-tag tag-bl">
          <span className="tag-line" />
          <span className="tag-content">[ REACT • NODE • AI ]</span>
        </div>

        <div className="hud-floating-tag tag-br">
          <span className="tag-content">[ ASHWIN MENON ]</span>
          <span className="tag-line" />
        </div>

        {/* Scanline Overlay on Projection */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 6,
            pointerEvents: 'none',
            background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0, 240, 255, 0.06) 3px, rgba(0, 240, 255, 0.06) 4px)',
            mixBlendMode: 'overlay',
            opacity: 0.7,
          }}
        />

        {/* Isolated Person Projection Image */}
        <img
          src={personCutout}
          alt="Ashwin Menon - Holographic AI Developer Projection"
          draggable={false}
          onError={(e) => {
            if (e.currentTarget.src !== fallbackCutoutSrc) {
              e.currentTarget.src = fallbackCutoutSrc;
            }
          }}
          style={{
            display: 'block',
            position: 'relative',
            zIndex: 4,
            opacity: 1,
            visibility: 'visible',
            maxHeight: 'min(68vh, 580px)',
            maxWidth: '100%',
            objectFit: 'contain',
            filter: [
              'drop-shadow(0 0 25px rgba(0, 240, 255, 0.45))',
              'drop-shadow(0 0 50px rgba(168, 85, 247, 0.28))',
              'contrast(1.05)',
              'brightness(1.02)',
            ].join(' '),
          }}
        />

        {/* Floating Particles Overlay */}
        <ParticlesOverlay />
      </motion.div>
    </div>
  );
}
