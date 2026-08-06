import type { Config } from 'tailwindcss';

const config: Config = {
  // The page is dark by default and opts *into* .light, so `dark:` variants
  // must match "no .light on the root" rather than a .dark class.
  darkMode: ['selector', ':root:not(.light)'],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Fixed: only used as scrims over night imagery, never as the page.
        obsidian: '#050505',
        graphite: '#0d0f12',
        midnight: '#080d1a',
        // Theme-aware: resolved from the tokens in globals.css, so these also
        // flip inside a .on-dark island regardless of the page theme.
        silver: 'rgb(var(--ink-dim) / <alpha-value>)',
        frost: 'rgb(var(--ink) / <alpha-value>)',
        electric: 'rgb(var(--electric) / <alpha-value>)',
        aurum: 'rgb(var(--aurum) / <alpha-value>)',
        /** Hairlines and subtle surface fills — white on dark, ink on light. */
        hair: 'rgb(var(--hair) / <alpha-value>)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'SF Pro Display', 'Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.045em',
        editorial: '-0.03em',
        wideluxe: '0.34em',
      },
      transitionTimingFunction: {
        luxe: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      animation: {
        breathe: 'breathe 7s ease-in-out infinite',
        drift: 'drift 26s linear infinite',
        shimmer: 'shimmer 3.4s linear infinite',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.55' },
          '50%': { transform: 'scale(1.06)', opacity: '0.9' },
        },
        drift: {
          '0%': { transform: 'translate3d(-4%, 0, 0)' },
          '50%': { transform: 'translate3d(4%, -3%, 0)' },
          '100%': { transform: 'translate3d(-4%, 0, 0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
