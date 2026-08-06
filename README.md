# LUXORA — The Future Concierge

Ultra-premium, scroll-driven concierge site. Next.js 14 App Router · TypeScript · Tailwind ·
Framer Motion · GSAP ScrollTrigger · Lenis · React Three Fiber (custom GLSL).

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Architecture

| Path | Role |
|---|---|
| `app/globals.css` | Liquid Glass design system — refraction sheen, conic glow borders, `--accent` runtime channel |
| `components/SmoothScroll.tsx` | Lenis + GSAP ticker bridge, ScrollTrigger sync, anchor interception |
| `components/Preloader.tsx` | Canvas particle logo assembly + visual audio bars |
| `components/Hero.tsx` | Mouse-reactive light, tilted floating glass panels, blur→clear video reveal |
| `components/ScrollScenes.tsx` | 5 pinned scenes crossfaded on one scrubbed ScrollTrigger timeline |
| `components/scenes/SceneArt.tsx` | Procedural SVG/CSS backdrops (island, hypercar, penthouse, orbit, megacity) |
| `components/three/Globe.tsx` | Rotating earth, fresnel atmosphere shader, city nodes, animated flight arcs |
| `components/three/ParticleField.tsx` | GLSL point cloud with depth-weighted mouse displacement |
| `components/Intelligence.tsx` | Holographic AI command center |
| `components/Experiences.tsx` | Magnetic liquid-glass cards |
| `components/Footer.tsx` | Canvas starfield, shooting stars, planet horizon glow |

## Video plates (optional)

Every scene renders a procedural backdrop immediately, then crossfades to real footage
if the file exists. Nothing breaks when it doesn't. Drop MP4s into `public/video/`:

```
hero.mp4
island.mp4  hypercar.mp4  penthouse.mp4  orbit.mp4  megacity.mp4
city-tokyo.mp4  city-dubai.mp4  city-paris.mp4  city-new-york.mp4
city-singapore.mp4  city-monaco.mp4  city-london.mp4
exp-private-aviation.mp4  exp-superyachts.mp4  ...  exp-personal-security.mp4
```

Encode `-c:v libx264 -crf 24 -preset slow -movflags +faststart -an`, cap at 1920px for
web — 4K masters stall first paint and buy nothing on a backgrounded plate.

## Performance notes

- Three.js canvases are `next/dynamic` + `ssr: false`; nothing WebGL runs during SSR.
- Particle shader does displacement in the vertex stage — no per-frame JS attribute writes.
- `dpr={[1, 1.75]}` caps retina fill cost; `antialias: false` on the dust field.
- All videos are `preload="none"` except the hero (`metadata`).
- `prefers-reduced-motion` disables Lenis and collapses every animation.

## Deploy

Vercel auto-detects the Next.js App Router — no `vercel.json`, no build overrides.

```
Framework Preset  Next.js
Build Command     next build      (default)
Output Directory  .next           (default)
Install Command   npm install     (default)
Node             20.x
```

No environment variables are required. The whole site is static-prerendered
(`○ /` in the build output) and every WebGL layer mounts client-side.
