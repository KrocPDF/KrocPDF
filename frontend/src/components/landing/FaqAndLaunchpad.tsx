'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { HelpCircle, ChevronDown, ArrowRight, Terminal, Copy, Check, Sparkles } from 'lucide-react';
import { GithubIcon } from '@/components/icons/GithubIcon';
import clsx from 'clsx';

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: 'How does KrocPDF guarantee that exactly 0 bytes leave my device?',
    answer:
      'In Local Mode, KrocPDF uses client-side WebAssembly (WASM) and HTML5 Canvas technology. All image decoding, page sizing, and PDF byte-stitching happen completely inside your browser’s V8 memory sandbox. You can verify this independently in your browser DevTools Network tab: no files or binary payloads are transmitted across the wire.',
  },
  {
    question: 'When should I choose Cloud Mode instead of Local In-Browser Mode?',
    answer:
      'Local In-Browser Mode is optimal for standard documents, receipts, contracts, and confidential IDs up to 50MB. If you are converting massive batches (e.g. 50+ high-DPI smartphone photos or hundreds of pages), Cloud Mode offloads processing to our distributed Go worker cluster with Cloudflare R2 zero-egress storage, automatically purging all assets after 24 hours.',
  },
  {
    question: 'Are my converted PDFs really free of watermarks and quality downgrades?',
    answer:
      'Yes, 100%. Unlike predatory commercial converters that intentionally downsample free output to 72 DPI or force brand watermarks, KrocPDF is an open-source tool that retains full 150/300 DPI vector clarity with zero added stamps or watermarks.',
  },
  {
    question: 'Can I self-host KrocPDF in my own private cloud or on-premise infrastructure?',
    answer:
      'Absolutely! KrocPDF is open-source under the MIT License. We provide production-ready Docker Compose files, Kubernetes manifests (in infra/k8s/), and Nginx reverse proxy configurations so organizations can deploy their own internal document platform with complete privacy compliance.',
  },
  {
    question: 'Where can I learn more about the upcoming Mobile App for iOS and Android?',
    answer:
      'We have open-sourced a comprehensive 7-part Flutter & Dart architectural blueprint in mobile_blueprint/. It specifies on-device camera edge detection, perspective rectification, and offline native PDF assembly. Community Flutter contributors are invited to collaborate!',
  },
];

export function FaqAndLaunchpad() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [copiedDocker, setCopiedDocker] = useState(false);

  const dockerCommand = 'git clone https://github.com/KrocPDF/KrocPDF.git && cd KrocPDF && docker compose up -d';

  const handleCopyDocker = () => {
    navigator.clipboard.writeText(dockerCommand);
    setCopiedDocker(true);
    setTimeout(() => setCopiedDocker(false), 2000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-24">
      {/* ============================================
          Frequently Asked Questions (Matrix Accordion)
          ============================================ */}
      <div>
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 mb-4">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Clear Answers</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-100 tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Everything you need to know about our privacy-by-design architecture, document limits, and open-source mission.
          </p>
        </div>

        {/* Accordion Stack */}
        <div className="max-w-3xl mx-auto space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={clsx(
                  "rounded-2xl border transition-all duration-200 overflow-hidden",
                  isOpen
                    ? "bg-zinc-900/90 border-zinc-700/80 shadow-xl"
                    : "bg-zinc-950/60 hover:bg-zinc-900/40 border-zinc-800/80"
                )}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left space-x-4 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-semibold text-zinc-200 tracking-tight">
                    {faq.question}
                  </span>
                  <div className={clsx(
                    "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200 bg-zinc-800 text-zinc-300",
                    isOpen && "rotate-180 bg-zinc-700 text-white"
                  )}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-zinc-400 leading-relaxed border-t border-zinc-800/60 animate-fadeIn">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================
          Cinematic Launchpad / Community CTA Banner
          ============================================ */}
      <div className="relative rounded-3xl p-8 sm:p-14 lg:p-16 bg-gradient-to-b from-zinc-900/90 to-zinc-950 border border-zinc-800/90 shadow-2xl text-center overflow-hidden scale-border-beam scale-crosshair scale-crosshair-tl scale-crosshair-tr scale-crosshair-bl scale-crosshair-br">
        {/* Glow orb */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-48 bg-gradient-to-r from-emerald-500/20 via-sky-500/20 to-amber-500/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-700/60 text-xs font-mono text-zinc-300">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Democratizing Document Processing</span>
          </div>

          <h3 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Stop Paying for Predatory PDF Subscriptions.
          </h3>

          <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Convert unlimited documents right now in your browser with zero tracking, or spin up the entire cluster locally in seconds.
          </p>

          {/* Primary CTA Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/jpg-to-pdf"
              className="inline-flex items-center px-8 py-4 rounded-xl bg-white hover:bg-zinc-100 text-zinc-950 font-bold text-sm sm:text-base shadow-xl hover:scale-105 active:scale-95 transition-all"
            >
              <span>Launch In-Browser Converter</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>

            <a
              href="https://github.com/KrocPDF/KrocPDF"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-sm sm:text-base border border-zinc-700 shadow-md hover:scale-105 active:scale-95 transition-all"
            >
              <GithubIcon className="w-5 h-5 mr-2.5" />
              <span>Star on GitHub</span>
            </a>
          </div>

          {/* 1-Click Bootstrap Command Card */}
          <div className="pt-6 max-w-xl mx-auto">
            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 font-mono text-xs text-zinc-300 shadow-inner">
              <div className="flex items-center space-x-2 overflow-hidden mr-2">
                <Terminal className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-zinc-500 select-none">$</span>
                <span className="truncate text-zinc-300">{dockerCommand}</span>
              </div>
              <button
                onClick={handleCopyDocker}
                className="shrink-0 p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 transition"
                title="Copy Command"
              >
                {copiedDocker ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] font-mono text-zinc-500 mt-2">
              Free forever • MIT License • Zero data collection
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
