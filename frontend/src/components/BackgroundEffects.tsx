'use client';

import React, { useEffect, useRef } from 'react';

export function BackgroundEffects() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { clientX, clientY } = e;
      containerRef.current.style.setProperty('--mouse-x', `${clientX}px`);
      containerRef.current.style.setProperty('--mouse-y', `${clientY}px`);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none"
      style={{
        // Default cursor position at center of screen before mouse moves
        ['--mouse-x' as string]: '50vw',
        ['--mouse-y' as string]: '35vh',
      }}
      aria-hidden="true"
    >
      {/* 1. Base Dark Geometric Grid */}
      <div 
        className="absolute inset-0 bg-grid-pattern opacity-[0.22]"
        style={{
          maskImage: 'radial-gradient(ellipse 85% 70% at 50% 25%, #000 40%, transparent 95%)',
          WebkitMaskImage: 'radial-gradient(ellipse 85% 70% at 50% 25%, #000 40%, transparent 95%)',
        }}
      />

      {/* 2. Interactive Spotlight that tracks user's mouse */}
      <div
        className="absolute inset-0 opacity-80 transition-opacity duration-300"
        style={{
          background: `radial-gradient(650px circle at var(--mouse-x) var(--mouse-y), rgba(255, 255, 255, 0.055), transparent 60%)`,
        }}
      />

      {/* 3. Ambient Drifting Light Orbs (Soft Cream & Neutral Zinc) */}
      <div className="absolute top-[-10%] left-[20%] w-[550px] h-[550px] rounded-full bg-gradient-to-br from-zinc-100/[0.04] to-transparent blur-[90px] animate-drift-one" />
      <div className="absolute top-[30%] right-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-zinc-200/[0.03] to-transparent blur-[100px] animate-drift-two" />
      <div className="absolute bottom-[-15%] left-[35%] w-[700px] h-[700px] rounded-full bg-gradient-to-t from-zinc-400/[0.025] to-transparent blur-[110px] animate-drift-three" />

      {/* 4. Scale.com Data Light Tracers along Grid Lines */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-[28%] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent animate-beam-h" />
        <div className="absolute top-[64%] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent animate-beam-h-reverse" />
        <div className="absolute left-[25%] top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent animate-beam-v" />
        <div className="absolute right-[25%] top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/15 to-transparent animate-beam-v-delayed" />
      </div>
    </div>
  );
}
