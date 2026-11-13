'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Send,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import { InteractiveGridCanvas } from '@/components/InteractiveGridCanvas';

const CATEGORIES = [
  { id: 'Bug Report', label: 'Bug Report' },
  { id: 'Conversion Issue', label: 'Conversion Issue' },
  { id: 'Feature Request', label: 'Feature Request' },
  { id: 'General Feedback', label: 'General Feedback' },
] as const;

const TEMPLATES = {
  bug: `What happened:


Steps to reproduce:
1. 
2. 

Expected behavior:
`,
  conversion: `File details:
- File format (JPG, PNG, WebP): 
- Approximate file size: 
- Mode used (Browser WASM or Cloud): 

What went wrong:
`,
  feature: `Feature proposal:


Why this would be useful:
`,
  blank: '',
};

export default function ReportIssuePage() {
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState<string>('Bug Report');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState(TEMPLATES.bug);
  const [includeEnv, setIncludeEnv] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const applyTemplate = (key: keyof typeof TEMPLATES) => {
    setMessage(TEMPLATES[key]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = {
        email,
        category,
        subject,
        message,
        environment: includeEnv
          ? {
              userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
              url: typeof window !== 'undefined' ? window.location.href : 'Unknown',
            }
          : undefined,
      };

      const res = await fetch('/api/report-issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit issue report.');
      }

      setSubmitted(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred while submitting.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setSubject('');
    setMessage(TEMPLATES.bug);
    setError(null);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Interactive Reactive Grid Mesh Canvas */}
      <InteractiveGridCanvas />

      <div className="w-full max-w-2xl relative z-10 fade-in-up">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center space-x-2.5 group mb-3"
            aria-label="KrocPDF Home"
          >
            <div className="relative w-9 h-9 flex items-center justify-center">
              <Image
                src="/brand/logo-without-bg.png"
                alt="KrocPDF Logo"
                width={36}
                height={36}
                className="w-9 h-9 object-contain group-hover:scale-105 transition-transform duration-200 brightness-110"
                priority
              />
            </div>
            <span className="text-2xl font-bold tracking-tight">
              <span className="text-zinc-100 font-extrabold tracking-tighter">Kroc</span>
              <span className="text-zinc-400 font-medium">PDF</span>
            </span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight">
            Report an Issue & Contact Team
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-md mx-auto">
            Encountered a bug, conversion issue, or have a suggestion? Fill out the details below to notify the maintainer team directly.
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-zinc-950/80 border border-zinc-800/90 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl scale-crosshair scale-crosshair-tl scale-crosshair-tr scale-crosshair-bl scale-crosshair-br">
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-semibold text-zinc-100">Report Received</h2>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
                Thank you for taking the time to write to us. Your message has been routed directly to the KrocPDF maintainer team, and we will follow up with you at <span className="text-zinc-200 font-medium">{email}</span> if further details are needed.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-medium rounded-xl transition-colors"
                >
                  Submit Another Issue
                </button>
                <Link
                  href="/"
                  className="px-4 py-2 bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold rounded-xl transition-colors inline-flex items-center space-x-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Home</span>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 rounded-xl bg-red-950/40 border border-red-900/60 text-red-400 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Category Pills */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-2">
                  Issue Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => {
                        setCategory(cat.id);
                        if (cat.id === 'Conversion Issue') applyTemplate('conversion');
                        else if (cat.id === 'Feature Request') applyTemplate('feature');
                        else if (cat.id === 'Bug Report') applyTemplate('bug');
                      }}
                      className={`py-2 px-2.5 text-xs rounded-xl border transition-all text-center ${
                        category === cat.id
                          ? 'bg-zinc-100 text-zinc-950 font-semibold border-zinc-100 shadow-sm'
                          : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:border-zinc-700'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5" htmlFor="email">
                  Your Email Address <span className="text-zinc-500">(for response)</span>
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className="w-full px-3.5 py-2.5 bg-zinc-900/70 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400/20 transition-all"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5" htmlFor="subject">
                  Subject / Summary
                </label>
                <input
                  id="subject"
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Page orientation glitch when reordering images"
                  className="w-full px-3.5 py-2.5 bg-zinc-900/70 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400/20 transition-all"
                />
              </div>

              {/* Message with Quick Templates */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-zinc-300" htmlFor="message">
                    Description & Details
                  </label>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">
                      Starter template:
                    </span>
                    <button
                      type="button"
                      onClick={() => applyTemplate('bug')}
                      className="text-[11px] text-zinc-400 hover:text-zinc-200 underline decoration-zinc-700 px-1"
                    >
                      Bug
                    </button>
                    <span className="text-zinc-700">•</span>
                    <button
                      type="button"
                      onClick={() => applyTemplate('conversion')}
                      className="text-[11px] text-zinc-400 hover:text-zinc-200 underline decoration-zinc-700 px-1"
                    >
                      Conversion
                    </button>
                    <span className="text-zinc-700">•</span>
                    <button
                      type="button"
                      onClick={() => applyTemplate('blank')}
                      className="text-[11px] text-zinc-400 hover:text-zinc-200 underline decoration-zinc-700 px-1"
                    >
                      Blank
                    </button>
                  </div>
                </div>

                <textarea
                  id="message"
                  required
                  rows={8}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your issue details here..."
                  className="w-full px-3.5 py-2.5 bg-zinc-900/70 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 font-mono focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400/20 transition-all leading-relaxed"
                />
              </div>

              {/* Environment Diagnostics Toggle */}
              <div className="flex items-center space-x-2 pt-1">
                <input
                  id="includeEnv"
                  type="checkbox"
                  checked={includeEnv}
                  onChange={(e) => setIncludeEnv(e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-zinc-200 focus:ring-zinc-500 focus:ring-offset-0 cursor-pointer"
                />
                <label htmlFor="includeEnv" className="text-xs text-zinc-400 cursor-pointer select-none">
                  Include browser & OS diagnostic info to help diagnose client issues
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-zinc-100 hover:bg-white text-zinc-950 font-semibold rounded-xl text-sm transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
                      <span>Sending to Team...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-zinc-950" />
                      <span>Send Issue Report</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors inline-flex items-center space-x-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to KrocPDF</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
