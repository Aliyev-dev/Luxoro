export type SceneId = 'island' | 'hypercar' | 'penthouse' | 'orbit' | 'megacity';

export interface Scene {
  id: SceneId;
  index: string;
  eyebrow: string;
  title: string;
  copy: string;
  accent: string; // rgb triplet
  /** Optional mp4 dropped into /public/video — falls back to procedural WebGL/SVG art. */
  video?: string;
  stats: { k: string; v: string }[];
}

export const SCENES: Scene[] = [
  {
    id: 'island',
    index: '01',
    eyebrow: 'Scene One — Private Island',
    title: 'A coastline that answers only to you.',
    copy: 'LUXORA holds 60 private islands under standing charter. Crew, chef, security and seaplane are staged before your calendar clears.',
    accent: '90, 200, 220',
    video: '/video/island.mp4',
    stats: [
      { k: 'Islands held', v: '60' },
      { k: 'Staging time', v: '9 hrs' },
      { k: 'Crew ratio', v: '4:1' },
    ],
  },
  {
    id: 'hypercar',
    index: '02',
    eyebrow: 'Scene Two — Ground',
    title: 'Torque, delivered to the curb.',
    copy: 'A matte-obsidian hypercar, pre-configured to your seat memory and route, waiting at the terminal gate as the wheels touch down.',
    accent: '255, 96, 72',
    video: '/video/hypercar.mp4',
    stats: [
      { k: 'Fleet cities', v: '38' },
      { k: 'Curb time', v: '0 min' },
      { k: 'Marques', v: '11' },
    ],
  },
  {
    id: 'penthouse',
    index: '03',
    eyebrow: 'Scene Three — Residence',
    title: 'Glass, ninety floors above the noise.',
    copy: 'Residences that learn you. Light temperature, air, scent and acoustics recalibrate to your circadian profile before arrival.',
    accent: '196, 178, 255',
    video: '/video/penthouse.mp4',
    stats: [
      { k: 'Residences', v: '240' },
      { k: 'Avg. floor', v: '78' },
      { k: 'Recalibration', v: 'Live' },
    ],
  },
  {
    id: 'orbit',
    index: '04',
    eyebrow: 'Scene Four — Near Space',
    title: 'The thin blue line, from above it.',
    copy: 'Suborbital seats and stratospheric capsule flights, medically cleared and scheduled around your quarter — not the operator\u2019s.',
    accent: '120, 170, 255',
    video: '/video/orbit.mp4',
    stats: [
      { k: 'Altitude', v: '32 km' },
      { k: 'Operators', v: '4' },
      { k: 'Clearance', v: '6 wks' },
    ],
  },
  {
    id: 'megacity',
    index: '05',
    eyebrow: 'Scene Five — Neon Megacity',
    title: 'Midnight, with every door already open.',
    copy: 'Reservations, entrances, discretion and route security across twelve nocturnal capitals — orchestrated in a single unbroken thread.',
    accent: '255, 120, 200',
    video: '/video/megacity.mp4',
    stats: [
      { k: 'Capitals', v: '12' },
      { k: 'Venue access', v: '1,400+' },
      { k: 'Response', v: '<60 s' },
    ],
  },
];
