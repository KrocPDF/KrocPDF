'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { CloudflareTurnstile } from '@/components/CloudflareTurnstile';
import { getApiUrl } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${getApiUrl()}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, turnstileToken }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Login failed. Please check your credentials.');
      }

      setSuccess(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('kroc_user', JSON.stringify(data.user));
      }
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 text-2xl font-bold tracking-tight text-white mb-2">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-950/40 text-black font-extrabold text-sm">
              K
            </span>
            <span>Kroc<span className="text-emerald-400">PDF</span></span>
          </Link>
          <h1 className="text-2xl font-bold text-white tracking-tight">Welcome back</h1>
          <p className="text-sm text-slate-400 mt-1">
            Log in to manage your presets, history, or API tokens
          </p>
        </div>

        {/* Card */}
        <div className="bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/80">
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center">
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-5 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 flex-shrink-0" />
              <span>Login successful! Redirecting you...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5" htmlFor="email">
                Email address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-950/70 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-950/70 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-colors"
                />
              </div>
            </div>

            {/* Cloudflare Turnstile Verification */}
            <CloudflareTurnstile onSuccess={(token) => setTurnstileToken(token)} />

            <button
              type="submit"
              disabled={loading || success}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-sm transition-all shadow-lg shadow-emerald-950/40 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <span>{loading ? 'Verifying...' : 'Log In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-neutral-900 px-3 text-slate-500 font-medium tracking-wider">
                Or
              </span>
            </div>
          </div>

          {/* Friction-Free Guest Option */}
          <Link
            href="/"
            className="w-full py-2.5 px-4 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 hover:text-white text-sm font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Continue as Guest (No Login Required)</span>
          </Link>

          <p className="text-center text-xs text-slate-400 mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-emerald-400 hover:text-emerald-300 font-medium underline underline-offset-4">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
