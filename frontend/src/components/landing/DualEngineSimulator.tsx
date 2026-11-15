'use client';

import React, { useState } from 'react';
import { Cpu, ShieldCheck, Cloud, Server, Zap, HardDrive, RefreshCw, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';

export function DualEngineSimulator() {
  const [engineMode, setEngineMode] = useState<'wasm' | 'cloud'>('wasm');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simStep, setSimStep] = useState(0);

  const runSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimStep(1);

    setTimeout(() => setSimStep(2), 600);
    setTimeout(() => setSimStep(3), 1200);
    setTimeout(() => {
      setSimStep(4);
      setTimeout(() => {
        setIsSimulating(false);
        setSimStep(0);
      }, 1500);
    }, 1800);
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 mb-4">
          <Zap className="w-3.5 h-3.5 text-emerald-400" />
          <span>Interactive Architecture Flow</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-100 tracking-tight mb-4">
          Dual-Engine Architecture in Action
        </h2>
        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Toggle between our zero-knowledge client WASM compiler and the distributed Go cloud daemon.
          Watch real-time data flows, network boundaries, and execution telemetry.
        </p>
      </div>

      {/* Simulator Frame */}
      <div className="glass-card rounded-3xl p-6 sm:p-10 border border-zinc-800/80 shadow-2xl relative overflow-hidden scale-crosshair scale-crosshair-tl scale-crosshair-tr scale-crosshair-bl scale-crosshair-br">
        {/* Subtle Ambient Radial Glow */}
        <div 
          className={clsx(
            "absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-700",
            engineMode === 'wasm' ? "bg-emerald-500" : "bg-sky-500"
          )} 
        />

        {/* Engine Toggle Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-6 border-b border-zinc-900">
          <div className="inline-flex p-1.5 rounded-2xl bg-zinc-950 border border-zinc-800">
            <button
              onClick={() => { setEngineMode('wasm'); setSimStep(0); }}
              className={clsx(
                "flex items-center space-x-2.5 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all",
                engineMode === 'wasm'
                  ? "bg-zinc-800 text-white shadow-lg border border-zinc-700/60"
                  : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              <ShieldCheck className={clsx("w-4 h-4", engineMode === 'wasm' ? "text-emerald-400" : "text-zinc-500")} />
              <span>In-Browser WASM Mode</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60 font-mono">
                0 Bytes Wire
              </span>
            </button>

            <button
              onClick={() => { setEngineMode('cloud'); setSimStep(0); }}
              className={clsx(
                "flex items-center space-x-2.5 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all",
                engineMode === 'cloud'
                  ? "bg-zinc-800 text-white shadow-lg border border-zinc-700/60"
                  : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              <Cloud className={clsx("w-4 h-4", engineMode === 'cloud' ? "text-sky-400" : "text-zinc-500")} />
              <span>Cloud Cluster Mode</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800/60 font-mono">
                Go 1.25 + R2
              </span>
            </button>
          </div>

          <button
            onClick={runSimulation}
            disabled={isSimulating}
            className={clsx(
              "flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-md active:scale-95",
              isSimulating
                ? "bg-zinc-800 text-zinc-400 cursor-not-allowed border border-zinc-700/40"
                : "bg-zinc-100 hover:bg-white text-zinc-950 hover:shadow-zinc-100/10"
            )}
          >
            <RefreshCw className={clsx("w-4 h-4", isSimulating && "animate-spin")} />
            <span>{isSimulating ? 'Processing Flow...' : 'Simulate Packet Flow'}</span>
          </button>
        </div>

        {/* Visual Architecture Diagram Stage */}
        <div className="relative rounded-2xl bg-[#09090c] border border-zinc-800/90 p-6 sm:p-8 mb-8 min-h-[320px] flex flex-col justify-between">
          {/* Node Grid */}
          {engineMode === 'wasm' ? (
            /* WASM Local Node Journey */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 my-auto">
              {/* Step 1 */}
              <div className={clsx(
                "rounded-2xl p-5 border transition-all duration-300",
                simStep === 1 
                  ? "bg-emerald-950/30 border-emerald-500/80 shadow-[0_0_30px_rgba(16,185,129,0.2)] scale-105" 
                  : "bg-zinc-900/60 border-zinc-800"
              )}>
                <div className="w-10 h-10 rounded-xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center mb-3 text-zinc-200">
                  <HardDrive className="w-5 h-5 text-emerald-400" />
                </div>
                <h4 className="text-sm font-semibold text-zinc-200 mb-1">1. Local Buffer Ingestion</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Files read via HTML5 FileReader directly into browser sandbox memory.
                </p>
                <div className="mt-3 flex items-center space-x-1.5 text-[11px] font-mono text-emerald-400/90">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Sandbox: Sealed</span>
                </div>
              </div>

              {/* Step 2 */}
              <div className={clsx(
                "rounded-2xl p-5 border transition-all duration-300",
                simStep === 2 
                  ? "bg-emerald-950/30 border-emerald-500/80 shadow-[0_0_30px_rgba(16,185,129,0.2)] scale-105" 
                  : "bg-zinc-900/60 border-zinc-800"
              )}>
                <div className="w-10 h-10 rounded-xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center mb-3 text-zinc-200">
                  <Cpu className="w-5 h-5 text-emerald-400" />
                </div>
                <h4 className="text-sm font-semibold text-zinc-200 mb-1">2. Client WASM Assembly</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Lossless PDF bytecode assembled locally with <code className="text-zinc-300 font-mono">pdf-lib</code> in sub-800ms.
                </p>
                <div className="mt-3 flex items-center space-x-1.5 text-[11px] font-mono text-zinc-400">
                  <span>RAM: ~62MB</span>
                  <span>•</span>
                  <span>Threads: 1 WebWorker</span>
                </div>
              </div>

              {/* Step 3 */}
              <div className={clsx(
                "rounded-2xl p-5 border transition-all duration-300",
                simStep >= 3 
                  ? "bg-emerald-950/30 border-emerald-500/80 shadow-[0_0_30px_rgba(16,185,129,0.2)] scale-105" 
                  : "bg-zinc-900/60 border-zinc-800"
              )}>
                <div className="w-10 h-10 rounded-xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center mb-3 text-zinc-200">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <h4 className="text-sm font-semibold text-zinc-200 mb-1">3. Blob Revocation</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Generated Blob URL delivered to disk; memory purged via <code className="text-zinc-300 font-mono">revokeObjectURL</code>.
                </p>
                <div className="mt-3 flex items-center space-x-1.5 text-[11px] font-mono text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Wire Leak: 0 Bytes</span>
                </div>
              </div>
            </div>
          ) : (
            /* Cloud Cluster Node Journey */
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10 my-auto">
              {/* Step 1 */}
              <div className={clsx(
                "rounded-2xl p-4 border transition-all duration-300",
                simStep === 1 
                  ? "bg-sky-950/30 border-sky-500/80 shadow-[0_0_30px_rgba(56,189,248,0.2)] scale-105" 
                  : "bg-zinc-900/60 border-zinc-800"
              )}>
                <div className="w-9 h-9 rounded-xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center mb-2.5 text-zinc-200">
                  <HardDrive className="w-4 h-4 text-sky-400" />
                </div>
                <h4 className="text-xs font-semibold text-zinc-200 mb-1">1. Presigned S3 PUT</h4>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Direct client-to-storage upload to Cloudflare R2 ($0 egress).
                </p>
              </div>

              {/* Step 2 */}
              <div className={clsx(
                "rounded-2xl p-4 border transition-all duration-300",
                simStep === 2 
                  ? "bg-sky-950/30 border-sky-500/80 shadow-[0_0_30px_rgba(56,189,248,0.2)] scale-105" 
                  : "bg-zinc-900/60 border-zinc-800"
              )}>
                <div className="w-9 h-9 rounded-xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center mb-2.5 text-zinc-200">
                  <Server className="w-4 h-4 text-sky-400" />
                </div>
                <h4 className="text-xs font-semibold text-zinc-200 mb-1">2. Redis 7 Streams</h4>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Job enqueued to consumer group with realtime SSE progress tracking.
                </p>
              </div>

              {/* Step 3 */}
              <div className={clsx(
                "rounded-2xl p-4 border transition-all duration-300",
                simStep === 3 
                  ? "bg-sky-950/30 border-sky-500/80 shadow-[0_0_30px_rgba(56,189,248,0.2)] scale-105" 
                  : "bg-zinc-900/60 border-zinc-800"
              )}>
                <div className="w-9 h-9 rounded-xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center mb-2.5 text-zinc-200">
                  <Cpu className="w-4 h-4 text-sky-400" />
                </div>
                <h4 className="text-xs font-semibold text-zinc-200 mb-1">3. Go 1.25 Assembly</h4>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Parallel <code className="text-zinc-300 font-mono">pdfcpu</code> goroutines compile 50+ pages in 2.1s.
                </p>
              </div>

              {/* Step 4 */}
              <div className={clsx(
                "rounded-2xl p-4 border transition-all duration-300",
                simStep >= 4 
                  ? "bg-sky-950/30 border-sky-500/80 shadow-[0_0_30px_rgba(56,189,248,0.2)] scale-105" 
                  : "bg-zinc-900/60 border-zinc-800"
              )}>
                <div className="w-9 h-9 rounded-xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center mb-2.5 text-zinc-200">
                  <ShieldCheck className="w-4 h-4 text-sky-400" />
                </div>
                <h4 className="text-xs font-semibold text-zinc-200 mb-1">4. 24h Hard Purge</h4>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Automated lifecycle deletes all source assets permanently.
                </p>
              </div>
            </div>
          )}

          {/* Privacy & Wire Status Banner */}
          <div className="mt-6 pt-4 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center space-x-2">
              <span className={clsx(
                "w-2.5 h-2.5 rounded-full animate-ping",
                engineMode === 'wasm' ? "bg-emerald-400" : "bg-sky-400"
              )} />
              <span className="text-zinc-300">
                {engineMode === 'wasm' 
                  ? "Security Status: Zero-Knowledge Client Memory Isolation Active" 
                  : "Cluster Status: 8 Go Worker Nodes Active (Redis Streams Consumer Group)"}
              </span>
            </div>

            <div className="flex items-center space-x-4 text-zinc-400">
              <span>Network Egress: <strong className={engineMode === 'wasm' ? "text-emerald-400" : "text-zinc-200"}>
                {engineMode === 'wasm' ? "0.00 B" : "Direct PUT (R2)"}
              </strong></span>
              <span>•</span>
              <span>Max Payload: <strong className="text-zinc-200">{engineMode === 'wasm' ? "50 MB" : "100 MB"}</strong></span>
            </div>
          </div>
        </div>

        {/* Real-Time Telemetry Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="rounded-2xl p-4 bg-zinc-950/70 border border-zinc-800/80">
            <p className="text-[11px] uppercase tracking-wider text-zinc-400 mb-1 font-mono">Avg Compilation</p>
            <p className="text-xl sm:text-2xl font-bold font-mono text-zinc-100">
              {engineMode === 'wasm' ? '< 780 ms' : '< 2.10 s'}
            </p>
            <p className="text-[11px] text-zinc-500 mt-1">{engineMode === 'wasm' ? '20 Pages (Local)' : '50 High-DPI Photos'}</p>
          </div>

          <div className="rounded-2xl p-4 bg-zinc-950/70 border border-zinc-800/80">
            <p className="text-[11px] uppercase tracking-wider text-zinc-400 mb-1 font-mono">Server Storage</p>
            <p className={clsx(
              "text-xl sm:text-2xl font-bold font-mono",
              engineMode === 'wasm' ? "text-emerald-400" : "text-sky-400"
            )}>
              {engineMode === 'wasm' ? '0 Bytes' : '24h Auto-Purge'}
            </p>
            <p className="text-[11px] text-zinc-500 mt-1">{engineMode === 'wasm' ? 'Never Touches Cloud' : 'Enforced R2 ILM Policy'}</p>
          </div>

          <div className="rounded-2xl p-4 bg-zinc-950/70 border border-zinc-800/80">
            <p className="text-[11px] uppercase tracking-wider text-zinc-400 mb-1 font-mono">Watermarks</p>
            <p className="text-xl sm:text-2xl font-bold font-mono text-emerald-400">Zero</p>
            <p className="text-[11px] text-zinc-500 mt-1">100% Clean Output</p>
          </div>

          <div className="rounded-2xl p-4 bg-zinc-950/70 border border-zinc-800/80">
            <p className="text-[11px] uppercase tracking-wider text-zinc-400 mb-1 font-mono">Resolution Fidelity</p>
            <p className="text-xl sm:text-2xl font-bold font-mono text-zinc-100">300 DPI</p>
            <p className="text-[11px] text-zinc-500 mt-1">Lossless Vector Precision</p>
          </div>
        </div>
      </div>
    </div>
  );
}
