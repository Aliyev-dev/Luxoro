'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type Theme = 'dark' | 'light';

export const THEME_KEY = 'luxora-theme';

/**
 * Inlined in <head> before paint so a stored light preference doesn't flash a
 * dark page first. Kept in sync with the reducer below by hand — it has to run
 * without React, so it cannot import anything.
 */
export const THEME_BOOTSTRAP = `(function(){try{var t=localStorage.getItem('${THEME_KEY}');if(t==='light')document.documentElement.classList.add('light');}catch(e){}})();`;

interface ThemeCtx {
  theme: Theme;
  isLight: boolean;
  toggle: () => void;
  setTheme: (t: Theme) => void;
}

const Ctx = createContext<ThemeCtx | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Server and first client render must agree, so start from the documented
  // default and adopt the real value once we can read the DOM.
  const [theme, setThemeState] = useState<Theme>('dark');

  useEffect(() => {
    setThemeState(document.documentElement.classList.contains('light') ? 'light' : 'dark');
  }, []);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    document.documentElement.classList.toggle('light', next === 'light');
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      /* private mode — the class is still applied, it just won't persist */
    }
  }, []);

  const toggle = useCallback(
    () => setTheme(document.documentElement.classList.contains('light') ? 'dark' : 'light'),
    [setTheme]
  );

  const value = useMemo<ThemeCtx>(
    () => ({ theme, isLight: theme === 'light', toggle, setTheme }),
    [theme, toggle, setTheme]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTheme() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}
