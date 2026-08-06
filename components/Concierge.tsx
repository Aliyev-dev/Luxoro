'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import SectionHeading from './SectionHeading';

export default function Concierge() {
  const [sent, setSent] = useState(false);

  return (
    <section id="concierge" className="relative overflow-hidden py-28 md:py-40">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(46% 40% at 50% 50%, rgba(216,176,106,0.08), transparent 70%)' }}
      />
      <div className="relative mx-auto w-[min(920px,92vw)]">
        <div className="glass glass-strong glow-border rounded-[34px] p-8 md:p-14">
          <SectionHeading
            eyebrow="Membership"
            title="Access is granted, never purchased."
            copy="LUXORA admits 400 principals per year. Submit an expression of interest — a partner responds within seventy-two hours."
            align="center"
          />

          <form
            className="mx-auto mt-12 grid max-w-xl gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            {[
              { name: 'name', label: 'Full name', type: 'text', ph: 'Alexandra Reyes' },
              { name: 'email', label: 'Private email', type: 'email', ph: 'a.reyes@family-office.com' },
              { name: 'city', label: 'Primary residence', type: 'text', ph: 'Monaco' },
            ].map((f) => (
              <label key={f.name} className="glass block rounded-2xl px-5 py-3.5 transition-shadow duration-500 focus-within:shadow-[0_0_50px_-18px_rgba(77,166,255,0.9)]">
                <span className="block text-[9.5px] uppercase tracking-[0.2em] text-silver/45">{f.label}</span>
                <input
                  required
                  name={f.name}
                  type={f.type}
                  placeholder={f.ph}
                  className="mt-1.5 w-full bg-transparent text-[14px] text-frost outline-none placeholder:text-silver/25"
                />
              </label>
            ))}

            <motion.button
              type="submit"
              whileTap={{ scale: 0.985 }}
              className="btn-liquid glass btn-primary glow-border mt-3 justify-center"
            >
              <span className="reflect" />
              {sent ? 'Received — a partner will contact you' : 'Submit expression of interest'}
            </motion.button>

            <p className="mt-2 text-center text-[10.5px] text-silver/35">
              Encrypted end-to-end. Never shared. Reviewed by two partners.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
