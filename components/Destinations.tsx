'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CITIES, type City } from '@/lib/cities';
import SectionHeading from './SectionHeading';
import VideoPlate from './VideoPlate';
import SafeGL from './SafeGL';

const Globe = dynamic(() => import('./three/Globe'), {
  ssr: false,
  loading: () => <div className="grid h-full w-full place-items-center text-[10px] tracking-wideluxe text-silver/40">RENDERING ORBIT</div>,
});

export default function Destinations() {
  const [active, setActive] = useState<City | null>(null);
  const [pinned, setPinned] = useState<City>(CITIES[3]);

  const onHover = useCallback((c: City | null) => {
    setActive(c);
    if (c) setPinned(c);
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--accent', (active ?? pinned).accent);
  }, [active, pinned]);

  const shown = active ?? pinned;

  return (
    <section id="destinations" className="relative overflow-hidden py-28 md:py-40">
      <div
        className="pointer-events-none absolute inset-0 transition-all duration-1000"
        style={{
          background: `radial-gradient(52% 42% at 50% 46%, rgba(var(--accent),0.15), transparent 70%)`,
        }}
      />

      <div className="relative mx-auto w-[min(1180px,92vw)]">
        <SectionHeading
          eyebrow="Destinations"
          title="Seven cities. One unbroken thread."
          copy="LUXORA maintains permanent ground infrastructure in the world's seven most demanding cities — and routes you between them without a single handoff."
        />

        <div className="relative mt-16 grid items-center gap-8 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="relative aspect-square w-full max-w-[720px] md:mx-auto">
            <SafeGL>
              <Globe onHover={onHover} />
            </SafeGL>
            <div className="pointer-events-none absolute inset-0 rounded-full" style={{ boxShadow: 'inset 0 0 140px 20px rgba(5,5,5,0.9)' }} />
          </div>

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={shown.name}
                initial={{ opacity: 0, y: 18, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -12, filter: 'blur(8px)' }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="glass glass-strong glow-border relative overflow-hidden rounded-3xl p-7"
              >
                {/* background video preview slot — /public/video/city-<slug>.mp4 */}
                <VideoPlate
                  key={`v-${shown.name}`}
                  src={`/video/city-${shown.name.toLowerCase().replace(/\s+/g, '-')}.mp4`}
                  fadeTo={0.22}
                />

                <div className="relative">
                  <div className="flex items-center gap-3">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: `rgb(${shown.accent})`, boxShadow: `0 0 12px 3px rgba(${shown.accent},0.6)` }} />
                    <span className="eyebrow !text-silver/55">{shown.country}</span>
                  </div>

                  <h3 className="display mt-4 text-[clamp(1.9rem,3.4vw,2.7rem)] text-frost">{shown.name}</h3>
                  <p className="mt-4 text-[14px] leading-relaxed text-silver/70">{shown.tagline}</p>

                  <div className="mt-7 grid grid-cols-3 gap-2">
                    {shown.metrics.map((m) => (
                      <div key={m.k} className="rounded-2xl border border-white/[0.07] bg-white/[0.02] px-3 py-3">
                        <div className="text-[15px] font-semibold text-frost">{m.v}</div>
                        <div className="mt-1 text-[9px] uppercase tracking-[0.18em] text-silver/45">{m.k}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <ul className="mt-4 flex flex-wrap gap-1.5">
              {CITIES.map((c) => (
                <li key={c.name}>
                  <button
                    onMouseEnter={() => setActive(c)}
                    onMouseLeave={() => setActive(null)}
                    onClick={() => setPinned(c)}
                    className={`rounded-full border px-3.5 py-1.5 text-[11px] transition-all duration-500 ease-luxe ${
                      shown.name === c.name
                        ? 'border-transparent text-frost'
                        : 'border-white/10 text-silver/55 hover:border-white/25 hover:text-frost'
                    }`}
                    style={
                      shown.name === c.name
                        ? { background: `rgba(${c.accent},0.16)`, boxShadow: `0 0 24px -6px rgba(${c.accent},0.7)` }
                        : undefined
                    }
                  >
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
