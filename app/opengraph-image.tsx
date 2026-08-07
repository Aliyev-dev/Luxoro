import { ImageResponse } from 'next/og';

export const alt = 'LUXORA — Your Life. Curated by Intelligence.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: '#050505',
          // Satori has no radial-gradient, so the glow is a layered linear one.
          backgroundImage:
            'linear-gradient(135deg, rgba(77,166,255,0.22) 0%, rgba(5,5,5,0) 48%),' +
            'linear-gradient(300deg, rgba(216,176,106,0.14) 0%, rgba(5,5,5,0) 42%)',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div
            style={{
              width: 30,
              height: 30,
              display: 'flex',
              border: '3px solid #4da6ff',
              transform: 'rotate(45deg)',
              borderRadius: 3,
            }}
          />
          <div style={{ color: '#f4f7fb', fontSize: 26, letterSpacing: 10, fontWeight: 600 }}>
            LUXORA
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              color: '#f4f7fb',
              fontSize: 82,
              lineHeight: 1.04,
              letterSpacing: -3,
              fontWeight: 600,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <span>Your Life.</span>
            <span style={{ color: '#8ec5ff' }}>Curated by Intelligence.</span>
          </div>
          <div style={{ color: '#8b93a1', fontSize: 27, marginTop: 30, maxWidth: 860 }}>
            A private AI concierge orchestrating travel, lifestyle, investments and
            experiences across seven cities.
          </div>
        </div>
      </div>
    ),
    size
  );
}
