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

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>('[data-scene]');
      const total = panels.length;

      gsap.set(panels, { autoAlpha: 0, scale: 1.14, filter: 'blur(18px)' });
      gsap.set(panels[0], { autoAlpha: 1, scale: 1, filter: 'blur(0px)' });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap,
          start: 'top top',
          end: () => `+=${total * 110}%`,
          scrub: 1.1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      panels.forEach((panel, i) => {
        const art = panel.querySelector('[data-art]');
        const copy = panel.querySelectorAll('[data-copy] > *');

        // slow cinematic push-in across the whole scene
        tl.to(art, { scale: 1.16, yPercent: -5, ease: 'none', duration: 1 }, i);
        tl.fromTo(
          copy,
          { y: 44, autoAlpha: 0, filter: 'blur(10px)' },
          { y: 0, autoAlpha: 1, filter: 'blur(0px)', stagger: 0.06, duration: 0.28, ease: 'power2.out' },
          i
        );
        tl.to(copy, { y: -34, autoAlpha: 0, filter: 'blur(8px)', duration: 0.22, ease: 'power2.in' }, i + 0.74);

        if (i < total - 1) {
          tl.to(panel, { autoAlpha: 0, scale: 0.94, filter: 'blur(20px)', duration: 0.34, ease: 'power2.inOut' }, i + 0.66);
          tl.fromTo(
            panels[i + 1],
            { autoAlpha: 0, scale: 1.14, filter: 'blur(18px)' },
            { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 0.34, ease: 'power2.inOut' },
            i + 0.66
          );
        }
      });

      // accent lighting follows the active scene
      panels.forEach((panel, i) => {
        ScrollTrigger.create({
          trigger: wrap,
          start: () => `top+=${i * window.innerHeight * 1.1} top`,
          end: () => `top+=${(i + 1) * window.innerHeight * 1.1} top`,
          onToggle: (self) => {
            if (!self.isActive) return;
            document.documentElement.style.setProperty('--accent', SCENES[i].accent);
          },
        });
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
