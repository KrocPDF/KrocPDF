'use client';

import React from 'react';

export function KrocCrunchDemo() {
  return (
    <div className="w-full max-w-5xl mx-auto select-none">
      {/* Submerged Video Stage - Pure Animation, Seamless Loop, Zero Watermark, Zero Text */}
      <div 
        className="relative w-full aspect-video rounded-3xl border border-zinc-800/80 bg-zinc-950 overflow-hidden shadow-2xl scale-crosshair scale-crosshair-tl scale-crosshair-tr scale-crosshair-bl scale-crosshair-br"
        style={{
          maskImage: 'radial-gradient(ellipse 99% 94% at 50% 50%, #000 80%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 99% 94% at 50% 50%, #000 80%, transparent 100%)',
        }}
      >
        <video
          src="/brand/kroc-crunch-animation.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover brightness-105"
        />
      </div>
    </div>
  );
}
