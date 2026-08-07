import { NextResponse } from 'next/server';

/**
 * Membership enquiries from the concierge form.
 *
 * Delivery goes through Resend's REST API rather than its SDK so this adds no
 * dependency. Set RESEND_API_KEY and INTEREST_TO_EMAIL to enable it; without
 * them the route reports 501 rather than pretending the message was sent.
 */

export const runtime = 'nodejs';

const MAX_LEN = { name: 120, email: 254, city: 120 } as const;

/** Deliberately loose — the only real check that matters is deliverability. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

interface Body {
  name?: unknown;
  email?: unknown;
  city?: unknown;
  /** Honeypot: real people leave this empty because it is hidden. */
  company?: unknown;
}

/**
 * In-memory, per-instance throttle. Serverless instances are recycled and not
 * shared, so this trims casual abuse rather than a determined flood — put a
 * WAF rule in front if that becomes a concern.
 */
const HITS = new Map<string, number[]>();
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (HITS.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    HITS.set(ip, recent);
    return true;
  }
  recent.push(now);
  HITS.set(ip, recent);
  if (HITS.size > 5000) HITS.clear();
  return false;
}

function clean(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

export async function POST(request: Request) {
  let body: Body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Malformed request.' }, { status: 400 });
  }

  // Bots fill every field they find, including the hidden one.
  if (clean(body.company, 200)) {
    return NextResponse.json({ ok: true });
  }

  const name = clean(body.name, MAX_LEN.name);
  const email = clean(body.email, MAX_LEN.email);
  const city = clean(body.city, MAX_LEN.city);

  const fieldErrors: Record<string, string> = {};
  if (!name) fieldErrors.name = 'Please enter your name.';
  if (!email) fieldErrors.email = 'Please enter an email address.';
  else if (!EMAIL.test(email)) fieldErrors.email = 'That email address looks incomplete.';
  if (!city) fieldErrors.city = 'Please enter your primary residence.';

  if (Object.keys(fieldErrors).length) {
    return NextResponse.json({ error: 'Please check the form.', fieldErrors }, { status: 422 });
  }

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';

  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many enquiries from this connection. Try again later.' },
      { status: 429 }
    );
  }

  const key = process.env.RESEND_API_KEY;
  const to = process.env.INTEREST_TO_EMAIL;
  const from = process.env.INTEREST_FROM_EMAIL ?? 'LUXORA <onboarding@resend.dev>';

  if (!key || !to) {
    console.warn('[interest] RESEND_API_KEY / INTEREST_TO_EMAIL missing — enquiry not delivered');
    return NextResponse.json(
      { error: 'The enquiry desk is not connected yet. Please email partners@luxora.world.' },
      { status: 501 }
    );
  }

  const escape = (s: string) =>
    s.replace(/[&<>"']/g, (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string
    );

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `Expression of interest — ${name}`,
        html:
          `<p><strong>Name:</strong> ${escape(name)}</p>` +
          `<p><strong>Email:</strong> ${escape(email)}</p>` +
          `<p><strong>Primary residence:</strong> ${escape(city)}</p>`,
      }),
    });

    if (!res.ok) {
      console.error('[interest] resend responded', res.status, await res.text());
      return NextResponse.json(
        { error: 'We could not send that just now. Please try again shortly.' },
        { status: 502 }
      );
    }
  } catch (err) {
    console.error('[interest] delivery failed', err);
    return NextResponse.json(
      { error: 'We could not send that just now. Please try again shortly.' },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
