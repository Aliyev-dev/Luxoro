<div align="center">

# LUXORA

### Your Life. Curated by Intelligence.

A cinematic, scroll-driven website for a fictional private AI concierge —
built to feel like an Apple keynote crossed with a luxury brand from 2035.

**[▸ Live site](https://luxoro-qpjf.vercel.app)**

![Next.js](https://img.shields.io/badge/Next.js-14.2-000?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-r169-000?style=flat-square&logo=three.js)
![GSAP](https://img.shields.io/badge/GSAP-ScrollTrigger-88CE02?style=flat-square)
![Deploy](https://img.shields.io/badge/Vercel-live-000?style=flat-square&logo=vercel)

</div>

---

## What it is

A single-page experience with no third-party UI kit, no template, and no stock
video dependency. Every visual layer — the glass, the scenes, the globe, the
particles, the starfield — is generated in code.

| | |
|---|---|
| **Particle preloader** | The LUXORA wordmark is sampled pixel-by-pixel off an offscreen canvas, exploded into ~4,000 particles, then reassembled with spring physics while an ambient bar visualizer runs underneath. |
| **Liquid Glass system** | Refraction sheen that tracks the cursor per-element, conic `@property` glow borders, internal highlight edges, layered inset shadows. One CSS layer, no images. |
| **Scroll storytelling** | Five scenes — private island, hypercar, penthouse, near-space, neon megacity — pinned on a single scrubbed GSAP timeline and crossfaded with scale + blur. The site accent colour is rewritten live per scene. |
| **Interactive globe** | React Three Fiber. Fresnel atmosphere shader, lat/long wireframe, seven city nodes with expanding pulse rings, eight quadratic-bezier flight arcs each carrying a travelling light. Hover swaps the glass card and repaints the page lighting. |
| **Particle field** | Custom GLSL. Displacement runs in the vertex stage with depth-weighted mouse attraction — zero per-frame JavaScript attribute writes. |
| **AI command center** | Holographic dashboard: live sparklines, animated avatar silhouette, six orchestration modules cycling on their own clock. |
| **Starfield footer** | Canvas starfield with procedurally spawned shooting stars over a planet horizon glow. |

## Stack

```
Next.js 14 (App Router)  ·  React 18  ·  TypeScript 5.6
Tailwind CSS 3.4         ·  Framer Motion 11
GSAP 3.12 + ScrollTrigger·  Lenis 1.1 (smooth scroll)
Three.js r169 + React Three Fiber  ·  custom GLSL shaders
```

## Run locally

```bash
git clone https://github.com/liyevv5511-bot/Luxoro.git
cd Luxoro
npm install
npm run dev          # http://localhost:3000
```

```bash
npm run build && npm start   # production
```

Node 20.x. No environment variables — the site has no backend.

## Structure

```
app/
  globals.css              Liquid Glass design system + --accent runtime channel
  layout.tsx  page.tsx
components/
  Preloader.tsx            Canvas particle logo assembly
  SmoothScroll.tsx         Lenis ↔ GSAP ticker bridge
  Hero.tsx                 Mouse-reactive light, tilted floating glass panels
  ScrollScenes.tsx         Five pinned scenes, one scrubbed timeline
  Destinations.tsx         Globe section + hover city cards
  Intelligence.tsx         Holographic AI dashboard
  Experiences.tsx          Magnetic liquid-glass cards
  Testimonials.tsx         Dual-direction marquee
  Concierge.tsx  Footer.tsx  Navbar.tsx  Atmosphere.tsx
  VideoPlate.tsx           Mounts video only if the file exists
  SafeGL.tsx               WebGL error boundary
  scenes/SceneArt.tsx      Procedural SVG/CSS backdrops
  three/Globe.tsx          Earth, atmosphere shader, flight arcs
  three/ParticleField.tsx  GLSL point cloud
lib/     cities.ts  scenes.ts
hooks/   useMagnetic.ts
```

## Optional video plates

Every scene renders a procedural backdrop immediately. If you drop real footage
into `public/video/`, `VideoPlate` detects it with a `HEAD` request and crossfades
it in. Nothing breaks when the files are absent — that is the default state.

```
hero.mp4
island.mp4  hypercar.mp4  penthouse.mp4  orbit.mp4  megacity.mp4
city-tokyo.mp4  city-dubai.mp4  city-paris.mp4  city-new-york.mp4
city-singapore.mp4  city-monaco.mp4  city-london.mp4
exp-private-aviation.mp4 … exp-personal-security.mp4
```

Encode with `-c:v libx264 -crf 24 -preset slow -movflags +faststart -an` and cap
at 1920px. A 4K master on a backgrounded plate stalls first paint and buys nothing.

## Performance

- `105 kB` page / `193 kB` first load JS. Route `/` is fully static-prerendered.
- Three.js canvases are `next/dynamic` with `ssr: false` — no WebGL touches the server.
- `dpr={[1, 1.75]}` caps retina fill cost; antialiasing off on the dust field.
- Videos are `preload="metadata"` and never mount unless the file is confirmed present.
- `SafeGL` error boundary keeps a lost WebGL context from blanking the page.
- `prefers-reduced-motion` disables Lenis and collapses every animation.

## Deploy

Vercel auto-detects the App Router. No `vercel.json`, no build overrides, no env vars.

```
Framework Preset  Next.js
Build Command     next build     (default)
Output Directory  .next          (default)
Node              20.x
```

---

<div align="center">
<sub>LUXORA is a fictional brand. Names, quotes, companies and figures are invented for the design.</sub>
</div>
