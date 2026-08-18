import { useEffect, useRef, useState } from 'react';

const POINTER_QUERY = '(pointer: fine)';
const REDUCED_QUERY = '(prefers-reduced-motion: reduce)';
const LIQUID_CLICK_EVENT = 'liquid:click';

const EMERALD = '157, 247, 203';
const EMERALD_CYAN = '150, 235, 255';

const INTERACTIVE_SELECTOR = 'a, button, input, textarea, select, [data-cursor="interactive"]';
const HOLOGRAM_SELECTOR = '.hologram-stage';
const PROJECT_SELECTOR = '.project-orbit-card';
const MAGNETIC_SELECTOR =
  '.hero-actions a, .contact-button, .cta-magnetic, .contact-footer-socials a';

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const lerp = (a, b, t) => a + (b - a) * t;
const easeOut = (p) => 1 - (1 - p) * (1 - p);

function detectMode() {
  const finePointer = window.matchMedia(POINTER_QUERY).matches;
  const reducedMotion = window.matchMedia(REDUCED_QUERY).matches;
  return finePointer && !reducedMotion;
}

export function LiquidCursor() {
  const [active, setActive] = useState(() => detectMode());

  const coreRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);
  const canvasRef = useRef(null);
  const lensRef = useRef(null);

  useEffect(() => {
    const pointerQuery = window.matchMedia(POINTER_QUERY);
    const motionQuery = window.matchMedia(REDUCED_QUERY);
    const update = () => setActive(detectMode());

    update();
    pointerQuery.addEventListener('change', update);
    motionQuery.addEventListener('change', update);
    return () => {
      pointerQuery.removeEventListener('change', update);
      motionQuery.removeEventListener('change', update);
    };
  }, []);

  useEffect(() => {
    if (!active) return undefined;

    const core = coreRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    const canvas = canvasRef.current;
    const lens = lensRef.current;
    const ctx = canvas.getContext('2d');

    document.body.classList.add('has-custom-cursor');

    const state = {
      targetX: window.innerWidth / 2,
      targetY: window.innerHeight / 2,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      rx: window.innerWidth / 2,
      ry: window.innerHeight / 2,
      tx: window.innerWidth / 2,
      ty: window.innerHeight / 2,
      speed: 0,
      initialised: false,
      hoverKind: 'normal',
      scale: 1,
      labelText: '',
      showLabel: false,
      labelScale: 0.6,
      labelOpacity: 0,
      magEl: null,
      magLastEl: null,
      magDx: 0,
      magDy: 0,
      magActive: false,
    };

    const trail = [];
    const droplets = [];
    const ripples = [];
    const bursts = [];
    const flashes = [];

    let cssW = window.innerWidth;
    let cssH = window.innerHeight;
    let raf = 0;
    let last = performance.now();
    let lastSpawnX = -999;
    let lastSpawnY = -999;
    let lastMoveRipple = 0;

    const resize = () => {
      cssW = window.innerWidth;
      cssH = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const setTransform = (element, x, y, scale = 1) => {
      element.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) scale(${scale.toFixed(3)})`;
    };

    const spawnRipple = (x, y, max, strength, duration, cyan) => {
      ripples.push({ x, y, t: 0, dur: duration, max, strength, cyan: Boolean(cyan) });
    };

    const spawnClick = (x, y) => {
      flashes.push({ x, y, t: 0, dur: 0.16 });
      spawnRipple(x, y, 96, 0.55, 0.75);
      spawnRipple(x, y, 60, 0.4, 0.7, true);
      const count = 14;
      for (let i = 0; i < count; i += 1) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
        const speed = 46 + Math.random() * 86;
        const life = 0.45 + Math.random() * 0.35;
        bursts.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life,
          dur: life,
          r: 1 + Math.random() * 1.6,
        });
      }
    };

    const classify = (target) => {
      if (target.closest(PROJECT_SELECTOR)) return 'project';
      if (target.closest(HOLOGRAM_SELECTOR)) return 'hologram';
      if (target.closest(INTERACTIVE_SELECTOR)) return 'interactive';
      return 'normal';
    };

    const applyLabel = (kind) => {
      if (kind === 'hologram') {
        state.labelText = 'SCANNING...';
        state.showLabel = true;
      } else if (kind === 'project') {
        state.labelText = 'VIEW PROJECT →';
        state.showLabel = true;
      } else {
        state.labelText = '';
        state.showLabel = false;
      }
      label.textContent = state.labelText;
    };

    const onPointerMove = (event) => {
      state.targetX = event.clientX;
      state.targetY = event.clientY;
      if (!state.initialised) {
        state.initialised = true;
        state.x = state.rx = state.tx = event.clientX;
        state.y = state.ry = state.ty = event.clientY;
      }
    };

    const onPointerOver = (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const kind = classify(target);

      const magTarget = target.closest(MAGNETIC_SELECTOR);
      if (magTarget) {
        if (state.magEl !== magTarget) {
          state.magEl = magTarget;
          state.magLastEl = magTarget;
        }
      } else if (state.magEl) {
        state.magEl = null;
      }

      if (state.hoverKind !== kind) {
        state.hoverKind = kind;
        if (kind !== 'normal') {
          spawnRipple(state.targetX, state.targetY, 24, 0.5, 0.45);
        }
        applyLabel(kind);
      }
    };

    const onPointerLeave = () => {
      state.hoverKind = 'normal';
      state.magEl = null;
      applyLabel('normal');
    };

    const onPointerDown = (event) => {
      spawnClick(event.clientX, event.clientY);
      window.dispatchEvent(
        new CustomEvent(LIQUID_CLICK_EVENT, { detail: { x: event.clientX, y: event.clientY } }),
      );
    };

    const loop = (now) => {
      const dt = clamp((now - last) / 1000, 0.001, 0.05);
      last = now;

      const fCore = 1 - Math.pow(0.42, dt * 60);
      const fRing = 1 - Math.pow(0.26, dt * 60);
      const fTrail = 1 - Math.pow(0.13, dt * 60);

      const prevX = state.x;
      const prevY = state.y;

      state.x += (state.targetX - state.x) * fCore;
      state.y += (state.targetY - state.y) * fCore;
      state.rx += (state.x - state.rx) * fRing;
      state.ry += (state.y - state.ry) * fRing;
      state.tx += (state.x - state.tx) * fTrail;
      state.ty += (state.y - state.ty) * fTrail;

      const frameSpeed = Math.hypot(state.x - prevX, state.y - prevY) * 60;
      state.speed = lerp(state.speed, frameSpeed, 0.3);

      if (state.speed > 320 && now - lastMoveRipple > 160) {
        lastMoveRipple = now;
        spawnRipple(state.x, state.y, 30, 0.28, 0.6);
      }

      trail.push({ x: state.tx, y: state.ty, t: now });
      const cutoff = now - 620;
      while (trail.length > 0 && trail[0].t < cutoff) trail.shift();
      if (trail.length > 70) trail.splice(0, trail.length - 70);

      if (state.speed > 45 && droplets.length < 90) {
        const travelled = Math.hypot(state.tx - lastSpawnX, state.ty - lastSpawnY);
        if (travelled > 9) {
          const life = 0.4 + Math.random() * 0.22;
          droplets.push({
            x: state.tx + (Math.random() - 0.5) * 2,
            y: state.ty + (Math.random() - 0.5) * 2,
            vx: (Math.random() - 0.5) * 34,
            vy: (Math.random() - 0.5) * 34,
            life,
            dur: life,
            r: 1.2 + Math.random() * 1.5,
          });
          lastSpawnX = state.tx;
          lastSpawnY = state.ty;
        }
      }

      const magTarget = state.magEl;
      if (magTarget) {
        const rect = magTarget.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (state.targetX - cx) * 0.14;
        const dy = (state.targetY - cy) * 0.14;
        state.magDx = lerp(state.magDx, clamp(dx, -6, 6), 0.24);
        state.magDy = lerp(state.magDy, clamp(dy, -6, 6), 0.24);
        magTarget.style.translate = `${state.magDx.toFixed(2)}px ${state.magDy.toFixed(2)}px`;
        state.magActive = true;
      } else if (state.magActive && state.magLastEl) {
        state.magDx = lerp(state.magDx, 0, 0.16);
        state.magDy = lerp(state.magDy, 0, 0.16);
        state.magLastEl.style.translate = `${state.magDx.toFixed(2)}px ${state.magDy.toFixed(2)}px`;
        if (Math.abs(state.magDx) < 0.1 && Math.abs(state.magDy) < 0.1) {
          state.magActive = false;
          state.magLastEl = null;
        }
      }

      const scaleTarget =
        state.hoverKind === 'project'
          ? 1.85
          : state.hoverKind === 'hologram'
            ? 1.72
            : state.hoverKind === 'interactive'
              ? 1.55
              : 1;
      state.scale = lerp(state.scale, scaleTarget, 0.22);

      setTransform(core, state.x, state.y, 1);
      setTransform(ring, state.rx, state.ry, state.scale);

      if (state.showLabel) {
        state.labelScale = lerp(state.labelScale, 1, 0.22);
        state.labelOpacity = lerp(state.labelOpacity, 1, 0.24);
      } else {
        state.labelScale = lerp(state.labelScale, 0.6, 0.18);
        state.labelOpacity = lerp(state.labelOpacity, 0, 0.2);
      }
      label.style.transform = `translate3d(${(state.x + 16).toFixed(2)}px, ${(state.y + 18).toFixed(2)}px, 0) scale(${state.labelScale.toFixed(3)})`;
      label.style.opacity = state.labelOpacity.toFixed(3);

      lens.style.setProperty('--lens-x', `${state.x.toFixed(1)}px`);
      lens.style.setProperty('--lens-y', `${state.y.toFixed(1)}px`);

      ctx.clearRect(0, 0, cssW, cssH);
      ctx.globalCompositeOperation = 'lighter';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      for (let i = 1; i < trail.length; i += 1) {
        const a = trail[i - 1];
        const b = trail[i];
        const fade = clamp(1 - (now - b.t) / 620, 0, 1);
        if (fade <= 0.02) continue;
        const width = 1.6 + Math.sin(i * 0.55 + now * 0.003) * 0.6;
        ctx.strokeStyle = `rgba(${EMERALD}, ${(fade * 0.16).toFixed(3)})`;
        ctx.lineWidth = Math.max(0.6, width);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      for (let i = droplets.length - 1; i >= 0; i -= 1) {
        const d = droplets[i];
        d.x += d.vx * dt;
        d.y += d.vy * dt;
        d.vx *= 0.94;
        d.vy *= 0.94;
        d.life -= dt;
        if (d.life <= 0) {
          droplets.splice(i, 1);
          continue;
        }
        const p = d.life / d.dur;
        ctx.fillStyle = `rgba(${EMERALD}, ${(p * 0.65).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, Math.max(0.3, d.r * (0.5 + p * 0.5)), 0, Math.PI * 2);
        ctx.fill();
      }

      for (let i = ripples.length - 1; i >= 0; i -= 1) {
        const r = ripples[i];
        r.t += dt;
        if (r.t >= r.dur) {
          ripples.splice(i, 1);
          continue;
        }
        const p = r.t / r.dur;
        const radius = r.max * easeOut(p);
        const alpha = (1 - p) * r.strength;
        ctx.strokeStyle = `rgba(${EMERALD}, ${alpha.toFixed(3)})`;
        ctx.lineWidth = 1 + (1 - p) * 1.6;
        ctx.beginPath();
        ctx.arc(r.x, r.y, Math.max(0.5, radius), 0, Math.PI * 2);
        ctx.stroke();
        if (r.cyan && p < 0.55) {
          ctx.strokeStyle = `rgba(${EMERALD_CYAN}, ${(alpha * 0.6).toFixed(3)})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.arc(r.x, r.y, Math.max(0.5, radius * 0.62), 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      for (let i = bursts.length - 1; i >= 0; i -= 1) {
        const b = bursts[i];
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        b.vx *= 0.92;
        b.vy *= 0.92;
        b.life -= dt;
        if (b.life <= 0) {
          bursts.splice(i, 1);
          continue;
        }
        const p = b.life / b.dur;
        ctx.fillStyle = `rgba(${EMERALD_CYAN}, ${(p * 0.7).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(b.x, b.y, Math.max(0.3, b.r * p), 0, Math.PI * 2);
        ctx.fill();
      }

      for (let i = flashes.length - 1; i >= 0; i -= 1) {
        const f = flashes[i];
        f.t += dt;
        if (f.t >= f.dur) {
          flashes.splice(i, 1);
          continue;
        }
        const p = f.t / f.dur;
        const radius = 2 + p * 16;
        const alpha = (1 - p) * 0.85;
        ctx.fillStyle = `rgba(${EMERALD}, ${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(f.x, f.y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = `rgba(220, 255, 240, ${(alpha * 0.8).toFixed(3)})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(f.x, f.y, radius * 1.9, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.globalCompositeOperation = 'source-over';

      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerover', onPointerOver, { passive: true });
    document.addEventListener('pointerleave', onPointerLeave);
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerover', onPointerOver);
      document.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('pointerdown', onPointerDown);
      if (state.magLastEl) {
        state.magLastEl.style.translate = '';
      }
      document.body.classList.remove('has-custom-cursor');
    };
  }, [active]);

  if (!active) {
    return null;
  }

  return (
    <>
      <div className="liquid-lens" ref={lensRef} aria-hidden="true" />
      <div className="liquid-layer" aria-hidden="true">
        <canvas ref={canvasRef} className="liquid-canvas" />
        <div ref={coreRef} className="liquid-cursor-core" />
        <div ref={ringRef} className="liquid-cursor-ring" />
        <div ref={labelRef} className="liquid-cursor-label" />
      </div>
    </>
  );
}

export default LiquidCursor;
