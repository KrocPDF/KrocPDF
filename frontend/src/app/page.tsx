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
  Sparkles,
  FileCheck,
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
    <div className="gradient-mesh min-h-screen relative overflow-hidden">
      {/* ============================================
          Hero Section (Expanded Full-Screen Width)
          ============================================ */}
      <section className="relative py-16 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 border-b border-zinc-900/80">
        {/* Subtle Geometric Background Grid */}
        <div 
          className="absolute inset-0 bg-grid-pattern opacity-40 [mask-image:radial-gradient(ellipse_75%_55%_at_50%_0%,#000_60%,transparent_100%)] pointer-events-none" 
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto text-center relative z-10 fade-in-up">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.06] mb-6 text-zinc-100 max-w-5xl mx-auto">
            Every Document Tool <br className="hidden sm:inline" />
            <span className="text-zinc-400 font-medium">You Need, Pure &amp; Private.</span>
          </h1>
          
          <p className="text-base sm:text-xl text-zinc-400 max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
            Fast, zero-compromise document processing. Convert images or merge PDFs directly in your browser via local WASM or with secure dedicated cloud workers.{' '}
            <span className="text-zinc-200 font-medium">Free, open source, no watermarks.</span>
          </p>

          {/* Expansive Hero Drop Zone CTA */}
          <div
            onDrop={handleHeroDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={clsx(
              "relative max-w-4xl w-full mx-auto border-2 border-dashed rounded-3xl p-8 sm:p-12 transition-all duration-300 cursor-pointer group shadow-2xl glass-card",
              dragActive
                ? "border-zinc-100 bg-zinc-900/95 scale-[1.01] shadow-[0_0_50px_rgba(255,255,255,0.15)] ring-2 ring-white/20"
                : "border-zinc-800 hover:border-zinc-500 bg-zinc-950/70 hover:bg-zinc-900/50 pulse-glow-box"
            )}
            role="button"
            tabIndex={0}
            aria-label="Drop files here to start converting, or click to browse tools"
          >
            <div className="flex flex-col items-center space-y-5">
              <div className={clsx(
                "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 border shadow-inner",
                dragActive
                  ? "bg-zinc-100 text-zinc-950 border-white scale-110"
                  : "bg-zinc-900 border-zinc-700/80 text-zinc-300 group-hover:text-white group-hover:border-zinc-500 group-hover:scale-105 animate-float"
              )}>
                <UploadCloud className="w-8 h-8" />
              </div>
              
              <div className="space-y-1.5">
                <p className="text-xl sm:text-2xl font-semibold text-zinc-100 tracking-tight">
                  {dragActive ? 'Release to Convert Instantly' : 'Drag & Drop Any Images or PDFs Here'}
                </p>
                <p className="text-sm text-zinc-400 max-w-md mx-auto">
                  Auto-detects JPG, PNG, WebP, or PDF and launches the optimal conversion engine
                </p>
              </div>

              {/* Supported Formats Pills */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1 pb-2">
                {['.JPG', '.PNG', '.JPEG', '.WEBP', '.PDF'].map((ext) => (
                  <span
                    key={ext}
                    className="px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-zinc-900/90 border border-zinc-800 text-zinc-400 group-hover:border-zinc-700 group-hover:text-zinc-300 transition-colors"
                  >
                    {ext}
                  </span>
                ))}
              </div>

              <div className="pt-2">
                <Link
                  href="/jpg-to-pdf"
                  className="inline-flex items-center px-6 py-3 text-sm font-semibold bg-zinc-100 text-zinc-950 rounded-xl hover:bg-white transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
                >
                  Start Converting Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          Trust Badges
          ============================================ */}
      <section className="py-6 px-4 sm:px-6 lg:px-8 border-b border-zinc-900/80 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          <TrustBadge icon={Lock} text="100% Open Source" />
          <TrustBadge icon={Shield} text="Files never leave your browser (Local WASM)" />
          <TrustBadge icon={Zap} text="Zero Sign-up Required" />
          <TrustBadge icon={FileCheck} text="No Watermarks & No File Limits" />
          <a
            href="https://github.com/alokprashar864/jpg_to_pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
          >
            <GithubIcon className="w-4 h-4" />
            <span>Star on GitHub</span>
          </a>
        </div>
      </section>

      {/* ============================================
          Tool Cards Grid (Expansive 3 & 4 Columns)
          ============================================ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-100 tracking-tight mb-3">
              Available Conversion Tools
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto">
              Select an optimized tool below. Lossless client rendering or high-throughput batch workers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
          Why KrocPDF Features Section (Expansive)
          ============================================ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-zinc-900/80 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-100 tracking-tight mb-3">
              Why Choose KrocPDF?
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto">
              Engineered for uncompromising speed, privacy, and architectural purity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              icon={Shield}
              title="Privacy Guaranteed (WASM)"
              description="Your documents are assembled locally right inside your browser with WebAssembly. Zero data touches remote servers unless Cloud Batch mode is chosen."
            />
            <FeatureCard
              icon={Zap}
              title="Dual-Engine Scalability"
              description="Instant in-browser rendering for daily conversions, backed by high-concurrency Go worker microservices for heavy batch payloads."
            />
            <FeatureCard
              icon={Wifi}
              title="Full Offline Support"
              description="Keep working even when your internet drops. Fully functional offline with zero telemetry, zero accounts, and zero watermarks."
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
    <div className="flex items-center space-x-2 text-xs text-zinc-400">
      <Icon className="w-4 h-4 text-zinc-300" />
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
      <div className="tooltip-container relative h-full">
        <div
          className="card-glow-muted glass-card rounded-2xl p-6 text-center h-full flex flex-col justify-between"
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
          <div>
            <div className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-4 bg-zinc-900 border border-zinc-800">
              <Icon className="w-6 h-6 text-zinc-400" />
            </div>
            <div className="flex items-center justify-center space-x-2 mb-2">
              <h3 className="font-semibold text-zinc-300 text-base">{tool.name}</h3>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-400">
                Soon
              </span>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed">{tool.shortDescription}</p>
          </div>
        </div>

        {/* Tooltip */}
        {isTooltipOpen && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-72 scale-in">
            <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 shadow-2xl">
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
      className="card-glow glass-card rounded-2xl p-6 text-center block h-full transition-all group"
      role="link"
      aria-label={`Open ${tool.name} converter`}
    >
      <div className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-4 bg-zinc-900 border border-zinc-800 group-hover:border-zinc-700 group-hover:scale-105 transition-all">
        <Icon className="w-6 h-6 text-zinc-200 group-hover:text-white transition-colors" />
      </div>
      <h3 className="font-semibold text-zinc-100 text-base mb-2 group-hover:text-white transition-colors">{tool.name}</h3>
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
    <div className="card-glow glass-card rounded-2xl p-6 sm:p-8 hover:border-zinc-600 transition-all flex flex-col justify-between">
      <div>
        <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 border border-zinc-800 bg-zinc-900 text-zinc-200">
          <Icon className="w-5 h-5 text-zinc-100" />
        </div>
        <h3 className="font-bold text-zinc-100 text-lg mb-2">{title}</h3>
        <p className="text-sm text-zinc-400 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
