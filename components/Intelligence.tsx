'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import SectionHeading from './SectionHeading';

const MODULES = [
  { k: 'Travel Orchestration', v: 'Routing 4 legs', d: 'LFPB → OMDB → WSSS → RJTT', bar: 82 },
  { k: 'Weather Intelligence', v: 'CAT risk low', d: 'FL410 · shear −2.1 kt/1000ft', bar: 34 },
  { k: 'Reservations', v: '6 confirmed', d: 'Sublimotion · Den · Sézanne', bar: 71 },
  { k: 'Investment Signals', v: '+2.14% today', d: '3 rebalance candidates flagged', bar: 64 },
  { k: 'Calendar Fabric', v: '0 conflicts', d: '14 events reconciled across 3 tz', bar: 96 },
  { k: 'Preference Engine', v: '1,284 signals', d: 'Confidence 0.94 · drift stable', bar: 88 },
];

function Sparkline({ seed }: { seed: number }) {
  const pts = Array.from({ length: 26 }, (_, i) => {
    const y = 24 - (Math.sin(i * 0.55 + seed) * 8 + Math.sin(i * 0.19 + seed * 2) * 5 + 12);
    return `${(i / 25) * 100},${y.toFixed(2)}`;
  }).join(' ');
  return (
    <svg viewBox="0 0 100 26" preserveAspectRatio="none" className="h-8 w-full">
      <defs>
        <linearGradient id={`sg${seed}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(77,166,255,0.15)" />
          <stop offset="100%" stopColor="rgba(77,166,255,0.95)" />
        </linearGradient>
      </defs>
      <polyline points={pts} fill="none" stroke={`url(#sg${seed})`} strokeWidth="1" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export default function Intelligence() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-20%' });
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => (t + 1) % MODULES.length), 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="intelligence" className="relative overflow-hidden py-28 md:py-40">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(48% 40% at 70% 40%, rgba(77,166,255,0.10), transparent 70%)' }}
      />

      <div ref={ref} className="relative mx-auto w-[min(1180px,92vw)]">
        <SectionHeading
          eyebrow="Intelligence"
          title="A command center that never sleeps in your timezone."
          copy="LUXORA runs a continuous model of your calendar, holdings, health, appetite and location — and acts before the request forms."
        />

        <div className="mt-16 grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
          {/* AI avatar silhouette */}
          <div className="glass glass-strong glow-border relative overflow-hidden rounded-[28px] p-8">
            <div className="absolute inset-0 opacity-70">
              <div
                className="absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full animate-breathe"
                style={{ background: 'radial-gradient(circle,rgba(77,166,255,0.30),transparent 66%)', filter: 'blur(24px)' }}
              />
            </div>

            <svg viewBox="0 0 200 240" className="relative mx-auto h-[280px]">
              <defs>
                <linearGradient id="av" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(190,225,255,0.85)" />
                  <stop offset="100%" stopColor="rgba(77,166,255,0.04)" />
                </linearGradient>
              </defs>
              <path
                d="M100 30 a34 34 0 1 1 -0.1 0 Z M46 226 q0 -74 54 -74 q54 0 54 74 Z"
                fill="url(#av)"
                opacity="0.5"
              />
              {Array.from({ length: 26 }).map((_, i) => (
                <line
                  key={i}
                  x1="30"
                  x2="170"
                  y1={20 + i * 8.4}
                  y2={20 + i * 8.4}
                  stroke="rgba(140,200,255,0.30)"
                  strokeWidth="0.7"
                >
                  <animate
                    attributeName="opacity"
                    values="0.15;0.75;0.15"
                    dur={`${2.6 + (i % 5) * 0.4}s`}
                    begin={`${i * 0.07}s`}
                    repeatCount="indefinite"
                  />
                </line>
              ))}
            </svg>

            <div className="relative mt-4 text-center">
              <div className="eyebrow">LUXORA CORE</div>
              <p className="mt-3 text-[13px] leading-relaxed text-silver/65">
                &ldquo;Your Tokyo leg shifted eleven minutes. I moved the counter reservation,
                re-tasked the car, and told the residence to hold the lighting.&rdquo;
              </p>
              <div className="mt-5 flex items-center justify-center gap-1.5">
                {Array.from({ length: 28 }).map((_, i) => (
                  <motion.span
                    key={i}
                    className="w-[2px] rounded-full bg-electric/70"
                    animate={{ height: [4, 6 + ((i * 13) % 20), 4] }}
                    transition={{ duration: 1 + (i % 5) * 0.14, repeat: Infinity, ease: 'easeInOut', delay: i * 0.04 }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* holographic dashboard */}
          <div className="grid gap-4 sm:grid-cols-2">
            {MODULES.map((m, i) => (
              <motion.div
                key={m.k}
                initial={{ opacity: 0, y: 26, filter: 'blur(10px)' }}
                animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className={`glass relative rounded-3xl p-5 transition-shadow duration-700 ${
                  tick === i ? 'shadow-[0_0_60px_-18px_rgba(77,166,255,0.8)]' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-silver/45">{m.k}</div>
                  <span
                    className={`mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full transition-all duration-700 ${
                      tick === i ? 'bg-electric shadow-[0_0_10px_3px_rgba(77,166,255,0.7)]' : 'bg-white/20'
                    }`}
                  />
                </div>
                <div className="mt-3 text-[19px] font-semibold text-frost">{m.v}</div>
                <div className="mt-1 text-[11px] text-silver/50">{m.d}</div>
                <Sparkline seed={i + 1} />
                <div className="mt-1 h-px w-full overflow-hidden bg-white/8">
                  <motion.div
                    className="h-full bg-gradient-to-r from-electric/40 to-electric"
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${m.bar}%` } : {}}
                    transition={{ delay: 0.4 + i * 0.08, duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
