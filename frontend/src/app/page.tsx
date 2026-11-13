'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  UploadCloud,
  Image,
  ImagePlus,
  Camera,
  GitMerge,
  Minimize2,
  FileOutput,
  Shield,
  Zap,
  Wifi,
  Lock,
  ArrowRight,
  Bell,
  Mail,
} from 'lucide-react';
import clsx from 'clsx';
import { GithubIcon } from '@/components/icons/GithubIcon';
import { toolCards, type ToolCardConfig } from '@/lib/seoConfigs';

const iconMap: Record<ToolCardConfig['iconId'], React.ElementType> = {
  'image': Image,
  'image-plus': ImagePlus,
  'camera': Camera,
  'merge': GitMerge,
  'minimize': Minimize2,
  'file-output': FileOutput,
};

export default function HomePage() {
  const router = useRouter();
  const [dragActive, setDragActive] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState('');
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [notifySubmitted, setNotifySubmitted] = useState<Set<string>>(new Set());

  const handleHeroDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files).filter(
      f => f.type === 'image/jpeg' || f.type === 'image/png' || f.type === 'image/webp' || f.type === 'application/pdf'
    );

    if (files.length === 0) return;

    // Detect file type and route to the right tool
    const hasPdf = files.some(f => f.type === 'application/pdf');
    if (hasPdf) {
      router.push('/merge-pdf');
      return;
    }
    
    const hasPng = files.some(f => f.type === 'image/png');
    const targetTool = hasPng ? 'png-to-pdf' : 'jpg-to-pdf';
    router.push(`/${targetTool}`);
  }, [router]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragActive(false);
  }, []);

  const handleNotify = (slug: string) => {
    if (!notifyEmail.trim()) return;
    setNotifySubmitted(prev => new Set(prev).add(slug));
    setNotifyEmail('');
  };

  return (
    <div className="gradient-mesh min-h-screen">
      {/* ============================================
          Hero Section (Refined Monochrome + Cream)
          ============================================ */}
      <section className="relative py-20 sm:py-28 lg:py-32 px-4 border-b border-zinc-900">
        <div className="max-w-4xl mx-auto text-center fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-zinc-800 bg-zinc-900/60 text-xs font-medium text-zinc-300">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-200" />
            Dual-Engine Document Conversion
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.08] mb-6 text-zinc-100">
            Every Document Tool <br className="hidden sm:inline" />
            <span className="text-zinc-400 font-normal">You Need, Pure &amp; Private.</span>
          </h1>
          
          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Fast, zero-compromise document processing. Convert images or merge PDFs in your browser via local WASM or with secure dedicated cloud workers.{' '}
            <span className="text-zinc-200 font-medium">Free, open source, no watermarks.</span>
          </p>

          {/* Hero Drop Zone CTA */}
          <div
            onDrop={handleHeroDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={clsx(
              "relative max-w-xl mx-auto border-2 border-dashed rounded-2xl p-8 sm:p-10 transition-all duration-200 cursor-pointer group shadow-2xl",
              dragActive
                ? "border-zinc-200 bg-zinc-900/90 scale-[1.01] shadow-zinc-950"
                : "border-zinc-800 hover:border-zinc-500 bg-zinc-950/70 hover:bg-zinc-900/40"
            )}
            role="button"
            tabIndex={0}
            aria-label="Drop files here to start converting, or click to browse tools"
          >
            <div className="flex flex-col items-center space-y-4">
              <div className={clsx(
                "w-12 h-12 rounded-xl flex items-center justify-center transition-all border",
                dragActive
                  ? "bg-zinc-100 text-zinc-950 border-white scale-105"
                  : "bg-zinc-900 border-zinc-800 text-zinc-300 group-hover:text-white group-hover:border-zinc-700"
              )}>
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <p className="text-base font-semibold text-zinc-100">
                  {dragActive ? 'Release to convert' : 'Drop any image or PDF here'}
                </p>
                <p className="text-xs text-zinc-400 mt-1">
                  JPG, PNG, JPEG, PDF — auto-detected and routed instantly
                </p>
              </div>
              <Link
                href="/jpg-to-pdf"
                className="inline-flex items-center px-5 py-2 text-sm font-semibold bg-zinc-100 text-zinc-950 rounded-lg hover:bg-white transition-all shadow-md hover:shadow-zinc-800/40"
              >
                Start Converting
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          Trust Badges
          ============================================ */}
      <section className="py-5 px-4 border-b border-zinc-900 bg-zinc-950/70">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          <TrustBadge icon={Lock} text="100% Open Source" />
          <TrustBadge icon={Shield} text="Files never leave your browser" />
          <TrustBadge icon={Zap} text="No sign-up required" />
          <a
            href="https://github.com/alokprashar864/jpg_to_pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
          >
            <GithubIcon className="w-3.5 h-3.5" />
            <span>Star on GitHub</span>
          </a>
        </div>
      </section>

      {/* ============================================
          Tool Cards Grid
          ============================================ */}
      <section className="py-16 sm:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100 mb-2">Available PDF Tools</h2>
            <p className="text-sm text-zinc-400 max-w-lg mx-auto">
              Select a conversion tool below. Fast, lossless, and browser-driven.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {toolCards.map((tool) => (
              <ToolCard
                key={tool.slug}
                tool={tool}
                activeTooltip={activeTooltip}
                setActiveTooltip={setActiveTooltip}
                notifyEmail={notifyEmail}
                setNotifyEmail={setNotifyEmail}
                notifySubmitted={notifySubmitted}
                onNotify={handleNotify}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          Features Section
          ============================================ */}
      <section className="py-16 sm:py-20 px-4 border-t border-zinc-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100 mb-2">Why KrocPDF?</h2>
            <p className="text-sm text-zinc-400">Engineered for speed, privacy, and simplicity.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FeatureCard
              icon={Shield}
              title="Privacy First"
              description="Your documents are processed locally in your browser with WebAssembly. No data uploaded unless Cloud mode is chosen."
            />
            <FeatureCard
              icon={Zap}
              title="Dual-Engine Power"
              description="Instant in-browser rendering for standard jobs, or isolated high-throughput Go workers for batch conversions."
            />
            <FeatureCard
              icon={Wifi}
              title="Works Offline"
              description="Complete local conversion without network connection. Zero telemetry, zero accounts required, zero watermarks."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

/* ==========================================
   Sub-Components
   ========================================== */

function TrustBadge({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
  return (
    <div className="flex items-center space-x-1.5 text-xs text-zinc-400">
      <Icon className="w-3.5 h-3.5 text-zinc-300" />
      <span>{text}</span>
    </div>
  );
}

function ToolCard({
  tool,
  activeTooltip,
  setActiveTooltip,
  notifyEmail,
  setNotifyEmail,
  notifySubmitted,
  onNotify,
}: {
  tool: ToolCardConfig;
  activeTooltip: string | null;
  setActiveTooltip: (slug: string | null) => void;
  notifyEmail: string;
  setNotifyEmail: (email: string) => void;
  notifySubmitted: Set<string>;
  onNotify: (slug: string) => void;
  }) {
  const Icon = iconMap[tool.iconId];
  const isTooltipOpen = activeTooltip === tool.slug;

  if (tool.comingSoon) {
    return (
      <div className="tooltip-container relative">
        <div
          className="card-glow-muted bg-zinc-900/40 border border-zinc-800 rounded-xl p-5 text-center"
          onClick={() => setActiveTooltip(isTooltipOpen ? null : tool.slug)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setActiveTooltip(isTooltipOpen ? null : tool.slug);
            }
          }}
          role="button"
          tabIndex={0}
          aria-label={`${tool.name} — coming soon`}
          aria-expanded={isTooltipOpen}
        >
          <div className="w-10 h-10 mx-auto rounded-lg flex items-center justify-center mb-3 bg-zinc-850 border border-zinc-800">
            <Icon className="w-5 h-5 text-zinc-400" />
          </div>
          <div className="flex items-center justify-center space-x-2 mb-1.5">
            <h3 className="font-semibold text-zinc-300 text-sm">{tool.name}</h3>
            <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-400">
              Soon
            </span>
          </div>
          <p className="text-xs text-zinc-500">{tool.shortDescription}</p>
        </div>

        {/* Tooltip */}
        {isTooltipOpen && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-72 scale-in">
            <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 shadow-xl">
              <div className="flex items-center space-x-2 mb-2">
                <Bell className="w-3.5 h-3.5 text-zinc-200" />
                <p className="text-xs font-semibold text-zinc-200">Coming Soon</p>
              </div>
              <p className="text-xs text-zinc-400 mb-3">{tool.comingSoonBlurb}</p>

              {notifySubmitted.has(tool.slug) ? (
                <p className="text-xs text-zinc-200 font-medium">
                  ✓ We&apos;ll notify you when this ships!
                </p>
              ) : (
                <div className="flex space-x-1.5">
                  <div className="flex-1 relative">
                    <Mail className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={notifyEmail}
                      onChange={(e) => setNotifyEmail(e.target.value)}
                      className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:border-zinc-400 outline-none transition"
                      aria-label="Email for notification"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') onNotify(tool.slug);
                      }}
                    />
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNotify(tool.slug);
                    }}
                    className="px-3 py-1.5 text-xs font-semibold bg-zinc-100 hover:bg-white text-zinc-950 rounded-lg transition-colors"
                  >
                    Notify
                  </button>
                </div>
              )}

              {/* Arrow */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-zinc-900" />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={`/${tool.slug}`}
      className="card-glow bg-zinc-900/30 border border-zinc-800/80 rounded-xl p-5 text-center block transition-all"
      role="link"
      aria-label={`Open ${tool.name} converter`}
    >
      <div className="w-10 h-10 mx-auto rounded-lg flex items-center justify-center mb-3 bg-zinc-850 border border-zinc-800">
        <Icon className="w-5 h-5 text-zinc-200" />
      </div>
      <h3 className="font-semibold text-zinc-100 text-sm mb-1.5">{tool.name}</h3>
      <p className="text-xs text-zinc-400 leading-relaxed">{tool.shortDescription}</p>
    </Link>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-xl p-5 hover:border-zinc-700 transition-colors">
      <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3.5 border border-zinc-800 bg-zinc-850">
        <Icon className="w-4 h-4 text-zinc-200" />
      </div>
      <h3 className="font-semibold text-zinc-100 text-sm mb-1.5">{title}</h3>
      <p className="text-xs text-zinc-400 leading-relaxed">{description}</p>
    </div>
  );
}
