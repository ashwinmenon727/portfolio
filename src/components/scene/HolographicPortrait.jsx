import { useEffect, useRef } from 'react';
import portraitImg from '../../assets/ashwin-portrait.jpg';

const ACCENT_CYAN = '#00f0ff';
const ACCENT_PURPLE = '#a855f7';

/* ─── Floating particles ─── */
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
        canvas.width = parent.clientWidth || 300;
        canvas.height = parent.clientHeight || 400;
      }
    }
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 35 }, (_, i) => ({
      x: Math.random() * (canvas.width || 300),
      y: Math.random() * (canvas.height || 400),
      vy: -0.2 - Math.random() * 0.4,
      size: 1 + Math.random() * 1.5,
      alpha: 0.15 + Math.random() * 0.45,
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
  const fallbackSrc = `${cleanBase}ashwin-portrait.jpg`;

  return (
    <div
      className="scene-stage holo-3d-stage"
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
      {/* Soft Ambient Radial Glow Behind Figure */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: '-10%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 240, 255, 0.2) 0%, rgba(168, 85, 247, 0.12) 45%, rgba(59, 130, 246, 0.05) 70%, transparent 88%)',
          pointerEvents: 'none',
          zIndex: 1,
          filter: 'blur(24px)',
        }}
      />

      {/* Main Holographic Profile Card */}
      <div
        className="portrait-hacker-card"
        style={{
          position: 'relative',
          zIndex: 5,
          opacity: 1,
          visibility: 'visible',
          display: 'block',
          padding: '12px',
          borderRadius: '24px',
          background: 'rgba(14, 22, 40, 0.75)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(0, 240, 255, 0.25)',
          boxShadow: '0 20px 50px -10px rgba(0, 0, 0, 0.75), 0 0 35px rgba(0, 240, 255, 0.2)',
        }}
      >
        {/* HUD Tech Corner Ticks */}
        <div className="hud-corner hud-tl" />
        <div className="hud-corner hud-tr" />
        <div className="hud-corner hud-bl" />
        <div className="hud-corner hud-br" />

        {/* HUD Floating Data Badges */}
        <div className="hud-tag hud-tag-top-left">[SYS_ID // 0x7F4A]</div>
        <div className="hud-tag hud-tag-top-right">[STATUS: ACTIVE]</div>

        {/* Profile Image Asset — ESM Bundled with Vite Base URL resolution */}
        <img
          src={portraitImg}
          alt="Ashwin Menon"
          draggable={false}
          onError={(e) => {
            if (e.currentTarget.src !== fallbackSrc) {
              e.currentTarget.src = fallbackSrc;
            }
          }}
          style={{
            display: 'block',
            position: 'relative',
            zIndex: 10,
            opacity: 1,
            visibility: 'visible',
            maxHeight: 'min(65vh, 580px)',
            maxWidth: '100%',
            objectFit: 'contain',
            borderRadius: '16px',
            filter: [
              'drop-shadow(0 0 25px rgba(0, 240, 255, 0.4))',
              'drop-shadow(0 0 50px rgba(168, 85, 247, 0.25))',
            ].join(' '),
            WebkitMaskImage: 'radial-gradient(ellipse 85% 92% at 50% 48%, black 60%, transparent 95%)',
            maskImage: 'radial-gradient(ellipse 85% 92% at 50% 48%, black 60%, transparent 95%)',
          }}
        />

        {/* HUD Bottom Status Pill */}
        <div className="hud-tag hud-tag-bottom">
          <span className="hud-dot" /> SYS.ONLINE • ASHWIN MENON
        </div>

        {/* Background Particles */}
        <ParticlesOverlay />
      </div>
    </div>
  );
}
