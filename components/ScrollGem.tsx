'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const SRC = '/video/gem.mp4';
const POSTER = '/video/gem-poster.jpg';

/**
 * The brand mark as a turned object. It reads as a live 3D render, but it is a
 * pre-rendered plate whose playhead is bound to scroll position — no third
 * WebGL context on top of the globe and the dust field.
 *
 * The plate is rendered on #050505 and composited with mix-blend-mode: screen,
 * which drops the black box without needing an alpha video. That only works
 * over a dark backdrop, hence .on-dark.
 */
export default function ScrollGem() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const degRef = useRef<HTMLSpanElement | null>(null);
  const barRef = useRef<HTMLSpanElement | null>(null);

  // 2.5 MB is not worth fetching for someone who never scrolls this far.
  const [armed, setArmed] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reduced) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setArmed(true);
          io.disconnect();
        }
      },
      { rootMargin: '120% 0px' }
    );
    io.observe(section);
    return () => io.disconnect();
  }, [reduced]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reduced || !armed) return;

    gsap.registerPlugin(ScrollTrigger);

    let queued = false;
    let progress = 0;

    const apply = () => {
      queued = false;
      const video = videoRef.current;
      if (degRef.current) degRef.current.textContent = `${Math.round(progress * 360)}°`;
      if (barRef.current) barRef.current.style.width = `${(progress * 100).toFixed(1)}%`;
      // HAVE_CURRENT_DATA — seeking before this silently no-ops
      if (!video || video.readyState < 2 || !video.duration) return;
      // Parking exactly on duration can land on a blank frame in some browsers.
      video.currentTime = Math.min(video.duration - 0.001, progress * video.duration);
    };

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        progress = self.progress;
        if (queued) return;
        queued = true;
        requestAnimationFrame(apply);
      },
    });

    return () => st.kill();
  }, [armed, reduced]);

  return (
    <section
      ref={sectionRef}
      id="mark"
      className="on-dark relative h-[320vh] bg-obsidian"
      // ScrollScenes and Destinations rewrite --accent on <html> as you scroll,
      // so without pinning it here this section's glow would inherit whichever
      // city was last hovered. The mark is brand blue, always.
      style={{ ['--accent' as string]: '77, 166, 255' }}
    >
      {/* lands the light page onto this dark island and back off it again —
          both are no-ops in dark, where --seam is already obsidian */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[18vh]"
        style={{ background: 'linear-gradient(180deg, rgb(var(--seam)) 0%, transparent 100%)' }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[18vh]"
        style={{ background: 'linear-gradient(0deg, rgb(var(--seam)) 0%, transparent 100%)' }}
      />

      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(42% 42% at 50% 46%, rgba(var(--accent), 0.18), transparent 70%)',
          }}
        />

        <div className="relative mx-auto grid w-[min(1180px,92vw)] items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative z-10 max-w-md">
            <div className="flex items-center gap-4">
              <span className="h-px w-10 bg-gradient-to-r from-transparent to-electric/70" />
              <span className="eyebrow">The Mark</span>
            </div>
            <h2 className="display mt-6 text-[clamp(2rem,4.4vw,3.4rem)] text-gradient">
              Cut once. Held by four hundred.
            </h2>
            <p className="mt-6 text-[15px] leading-relaxed text-silver/70">
              The LUXORA mark is issued as a single machined object, numbered to its principal
              and never reissued. Keep scrolling to turn it.
            </p>
          </div>

          <div className="relative mx-auto aspect-square w-full max-w-[560px]">
            {reduced ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={POSTER}
                alt="The LUXORA mark, a machined brilliant-cut stone"
                className="h-full w-full object-contain mix-blend-screen"
              />
            ) : (
              <>
                <img
                  src={POSTER}
                  alt=""
                  aria-hidden
                  className={`absolute inset-0 h-full w-full object-contain mix-blend-screen transition-opacity duration-700 ${
                    ready ? 'opacity-0' : 'opacity-100'
                  }`}
                />
                {armed && (
                  <video
                    ref={videoRef}
                    src={SRC}
                    poster={POSTER}
                    muted
                    playsInline
                    preload="auto"
                    aria-hidden
                    onLoadedData={() => setReady(true)}
                    className={`h-full w-full object-contain mix-blend-screen transition-opacity duration-700 ${
                      ready ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                )}
              </>
            )}
          </div>
        </div>

        {!reduced && (
          <div className="pointer-events-none absolute bottom-10 left-1/2 z-10 flex w-[min(320px,60vw)] -translate-x-1/2 flex-col gap-3">
            <div className="flex items-baseline justify-between">
              <span className="text-[9px] uppercase tracking-[0.2em] text-silver/40">Rotation</span>
              <span
                ref={degRef}
                className="text-[13px] font-semibold tabular-nums text-frost"
              >
                0°
              </span>
            </div>
            <span className="h-px w-full overflow-hidden bg-hair/12">
              <span
                ref={barRef}
                className="block h-full w-0 bg-gradient-to-r from-electric/40 via-electric to-aurum"
              />
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
