'use client';

import { Component, type ReactNode } from 'react';

/** WebGL contexts are not guaranteed. A lost context should never blank the page. */
export default class SafeGL extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    if (process.env.NODE_ENV !== 'production') console.warn('[LUXORA] WebGL layer disabled:', error);
  }

  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}
