'use client';

import { motion } from 'framer-motion';

export default function SectionHeading({
  eyebrow,
  title,
  copy,
  align = 'left',
}: {
  eyebrow: string;
  title: string;
  copy?: string;
  align?: 'left' | 'center';
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, filter: 'blur(12px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-15%' }}
      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}
    >
      <div className={`flex items-center gap-4 ${align === 'center' ? 'justify-center' : ''}`}>
        <span className="h-px w-10 bg-gradient-to-r from-transparent to-electric/70" />
        <span className="eyebrow">{eyebrow}</span>
      </div>
      <h2 className="display mt-6 text-[clamp(2rem,4.4vw,3.6rem)] text-gradient">{title}</h2>
      {copy && <p className="mt-6 text-[15px] leading-relaxed text-silver/65">{copy}</p>}
    </motion.div>
  );
}
