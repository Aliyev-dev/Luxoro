'use client';

import { useEffect, useState } from 'react';

export interface RenderGate {
  /** The element is on (or near) screen and the tab is visible. */
  active: boolean;
  /** The viewer asked for reduced motion — render one frame, then hold. */
  still: boolean;
}

/**
 * Decides whether a WebGL canvas should keep rendering.
 *
 * Both canvases used to run `frameloop="always"` for the life of the page, so
 * they burned GPU while scrolled past or while the tab sat in the background.
 * Feed the result into R3F's frameloop: 'always' | 'demand' | 'never'.
 */
export function useRenderGate(ref: React.RefObject<HTMLElement | null>): RenderGate {
  const [onScreen, setOnScreen] = useState(true);
  const [visible, setVisible] = useState(true);
  const [still, setStill] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setStill(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    const onVisibility = () => setVisible(!document.hidden);
    onVisibility();
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      // A margin so the scene is already running by the time it scrolls in.
      { rootMargin: '25% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);

  return { active: onScreen && visible, still };
}
