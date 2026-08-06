'use client';

import type { SceneId } from '@/lib/scenes';

/**
 * Procedural cinematic backdrops. These render immediately with zero network
 * cost and act as the poster layer beneath any /public/video/*.mp4 the client
 * drops in later — so the site is never blocked on 4K footage.
 */

const Grain = () => (
  <div
    className="absolute inset-0 opacity-[0.07] mix-blend-overlay"
    style={{
      backgroundImage:
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E\")",
    }}
  />
);

function Island() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#03080c]">
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg,#061a24 0%,#0a2b38 34%,#04121a 62%,#020609 100%)',
        }}
      />
      <div
        className="absolute left-1/2 top-[34%] h-[46vw] w-[46vw] -translate-x-1/2 -translate-y-1/2 rounded-full animate-breathe"
        style={{ background: 'radial-gradient(circle,rgba(255,214,170,0.42),transparent 62%)', filter: 'blur(30px)' }}
      />
      <svg className="absolute inset-x-0 bottom-0 h-[62%] w-full" viewBox="0 0 1440 600" preserveAspectRatio="none">
        <defs>
          <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0e4d5e" />
            <stop offset="100%" stopColor="#02090d" />
          </linearGradient>
        </defs>
        <path d="M0 210 Q 300 150 620 208 T 1440 190 V600 H0Z" fill="url(#sea)" />
        {Array.from({ length: 16 }).map((_, i) => (
          <path
            key={i}
            d={`M0 ${240 + i * 22} Q 360 ${228 + i * 22} 720 ${242 + i * 22} T 1440 ${232 + i * 22}`}
            stroke="rgba(180,240,255,0.10)"
            strokeWidth="1"
            fill="none"
          />
        ))}
        <path d="M470 214 q 90 -78 190 -6 q 80 -54 150 6 z" fill="#03151b" />
        <path d="M470 214 q 90 -78 190 -6 q 80 -54 150 6 z" fill="rgba(255,214,170,0.07)" />
      </svg>
      <Grain />
    </div>
  );
}

function Hypercar() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#040404]">
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(90% 60% at 50% 62%,#181a1f 0%,#050506 62%,#000 100%)' }}
      />
      {Array.from({ length: 22 }).map((_, i) => (
        <span
          key={i}
          className="absolute h-px"
          style={{
            top: `${8 + i * 4.2}%`,
            left: '-30%',
            width: `${30 + ((i * 17) % 60)}%`,
            background: `linear-gradient(90deg,transparent,rgba(255,${120 + i * 4},90,${0.1 + (i % 5) * 0.09}),transparent)`,
            filter: 'blur(1px)',
            animation: `drift ${5 + (i % 6)}s linear infinite`,
            animationDelay: `${i * 0.19}s`,
          }}
        />
      ))}
      <svg className="absolute inset-x-0 bottom-[16%] mx-auto w-[86%]" viewBox="0 0 1200 320">
        <defs>
          <linearGradient id="car" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#26282d" />
            <stop offset="60%" stopColor="#0b0c0e" />
            <stop offset="100%" stopColor="#000" />
          </linearGradient>
        </defs>
        <path
          d="M60 250 L150 250 Q190 186 300 176 L470 158 Q600 92 760 128 L930 168 Q1080 186 1130 246 L1140 258 Q1100 274 1020 272 L180 272 Q80 272 60 250Z"
          fill="url(#car)"
          stroke="rgba(255,255,255,0.16)"
          strokeWidth="1"
        />
        <path d="M500 158 Q620 108 748 136 L800 152 L520 166Z" fill="rgba(140,190,255,0.16)" />
        <ellipse cx="290" cy="272" rx="72" ry="16" fill="rgba(255,110,70,0.30)" />
        <ellipse cx="930" cy="272" rx="72" ry="16" fill="rgba(255,110,70,0.30)" />
        <rect x="1040" y="196" width="96" height="7" rx="3.5" fill="rgba(255,70,50,0.9)" />
      </svg>
      <div
        className="absolute inset-x-0 bottom-0 h-[26%]"
        style={{ background: 'linear-gradient(0deg,rgba(255,90,60,0.14),transparent)' }}
      />
      <Grain />
    </div>
  );
}

