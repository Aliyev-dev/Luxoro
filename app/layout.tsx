import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider, THEME_BOOTSTRAP } from '@/components/ThemeProvider';
import { SITE_NAME, SITE_URL } from '@/lib/site';

const DESCRIPTION =
  'A private AI concierge that orchestrates travel, lifestyle, investments, experiences, and luxury services across the world.';

export const metadata: Metadata = {
  // Without this, Next cannot resolve the generated OG image to an absolute
  // URL and warns on every build.
  metadataBase: new URL(SITE_URL),
  title: 'LUXORA — Your Life. Curated by Intelligence.',
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: { canonical: '/' },
  openGraph: {
    title: 'LUXORA — The Future Concierge',
    description: 'Your Life. Curated by Intelligence.',
    type: 'website',
    siteName: SITE_NAME,
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LUXORA — The Future Concierge',
    description: 'Your Life. Curated by Intelligence.',
  },
};

/** Organization markup so search engines read the brand rather than guess it. */
const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  description: DESCRIPTION,
  slogan: 'Your Life. Curated by Intelligence.',
  email: 'partners@luxora.world',
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
