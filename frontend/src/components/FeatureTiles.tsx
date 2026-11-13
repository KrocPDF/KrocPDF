'use client';

import React from 'react';
import { Shield, Lock, Zap, WifiOff, FileText, Check, Cpu } from 'lucide-react';

export function FeatureTiles() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
      {/* ========================================
          Tile 1: 100% Private On-Device
          ======================================== */}
      <div className="group relative rounded-3xl border border-zinc-800/80 bg-zinc-950/70 hover:border-zinc-600 p-6 sm:p-8 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-[1.01] flex flex-col justify-between overflow-hidden scale-crosshair scale-crosshair-tl scale-crosshair-tr">
        <div>
          {/* Cascading Pop-Up Layers Visual */}
          <div className="relative h-44 w-full flex items-center justify-center overflow-hidden mb-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 select-none">
            {/* Ambient Background Grid Pattern inside preview */}
            <div className="absolute inset-0 bg-grid-pattern opacity-10" />

            {/* Back Layer (Sheet 1) */}
            <div className="absolute w-[82%] rounded-xl bg-zinc-900/90 border border-zinc-800 px-3.5 py-2.5 transform -rotate-6 translate-y-3 group-hover:-rotate-12 group-hover:-translate-y-2 group-hover:scale-95 transition-all duration-300 ease-out flex items-center space-x-2.5 text-xs text-zinc-400 opacity-60 group-hover:opacity-80 shadow-md">
              <FileText className="w-4 h-4 text-zinc-500 flex-shrink-0" />
              <span className="truncate font-mono">Passport_Scan.png</span>
              <span className="ml-auto text-[10px] text-zinc-500 font-mono">2.4 MB</span>
            </div>

            {/* Middle Layer (Sheet 2) */}
            <div className="absolute w-[86%] rounded-xl bg-zinc-900 border border-zinc-700/80 px-3.5 py-2.5 transform rotate-3 translate-y-1 group-hover:rotate-6 group-hover:-translate-y-6 group-hover:scale-100 transition-all duration-300 ease-out shadow-lg flex items-center space-x-2.5 text-xs text-zinc-300 opacity-85 group-hover:opacity-100">
              <Lock className="w-4 h-4 text-zinc-400 flex-shrink-0" />
              <span className="truncate font-mono">Confidential_Tax.pdf</span>
              <span className="ml-auto text-[10px] text-zinc-400 font-mono">Local RAM</span>
            </div>

            {/* Front Pop-Up Layer (Hero Shield Card) */}
            <div className="relative w-[90%] rounded-xl bg-zinc-950 border border-zinc-600 px-4 py-3 transform translate-y-0 group-hover:-translate-y-10 group-hover:scale-105 group-hover:border-zinc-300 transition-all duration-300 ease-out shadow-2xl flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded-lg bg-zinc-800/90 border border-zinc-700 flex items-center justify-center text-zinc-100 group-hover:scale-110 transition-transform">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-zinc-100 tracking-tight">On-Device Sandbox</p>
                  <p className="text-[10px] text-zinc-400 font-mono">Zero server upload</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-zinc-900 border border-zinc-700 text-zinc-200">
                100% Private
              </span>
            </div>
          </div>

          {/* Crisp, User-Facing Text */}
          <h3 className="text-xl font-bold text-zinc-100 tracking-tight mb-2">
            100% Private &amp; On-Device
          </h3>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Your documents are converted directly in your browser. Files never leave your computer or touch an external server.
          </p>
        </div>

        {/* Feature Pill Footnote */}
        <div className="mt-6 pt-4 border-t border-zinc-900 flex items-center space-x-2 text-xs font-mono text-zinc-500">
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
          <span>Local memory processing · No tracking</span>
        </div>
      </div>

      {/* ========================================
          Tile 2: Instant Speed & Batch
          ======================================== */}
      <div className="group relative rounded-3xl border border-zinc-800/80 bg-zinc-950/70 hover:border-zinc-600 p-6 sm:p-8 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-[1.01] flex flex-col justify-between overflow-hidden scale-crosshair scale-crosshair-tl scale-crosshair-tr">
        <div>
          {/* Cascading Pop-Up Layers Visual */}
          <div className="relative h-44 w-full flex items-center justify-center overflow-hidden mb-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 select-none">
            <div className="absolute inset-0 bg-grid-pattern opacity-10" />

            {/* Back Layer (Batch Item) */}
            <div className="absolute w-[82%] rounded-xl bg-zinc-900/90 border border-zinc-800 px-3.5 py-2.5 transform rotate-6 translate-y-3 group-hover:rotate-12 group-hover:-translate-y-2 group-hover:scale-95 transition-all duration-300 ease-out flex items-center space-x-2.5 text-xs text-zinc-400 opacity-60 group-hover:opacity-80 shadow-md">
              <span className="font-mono text-zinc-500">01</span>
              <span className="truncate font-mono">Invoice_Batch_12.jpg</span>
              <span className="ml-auto text-[10px] text-zinc-500 font-mono">Ready</span>
            </div>

            {/* Middle Layer (Compression Metric) */}
            <div className="absolute w-[86%] rounded-xl bg-zinc-900 border border-zinc-700/80 px-3.5 py-2.5 transform -rotate-3 translate-y-1 group-hover:-rotate-6 group-hover:-translate-y-6 group-hover:scale-100 transition-all duration-300 ease-out shadow-lg flex items-center space-x-2.5 text-xs text-zinc-300 opacity-85 group-hover:opacity-100">
              <Cpu className="w-4 h-4 text-zinc-400 flex-shrink-0" />
              <span className="truncate font-mono">Lossless Compression</span>
              <span className="ml-auto text-[10px] text-zinc-300 font-mono">84% Smaller</span>
            </div>

            {/* Front Pop-Up Layer (Speed Card) */}
            <div className="relative w-[90%] rounded-xl bg-zinc-950 border border-zinc-600 px-4 py-3 transform translate-y-0 group-hover:-translate-y-10 group-hover:scale-105 group-hover:border-zinc-300 transition-all duration-300 ease-out shadow-2xl flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded-lg bg-zinc-800/90 border border-zinc-700 flex items-center justify-center text-zinc-100 group-hover:scale-110 transition-transform">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-zinc-100 tracking-tight">Instant Conversion</p>
                  <p className="text-[10px] text-zinc-400 font-mono">Zero upload latency</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-zinc-900 border border-zinc-700 text-zinc-200">
                0.14s
              </span>
            </div>
          </div>

          {/* Crisp, User-Facing Text */}
          <h3 className="text-xl font-bold text-zinc-100 tracking-tight mb-2">
            Blazing Fast &amp; Unlimited
          </h3>
          <p className="text-sm text-zinc-400 leading-relaxed">
            No waiting queues, slow upload bars, or file size limits. Convert single images or bulk multi-page documents instantly.
          </p>
        </div>

        {/* Feature Pill Footnote */}
        <div className="mt-6 pt-4 border-t border-zinc-900 flex items-center space-x-2 text-xs font-mono text-zinc-500">
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
          <span>Zero queue time · Unlimited file batching</span>
        </div>
      </div>

      {/* ========================================
          Tile 3: 100% Offline Ready
          ======================================== */}
      <div className="group relative rounded-3xl border border-zinc-800/80 bg-zinc-950/70 hover:border-zinc-600 p-6 sm:p-8 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-[1.01] flex flex-col justify-between overflow-hidden scale-crosshair scale-crosshair-tl scale-crosshair-tr">
        <div>
          {/* Cascading Pop-Up Layers Visual */}
          <div className="relative h-44 w-full flex items-center justify-center overflow-hidden mb-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 select-none">
            <div className="absolute inset-0 bg-grid-pattern opacity-10" />

            {/* Back Layer (No Connection Badge) */}
            <div className="absolute w-[82%] rounded-xl bg-zinc-900/90 border border-zinc-800 px-3.5 py-2.5 transform -rotate-4 translate-y-3 group-hover:-rotate-8 group-hover:-translate-y-2 group-hover:scale-95 transition-all duration-300 ease-out flex items-center space-x-2.5 text-xs text-zinc-400 opacity-60 group-hover:opacity-80 shadow-md">
              <span className="font-mono text-zinc-500">✈️</span>
              <span className="truncate font-mono">Airplane Mode Active</span>
              <span className="ml-auto text-[10px] text-zinc-500 font-mono">Offline</span>
            </div>

            {/* Middle Layer (Engine Standalone) */}
            <div className="absolute w-[86%] rounded-xl bg-zinc-900 border border-zinc-700/80 px-3.5 py-2.5 transform rotate-4 translate-y-1 group-hover:rotate-8 group-hover:-translate-y-6 group-hover:scale-100 transition-all duration-300 ease-out shadow-lg flex items-center space-x-2.5 text-xs text-zinc-300 opacity-85 group-hover:opacity-100">
              <Check className="w-4 h-4 text-zinc-400 flex-shrink-0" />
              <span className="truncate font-mono">Standalone Engine</span>
              <span className="ml-auto text-[10px] text-zinc-400 font-mono">Self-Contained</span>
            </div>

            {/* Front Pop-Up Layer (Offline Status Card) */}
            <div className="relative w-[90%] rounded-xl bg-zinc-950 border border-zinc-600 px-4 py-3 transform translate-y-0 group-hover:-translate-y-10 group-hover:scale-105 group-hover:border-zinc-300 transition-all duration-300 ease-out shadow-2xl flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded-lg bg-zinc-800/90 border border-zinc-700 flex items-center justify-center text-zinc-100 group-hover:scale-110 transition-transform">
                  <WifiOff className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-zinc-100 tracking-tight">Works Without Wi-Fi</p>
                  <p className="text-[10px] text-zinc-400 font-mono">No connection required</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-zinc-900 border border-zinc-700 text-zinc-200">
                Offline
              </span>
            </div>
          </div>

          {/* Crisp, User-Facing Text */}
          <h3 className="text-xl font-bold text-zinc-100 tracking-tight mb-2">
            Works Completely Offline
          </h3>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Convert, merge, and export anywhere — on a flight, on the go, or off the grid. No internet connection needed.
          </p>
        </div>

        {/* Feature Pill Footnote */}
        <div className="mt-6 pt-4 border-t border-zinc-900 flex items-center space-x-2 text-xs font-mono text-zinc-500">
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
          <span>No accounts · No watermarks · 100% Free</span>
        </div>
      </div>
    </div>
  );
}
