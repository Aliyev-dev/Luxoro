'use client';

import { motion } from 'framer-motion';
import SectionHeading from './SectionHeading';
import { useMagnetic } from '@/hooks/useMagnetic';
import VideoPlate from './VideoPlate';

interface Card {
  title: string;
  copy: string;
  tag: string;
  accent: string;
  icon: JSX.Element;
}

const I = (d: string) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
    <path d={d} />
  </svg>
);

const CARDS: Card[] = [
  { title: 'Private Aviation', tag: 'Wheels-up 90 min', accent: '77,166,255', copy: 'A managed fleet of 42 heavy and ultra-long-range airframes with crew on rolling standby.', icon: I('M2 14l20-8-8 20-2.5-8L2 14z') },
  { title: 'Superyachts', tag: '37 hulls', accent: '90,220,220', copy: 'Charter and full-ownership management, crewed and provisioned to your standing profile.', icon: I('M3 18h18l-3 3H6l-3-3zM12 3v12M12 6l7 9H5l7-9z') },
  { title: 'Luxury Villas', tag: '240 residences', accent: '196,178,255', copy: 'Estates that pre-tune light, air, scent and acoustics before your wheels touch the tarmac.', icon: I('M3 11l9-7 9 7v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-9z') },
  { title: 'Michelin Dining', tag: '1,400 tables', accent: '255,140,120', copy: 'Standing access to counters that do not publish a reservation line at all.', icon: I('M6 3v8a3 3 0 0 0 6 0V3M9 11v10M17 3c-1.5 2-2 4-2 7v11') },
  { title: 'Hypercars', tag: '11 marques', accent: '255,96,72', copy: 'Curbside delivery configured to your seat memory, route and preferred drive mode.', icon: I('M4 16l1.6-5A3 3 0 0 1 8.5 9h7a3 3 0 0 1 2.9 2L20 16M4 16h16v3H4v-3zM7 19v1M17 19v1') },
  { title: 'Exclusive Events', tag: '380 per year', accent: '216,176,106', copy: 'Paddock, backstage, front row and after-hours — arranged without your name on a list.', icon: I('M12 3l2.6 5.6 6.1.8-4.5 4.2 1.2 6.1L12 16.8 6.6 19.7l1.2-6.1L3.3 9.4l6.1-.8L12 3z') },
  { title: 'Space Travel', tag: '32 km apogee', accent: '120,170,255', copy: 'Suborbital and stratospheric seats, medically cleared and scheduled around your quarter.', icon: I('M4.5 19.5c3-1 5-2.5 7-4.5s3.5-4 4.5-7c-3 1-5 2.5-7 4.5s-3.5 4-4.5 7zM14 6.5a3 3 0 1 0 3.5 3.5') },
  { title: 'Personal Security', tag: '<60 s response', accent: '150,200,255', copy: 'Route hardening, close protection and digital counter-surveillance in twelve capitals.', icon: I('M12 3l8 3v6c0 5-3.4 8.2-8 9-4.6-.8-8-4-8-9V6l8-3z') },
];

function GlassCard({ card, i }: { card: Card; i: number }) {
  const ref = useMagnetic<HTMLDivElement>(0.16);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, filter: 'blur(14px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-12%' }}
      transition={{ delay: (i % 4) * 0.07, duration: 1, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        ref={ref}
        className="glass glow-border group relative h-full rounded-[26px] p-6 transition-shadow duration-700 ease-luxe hover:shadow-[0_40px_90px_-40px_rgba(0,0,0,1)]"
        style={{ ['--accent' as string]: card.accent }}
      >
        {/* video thumbnail slot */}
        <VideoPlate
          src={`/video/exp-${card.title.toLowerCase().replace(/\s+/g, '-')}.mp4`}
          className="pointer-events-none"
          fadeTo={0.18}
        />

        <div
          className="pointer-events-none absolute -inset-px rounded-[26px] opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          style={{ background: `radial-gradient(60% 50% at var(--mx,50%) var(--my,50%), rgba(${card.accent},0.16), transparent 70%)` }}
        />

        <div className="relative flex h-full flex-col">
          <div
            className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 p-2.5 transition-all duration-700 group-hover:scale-110"
            style={{ color: `rgb(${card.accent})`, boxShadow: `0 0 0 0 rgba(${card.accent},0)` }}
          >
            {card.icon}
          </div>

          <h3 className="mt-6 text-[17px] font-medium tracking-editorial text-frost">{card.title}</h3>
          <p className="mt-3 flex-1 text-[13px] leading-relaxed text-silver/60">{card.copy}</p>

          <div className="mt-7 flex items-center justify-between">
            <span
              className="rounded-full px-2.5 py-1 text-[10px] tracking-[0.14em]"
              style={{ background: `rgba(${card.accent},0.12)`, color: `rgb(${card.accent})` }}
            >
              {card.tag}
            </span>
            <span className="translate-x-0 text-silver/40 transition-transform duration-700 ease-luxe group-hover:translate-x-1.5 group-hover:text-frost">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Experiences() {
  return (
    <section id="experiences" className="relative py-28 md:py-40">
      <div className="mx-auto w-[min(1180px,92vw)]">
        <SectionHeading
          eyebrow="Experiences"
          title="Eight desks. One private number."
          copy="Every category below is staffed by a dedicated desk and modelled by the same intelligence layer — so nothing is ever handed off twice."
        />
        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CARDS.map((c, i) => (
            <GlassCard key={c.title} card={c} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
