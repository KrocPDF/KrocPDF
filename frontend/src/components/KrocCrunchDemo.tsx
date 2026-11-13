'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export function KrocCrunchDemo() {
  // Phases:
  // 0: Stalk & Float
  // 1: Jaws Open & Lunge
  // 2: Chomp & Shockwave
  // 3: Savor / Gulp
  // 4: Reset & Materialize
  const [phase, setPhase] = useState<number>(0);

  useEffect(() => {
    const cycle = () => {
      // Phase 0: Stalk & Float (0ms to 1400ms)
      setPhase(0);

      // Phase 1: Jaws Open & Lunge (1400ms)
      const t1 = setTimeout(() => setPhase(1), 1400);

      // Phase 2: CHOMP / Shockwave (2300ms)
      const t2 = setTimeout(() => setPhase(2), 2300);

      // Phase 3: Savor / Gulp (2900ms)
      const t3 = setTimeout(() => setPhase(3), 2900);

      // Phase 4: Materialize next doc (4200ms)
      const t4 = setTimeout(() => setPhase(4), 4200);

      return [t1, t2, t3, t4];
    };

    let timers = cycle();
    const interval = setInterval(() => {
      timers.forEach(clearTimeout);
      timers = cycle();
    }, 5200);

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto select-none pointer-events-none">
      {/* Cinematic Stage - Pure Visual Animation, Zero Text */}
      <div className="relative w-full h-[360px] sm:h-[420px] rounded-3xl border border-zinc-800/60 bg-zinc-950/40 overflow-hidden shadow-2xl flex items-center justify-center scale-crosshair scale-crosshair-tl scale-crosshair-tr scale-crosshair-bl scale-crosshair-br">
        
        {/* Subtle Ambient Radial Lighting */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent_70%)] pointer-events-none" />

        {/* Shockwave Rings on Chomp (Phase 2) */}
        {phase === 2 && (
          <div className="absolute left-[38%] sm:left-[42%] top-1/2 -translate-y-1/2 pointer-events-none z-10">
            <div className="w-48 h-48 -ml-24 -mt-24 rounded-full border border-white/80 animate-crunch-shockwave" />
            <div className="w-80 h-80 -ml-40 -mt-40 rounded-full border border-white/30 animate-crunch-shockwave [animation-delay:100ms]" />
            {/* Impact Sparkle Bursts */}
            <div className="absolute -top-12 -left-12 w-2 h-2 rounded-full bg-white shadow-[0_0_12px_#fff] animate-ping" />
            <div className="absolute top-10 -right-16 w-2.5 h-2.5 rounded-full bg-white/90 shadow-[0_0_14px_#fff] animate-ping [animation-delay:150ms]" />
            <div className="absolute -bottom-14 left-8 w-2 h-2 rounded-full bg-white/70 shadow-[0_0_10px_#fff] animate-ping [animation-delay:80ms]" />
          </div>
        )}

        {/* ========================================================
            PDF / Document Icon (Target)
            ======================================================== */}
        <div
          className={`absolute transition-all duration-500 ease-out z-10 flex items-center justify-center ${
            phase === 0
              ? 'left-[16%] sm:left-[24%] opacity-100 scale-100 translate-y-0 rotate-0'
              : phase === 1
              ? 'left-[24%] sm:left-[32%] opacity-100 scale-105 -translate-y-1 rotate-3'
              : phase === 2
              ? 'left-[36%] sm:left-[42%] opacity-0 scale-0 translate-y-2 rotate-45 transition-all duration-150'
              : phase === 3
              ? 'left-[36%] opacity-0 scale-0'
              : 'left-[16%] sm:left-[24%] opacity-100 scale-100 translate-y-0 rotate-0 transition-opacity duration-700'
          }`}
        >
          {/* Stylized PDF Document Graphic */}
          <div className="relative w-24 h-32 sm:w-28 sm:h-36 rounded-2xl bg-zinc-900/90 border border-zinc-700/80 shadow-[0_16px_36px_rgba(0,0,0,0.8)] flex flex-col justify-between p-3 overflow-hidden backdrop-blur-sm group">
            {/* Folded Top-Right Corner */}
            <div className="absolute top-0 right-0 w-7 h-7 bg-zinc-800 border-b border-l border-zinc-700 rounded-bl-xl shadow-md" />
            
            {/* PDF Emblem Badge */}
            <div className="w-9 h-9 rounded-xl bg-red-600/90 border border-red-500 flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9.5 8.5c0 .83-.67 1.5-1.5 1.5H7v2H5.5V9H8c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V9H13c.83 0 1.5.67 1.5 1.5v3zm4-3.5H17v1.5h1.5v1.5H17V15h-1.5V9h3v1.5zM7 10.5h1v1H7v-1zm4.5 0h1v3h-1v-3z" />
              </svg>
            </div>

            {/* Document Lines */}
            <div className="space-y-1.5 pb-1">
              <div className="w-full h-1.5 rounded-full bg-zinc-700/60" />
              <div className="w-4/5 h-1.5 rounded-full bg-zinc-700/40" />
              <div className="w-3/5 h-1.5 rounded-full bg-zinc-700/30" />
            </div>
          </div>
        </div>

        {/* ========================================================
            The Kroc Mascot (Built Directly from Official Brand Logo)
            Upper Jaw + Lower Jaw Articulated Chomp
            ======================================================== */}
        <div
          className={`absolute transition-all duration-500 ease-out z-20 ${
            phase === 0
              ? 'right-[12%] sm:right-[18%] translate-x-0 translate-y-0 scale-100'
              : phase === 1
              ? 'right-[18%] sm:right-[26%] -translate-x-6 -translate-y-2 scale-105'
              : phase === 2
              ? 'right-[24%] sm:right-[32%] -translate-x-12 translate-y-1 scale-110'
              : phase === 3
              ? 'right-[18%] sm:right-[24%] -translate-x-4 translate-y-0 scale-100'
              : 'right-[12%] sm:right-[18%] translate-x-0 translate-y-0 scale-100'
          }`}
        >
          {/* Logo Container - Exact 1536x1024 Aspect Ratio */}
          <div className="relative w-64 h-44 sm:w-80 sm:h-52 md:w-96 md:h-64 filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)]">
            
            {/* Upper Jaw & Head (from official logo) */}
            <div
              className="absolute inset-0 transition-transform duration-250 ease-out origin-[25%_60%]"
              style={{
                transform:
                  phase === 1
                    ? 'rotate(-26deg)'
                    : phase === 2
                    ? 'rotate(0deg)'
                    : phase === 3
                    ? 'rotate(-2deg)'
                    : 'rotate(0deg)',
              }}
            >
              <Image
                src="/brand/kroc-upper.png"
                alt="Kroc Upper Jaw"
                fill
                sizes="(max-width: 768px) 320px, 384px"
                className="object-contain brightness-110"
                priority
              />
            </div>

            {/* Lower Jaw & Chin (from official logo) */}
            <div
              className="absolute inset-0 transition-transform duration-250 ease-out origin-[25%_60%]"
              style={{
                transform:
                  phase === 1
                    ? 'rotate(22deg)'
                    : phase === 2
                    ? 'rotate(0deg)'
                    : phase === 3
                    ? 'rotate(1deg)'
                    : 'rotate(0deg)',
              }}
            >
              <Image
                src="/brand/kroc-lower.png"
                alt="Kroc Lower Jaw"
                fill
                sizes="(max-width: 768px) 320px, 384px"
                className="object-contain brightness-110"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
