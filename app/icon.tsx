import { ImageResponse } from 'next/og';

export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

/**
 * The mark drawn with a rotated square rather than an SVG path — Satori only
 * supports a subset of SVG, and plain boxes render identically everywhere.
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#050505',
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '4px solid #4da6ff',
            transform: 'rotate(45deg)',
            borderRadius: 3,
          }}
        >
          <div style={{ width: 12, height: 12, background: '#4da6ff', borderRadius: 1 }} />
        </div>
      </div>
    ),
    size
  );
}
