'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const WORD = 'LUXORA';

/** Particle-assembly logo intro with an ambient audio-visualizer bar strip. */
export default function Preloader({ onDone }: { onDone?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Particles start off-screen and fly in. That is exactly the kind of motion
    // reduced-motion asks us to skip, so they start settled instead.
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;

    type P = { x: number; y: number; tx: number; ty: number; vx: number; vy: number; s: number; hue: number };
    let particles: P[] = [];

    const build = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      // The overlay can be measured before layout settles; getImageData throws
      // on a zero-sized source. The observer below re-runs once it has a box.
      if (w < 1 || h < 1) return;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const off = document.createElement('canvas');
      off.width = w;
      off.height = h;
      const octx = off.getContext('2d');
      if (!octx) return;
      const size = Math.min(Math.max(w * 0.11, 44), 128);
      octx.fillStyle = '#fff';
      octx.font = `600 ${size}px "SF Pro Display", Inter, system-ui, sans-serif`;
      octx.textAlign = 'center';
      octx.textBaseline = 'middle';
      octx.letterSpacing = `${size * 0.22}px`;
      octx.fillText(WORD, w / 2, h / 2);

      const data = octx.getImageData(0, 0, w, h).data;
      const step = w > 900 ? 3 : 4;
      const next: P[] = [];
      for (let y = 0; y < h; y += step) {
        for (let x = 0; x < w; x += step) {
          if (data[(y * w + x) * 4 + 3] > 128) {
            const a = Math.random() * Math.PI * 2;
            const r = Math.max(w, h) * (0.5 + Math.random() * 0.7);
            next.push({
              x: still ? x : w / 2 + Math.cos(a) * r,
              y: still ? y : h / 2 + Math.sin(a) * r,
              tx: x,
              ty: y,
              vx: 0,
              vy: 0,
              s: 0.6 + Math.random() * 1.1,
              hue: Math.random() < 0.12 ? 44 : 210,
            });
          }
        }
      }
      particles = next;
    };

    build();
    // Observing the canvas rather than the window also covers the first layout.
    const ro = new ResizeObserver(() => build());
    ro.observe(canvas);

    let frame = 0;
    let raf = 0;
    const start = performance.now();

    const tick = () => {
      frame++;
      const elapsed = performance.now() - start;
      ctx.clearRect(0, 0, w, h);

      let settled = 0;
      for (const p of particles) {
        const dx = p.tx - p.x;
        const dy = p.ty - p.y;
        p.vx = (p.vx + dx * 0.0075) * 0.9;
        p.vy = (p.vy + dy * 0.0075) * 0.9;
        p.x += p.vx;
        p.y += p.vy;
        const d = Math.abs(dx) + Math.abs(dy);
        if (d < 1.5) settled++;

        const glow = Math.max(0, 1 - d / 90);
        ctx.beginPath();
        ctx.fillStyle =
          p.hue === 44
            ? `rgba(216,176,106,${0.35 + glow * 0.62})`
            : `rgba(${140 + glow * 115},${185 + glow * 60},255,${0.28 + glow * 0.66})`;
        ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
        ctx.fill();
      }

      if (frame % 3 === 0) {
        // No particles yet means the canvas hasn't been measured — fall back to
        // the elapsed-time floor rather than reporting "done".
        const ratio = particles.length ? settled / particles.length : 0;
        const floor = elapsed / (still ? 500 : 2400);
        setProgress(Math.min(100, Math.round(Math.max(ratio * 100, floor * 100))));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  useEffect(() => {
    if (progress < 100) return;
    const t = setTimeout(() => {
      setGone(true);
      onDone?.();
    }, 620);
    return () => clearTimeout(t);
  }, [progress, onDone]);

  return (
    <AnimatePresence>
      {!gone && (
        <motion.div
          className="on-dark fixed inset-0 z-[200] flex flex-col items-center justify-center bg-obsidian"
          exit={{ opacity: 0, filter: 'blur(24px)', scale: 1.06 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            className="pointer-events-none absolute inset-0 animate-breathe"
            style={{
              background:
                'radial-gradient(60% 45% at 50% 50%, rgba(77,166,255,0.14), transparent 70%)',
            }}
          />
          <canvas ref={canvasRef} className="h-[46vh] w-full max-w-5xl" />

          {/* ambient sound visualization — visual only */}
          <div className="mt-2 flex h-10 items-end gap-[3px]" aria-hidden>
            {Array.from({ length: 44 }).map((_, i) => (
              <motion.span
                key={i}
                className="w-[2px] rounded-full bg-gradient-to-t from-electric/10 to-electric/80"
                animate={{ height: ['12%', `${18 + ((i * 37) % 70)}%`, '12%'] }}
                transition={{
                  duration: 1.1 + ((i % 7) * 0.12),
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.03,
                }}
              />
            ))}
          </div>

          <div className="mt-10 flex w-[240px] flex-col gap-3">
            <div className="h-px w-full overflow-hidden bg-hair/10">
              <motion.div
                className="h-full bg-gradient-to-r from-electric/30 via-electric to-aurum"
                animate={{ width: `${progress}%` }}
                transition={{ ease: 'linear', duration: 0.2 }}
              />
            </div>
            <div className="flex justify-between text-[10px] tracking-wideluxe text-silver/50">
              <span>CALIBRATING</span>
              <span>{String(progress).padStart(3, '0')}</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
