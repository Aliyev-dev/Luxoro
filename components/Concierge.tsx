'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import SectionHeading from './SectionHeading';

const FIELDS = [
  { name: 'name', label: 'Full name', type: 'text', ph: 'Alexandra Reyes', autoComplete: 'name' },
  { name: 'email', label: 'Private email', type: 'email', ph: 'a.reyes@family-office.com', autoComplete: 'email' },
  { name: 'city', label: 'Primary residence', type: 'text', ph: 'Monaco', autoComplete: 'address-level2' },
] as const;

type Status = 'idle' | 'sending' | 'sent';

export default function Concierge() {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === 'sending') return;

    setStatus('sending');
    setError('');
    setFieldErrors({});

    const data = Object.fromEntries(new FormData(e.currentTarget).entries());

    try {
      const res = await fetch('/api/interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus('idle');
        setFieldErrors(json.fieldErrors ?? {});
        setError(json.error ?? 'Something went wrong. Please try again.');
        return;
      }

      setStatus('sent');
      formRef.current?.reset();
    } catch {
      setStatus('idle');
      setError('No connection. Please check your network and try again.');
    }
  }

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

          <form ref={formRef} className="mx-auto mt-12 grid max-w-xl gap-3" onSubmit={onSubmit} noValidate>
            {FIELDS.map((f) => {
              const invalid = Boolean(fieldErrors[f.name]);
              return (
                <div key={f.name}>
                  <label className="glass block rounded-2xl px-5 py-3.5 transition-shadow duration-500 focus-within:shadow-[0_0_50px_-18px_rgba(77,166,255,0.9)]">
                    <span className="block text-[9.5px] uppercase tracking-[0.2em] text-silver/45">{f.label}</span>
                    <input
                      required
                      name={f.name}
                      type={f.type}
                      placeholder={f.ph}
                      autoComplete={f.autoComplete}
                      aria-invalid={invalid}
                      aria-describedby={invalid ? `${f.name}-error` : undefined}
                      disabled={status === 'sending'}
                      className="mt-1.5 w-full bg-transparent text-[14px] text-frost outline-none placeholder:text-silver/45 disabled:opacity-60"
                    />
                  </label>
                  {invalid && (
                    <p id={`${f.name}-error`} className="mt-1.5 px-5 text-[11px] text-[#ff9b8a]">
                      {fieldErrors[f.name]}
                    </p>
                  )}
                </div>
              );
            })}

            {/* Honeypot — hidden from people, irresistible to bots. */}
            <input
              type="text"
              name="company"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden
              className="pointer-events-none absolute h-0 w-0 opacity-0"
            />

            <motion.button
              type="submit"
              whileTap={{ scale: 0.985 }}
              disabled={status !== 'idle'}
              className="btn-liquid glass btn-primary glow-border mt-3 justify-center disabled:cursor-not-allowed"
            >
              <span className="reflect" />
              {status === 'sending'
                ? 'Sending…'
                : status === 'sent'
                  ? 'Received — a partner will be in touch'
                  : 'Submit expression of interest'}
            </motion.button>

            {/* aria-live so the outcome reaches screen readers, not just eyes */}
            <p role="status" aria-live="polite" className="min-h-[1.2em] text-center text-[11.5px]">
              {error && <span className="text-[#ff9b8a]">{error}</span>}
              {status === 'sent' && (
                <span className="text-silver/70">
                  Thank you. A partner responds within seventy-two hours.
                </span>
              )}
            </p>

            <p className="text-center text-[10.5px] text-silver/45">
              Sent over an encrypted connection and used only to contact you about membership.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
