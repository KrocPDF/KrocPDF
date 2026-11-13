'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Zap,
  CheckCircle2,
  Crosshair,
  ShieldCheck,
} from 'lucide-react';

export function KrocCrunchDemo() {
  // Acts:
  // 1: Heavy Doc In
  // 2: Target Locked
  // 3: Jaws Open & Lunge
  // 4: CHOMP / Shockwave Crunch
  // 5: Output Lean PDF
  const [act, setAct] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isPlaying) return;

    const actDurations: Record<number, number> = {
      1: 1600 / playbackSpeed,
      2: 1200 / playbackSpeed,
      3: 1000 / playbackSpeed,
      4: 1200 / playbackSpeed,
      5: 2800 / playbackSpeed,
    };

    timerRef.current = setTimeout(() => {
      setAct((prev) => (prev >= 5 ? 1 : prev + 1));
    }, actDurations[act]);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [act, isPlaying, playbackSpeed]);

  const handleReplay = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setAct(1);
    setIsPlaying(true);
  };

  const getHudStatus = () => {
    switch (act) {
      case 1:
        return { label: 'SCANNING INCOMING FILE', color: 'text-amber-400' };
      case 2:
        return { label: 'TARGET LOCKED: 48.6 MB RAW BUFFER', color: 'text-red-400' };
      case 3:
        return { label: 'PREPARING ON-DEVICE JAWS', color: 'text-zinc-200' };
      case 4:
        return { label: 'CRUNCHING: PARSING & COMPRESSING STREAMS', color: 'text-white' };
      case 5:
        return { label: 'CRUNCH COMPLETE · ZERO DATA LEAKED', color: 'text-emerald-400' };
      default:
        return { label: 'READY', color: 'text-zinc-400' };
    }
  };

  const hud = getHudStatus();

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Main Cinema Screen */}
      <div className="relative w-full h-[380px] sm:h-[440px] rounded-3xl border border-zinc-800/90 bg-zinc-950/70 backdrop-blur-md overflow-hidden shadow-2xl flex flex-col justify-between scale-crosshair scale-crosshair-tl scale-crosshair-tr scale-crosshair-bl scale-crosshair-br select-none">
        
        {/* Subtle grid background inside screen */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

        {/* Top HUD Telemetry Bar */}
        <div className="relative z-20 flex items-center justify-between px-5 py-3.5 border-b border-zinc-800/80 bg-zinc-900/40 text-xs font-mono">
          <div className="flex items-center space-x-2.5">
            <span className="w-2 h-2 rounded-full bg-zinc-100 animate-pulse" />
            <span className="text-zinc-400 tracking-wider">KROC_ENGINE_SIMULATOR</span>
            <span className="text-zinc-600">//</span>
            <span className={`font-semibold tracking-wider ${hud.color}`}>{hud.label}</span>
          </div>

          <div className="hidden sm:flex items-center space-x-4 text-zinc-400">
            <span>ACT {act.toString().padStart(2, '0')}/05</span>
            <span className="text-zinc-600">|</span>
            <span className="text-zinc-300">RAM: 14.2 MB</span>
            <span className="text-zinc-600">|</span>
            <span className="text-zinc-300">SERVER: 0 BYTES</span>
          </div>
        </div>

        {/* ========================================================
            Animation Stage (Center Canvas)
            ======================================================== */}
        <div className="relative flex-1 w-full flex items-center justify-center overflow-hidden px-4">
          
          {/* Target Reticle (Act 2 & 3) */}
          {(act === 2 || act === 3) && (
            <div className="absolute left-[20%] sm:left-[28%] top-1/2 -translate-y-1/2 w-44 h-44 rounded-full border border-dashed border-red-500/40 animate-spin pointer-events-none flex items-center justify-center">
              <Crosshair className="w-8 h-8 text-red-400/80 animate-ping" />
            </div>
          )}

          {/* Shockwave Rings on Crunch (Act 4) */}
          {act === 4 && (
            <div className="absolute left-[38%] sm:left-[42%] top-1/2 -translate-y-1/2 pointer-events-none z-10">
              <div className="w-40 h-40 -ml-20 -mt-20 rounded-full border-2 border-white/80 animate-crunch-shockwave" />
              <div className="w-64 h-64 -ml-32 -mt-32 rounded-full border border-zinc-400/50 animate-crunch-shockwave [animation-delay:120ms]" />
              {/* Particle Sparkles */}
              <div className="absolute -top-12 -left-12 text-white animate-bounce">
                <Sparkles className="w-6 h-6 text-zinc-200" />
              </div>
              <div className="absolute -bottom-10 -right-8 text-white animate-ping">
                <Zap className="w-5 h-5 text-zinc-100" />
              </div>
            </div>
          )}

          {/* ========================================
              Item 1: Bloated Document (Left)
              ======================================== */}
          <div
            className={`absolute transition-all duration-500 ease-out z-10 ${
              act === 1
                ? 'left-[10%] sm:left-[20%] opacity-100 scale-100 rotate-0'
                : act === 2
                ? 'left-[18%] sm:left-[26%] opacity-100 scale-100 -rotate-2'
                : act === 3
                ? 'left-[22%] sm:left-[30%] opacity-100 scale-95 rotate-3'
                : act === 4
                ? 'left-[36%] sm:left-[40%] opacity-0 scale-50 rotate-12 transition-all duration-200'
                : 'left-[-300px] opacity-0 scale-0 pointer-events-none'
            }`}
          >
            <div className="w-48 sm:w-56 p-4 rounded-2xl bg-zinc-900 border-2 border-dashed border-red-500/40 shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between mb-3">
                <span className="p-2 rounded-xl bg-red-950/60 border border-red-900/60 text-red-400">
                  <FileText className="w-5 h-5" />
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-950/80 text-red-400 border border-red-900/80 animate-pulse">
                  48.6 MB
                </span>
              </div>
              <p className="text-xs font-semibold text-zinc-200 truncate font-mono">uncompressed_doc.pdf</p>
              <p className="text-[10px] text-zinc-500 mt-0.5">Oversized raw bitmaps · 300 DPI</p>
            </div>
          </div>

          {/* ========================================
              Item 2: Vector Kroc Mascot (Right)
              ======================================== */}
          <div
            className={`absolute transition-all duration-500 ease-out z-20 ${
              act === 1
                ? 'right-[8%] sm:right-[16%] translate-x-0'
                : act === 2
                ? 'right-[12%] sm:right-[22%] -translate-x-2'
                : act === 3
                ? 'right-[24%] sm:right-[32%] -translate-x-12 scale-105'
                : act === 4
                ? 'right-[26%] sm:right-[34%] -translate-x-16 scale-110'
                : 'right-[12%] sm:right-[20%] translate-x-0 scale-100'
            }`}
          >
            <div className="relative w-52 h-40 sm:w-64 sm:h-48 flex items-center justify-center">
              
              {/* Articulated Kroc SVG with dynamic jaws */}
              <svg
                viewBox="0 0 260 180"
                className="w-full h-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.8)]"
              >
                <defs>
                  <linearGradient id="krocSkin" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#27272a" />
                    <stop offset="100%" stopColor="#09090b" />
                  </linearGradient>
                  <linearGradient id="krocTeeth" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="100%" stopColor="#e4e4e7" />
                  </linearGradient>
                </defs>

                {/* Body & Tail */}
                <path
                  d="M150 90 Q190 70 230 85 Q245 95 255 110 Q240 120 220 115 Q185 125 150 105 Z"
                  fill="url(#krocSkin)"
                  stroke="#52525b"
                  strokeWidth="2"
                />

                {/* Back ridges/scales */}
                <polygon points="175,75 185,62 195,75" fill="#3f3f46" />
                <polygon points="198,78 208,66 218,79" fill="#3f3f46" />
                <polygon points="220,83 228,74 236,85" fill="#3f3f46" />

                {/* Upper Jaw (Snout + Eye + Top Teeth) */}
                <g
                  className="transition-transform duration-300 ease-out origin-[140px_90px]"
                  style={{
                    transform:
                      act === 3
                        ? 'rotate(-36deg)'
                        : act === 4
                        ? 'rotate(0deg)'
                        : 'rotate(0deg)',
                  }}
                >
                  {/* Upper Snout Body */}
                  <path
                    d="M140 90 Q110 50 40 68 Q25 74 15 82 Q35 88 70 88 Q110 88 140 90 Z"
                    fill="url(#krocSkin)"
                    stroke="#71717a"
                    strokeWidth="2.5"
                  />
                  {/* Nostril */}
                  <ellipse cx="28" cy="74" rx="3" ry="2" fill="#18181b" />
                  
                  {/* Gleaming Eye with active glow */}
                  <circle cx="108" cy="62" r="7" fill="#18181b" stroke="#a1a1aa" strokeWidth="1.5" />
                  <circle
                    cx="109"
                    cy="61"
                    r="3.5"
                    fill={act === 5 ? '#34d399' : act === 4 ? '#ffffff' : '#fbbf24'}
                    className={act >= 3 ? 'animate-pulse' : ''}
                  />

                  {/* Upper Teeth Row */}
                  <polygon points="35,85 41,96 47,86" fill="url(#krocTeeth)" stroke="#18181b" strokeWidth="0.8" />
                  <polygon points="52,86 58,98 64,87" fill="url(#krocTeeth)" stroke="#18181b" strokeWidth="0.8" />
                  <polygon points="70,87 77,100 84,88" fill="url(#krocTeeth)" stroke="#18181b" strokeWidth="0.8" />
                  <polygon points="90,88 98,100 106,89" fill="url(#krocTeeth)" stroke="#18181b" strokeWidth="0.8" />
                  <polygon points="112,89 120,98 128,90" fill="url(#krocTeeth)" stroke="#18181b" strokeWidth="0.8" />
                </g>

                {/* Lower Jaw (Under-Snout + Bottom Teeth) */}
                <g
                  className="transition-transform duration-300 ease-out origin-[140px_92px]"
                  style={{
                    transform:
                      act === 3
                        ? 'rotate(26deg)'
                        : act === 4
                        ? 'rotate(0deg)'
                        : 'rotate(0deg)',
                  }}
                >
                  {/* Lower Chin Body */}
                  <path
                    d="M140 92 Q105 105 60 105 Q30 105 20 95 Q38 92 70 91 Q110 91 140 92 Z"
                    fill="url(#krocSkin)"
                    stroke="#52525b"
                    strokeWidth="2.5"
                  />
                  {/* Lower Teeth Row (Interlocking) */}
                  <polygon points="44,92 50,81 56,92" fill="url(#krocTeeth)" stroke="#18181b" strokeWidth="0.8" />
                  <polygon points="62,92 68,80 74,92" fill="url(#krocTeeth)" stroke="#18181b" strokeWidth="0.8" />
                  <polygon points="80,92 88,78 96,92" fill="url(#krocTeeth)" stroke="#18181b" strokeWidth="0.8" />
                  <polygon points="102,92 110,81 118,92" fill="url(#krocTeeth)" stroke="#18181b" strokeWidth="0.8" />
                </g>
              </svg>
            </div>
          </div>

          {/* ========================================
              Item 3: Lean Optimized PDF (Spit Out, Act 5)
              ======================================== */}
          {act === 5 && (
            <div className="absolute left-[20%] sm:left-[30%] top-1/2 -translate-y-1/2 z-30 transition-all duration-700 ease-out animate-in zoom-in-75 slide-in-from-right-16">
              <div className="w-56 sm:w-64 p-4 sm:p-5 rounded-2xl bg-zinc-950 border-2 border-white/80 shadow-[0_0_50px_rgba(255,255,255,0.2)]">
                <div className="flex items-center justify-between mb-3">
                  <span className="p-2 rounded-xl bg-zinc-800 text-white border border-zinc-700">
                    <FileText className="w-5 h-5" />
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-white text-zinc-950 flex items-center space-x-1 shadow-md">
                    <Sparkles className="w-3 h-3 text-zinc-950" />
                    <span>1.8 MB (96% Smaller)</span>
                  </span>
                </div>
                
                <p className="text-sm font-bold text-white truncate font-mono">optimized_vector.pdf</p>
                <div className="mt-2 pt-2 border-t border-zinc-800 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                  <span className="flex items-center space-x-1 text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Lossless Vector</span>
                  </span>
                  <span className="text-zinc-300 font-bold">0.12s Instant</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================
            Bottom Control Bar
            ======================================================== */}
        <div className="relative z-20 flex flex-wrap items-center justify-between px-5 py-3 border-t border-zinc-800/80 bg-zinc-900/60 backdrop-blur-md gap-4">
          
          {/* Act Step Indicators */}
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((step) => (
              <button
                key={step}
                onClick={() => {
                  setAct(step);
                  setIsPlaying(false);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  act === step
                    ? 'w-8 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]'
                    : act > step
                    ? 'w-4 bg-zinc-500'
                    : 'w-2 bg-zinc-800'
                }`}
                title={`Jump to Act ${step}`}
                aria-label={`Jump to Act ${step}`}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-3 py-1.5 rounded-xl border border-zinc-700 bg-zinc-800/80 hover:bg-zinc-700 text-xs font-medium text-zinc-200 hover:text-white transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Pause' : 'Resume'}</span>
            </button>

            <button
              onClick={handleReplay}
              className="px-3.5 py-1.5 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold transition-all shadow-md flex items-center space-x-1.5 cursor-pointer active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Replay Crunch</span>
            </button>

            <button
              onClick={() => setPlaybackSpeed((s) => (s === 1 ? 1.5 : s === 1.5 ? 2 : 1))}
              className="px-2.5 py-1.5 rounded-xl border border-zinc-800 hover:border-zinc-700 text-[11px] font-mono text-zinc-400 hover:text-zinc-200 transition-colors"
              title="Toggle Playback Speed"
            >
              {playbackSpeed}x
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
