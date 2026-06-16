'use client';

import { useEffect, useRef } from 'react';

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.5;
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <>
      <video
        ref={videoRef}
        src="/videos/hero-bg.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="hero-video"
      />
      <div className="hero-video-overlay" />
    </>
  );
}
