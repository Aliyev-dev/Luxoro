'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from './ThemeProvider';

const LINKS = [
  { label: 'Experiences', href: '#experiences' },
  { label: 'Destinations', href: '#destinations' },
  { label: 'Intelligence', href: '#intelligence' },
  { label: 'Concierge', href: '#concierge' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { isLight, toggle } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    // Positioning stays on a plain element: Framer writes an inline transform
    // for the entry animation (and `none` once it settles), which would
    // otherwise wipe out the -translate-x-1/2 that centres the bar.
    <header className="fixed left-1/2 top-4 z-[120] w-[min(1180px,94vw)] -translate-x-1/2">
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 2.4, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      >
        <nav
          className={`glass glow-border flex items-center justify-between rounded-full px-5 py-3 transition-all duration-700 ease-luxe md:px-7 ${
            scrolled ? 'glass-strong py-2.5' : ''
          }`}
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            e.currentTarget.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
            e.currentTarget.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
          }}
        >
          <a href="#top" className="group flex items-center gap-2.5 text-frost">
            <span className="relative grid h-7 w-7 place-items-center">
              <span className="absolute inset-0 rounded-full bg-electric/25 blur-[10px] transition group-hover:bg-electric/50" />
              <svg viewBox="0 0 24 24" className="relative h-5 w-5">
                <path
                  d="M12 2 21 12 12 22 3 12Z"
                  fill="none"
                  stroke="url(#lg)"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                />
                <path d="M12 7.5 16.5 12 12 16.5 7.5 12Z" fill="rgba(77,166,255,0.55)" />
                <defs>
                  <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
                    {/* currentColor keeps the mark legible on a light nav bar */}
                    <stop offset="0%" stopColor="currentColor" />
                    <stop offset="100%" stopColor="rgb(var(--electric))" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
            <span className="text-[13px] font-semibold tracking-wideluxe">LUXORA</span>
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="group relative block rounded-full px-4 py-2 text-[12.5px] text-silver transition-colors duration-500 hover:text-frost"
                >
                  <span className="absolute inset-0 scale-90 rounded-full bg-hair/[0.06] opacity-0 transition-all duration-500 ease-luxe group-hover:scale-100 group-hover:opacity-100" />
                  <span className="relative">{l.label}</span>
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <button
              aria-label={isLight ? 'Switch to dark appearance' : 'Switch to light appearance'}
              aria-pressed={isLight}
              onClick={toggle}
              className="grid h-9 w-9 place-items-center rounded-full border border-hair/15 text-silver transition hover:border-electric/40 hover:text-frost"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.4">
                {isLight ? (
                  <>
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19" />
                  </>
                ) : (
                  <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" />
                )}
              </svg>
            </button>

            <a href="#concierge" className="btn-liquid glass btn-primary hidden !px-5 !py-2.5 !text-[12.5px] sm:inline-flex">
              <span className="reflect" />
              Request Access
            </a>

            <button
              aria-label="Menu"
              onClick={() => setOpen((v) => !v)}
              className="grid h-9 w-9 place-items-center rounded-full border border-hair/10 md:hidden"
            >
              <span className="flex flex-col gap-[5px]">
                <span className={`h-px w-4 bg-frost transition ${open ? 'translate-y-[3px] rotate-45' : ''}`} />
                <span className={`h-px w-4 bg-frost transition ${open ? '-translate-y-[3px] -rotate-45' : ''}`} />
              </span>
            </button>
          </div>
        </nav>

        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass glass-strong mt-2 overflow-hidden rounded-3xl p-2 md:hidden"
          >
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-2xl px-4 py-3 text-sm text-silver transition hover:bg-hair/5 hover:text-frost"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </motion.ul>
        )}
      </motion.div>
    </header>
  );
}
