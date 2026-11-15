'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Eye, AlertTriangle, ShieldCheck } from 'lucide-react';
import clsx from 'clsx';

export function ClarityComparisonSlider() {
  const [sliderPos, setSliderPos] = useState(50);
  const [activePreset, setActivePreset] = useState<'invoice' | 'id' | 'photo'>('invoice');
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const clampedPercent = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPos(clampedPercent);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 mb-4">
          <Eye className="w-3.5 h-3.5 text-amber-400" />
          <span>Interactive Clarity Lens</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-100 tracking-tight mb-4">
          Lossless 300 DPI vs. The 72 DPI Trap
        </h2>
        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Drag the neon slider below to see how commercial converters secretly downsample your documents
          and stamp watermarks — compared to KrocPDF&apos;s clean, legal-grade PDF assembly.
        </p>

        {/* Preset Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
          {[
            { id: 'invoice', label: 'Financial Invoice' },
            { id: 'id', label: 'Government ID / Passport' },
            { id: 'photo', label: 'High-Res Photography' },
          ].map((preset) => (
            <button
              key={preset.id}
              onClick={() => setActivePreset(preset.id as 'invoice' | 'id' | 'photo')}
              className={clsx(
                "px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all",
                activePreset === preset.id
                  ? "bg-zinc-100 text-zinc-950 font-semibold shadow-md"
                  : "bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
              )}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Comparison Canvas Card */}
      <div className="glass-card rounded-3xl p-4 sm:p-8 border border-zinc-800/80 shadow-2xl relative select-none scale-crosshair scale-crosshair-tl scale-crosshair-tr scale-crosshair-bl scale-crosshair-br">
        <div
          ref={containerRef}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          className="relative w-full h-[400px] sm:h-[480px] lg:h-[520px] rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 cursor-ew-resize"
        >
          {/* Right Layer: KrocPDF 300 DPI Output (Base) */}
          <div className="absolute inset-0 bg-[#0c0d12] p-6 sm:p-10 flex flex-col justify-between">
            {/* Header Badge */}
            <div className="flex items-center justify-end">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-600/40 text-emerald-400 text-xs font-mono font-medium shadow-lg">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>KrocPDF: 300 DPI Lossless (0 Watermark)</span>
              </span>
            </div>

            {/* Document Content Sample: Sharp Vector Clarity */}
            <div className="max-w-xl mx-auto w-full my-auto bg-zinc-900/90 border border-zinc-700/60 rounded-xl p-6 sm:p-8 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-700/60 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center font-black text-zinc-950 text-xs font-mono">
                    KROC
                  </div>
                  <div>
                    <p className="text-sm font-bold text-zinc-100 tracking-tight">OFFICIAL VERIFIED STATEMENT</p>
                    <p className="text-[10px] font-mono text-zinc-400">DOC_ID: KROC-9482-LOSSLESS</p>
                  </div>
                </div>
                <span className="text-xs font-mono text-emerald-400 font-semibold px-2 py-1 rounded bg-emerald-950 border border-emerald-800/60">
                  PASSED AA
                </span>
              </div>

              <div className="space-y-2 text-xs text-zinc-300 font-sans leading-relaxed">
                <p>
                  <strong>Entity:</strong> Antigravity Global Corporation Ltd.
                </p>
                <p>
                  <strong>Certification:</strong> All vector glyphs and typography preserved with exact font metric accuracy at 300 DPI. No rasterization artifacts detected.
                </p>
                <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 font-mono text-[11px] text-zinc-300">
                  SHA256: 8f4e2b83a9...00d41 (Bit-for-bit lossless match)
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-zinc-400 border-t border-zinc-800">
                <span>File Size: 1.24 MB</span>
                <span className="text-emerald-400">Clean Legal Output</span>
              </div>
            </div>

            <div className="flex items-center justify-end text-[11px] text-zinc-500 font-mono">
              Rendered via In-Browser WASM Engine (pdf-lib)
            </div>
          </div>

          {/* Left Layer: Competitor 72 DPI Output (Clipped via sliderPos) */}
          <div
            className="absolute inset-0 bg-[#121111] p-6 sm:p-10 flex flex-col justify-between overflow-hidden"
            style={{ width: `${sliderPos}%` }}
          >
            {/* Header Badge */}
            <div className="flex items-center justify-start">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-red-950/80 border border-red-600/40 text-red-400 text-xs font-mono font-medium shadow-lg">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span>Commercial Converter: 72 DPI (Blurry + Ads)</span>
              </span>
            </div>

            {/* Document Content Sample: Blurry & Watermarked */}
            <div className="max-w-xl mx-auto w-full my-auto bg-zinc-950/90 border border-red-900/40 rounded-xl p-6 sm:p-8 shadow-2xl space-y-4 filter blur-[1.2px] relative">
              {/* Giant Obnoxious Watermark */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                <span className="text-3xl sm:text-4xl font-extrabold text-red-600/30 uppercase tracking-widest rotate-[-25deg] select-none border-2 border-dashed border-red-500/20 px-6 py-2 rounded-xl">
                  FREE TIER WATERMARK
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center font-black text-zinc-500 text-xs font-mono">
                    AD
                  </div>
                  <div>
                    <p className="text-sm font-bold text-zinc-400 tracking-tight">OFFICIAL STATEMENT (COMPRESSED)</p>
                    <p className="text-[10px] font-mono text-zinc-600">DOWNSAMPLED TO 72 DPI</p>
                  </div>
                </div>
                <span className="text-xs font-mono text-red-400 font-semibold px-2 py-1 rounded bg-red-950 border border-red-800/60">
                  72 DPI
                </span>
              </div>

              <div className="space-y-2 text-xs text-zinc-400 font-sans leading-relaxed">
                <p>
                  <strong>Entity:</strong> Unreadable Fuzzy Characters...
                </p>
                <p>
                  <strong>Certification:</strong> Document details heavily degraded to force user into purchasing $12/month pro plan.
                </p>
                <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 font-mono text-[11px] text-zinc-500">
                  Warning: 15MB file size limit exceeded!
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-red-400 border-t border-zinc-800">
                <span>File Size: 450 KB (Artifacted)</span>
                <span>Watermark Enforced</span>
              </div>
            </div>

            <div className="flex items-center justify-start text-[11px] text-red-500/80 font-mono">
              Harvested on 3rd-party cloud server
            </div>
          </div>

          {/* Draggable Neon Divider Bar */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-amber-400 via-white to-emerald-400 shadow-[0_0_15px_rgba(255,255,255,0.8)] cursor-ew-resize z-30"
            style={{ left: `${sliderPos}%` }}
          >
            {/* Handle Thumb */}
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-zinc-950 border-2 border-white flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-transform">
              <span className="text-zinc-200 text-xs font-black select-none">↔</span>
            </div>
          </div>
        </div>

        {/* Caption & Controls Guidance */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400 px-2 font-mono">
          <span>← Drag Left to reveal 300 DPI Vector Sharpness</span>
          <span>Drag Right to inspect 72 DPI Compression Artifacts →</span>
        </div>
      </div>
    </div>
  );
}
