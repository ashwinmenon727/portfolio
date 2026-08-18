import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ACCENT = '#9df7cb';

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
    const img = new Image();
    img.onload = () => { if (!cancelled) setImgSrc('/images/ashwin-portrait.jpeg'); };
    img.onerror = () => {};
    img.src = '/images/ashwin-portrait.jpeg';
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
      if (!about) return;
      ctx = gsap.context(() => {
        gsap.timeline({
          scrollTrigger: {
            trigger: about,
            start: 'top 85%',
            end: 'top 30%',
            scrub: true,
          },
        }).to(scrollFadeRef.current, {
          opacity: 0.06,
          y: -45,
          scale: 0.82,
          ease: 'none',
          onUpdate() {
            if (!portraitGroupRef.current) return;
            const s = scrollFadeRef.current;
            portraitGroupRef.current.style.opacity = s.opacity;
            portraitGroupRef.current.style.transform = `translateY(${s.y}px) scale(${s.scale})`;
          },
        }, 0);
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
        style={{ opacity: imgSrc ? 1 : 0, transition: 'opacity 600ms ease' }}
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
            {/* BASE PORTRAIT — plain <img>, cannot distort */}
            {imgSrc && (
              <img
                src={imgSrc}
                alt="Ashwin Menon"
                draggable={false}
                style={{
                  display: 'block',
                  maxHeight: 'min(78vh, 750px)',
                  maxWidth: '100%',
                  objectFit: 'contain',
                  filter: [
                    'grayscale(1)',
                    'sepia(1)',
                    'saturate(2.5)',
                    'hue-rotate(130deg)',
                    'brightness(1.05)',
                    'contrast(1.2)',
                    'drop-shadow(0 0 12px rgba(157,247,203,0.25))',
                    'drop-shadow(0 0 30px rgba(157,247,203,0.10))',
                  ].join(' '),
                  /* Elliptical mask fades background edges, keeps person centered */
                  WebkitMaskImage: 'radial-gradient(ellipse 70% 90% at 55% 48%, black 40%, transparent 75%)',
                  maskImage: 'radial-gradient(ellipse 70% 90% at 55% 48%, black 40%, transparent 75%)',
                }}
              />
            )}

            {/* SCANLINES overlay — CSS pseudo via repeating gradient */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.07) 3px, rgba(0,0,0,0.07) 4px)',
                pointerEvents: 'none',
                animation: reduced ? 'none' : 'holo-scanline-scroll 6s linear infinite',
                zIndex: 1,
              }}
            />

            {/* SCAN BEAM — slow sweeping translucent band */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, transparent 0%, rgba(157,247,203,0.04) 48%, rgba(157,247,203,0.06) 50%, rgba(157,247,203,0.04) 52%, transparent 100%)',
                backgroundSize: '100% 200%',
                pointerEvents: 'none',
                animation: reduced ? 'none' : 'holo-scan-beam 4s ease-in-out infinite',
                zIndex: 2,
              }}
            />

            {/* GRAIN overlay — CSS noise via tiny SVG filter */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                opacity: 0.08,
                pointerEvents: 'none',
                mixBlendMode: 'overlay',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                backgroundSize: '150px 150px',
                animation: reduced ? 'none' : 'holo-grain-shift 0.5s steps(4) infinite',
                zIndex: 2,
              }}
            />

            {/* BOTTOM FADE — transparent gradient dissolve */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '35%',
                background: 'linear-gradient(to bottom, transparent 0%, rgba(10,10,10,0.5) 45%, rgba(10,10,10,0.97) 100%)',
                pointerEvents: 'none',
                zIndex: 2,
              }}
            />

            {/* Particles — only canvas in the entire component, touches nothing */}
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
