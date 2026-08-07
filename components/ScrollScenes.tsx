'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SCENES } from '@/lib/scenes';
import SceneArt from './scenes/SceneArt';
import VideoPlate from './VideoPlate';

export default function ScrollScenes() {
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const wrap = wrapRef.current;
    if (!wrap) return;

    // Keep the pin so every scene stays reachable, but drop the push-in, the
    // scale and the blur — the crossfade alone carries the sequence.
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /**
     * These panels are full-viewport. Animating `filter: blur()` on them meant
     * re-rasterising the whole scene every scrub frame — measured at roughly
     * half of all dropped frames on the page. Opacity and scale are handled by
     * the compositor, so the crossfade costs almost nothing; the blur stays on
     * the copy block below, which is small enough to be cheap.
     */
    const enter = still ? { autoAlpha: 0 } : { autoAlpha: 0, scale: 1.14 };
    const shown = still ? { autoAlpha: 1 } : { autoAlpha: 1, scale: 1 };
    const leave = still ? { autoAlpha: 0 } : { autoAlpha: 0, scale: 0.94 };

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>('[data-scene]');
      const total = panels.length;

      gsap.set(panels, enter);
      gsap.set(panels[0], shown);

      let live = -1;
      /**
       * Drives both the accent colour and which scene is allowed to animate.
       * Reading it off the pinned timeline's own progress rather than separate
       * triggers: a trigger anchored to a pinned element resolves against a
       * shifting coordinate space, and the per-panel ones this replaces never
       * fired past the first scene.
       */
      const setLive = (progress: number) => {
        const i = Math.min(total - 1, Math.max(0, Math.floor(progress * total)));
        if (i === live) return;
        live = i;
        panels.forEach((p, n) => p.toggleAttribute('data-live', n === i));
        document.documentElement.style.setProperty('--accent', SCENES[i].accent);
      };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap,
          start: 'top top',
          end: () => `+=${total * 110}%`,
          scrub: 1.1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => setLive(self.progress),
          onRefresh: (self) => setLive(self.progress),
        },
      });

      setLive(0);

      panels.forEach((panel, i) => {
        const art = panel.querySelector('[data-art]');
        const copy = panel.querySelectorAll('[data-copy] > *');

        // slow cinematic push-in across the whole scene
        if (!still) tl.to(art, { scale: 1.16, yPercent: -5, ease: 'none', duration: 1 }, i);

        tl.fromTo(
          copy,
          still ? { autoAlpha: 0 } : { y: 44, autoAlpha: 0, filter: 'blur(10px)' },
          still
            ? { autoAlpha: 1, stagger: 0.06, duration: 0.28 }
            : { y: 0, autoAlpha: 1, filter: 'blur(0px)', stagger: 0.06, duration: 0.28, ease: 'power2.out' },
          i
        );
        tl.to(
          copy,
          still
            ? { autoAlpha: 0, duration: 0.22 }
            : { y: -34, autoAlpha: 0, filter: 'blur(8px)', duration: 0.22, ease: 'power2.in' },
          i + 0.74
        );

        if (i < total - 1) {
          tl.to(panel, { ...leave, duration: 0.34, ease: 'power2.inOut' }, i + 0.66);
          tl.fromTo(
            panels[i + 1],
            enter,
            { ...shown, duration: 0.34, ease: 'power2.inOut' },
            i + 0.66
          );
        }
      });

    }, wrap);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={wrapRef} className="on-dark relative h-[100svh] overflow-hidden">
      {SCENES.map((s) => (
        <article
          key={s.id}
          data-scene={s.id}
          className="absolute inset-0 will-change-[opacity,transform]"
        >
          <div data-art className="absolute inset-0 gpu">
            <SceneArt id={s.id} />
            {s.video && <VideoPlate src={s.video} fadeTo={1} />}
            <div className="absolute inset-0 bg-gradient-to-r from-obsidian/92 via-obsidian/35 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-obsidian/60" />
          </div>

          <div className="relative z-10 mx-auto flex h-full w-[min(1180px,92vw)] items-center">
            <div data-copy className="max-w-xl">
              <div className="flex items-center gap-4">
                <span
                  className="text-[11px] font-semibold tracking-wideluxe"
                  style={{ color: `rgb(${s.accent})` }}
                >
                  {s.index}
                </span>
                <span className="h-px w-14" style={{ background: `rgb(${s.accent})` }} />
                <span className="eyebrow !text-silver/60">{s.eyebrow}</span>
              </div>

              <h2 className="display mt-7 text-[clamp(2rem,4.6vw,3.9rem)] text-frost">{s.title}</h2>

              <p className="mt-6 max-w-md text-[15px] leading-relaxed text-silver/70">{s.copy}</p>

              <div className="mt-10 grid max-w-md grid-cols-3 gap-3">
                {s.stats.map((st) => (
                  <div key={st.k} className="glass rounded-2xl px-4 py-3.5">
                    <div className="text-[18px] font-semibold text-frost">{st.v}</div>
                    <div className="mt-1 text-[9.5px] uppercase tracking-[0.2em] text-silver/50">{st.k}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </article>
      ))}

      <div className="pointer-events-none absolute bottom-8 right-8 z-20 hidden flex-col gap-2 md:flex">
        {SCENES.map((s) => (
          <span key={s.id} className="h-6 w-px bg-hair/12" style={{ boxShadow: `0 0 8px rgba(${s.accent},0.4)` }} />
        ))}
      </div>
    </section>
  );
}
