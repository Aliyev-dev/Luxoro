'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import SceneArt from './scenes/SceneArt';
import VideoPlate from './VideoPlate';

const rise = {
  hidden: { opacity: 0, y: 26, filter: 'blur(12px)' },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { delay: 2.35 + i * 0.11, duration: 1.15, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export default function Hero() {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const onMove = (e: PointerEvent) => {
      const r = root.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      root.style.setProperty('--hx', `${x * 100}%`);
      root.style.setProperty('--hy', `${y * 100}%`);
      root.style.setProperty('--tilt-x', `${(0.5 - y) * 6}deg`);
      root.style.setProperty('--tilt-y', `${(x - 0.5) * 8}deg`);
    };
    root.addEventListener('pointermove', onMove, { passive: true });
    return () => root.removeEventListener('pointermove', onMove);
  }, []);

  return (
    <section
      id="top"
      ref={rootRef}
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden"
      style={{ ['--hx' as string]: '50%', ['--hy' as string]: '40%' }}
    >
      {/* procedural poster layer — always present */}
      <div className="absolute inset-0 scale-105">
        <SceneArt id="orbit" />
      </div>

      {/* optional 4K drone plate: drop /public/video/hero.mp4 to activate */}
      <VideoPlate src="/video/hero.mp4" className="scale-110" fadeTo={1} />

      {/* depth-of-field + colour grade */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-obsidian/70 via-obsidian/25 to-obsidian" />
      <div
        className="pointer-events-none absolute inset-0 transition-[background] duration-500"
        style={{
          background:
            'radial-gradient(36% 34% at var(--hx) var(--hy), rgba(120,190,255,0.20), transparent 70%)',
          mixBlendMode: 'screen',
        }}
      />

      {/* floating glass panels */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block">
        {[
          { t: '18%', l: '7%', w: 210, d: 0, label: 'Gulfstream G800', sub: 'LFPB → RJTT · 11h 40m' },
          { t: '62%', l: '4%', w: 190, d: 0.5, label: 'Villa Aeternum', sub: 'Amalfi · staged' },
          { t: '24%', l: '78%', w: 220, d: 0.25, label: 'Table · 2, 21:15', sub: 'Sublimotion, Ibiza' },
          { t: '68%', l: '80%', w: 200, d: 0.75, label: 'Portfolio', sub: '+2.14% · today' },
        ].map((p) => (
          <motion.div
            key={p.label}
            initial={{ opacity: 0, y: 30, rotateX: -12 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: 2.9 + p.d, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="glass absolute rounded-2xl p-3.5"
            style={{
              top: p.t,
              left: p.l,
              width: p.w,
              transform: 'perspective(900px) rotateX(var(--tilt-x,0deg)) rotateY(var(--tilt-y,0deg))',
              transition: 'transform 700ms cubic-bezier(0.16,1,0.3,1)',
              animation: 'breathe 9s ease-in-out infinite',
              animationDelay: `${p.d}s`,
            }}
          >
            <div className="text-[11px] font-medium text-frost">{p.label}</div>
            <div className="mt-1 text-[10px] tracking-wide text-silver/60">{p.sub}</div>
            <div className="mt-2.5 h-px w-full bg-gradient-to-r from-electric/50 to-transparent" />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <motion.p variants={rise} custom={0} initial="hidden" animate="show" className="eyebrow">
          The Future Concierge · Est. 2035
        </motion.p>

        <motion.h1
          variants={rise}
          custom={1}
          initial="hidden"
          animate="show"
          className="display mt-6 max-w-5xl text-[clamp(2.6rem,8.2vw,7.2rem)] text-gradient"
        >
          Your Life.
          <br />
          Curated by Intelligence.
        </motion.h1>

        <motion.p
          variants={rise}
          custom={2}
          initial="hidden"
          animate="show"
          className="mt-8 max-w-2xl text-balance text-[15px] leading-relaxed text-silver/75 md:text-[17px]"
        >
          A private AI concierge that orchestrates travel, lifestyle, investments, experiences,
          and luxury services across the world.
        </motion.p>

        <motion.div
          variants={rise}
          custom={3}
          initial="hidden"
          animate="show"
          className="mt-12 flex flex-col gap-3 sm:flex-row"
        >
          <a href="#destinations" className="btn-liquid glass btn-primary glow-border">
            <span className="reflect" />
            Enter the Future
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
          <a href="#intelligence" className="btn-liquid glass">
            <span className="reflect" />
            <span className="grid h-5 w-5 place-items-center rounded-full border border-white/25">
              <svg viewBox="0 0 24 24" className="h-2.5 w-2.5 translate-x-[0.5px]" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
            Watch Experience
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.6, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3"
      >
        <span className="text-[9px] tracking-wideluxe text-silver/40">SCROLL</span>
        <span className="relative h-10 w-px overflow-hidden bg-white/10">
          <motion.span
            className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-electric to-transparent"
            animate={{ y: [-16, 40] }}
            transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut' }}
          />
        </span>
      </motion.div>
    </section>
  );
}
