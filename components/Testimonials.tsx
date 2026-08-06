'use client';

import { motion } from 'framer-motion';
import SectionHeading from './SectionHeading';

interface T {
  quote: string;
  name: string;
  role: string;
  company: string;
  hue: number;
}

const PEOPLE: T[] = [
  { quote: 'I stopped managing my calendar in 2033. LUXORA does not ask me questions — it presents decisions that are already ninety percent made.', name: 'Adriana Vance', role: 'Founder & Chair', company: 'Halcyon Capital', hue: 212 },
  { quote: 'Three continents in nine days, zero friction, zero paperwork touched by me. My chief of staff now works on strategy instead of logistics.', name: 'Kenji Mori', role: 'Chief Executive', company: 'Mori Aerospace', hue: 336 },
  { quote: 'The security layer alone justifies it. Route hardening in Lagos and São Paulo that my own team could not have arranged in a week.', name: 'Idris Okonkwo', role: 'Managing Partner', company: 'Meridian Holdings', hue: 42 },
  { quote: 'It knows I do not eat after eleven, that I hate north-facing suites, and that my mother calls on Sundays. It has never once been wrong.', name: 'Elena Sorokina', role: 'Creative Director', company: 'Maison Sorokina', hue: 268 },
  { quote: 'We closed a nine-figure round from a cabin at forty-one thousand feet because the connectivity, the counsel and the coffee were all already there.', name: 'Marcus Deveraux', role: 'General Partner', company: 'Northlight Ventures', hue: 190 },
  { quote: 'I have used every concierge on earth. This is the first one that felt like an institution rather than a phone number.', name: 'Priya Raghunathan', role: 'Principal', company: 'Anantara Family Office', hue: 160 },
];

function Avatar({ name, hue }: { name: string; hue: number }) {
  const initials = name.split(' ').map((n) => n[0]).join('');
  return (
    <div className="relative grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full border border-white/12">
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 32% 26%, hsl(${hue} 70% 62% / 0.9), hsl(${hue + 40} 60% 22% / 0.95) 62%, #05070c 100%)`,
        }}
      />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg,rgba(255,255,255,0.28),transparent 46%)' }} />
      <span className="relative text-[12px] font-semibold tracking-wide text-white/90">{initials}</span>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="relative overflow-hidden py-28 md:py-40">
      <div className="mx-auto w-[min(1180px,92vw)]">
        <SectionHeading
          eyebrow="Clientele"
          title="Spoken of quietly, by people who rarely speak."
          align="center"
        />
      </div>

      <div className="mask-fade-x relative mt-16">
        {[0, 1].map((row) => (
          <motion.div
            key={row}
            className="flex w-max gap-4 py-2"
            animate={{ x: row === 0 ? ['0%', '-50%'] : ['-50%', '0%'] }}
            transition={{ duration: row === 0 ? 58 : 68, repeat: Infinity, ease: 'linear' }}
          >
            {[...PEOPLE, ...PEOPLE].map((p, i) => (
              <figure
                key={`${row}-${p.name}-${i}`}
                className="glass glow-border w-[min(430px,84vw)] shrink-0 rounded-[26px] p-7"
                onMouseMove={(e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
                  e.currentTarget.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
                }}
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-electric/50" fill="currentColor">
                  <path d="M9.5 6C6.5 7.6 5 10.2 5 13.8V18h5.6v-5.4H8.2c0-2 .6-3.4 2.2-4.4L9.5 6zm9 0c-3 1.6-4.5 4.2-4.5 7.8V18h5.6v-5.4h-2.4c0-2 .6-3.4 2.2-4.4L18.5 6z" />
                </svg>
                <blockquote className="mt-5 text-[14.5px] leading-relaxed text-silver/78">
                  &ldquo;{p.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-7 flex items-center gap-4">
                  <Avatar name={p.name} hue={p.hue} />
                  <div>
                    <div className="text-[13px] font-medium text-frost">{p.name}</div>
                    <div className="text-[11px] text-silver/50">
                      {p.role} · {p.company}
                    </div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
