import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider, THEME_BOOTSTRAP } from '@/components/ThemeProvider';

export const metadata: Metadata = {
  title: 'LUXORA — Your Life. Curated by Intelligence.',
  description:
    'A private AI concierge that orchestrates travel, lifestyle, investments, experiences, and luxury services across the world.',
  openGraph: {
    title: 'LUXORA — The Future Concierge',
    description: 'Your Life. Curated by Intelligence.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#050505' },
    { media: '(prefers-color-scheme: light)', color: '#f0f3f8' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Applies a stored .light preference before first paint. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} />
        {/* SF Pro Display on Apple hardware; Inter served from the CDN elsewhere. */}
        <link rel="preconnect" href="https://rsms.me" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
