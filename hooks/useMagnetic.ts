'use client';

import { useEffect, useRef } from 'react';

/** Magnetic cursor pull + liquid-glass sheen tracking on a single element. */
export function useMagnetic<T extends HTMLElement>(strength = 0.22) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;

    const loop = () => {
      cx += (tx - cx) * 0.14;
      cy += (ty - cy) * 0.14;
      el.style.transform = `translate3d(${cx.toFixed(2)}px, ${cy.toFixed(2)}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const mx = e.clientX - r.left;
      const my = e.clientY - r.top;
      el.style.setProperty('--mx', `${(mx / r.width) * 100}%`);
      el.style.setProperty('--my', `${(my / r.height) * 100}%`);
      tx = (mx - r.width / 2) * strength;
      ty = (my - r.height / 2) * strength;
    };

    const onLeave = () => {
      tx = 0;
      ty = 0;
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    raf = requestAnimationFrame(loop);

    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, [strength]);

  return ref;
}
