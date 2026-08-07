'use client';

import { useEffect, useRef } from 'react';

const COLUMNS = [
  { h: 'Experiences', l: ['Private Aviation', 'Superyachts', 'Luxury Villas', 'Michelin Dining', 'Space Travel'] },
  { h: 'Destinations', l: ['Tokyo', 'Dubai', 'Paris', 'New York', 'Monaco'] },
  { h: 'Company', l: ['Intelligence', 'Membership', 'Partners', 'Press', 'Careers'] },
];

const SOCIAL: { n: string; d: string }[] = [
  { n: 'X', d: 'M4 4l16 16M20 4L4 20' },
  { n: 'IN', d: 'M6 9v10M6 5.5v.01M11 19v-6a3 3 0 0 1 6 0v6' },
  { n: 'IG', d: 'M4 8a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z' },
  { n: 'YT', d: 'M3 8.5A3.5 3.5 0 0 1 6.5 5h11A3.5 3.5 0 0 1 21 8.5v7a3.5 3.5 0 0 1-3.5 3.5h-11A3.5 3.5 0 0 1 3 15.5v-7zM10 9.5l5 2.5-5 2.5v-5z' },
];

function StarField() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let stars: { x: number; y: number; r: number; a: number; tw: number }[] = [];
    let shooters: { x: number; y: number; vx: number; vy: number; life: number; len: number }[] = [];

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.floor((w * h) / 5200);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.15 + 0.25,
        a: Math.random() * 0.6 + 0.15,
        tw: Math.random() * 0.02 + 0.004,
      }));
    };

    const paint = () => {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        ctx.beginPath();
        ctx.fillStyle = `rgba(220,235,255,${s.a})`;
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    resize();

    // A still field of stars, no twinkle and no shooting stars.
    if (still) {
      paint();
      const onResizeStill = () => {
        resize();
        paint();
      };
      window.addEventListener('resize', onResizeStill);
      return () => window.removeEventListener('resize', onResizeStill);
    }

    window.addEventListener('resize', resize);

    let raf = 0;
    let t = 0;

    const tick = () => {
      t += 1;
      ctx.clearRect(0, 0, w, h);

      for (const s of stars) {
        const a = s.a + Math.sin(t * s.tw + s.x) * 0.22;
        ctx.beginPath();
        ctx.fillStyle = `rgba(220,235,255,${Math.max(0.04, a)})`;
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (Math.random() < 0.012 && shooters.length < 3) {
        shooters.push({
          x: Math.random() * w * 0.7,
          y: Math.random() * h * 0.45,
          vx: 5 + Math.random() * 4,
          vy: 1.6 + Math.random() * 1.5,
          life: 1,
          len: 90 + Math.random() * 130,
        });
      }

      shooters = shooters.filter((s) => {
        s.x += s.vx;
        s.y += s.vy;
        s.life -= 0.012;
        if (s.life <= 0) return false;
        const g = ctx.createLinearGradient(s.x, s.y, s.x - s.len, s.y - s.len * (s.vy / s.vx));
        g.addColorStop(0, `rgba(255,255,255,${s.life})`);
        g.addColorStop(1, 'rgba(120,180,255,0)');
        ctx.strokeStyle = g;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.len, s.y - s.len * (s.vy / s.vx));
        ctx.stroke();
        return true;
      });

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 h-full w-full" />;
}

export default function Footer() {
  return (
    <footer id="contact" className="on-dark relative overflow-hidden pt-36">
      <div className="absolute inset-0 bg-gradient-to-b from-obsidian via-[#03060e] to-[#010204]" />
      <StarField />

      {/* planet horizon glow */}
      <div
        className="pointer-events-none absolute -bottom-[78%] left-1/2 h-[150vw] w-[150vw] -translate-x-1/2 rounded-full"
        style={{
          background: 'radial-gradient(circle at 50% 16%, #123a72 0%, #071a3a 38%, #020610 66%)',
          boxShadow: '0 -24px 160px 24px rgba(77,166,255,0.30), inset 0 26px 70px 0 rgba(160,215,255,0.40)',
        }}
      />

      {/* lands the page onto the dark footer — must sit above the planet glow,
          which is large enough to cover the top edge. A no-op in dark. */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[22vh]"
        style={{ background: 'linear-gradient(180deg, rgb(var(--seam)) 0%, transparent 100%)' }}
      />

      <div className="relative mx-auto w-[min(1180px,92vw)] pb-10">
        <div className="glass glass-strong rounded-[32px] p-8 md:p-12">
          <div className="grid gap-10 md:grid-cols-[1.3fr_2fr]">
            <div>
              <div className="flex items-center gap-2.5">
                <svg viewBox="0 0 24 24" className="h-5 w-5">
                  <path d="M12 2 21 12 12 22 3 12Z" fill="none" stroke="#4da6ff" strokeWidth="1.2" strokeLinejoin="round" />
                  <path d="M12 7.5 16.5 12 12 16.5 7.5 12Z" fill="rgba(77,166,255,0.5)" />
                </svg>
                <span className="text-[13px] font-semibold tracking-wideluxe">LUXORA</span>
              </div>
              <p className="mt-5 max-w-xs text-[13px] leading-relaxed text-silver/55">
                Your life, curated by intelligence. A private concierge operating continuously
                across seven cities and every timezone between them.
              </p>

              <div className="mt-7 flex gap-2">
                {SOCIAL.map((s) => (
                  <a
                    key={s.n}
                    href="#"
                    aria-label={s.n}
                    className="group relative grid h-10 w-10 place-items-center rounded-full border border-hair/10 text-silver/60 transition-all duration-500 ease-luxe hover:-translate-y-1 hover:border-electric/50 hover:text-frost"
                  >
                    <span className="absolute inset-0 rounded-full bg-electric/0 blur-md transition-all duration-500 group-hover:bg-electric/40" />
                    <svg viewBox="0 0 24 24" className="relative h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                      <path d={s.d} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              {COLUMNS.map((c) => (
                <div key={c.h}>
                  <div className="text-[9.5px] uppercase tracking-[0.22em] text-silver/40">{c.h}</div>
                  <ul className="mt-4 space-y-2.5">
                    {c.l.map((l) => (
                      <li key={l}>
                        <a
                          href="#"
                          className="group relative inline-block text-[13px] text-silver/62 transition-colors duration-500 hover:text-frost"
                        >
                          {l}
                          <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-electric transition-all duration-500 ease-luxe group-hover:w-full" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="rule my-9" />

          <div className="flex flex-col items-center justify-between gap-4 text-[11px] text-silver/40 sm:flex-row">
            <span>© {new Date().getFullYear()} LUXORA Holdings. All rights reserved.</span>
            <div className="flex items-center gap-6">
              <a href="#" className="transition hover:text-frost">Privacy</a>
              <a href="#" className="transition hover:text-frost">Terms</a>
              <a href="mailto:partners@luxora.world" className="transition hover:text-frost">partners@luxora.world</a>
            </div>
          </div>
        </div>

        <div className="mask-fade-x mt-14 select-none overflow-hidden">
          <div className="display bg-gradient-to-b from-hair/[0.09] to-transparent bg-clip-text text-center text-[clamp(3.5rem,15vw,13rem)] tracking-tightest text-transparent">
            LUXORA
          </div>
        </div>
      </div>
    </footer>
  );
}
