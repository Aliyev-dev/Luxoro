'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { MotionConfig } from 'framer-motion';
import SmoothScroll from '@/components/SmoothScroll';
import Preloader from '@/components/Preloader';
import Navbar from '@/components/Navbar';
import Atmosphere from '@/components/Atmosphere';
import Hero from '@/components/Hero';
import ScrollScenes from '@/components/ScrollScenes';
import Destinations from '@/components/Destinations';
import Intelligence from '@/components/Intelligence';
import Experiences from '@/components/Experiences';
import Testimonials from '@/components/Testimonials';
import ScrollGem from '@/components/ScrollGem';
import Concierge from '@/components/Concierge';
import Footer from '@/components/Footer';
import SafeGL from '@/components/SafeGL';

const ParticleField = dynamic(() => import('@/components/three/ParticleField'), { ssr: false });

export default function Page() {
  const [ready, setReady] = useState(false);

  return (
    // One switch for every framer-motion animation on the page: with
    // reducedMotion="user" it drops transform animation for anyone whose OS
    // asks for it. The CSS rule in globals.css cannot do this — framer and
    // GSAP animate via rAF, not CSS transitions.
    <MotionConfig reducedMotion="user">
      <Preloader onDone={() => setReady(true)} />
      <Atmosphere />
      <Navbar />

      {/* site-wide interactive dust — fixed, GPU, behind everything */}
      <SafeGL>
        <ParticleField className="fixed inset-0 z-0 h-screen w-screen opacity-60" />
      </SafeGL>

      <SmoothScroll>
        <main className={`relative z-10 transition-opacity duration-1000 ${ready ? 'opacity-100' : 'opacity-0'}`}>
          <Hero />
          <ScrollScenes />
          <Destinations />
          <Intelligence />
          <Experiences />
          <Testimonials />
          <ScrollGem />
          <Concierge />
          <Footer />
        </main>
      </SmoothScroll>
    </MotionConfig>
  );
}
