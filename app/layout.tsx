import type { Metadata, Viewport } from 'next';
import './globals.css';

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
  themeColor: '#050505',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* SF Pro Display on Apple hardware; Inter served from the CDN elsewhere. */}
        <link rel="preconnect" href="https://rsms.me" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
