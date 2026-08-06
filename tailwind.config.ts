import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: '#050505',
        graphite: '#0d0f12',
        midnight: '#080d1a',
        silver: '#b9c0cc',
        frost: '#f4f7fb',
        electric: '#4da6ff',
        aurum: '#d8b06a',
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