function Penthouse() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#05070c]">
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg,#101a33 0%,#070b16 46%,#020306 100%)' }}
      />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        {[
          { x: 80, w: 190, h: 640 },
          { x: 300, w: 150, h: 780 },
          { x: 480, w: 230, h: 540 },
          { x: 740, w: 170, h: 720 },
          { x: 940, w: 210, h: 620 },
          { x: 1180, w: 180, h: 800 },
        ].map((b, i) => (
          <g key={i}>
            <rect x={b.x} y={900 - b.h} width={b.w} height={b.h} fill="#080c15" stroke="rgba(150,180,255,0.14)" />
            {Array.from({ length: Math.floor(b.h / 40) }).map((_, r) =>
              Array.from({ length: Math.floor(b.w / 34) }).map((__, c) => (
                <rect
                  key={`${r}-${c}`}
                  x={b.x + 10 + c * 34}
                  y={900 - b.h + 16 + r * 40}
                  width="18"
                  height="22"
                  fill={`rgba(${170 + ((r * c) % 60)},200,255,${((r * 7 + c * 13 + i * 5) % 10) / 22})`}
                />
              ))
            )}
            <rect
              x={b.x}
              y={900 - b.h}
              width={b.w}
              height={b.h}
              fill="url(#refl)"
              className="mix-blend-screen"
            />
          </g>
        ))}
        <defs>
          <linearGradient id="refl" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.16)" />
            <stop offset="38%" stopColor="rgba(255,255,255,0)" />
            <stop offset="72%" stopColor="rgba(196,178,255,0.14)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            <animate attributeName="x1" values="-1;1;-1" dur="12s" repeatCount="indefinite" />
          </linearGradient>
        </defs>
      </svg>
      <Grain />
    </div>
  );
}

function Orbit() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      {Array.from({ length: 130 }).map((_, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            top: `${(i * 37) % 100}%`,
            left: `${(i * 61) % 100}%`,
            width: `${1 + (i % 3) * 0.6}px`,
            height: `${1 + (i % 3) * 0.6}px`,
            opacity: 0.18 + ((i % 9) / 16),
            animation: `breathe ${3 + (i % 6)}s ease-in-out infinite`,
            animationDelay: `${i * 0.05}s`,
          }}
        />
      ))}
      <div
        className="absolute -bottom-[62%] left-1/2 h-[130vw] w-[130vw] -translate-x-1/2 rounded-full"
        style={{
          background: 'radial-gradient(circle at 50% 22%,#1b4a8f 0%,#0a2350 42%,#040d1e 70%)',
          boxShadow: '0 -30px 140px 30px rgba(90,160,255,0.34)',
        }}
      />
      <div
        className="absolute -bottom-[62%] left-1/2 h-[130vw] w-[130vw] -translate-x-1/2 rounded-full"
        style={{ boxShadow: 'inset 0 30px 80px 0 rgba(150,215,255,0.45)' }}
      />
      <Grain />
    </div>
  );
}

function Megacity() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#04030a]">
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg,#25093f 0%,#0b0620 44%,#030209 100%)' }}
      />
      <div
        className="absolute inset-0 animate-drift"
        style={{
          background:
            'radial-gradient(40% 30% at 22% 62%,rgba(255,60,180,0.30),transparent 70%),radial-gradient(36% 28% at 78% 54%,rgba(60,220,255,0.26),transparent 70%)',
          filter: 'blur(20px)',
        }}
      />
      <svg className="absolute inset-x-0 bottom-0 h-[70%] w-full" viewBox="0 0 1440 620" preserveAspectRatio="none">
        {Array.from({ length: 26 }).map((_, i) => {
          const w = 30 + ((i * 23) % 60);
          const h = 120 + ((i * 71) % 400);
          const x = i * 56;
          return (
            <g key={i}>
              <rect x={x} y={620 - h} width={w} height={h} fill="#070512" stroke="rgba(255,80,190,0.20)" />
              <rect x={x + 4} y={620 - h + 8} width={w - 8} height="4" fill="rgba(80,230,255,0.55)" />
              <rect
                x={x + 4}
                y={620 - h + 22}
                width={(w - 8) * 0.6}
                height="3"
                fill="rgba(255,80,190,0.6)"
              />
            </g>
          );
        })}
      </svg>
      {Array.from({ length: 14 }).map((_, i) => (
        <span
          key={i}
          className="absolute h-[2px] rounded-full"
          style={{
            bottom: `${6 + (i % 5) * 5}%`,
            left: '-15%',
            width: `${40 + ((i * 13) % 40)}px`,
            background: i % 2 ? 'rgba(255,90,190,0.9)' : 'rgba(90,225,255,0.9)',
            filter: 'blur(1px)',
            animation: `drift ${3.4 + (i % 5) * 0.7}s linear infinite`,
            animationDelay: `${i * 0.4}s`,
          }}
        />
      ))}
      <Grain />
    </div>
  );
}

const MAP: Record<SceneId, () => JSX.Element> = {
  island: Island,
  hypercar: Hypercar,
  penthouse: Penthouse,
  orbit: Orbit,
  megacity: Megacity,
};

export default function SceneArt({ id }: { id: SceneId }) {
  const C = MAP[id];
  return <C />;
}
