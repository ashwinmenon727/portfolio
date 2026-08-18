import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ACCENT = '#2563eb';

/* ─── Particles canvas — only floating dots, never touches the portrait ─── */
function ParticlesOverlay({ pointerRef, containerRef }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    const count = 50;
    const particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -0.15 - Math.random() * 0.4,
        size: 0.5 + Math.random() * 1.8,
        alpha: 0.08 + Math.random() * 0.35,
        phase: Math.random() * Math.PI * 2,
      });
    }
    particlesRef.current = particles;
  }, [containerRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    let raf;

    function resize() {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    }
    resize();
    window.addEventListener('resize', resize);

    function render(time) {
      const t = time * 0.001;
      const particles = particlesRef.current;
      if (!particles) { raf = requestAnimationFrame(render); return; }

      const w = canvas.width;
      const h = canvas.height;
      const mx = pointerRef.current.mx;
      const my = pointerRef.current.my;
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        p.x += p.vx + Math.sin(t + p.phase) * 0.12 + mx * 0.2;
        p.y += p.vy + my * 0.08;
        if (p.y < -5) { p.y = h + 5; p.x = Math.random() * w; }
        if (p.x < -5) p.x = w + 5;
        if (p.x > w + 5) p.x = -5;
        const flicker = 0.5 + Math.sin(t * 2 + p.phase * 3) * 0.5;
        ctx.globalAlpha = p.alpha * flicker;
        ctx.fillStyle = ACCENT;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(render);
    }
    raf = requestAnimationFrame(render);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, [pointerRef, containerRef]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 3 }}
    />
  );
}

/* ─── Responsive hook ─── */
function useResponsive() {
  const [s, setS] = useState(() => ({
    mobile: window.matchMedia('(max-width: 820px)').matches,
    reduced: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  }));
  useEffect(() => {
    const mq1 = window.matchMedia('(max-width: 820px)');
    const mq2 = window.matchMedia('(prefers-reduced-motion: reduce)');
    const u = () => setS({ mobile: mq1.matches, reduced: mq2.matches });
    mq1.addEventListener('change', u);
    mq2.addEventListener('change', u);
    return () => { mq1.removeEventListener('change', u); mq2.removeEventListener('change', u); };
  }, []);
  return s;
}

/* ─── Main export ─── */
export function HolographicPortrait() {
  const stageRef = useRef(null);
  const portraitGroupRef = useRef();
  const scrollFadeRef = useRef({ opacity: 1, y: 0, scale: 1 });
  const parallaxRef = useRef(null);
  const containerRef = useRef(null);
  const pointerRef = useRef({ mx: 0, my: 0 });

  const [imgSrc, setImgSrc] = useState(null);
  const { mobile, reduced } = useResponsive();

  /* Load image — use the original photo, skip the broken cutout */
  useEffect(() => {
    let cancelled = false;
    const base = import.meta.env.BASE_URL || '/';
    const cleanBase = base.endsWith('/') ? base : `${base}/`;
    const src = `${cleanBase}images/ashwin-portrait.jpeg`;
    const img = new Image();
    img.onload = () => { if (!cancelled) setImgSrc(src); };
    img.onerror = () => {};
    img.src = src;
    return () => { cancelled = true; };
  }, []);

  /* GSAP scroll fade */
  useEffect(() => {
    if (reduced || !stageRef.current) return undefined;
    const stage = stageRef.current;
    const about = document.querySelector('.about-section');
    let ctx;

    const setupScroll = () => {
      if (ctx) { ctx.revert(); ctx = undefined; }
      if (!about || !portraitGroupRef.current) return;
      ctx = gsap.context(() => {
        gsap.fromTo(
          portraitGroupRef.current,
          { opacity: 1, y: 0, scale: 1 },
          {
            opacity: 0.06,
            y: -45,
            scale: 0.82,
            ease: 'none',
            scrollTrigger: {
              trigger: about,
              start: 'top 85%',
              end: 'top 30%',
              scrub: true,
              invalidateOnRefresh: true,
            },
          }
        );
      }, stage);
    };

    setupScroll();
    const onResize = () => setupScroll();
    window.addEventListener('resize', onResize);
    const mq = window.matchMedia('(max-width: 820px)');
    mq.addEventListener('change', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      mq.removeEventListener('change', onResize);
      if (ctx) ctx.revert();
    };
  }, [reduced]);

  /* Pointer tracking */
  useEffect(() => {
    if (!stageRef.current) return undefined;
    const stage = stageRef.current;
    const onPointerMove = (e) => {
      const rect = stage.getBoundingClientRect();
      pointerRef.current.mx = (e.clientX - rect.left) / rect.width - 0.5;
      pointerRef.current.my = -(e.clientY - rect.top) / rect.height + 0.5;
    };
    const onPointerLeave = () => { pointerRef.current.mx = 0; pointerRef.current.my = 0; };
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    stage.addEventListener('pointerleave', onPointerLeave);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      stage.removeEventListener('pointerleave', onPointerLeave);
    };
  }, []);

  /* CSS parallax — subtle translate, NO rotation, NO deformation */
  useEffect(() => {
    if (!imgSrc || reduced) return;
    let raf;
    function update() {
      const el = parallaxRef.current;
      if (el) {
        const mx = pointerRef.current.mx;
        const my = pointerRef.current.my;
        el.style.transform = `translate(${mx * 8}px, ${my * 5}px)`;
      }
      raf = requestAnimationFrame(update);
    }
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [imgSrc, reduced]);

  return (
    <div
      ref={stageRef}
      className="scene-stage holo-3d-stage"
      aria-label="Holographic portrait of Ashwin Menon"
    >
      <div
        ref={portraitGroupRef}
        className="holo-3d-canvas-wrapper"
        style={{ opacity: imgSrc ? 1 : 0, visibility: 'visible' }}
      >
        <div
          ref={parallaxRef}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Portrait container — pure HTML/CSS, zero canvas pixel manipulation */}
          <div
            ref={containerRef}
            style={{ position: 'relative', lineHeight: 0, maxHeight: '100%' }}
          >
            {/* BASE PORTRAIT — Clean, crisp rendering without dark/green matrix filters */}
            {imgSrc && (
              <div className="portrait-clean-card">
                <img
                  src={imgSrc}
                  alt="Ashwin Menon"
                  draggable={false}
                  style={{
                    display: 'block',
                    maxHeight: 'min(70vh, 620px)',
                    maxWidth: '100%',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 20px 35px rgba(15, 23, 42, 0.14))',
                    WebkitMaskImage: 'radial-gradient(ellipse 85% 92% at 50% 48%, black 60%, transparent 95%)',
                    maskImage: 'radial-gradient(ellipse 85% 92% at 50% 48%, black 60%, transparent 95%)',
                    borderRadius: '24px',
                  }}
                />
              </div>
            )}

            {/* Soft Ambient Light Glow Ring */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: '-10%',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(37, 99, 235, 0.08) 0%, rgba(6, 182, 212, 0.04) 50%, transparent 70%)',
                pointerEvents: 'none',
                zIndex: 0,
              }}
            />

            {/* Particles — Soft electric blue particles */}
            {!reduced && <ParticlesOverlay pointerRef={pointerRef} containerRef={containerRef} />}
          </div>
        </div>
      </div>

      {!imgSrc && (
        <div className="holo-3d-loading" aria-hidden="true">
          <div className="holo-3d-loading-pulse" />
        </div>
      )}
    </div>
  );
}
