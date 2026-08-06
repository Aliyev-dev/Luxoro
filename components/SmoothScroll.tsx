'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      duration: 1.25,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.92,
      touchMultiplier: 1.6,
      lerp: 0.085,
    });

    // Lenis drives window scroll natively — ScrollTrigger only needs the update
    // tick. A scrollerProxy here would double-bind the scroller and break pins.
    lenis.on('scroll', ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const onAnchor = (e: MouseEvent) => {
      const el = (e.target as HTMLElement)?.closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!el) return;
      const id = el.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -40, duration: 1.6 });
    };
    document.addEventListener('click', onAnchor);

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', onLoad);
    const refresh = setTimeout(onLoad, 600);

    return () => {
      clearTimeout(refresh);
      window.removeEventListener('load', onLoad);
      document.removeEventListener('click', onAnchor);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
