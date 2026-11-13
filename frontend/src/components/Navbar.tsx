'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Menu, X, LogIn, UserPlus } from 'lucide-react';
import { GithubIcon } from '@/components/icons/GithubIcon';
import clsx from 'clsx';
import { getActiveTools, toolCards } from '@/lib/seoConfigs';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const activeTools = getActiveTools();
  const comingSoonTools = toolCards.filter(t => t.comingSoon);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 glass"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2.5 group"
            aria-label="KrocPDF Home"
          >
            <div className="relative w-8 h-8 rounded-lg flex items-center justify-center">
              <Image
                src="/brand/logo-without-bg.png"
                alt="KrocPDF Logo"
                width={32}
                height={32}
                className="w-8 h-8 object-contain group-hover:scale-105 transition-transform duration-200 brightness-110"
                priority
              />
            </div>
            <span className="text-lg font-bold tracking-tight">
              <span className="text-zinc-100 font-extrabold tracking-tighter">
                Kroc
              </span>
              <span className="text-zinc-400 font-medium">PDF</span>
            </span>
          </Link>

          {/* Desktop Tool Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {activeTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/${tool.slug}`}
                aria-current={pathname === `/${tool.slug}` ? 'page' : undefined}
                className={clsx(
                  "px-3 py-1.5 text-sm font-medium rounded-lg border transition-all duration-150",
                  pathname === `/${tool.slug}`
                    ? "bg-zinc-800 text-zinc-100 border-zinc-700 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 border-transparent"
                )}
              >
                {tool.name}
              </Link>
            ))}

            {/* Grayed out Coming Soon Tools */}
            {comingSoonTools.map((tool) => (
              <span
                key={tool.slug}
                title={`${tool.name} (Coming Soon)`}
                className="px-2.5 py-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-400 select-none flex items-center space-x-1.5 cursor-not-allowed transition-colors"
              >
                <span>{tool.name}</span>
                <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-zinc-800/80 border border-zinc-700/60 text-zinc-400">
                  Soon
                </span>
              </span>
            ))}
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <a
              href="https://github.com/alokprashar864/jpg_to_pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-zinc-400 hover:text-zinc-100 transition-colors rounded-lg hover:bg-zinc-800/60"
              aria-label="View on GitHub"
            >
              <GithubIcon className="w-5 h-5" />
            </a>
            <Link
              href="/login"
              className="px-3.5 py-1.5 text-sm font-medium text-zinc-300 hover:text-white transition-colors rounded-lg hover:bg-zinc-800/60 flex items-center"
              aria-label="Log in"
            >
              <LogIn className="w-4 h-4 inline mr-1.5" />
              Log in
            </Link>
            <Link
              href="/signup"
              className="px-3.5 py-1.5 text-sm font-semibold bg-zinc-100 text-zinc-950 rounded-lg hover:bg-white hover:shadow-md transition-all flex items-center shadow-sm"
              aria-label="Sign up"
            >
              <UserPlus className="w-4 h-4 inline mr-1.5" />
              Sign up
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-zinc-800"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={clsx("mobile-menu-enter lg:hidden border-t border-zinc-800 max-h-[85vh] overflow-y-auto bg-zinc-950", mobileOpen && "open")}
        role="menu"
      >
        <div className="px-4 py-4 space-y-1">
          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 px-3 py-1">
            Active Tools
          </div>
          {activeTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/${tool.slug}`}
                role="menuitem"
                onClick={() => setMobileOpen(false)}
                className={clsx(
                  "block px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors duration-150",
                  pathname === `/${tool.slug}`
                    ? "bg-zinc-850 text-white border-zinc-700"
                    : "text-zinc-300 hover:text-white hover:bg-zinc-900 border-transparent"
                )}
              >
                {tool.name}
              </Link>
          ))}

          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 px-3 pt-3 pb-1">
            Coming Soon
          </div>
          {comingSoonTools.map((tool) => (
            <div
              key={tool.slug}
              role="menuitem"
              className="flex items-center justify-between px-4 py-2.5 rounded-lg text-sm text-zinc-500 cursor-not-allowed select-none"
            >
              <span>{tool.name}</span>
              <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-400">
                Soon
              </span>
            </div>
          ))}

          <hr className="border-zinc-800 my-3" />

          <a
            href="https://github.com/alokprashar864/jpg_to_pdf"
            target="_blank"
            rel="noopener noreferrer"
            role="menuitem"
            className="flex items-center px-4 py-3 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
          >
            <GithubIcon className="w-4 h-4 mr-3" />
            GitHub
          </a>

          <div className="flex space-x-2 px-4 pt-2">
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="flex-1 py-2.5 text-center text-sm font-medium text-zinc-200 border border-zinc-800 rounded-lg hover:bg-zinc-900 transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              onClick={() => setMobileOpen(false)}
              className="flex-1 py-2.5 text-center text-sm font-semibold bg-zinc-100 text-zinc-950 rounded-lg hover:bg-white transition-all shadow-sm"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
