/**
 * Canonical origin. Vercel exposes the deployment host but not the production
 * alias, so preview builds resolve to themselves and production is pinned.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_ENV === 'production'
    ? 'https://luxoro-qpjf.vercel.app'
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000');

export const SITE_NAME = 'LUXORA';
