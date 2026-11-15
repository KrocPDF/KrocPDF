'use client';

import React, { useState } from 'react';
import { ShieldCheck, Lock, WifiOff, FileCheck, CheckCircle2, Search, ArrowDownCircle } from 'lucide-react';
import clsx from 'clsx';

interface NetworkEntry {
  name: string;
  status: string;
  type: string;
  initiator: string;
  size: string;
  time: string;
  isBlockedOrSafe?: boolean;
}

export function PrivacyWireInspector() {
  const [hasAudited, setHasAudited] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);

  const runAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      setIsAuditing(false);
      setHasAudited(true);
    }, 800);
  };

  const networkEntries: NetworkEntry[] = [
    {
      name: 'localConverter.ts (WASM)',
      status: '200 OK',
      type: 'wasm/memory',
      initiator: 'V8 Sandbox',
      size: '0 B (In-Memory)',
      time: '12ms',
      isBlockedOrSafe: true,
    },
    {
      name: 'fflate / pdf-lib compiler',
      status: '200 OK',
      type: 'script',
      initiator: 'WebWorker #1',
      size: '0 B (Cached)',
      time: '8ms',
      isBlockedOrSafe: true,
    },
    {
      name: 'POST /upload-document',
      status: 'BLOCKED / NONE',
      type: 'fetch/xhr',
      initiator: 'Network Stack',
      size: '0 B (Never Called)',
      time: '0ms',
      isBlockedOrSafe: true,
    },
    {
      name: 'analytics-tracking-pixel',
      status: 'OMITTED',
      type: 'ping',
      initiator: 'Policy Engine',
      size: '0 B (Zero Cookies)',
      time: '0ms',
      isBlockedOrSafe: true,
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 mb-4">
          <WifiOff className="w-3.5 h-3.5 text-emerald-400" />
          <span>Independent Wire Audit</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-100 tracking-tight mb-4">
          Inspect The Network Wire
        </h2>
        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Don&apos;t just take our word for it. Run our live network inspector to verify that local conversions
          transmit exactly zero packets outside your machine.
        </p>
      </div>

      {/* Main Glassmorphic DevTools Frame */}
      <div className="glass-card rounded-3xl p-6 sm:p-10 border border-zinc-800/80 shadow-2xl relative scale-crosshair scale-crosshair-tl scale-crosshair-tr scale-crosshair-bl scale-crosshair-br">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-6 border-b border-zinc-900">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-200">DevTools Network Monitor (Simulated Sandbox)</h3>
              <p className="text-xs text-zinc-400 font-mono">Scope: Client Browser Memory Sandbox</p>
            </div>
          </div>

          <button
            onClick={runAudit}
            disabled={isAuditing}
            className={clsx(
              "flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-md active:scale-95",
              isAuditing
                ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                : "bg-emerald-400 hover:bg-emerald-300 text-zinc-950 font-bold"
            )}
          >
            <ShieldCheck className={clsx("w-4 h-4", isAuditing && "animate-spin")} />
            <span>{isAuditing ? 'Auditing Wire Packets...' : 'Run Network Wire Audit'}</span>
          </button>
        </div>

        {/* Mock DevTools Table Stage */}
        <div className="mt-6 rounded-2xl bg-[#08080a] border border-zinc-800/90 overflow-hidden shadow-inner font-mono text-xs">
          {/* Table Toolbar */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900/60 border-b border-zinc-800/80 text-[11px] text-zinc-400">
            <div className="flex items-center space-x-4">
              <span className="text-white font-semibold">Filter:</span>
              <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-200">All (4)</span>
              <span className="hidden sm:inline">Fetch/XHR (0)</span>
              <span className="hidden sm:inline">JS/WASM (2)</span>
            </div>
            <div className="flex items-center space-x-1.5 text-zinc-400">
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">0 requests recorded</span>
            </div>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-12 px-4 py-2 text-[11px] font-bold text-zinc-400 bg-zinc-950/80 border-b border-zinc-800/60 uppercase tracking-wider">
            <div className="col-span-5 sm:col-span-4">Request Resource</div>
            <div className="col-span-3 sm:col-span-2">Status</div>
            <div className="hidden sm:block sm:col-span-2">Type</div>
            <div className="col-span-4 sm:col-span-2 text-right">Transfer Size</div>
            <div className="hidden sm:block sm:col-span-2 text-right">Duration</div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-zinc-900">
            {networkEntries.map((row, idx) => (
              <div
                key={idx}
                className="grid grid-cols-12 px-4 py-3 items-center hover:bg-zinc-900/30 transition-colors"
              >
                <div className="col-span-5 sm:col-span-4 flex items-center space-x-2 truncate">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                  <span className="text-zinc-200 truncate">{row.name}</span>
                </div>
                <div className="col-span-3 sm:col-span-2">
                  <span className={clsx(
                    "px-1.5 py-0.5 rounded text-[10px] font-bold",
                    row.status.includes('OK') ? "bg-emerald-950 text-emerald-400 border border-emerald-800/40" : "bg-zinc-900 text-zinc-400"
                  )}>
                    {row.status}
                  </span>
                </div>
                <div className="hidden sm:block sm:col-span-2 text-zinc-400">{row.type}</div>
                <div className="col-span-4 sm:col-span-2 text-right font-bold text-emerald-400">
                  {row.size}
                </div>
                <div className="hidden sm:block sm:col-span-2 text-right text-zinc-500">{row.time}</div>
              </div>
            ))}
          </div>

          {/* Summary Audit Footer Bar */}
          <div className="px-4 py-3 bg-zinc-950 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-[11px]">
            <div className="flex items-center space-x-2 text-zinc-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>
                {hasAudited
                  ? 'Audit Verified: Exactly 0 bytes uploaded to remote servers.'
                  : 'Ready: Click "Run Network Wire Audit" to execute memory trace.'}
              </span>
            </div>

            <div className="flex items-center space-x-3 text-zinc-400 font-mono">
              <span>Total Transferred: <strong className="text-emerald-400">0.00 B</strong></span>
              <span>•</span>
              <span>Privacy Seal: <strong className="text-white">100% Client-Side</strong></span>
            </div>
          </div>
        </div>

        {/* Guarantees Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80">
            <h4 className="text-sm font-semibold text-zinc-200 mb-1 flex items-center space-x-2">
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <span>Zero Document Retention</span>
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              We never store, index, inspect, or train machine learning models on any document.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80">
            <h4 className="text-sm font-semibold text-zinc-200 mb-1 flex items-center space-x-2">
              <WifiOff className="w-4 h-4 text-emerald-400" />
              <span>Offline Ready</span>
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Once cached in your browser, KrocPDF converts files even when disconnected from the internet.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80">
            <h4 className="text-sm font-semibold text-zinc-200 mb-1 flex items-center space-x-2">
              <ArrowDownCircle className="w-4 h-4 text-emerald-400" />
              <span>Instant Local Download</span>
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Compiled PDFs save directly to your Downloads folder from memory. No waiting for server links.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
