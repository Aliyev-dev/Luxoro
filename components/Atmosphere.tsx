'use client';

import { useEffect, useRef } from 'react';

/** Cursor glow + magnetic light tracking + film grain + vignette. */
export default function Atmosphere() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const haloRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let hx = mx;
    let hy = my;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      document.documentElement.style.setProperty('--pointer-x', `${(mx / window.innerWidth) * 100}%`);
      document.documentElement.style.setProperty('--pointer-y', `${(my / window.innerHeight) * 100}%`);
    };

    const loop = () => {
      hx += (mx - hx) * 0.11;
      hy += (my - hy) * 0.11;
      if (dotRef.current) dotRef.current.style.transform = `translate3d(${mx - 3}px, ${my - 3}px, 0)`;
      if (haloRef.current) haloRef.current.style.transform = `translate3d(${hx - 190}px, ${hy - 190}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div
        ref={haloRef}
        className="pointer-events-none fixed left-0 top-0 z-[90] hidden h-[380px] w-[380px] rounded-full md:block"
        style={{
          background:
            'radial-gradient(circle, rgba(77,166,255,0.13), rgba(77,166,255,0.04) 42%, transparent 68%)',
          mixBlendMode: 'screen',
        }}
      />
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[95] hidden h-1.5 w-1.5 rounded-full bg-frost/90 md:block"
        style={{ boxShadow: '0 0 14px 4px rgba(77,166,255,0.55)' }}
      />

      {/* cinematic vignette */}
      <div
        className="pointer-events-none fixed inset-0 z-[80]"
        style={{
          background:
            'radial-gradient(125% 88% at 50% 42%, transparent 42%, rgba(0,0,0,0.42) 78%, rgba(0,0,0,0.82) 100%)',
        }}
      />

      {/* film grain */}
      <div
        className="pointer-events-none fixed inset-0 z-[85] opacity-[0.055] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: '180px 180px',
          animation: 'drift 8s steps(6) infinite',
        }}
      />
    </>
  );
}
