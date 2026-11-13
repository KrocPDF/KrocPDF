'use client';

import React from 'react';

interface Company {
  name: string;
  svg: React.ReactNode;
}

const companies: Company[] = [
  {
    name: 'Google',
    svg: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21.35 11.1H12v3.8h5.35c-.5 2.5-2.6 4.3-5.35 4.3-3.1 0-5.6-2.5-5.6-5.6s2.5-5.6 5.6-5.6c1.35 0 2.6.5 3.55 1.35l2.75-2.75C17.3 4.95 14.8 4 12 4 7.6 4 4 7.6 4 12s3.6 8 8 8c4.6 0 7.7-3.2 7.7-7.8 0-.7-.05-1.4-.35-2.1z" />
      </svg>
    ),
  },
  {
    name: 'Microsoft',
    svg: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <rect x="1" y="1" width="10" height="10" />
        <rect x="13" y="1" width="10" height="10" />
        <rect x="1" y="13" width="10" height="10" />
        <rect x="13" y="13" width="10" height="10" />
      </svg>
    ),
  },
  {
    name: 'GitHub',
    svg: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    name: 'Meta',
    svg: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16.7 5C14.7 5 13 6 12 7.6 11 6 9.3 5 7.3 5 3.8 5 1 8.1 1 12c0 4.1 3 7 6.5 7 2.3 0 4.2-1.1 5.3-2.9 1.1 1.8 3 2.9 5.3 2.9 3.5 0 6.5-2.9 6.5-7 0-3.9-2.8-7-7.9-7zm-9.4 11.6c-2.3 0-4.3-1.9-4.3-4.6 0-2.6 2-4.6 4.3-4.6 1.7 0 3.2 1 3.9 2.5.2.4.3.9.3 1.4 0 .6-.1 1.1-.3 1.5-.7 1.7-2.2 2.8-3.9 2.8zm9.4 0c-1.7 0-3.2-1.1-3.9-2.8-.2-.4-.3-.9-.3-1.5 0-.5.1-1 .3-1.4.7-1.5 2.2-2.5 3.9-2.5 2.3 0 4.3 2 4.3 4.6 0 2.7-2 4.6-4.3 4.6z" />
      </svg>
    ),
  },
  {
    name: 'Vercel',
    svg: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 20h20L12 2z" />
      </svg>
    ),
  },
  {
    name: 'Docker',
    svg: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.98 10.98h1.75v1.75h-1.75zm-2.19 0h1.75v1.75h-1.75zm-2.19 0h1.75v1.75H9.6zm-2.19 0h1.75v1.75H7.41zm6.57-2.19h1.75v1.75h-1.75zm-2.19 0h1.75v1.75h-1.75zm-2.19 0h1.75v1.75H9.6zm4.38-2.19h1.75v1.75h-1.75zm-2.19 0h1.75v1.75h-1.75zM22.5 12.87c-.38-.28-1.5-.38-2.34.22-.38.28-.75.75-.94 1.22-.38-.09-.75-.19-1.12-.19-1.5 0-2.72.84-3.47 1.88-2.34-.09-4.5.38-6.19 1.41-1.22.75-2.16 1.78-2.81 2.91-.47.84-.75 1.78-.75 2.81 0 .28.09.56.28.75.28.28.66.38 1.03.38 5.72 0 10.5-2.53 13.03-6.66.47-.75 1.22-1.31 2.06-1.59.56-.19 1.03-.47 1.31-.94.38-.66.28-1.5-.09-2.2z" />
      </svg>
    ),
  },
  {
    name: 'Cloudflare',
    svg: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
      </svg>
    ),
  },
  {
    name: 'WebAssembly',
    svg: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L3 7v10l9 5 9-5V7l-9-5zm0 2.2L18.8 8 12 11.8 5.2 8 12 4.2zM4.8 9.3l6.2 3.5v7l-6.2-3.5V9.3zm8.4 10.5v-7l6.2-3.5v7l-6.2 3.5z" />
      </svg>
    ),
  },
  {
    name: 'Next.js',
    svg: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2zm3.89 13.78-4.52-5.83v5.83H9.72V8.22h1.65l4.52 5.83V8.22h1.65v7.56z" />
      </svg>
    ),
  },
  {
    name: 'Amazon AWS',
    svg: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8zm-3.5-9.5h7v3h-7zm0-4h7v2.5h-7z" />
      </svg>
    ),
  },
];

export function CompanyMarquee() {
  // Duplicate list to create a seamless infinite loop
  const marqueeItems = [...companies, ...companies];

  return (
    <section 
      className="relative py-7 border-y border-white/[0.08] bg-transparent overflow-hidden select-none"
      style={{
        maskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
      }}
      aria-label="Supported ecosystems and trusted platforms"
    >
      <div className="flex animate-marquee-ltr items-center space-x-12 sm:space-x-16 cursor-default">
        {marqueeItems.map((company, index) => (
          <div
            key={`${company.name}-${index}`}
            className="flex items-center space-x-2.5 text-zinc-500 hover:text-zinc-200 transition-colors group flex-shrink-0"
          >
            <span className="text-zinc-400 group-hover:text-white transition-colors duration-200">
              {company.svg}
            </span>
            <span className="text-xs sm:text-sm font-semibold tracking-tight font-sans">
              {company.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

