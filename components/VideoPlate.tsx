'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Only mounts a <video> once the file is confirmed present. Without this the
 * browser throws MEDIA_ELEMENT_ERROR + a 404 for every plate that hasn't been
 * dropped into /public/video yet, which is most of them on a fresh clone.
 */
export default function VideoPlate({
  src,
  className = '',
  fadeTo = 1,
  play = true,
}: {
  src: string;
  className?: string;
  fadeTo?: number;
  play?: boolean;
}) {
  const [exists, setExists] = useState(false);
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    let alive = true;
    fetch(src, { method: 'HEAD' })
      .then((r) => {
        if (alive && r.ok && (r.headers.get('content-type') ?? '').includes('video')) setExists(true);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [src]);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (play) v.play().catch(() => {});
    else v.pause();
  }, [play, exists]);

  if (!exists) return null;

  return (
    <video
      ref={ref}
      src={src}
      className={`absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-[1400ms] ease-luxe ${className}`}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      onLoadedData={(e) => {
        e.currentTarget.style.opacity = String(fadeTo);
      }}
    />
  );
}
